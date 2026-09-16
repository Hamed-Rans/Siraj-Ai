export async function onRequestPost(context) {
  const { request, env } = context;
  const GEMINI_KEY = env.GEMINI_KEY; // 🔐 از Environment Variable خوانده می‌شه
  
  if (!GEMINI_KEY || GEMINI_KEY.length < 20) {
    return jsonResp({
      error: {
        message: "GEMINI_KEY تنظیم نشده",
        code: 500,
        status: "MISSING_KEY",
        hint: "توی Cloudflare → Settings → Environment variables یه متغیر به اسم GEMINI_KEY بساز"
      }
    }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResp({
      error: { message: "JSON بدنه معتبر نیست", status: "BAD_JSON", hint: e.message }
    }, 400);
  }

  // ✅ مدل پیش‌فرض gemini-3.6-flash
  const model = (body.model || 'gemini-3.6-flash').trim();
  const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

  const contents = [];
  let systemInstruction = null;
  let thinkingRequested = false;

  for (const m of (body.messages || [])) {
    if (m.role === 'system') {
      const sysText = typeof m.content === 'string'
        ? m.content
        : Array.isArray(m.content) ? m.content.map(c => c.text || '').join('\n') : '';
      if (sysText) {
        if (sysText.includes('حالت تفکر عمیق') || sysText.includes('thinking mode ON')) {
          thinkingRequested = true;
        }
        systemInstruction = { parts: [{ text: sysText }] };
      }
      continue;
    }

    const role = m.role === 'assistant' ? 'model' : 'user';
    const parts = [];

    if (typeof m.content === 'string') {
      parts.push({ text: m.content });
    } else if (Array.isArray(m.content)) {
      for (const c of m.content) {
        if (c.type === 'text') {
          parts.push({ text: c.text || '' });
        } else if (c.type === 'image_url') {
          const imgUrl = c.image_url?.url || '';
          const m2 = imgUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (m2) parts.push({ inlineData: { mimeType: m2[1], data: m2[2] } });
        } else if (c.type === 'input_audio') {
          const fmt = (c.input_audio?.format || 'wav').toLowerCase();
          const data = c.input_audio?.data || '';
          if (data) parts.push({ inlineData: { mimeType: `audio/${fmt}`, data } });
        }
      }
    }

    if (parts.length) contents.push({ role, parts });
  }

  if (!contents.length) {
    return jsonResp({
      error: { message: "پیام معتبری نبود", status: "NO_MESSAGES" }
    }, 400);
  }

  const genConfig = {
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.75,
    maxOutputTokens: thinkingRequested ? 8192 : 2048,
  };

  if (/gemini-(2\.5|3\.)/.test(model)) {
    genConfig.thinkingConfig = {
      thinkingBudget: thinkingRequested ? -1 : 0
    };
  }

  const geminiBody = { contents, generationConfig: genConfig };
  if (systemInstruction) geminiBody.systemInstruction = systemInstruction;

  let geminiRes;
  try {
    geminiRes = await fetchWithRetry(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY,
      },
      body: JSON.stringify(geminiBody),
    });
  } catch (e) {
    return jsonResp({
      error: {
        message: "اتصال به Gemini: " + e.message,
        status: "GEMINI_CONNECTION_FAILED"
      }
    }, 502);
  }

  if (!geminiRes.ok) {
    let errBody = '';
    try { errBody = await geminiRes.text(); } catch (e) {}
    return jsonResp({
      error: {
        message: `Gemini خطا داد (${geminiRes.status}): ${errBody.substring(0, 400)}`,
        code: geminiRes.status,
        status: geminiRes.status === 404 ? "MODEL_NOT_FOUND" :
                geminiRes.status === 401 || geminiRes.status === 403 ? "AUTH_ERROR" :
                geminiRes.status === 429 ? "RATE_LIMIT" : "GEMINI_ERROR",
        model: model,
        hint: geminiRes.status === 404 ? `مدل «${model}» وجود نداره. مدل‌های معتبر: gemini-2.5-flash, gemini-2.5-pro` :
              geminiRes.status === 401 || geminiRes.status === 403 ? "کلید API معتبر نیست" :
              geminiRes.status === 429 ? "به سقف درخواست رسیدی" : "جزئیات توی Worker logs"
      }
    }, geminiRes.status);
  }

  return convertGeminiSSEtoOpenAI(geminiRes);
}

async function fetchWithRetry(url, options, maxRetries = 4) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`HTTP ${response.status}`);
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 800;
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 800;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
    }
  }
  throw lastError;
}

function convertGeminiSSEtoOpenAI(geminiResponse) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  (async () => {
    const reader = geminiResponse.body.getReader();
    let buffer = '';
    let hasSentContent = false;
    let lastFinishReason = null;

    const sendChunk = async (text) => {
      const chunk = { choices: [{ delta: { content: text }, index: 0, finish_reason: null }] };
      await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;
          let gData;
          try { gData = JSON.parse(jsonStr); } catch (e) { continue; }

          if (gData.promptFeedback?.blockReason) {
            await sendChunk(`\n\n⚠️ درخواست مسدود شد (${gData.promptFeedback.blockReason}).`);
            hasSentContent = true;
            continue;
          }
          const candidate = gData.candidates?.[0];
          if (!candidate) continue;
          if (candidate.finishReason) lastFinishReason = candidate.finishReason;

          const parts = candidate.content?.parts || [];
          for (const p of parts) {
            if (typeof p.text === 'string' && p.text.length > 0) {
              hasSentContent = true;
              await sendChunk(p.text);
            }
          }
        }
      }
      if (!hasSentContent) {
        if (lastFinishReason === 'SAFETY' || lastFinishReason === 'RECITATION') {
          await sendChunk(`⚠️ پاسخ به دلیل ${lastFinishReason} مسدود شد.`);
        } else if (lastFinishReason && lastFinishReason !== 'STOP') {
          await sendChunk(`⚠️ پاسخ ناتمام (${lastFinishReason})`);
        } else {
          await sendChunk(`⚠️ پاسخی نیومد. کلید و مدل رو چک کن.`);
        }
      }
      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (e) {
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: '\n⚠️ ' + e.message } }] })}\n\n`));
        await writer.write(encoder.encode('data: [DONE]\n\n'));
      } catch (_) {}
    } finally {
      try { await writer.close(); } catch (_) {}
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "Connection": "keep-alive",
    },
  });
}

function jsonResp(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
