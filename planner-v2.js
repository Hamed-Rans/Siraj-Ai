/* Siraj v2.0 — planner-v2.js (Core) */
(function(){
  'use strict';
  var tries = 0;
  var timer = setInterval(function(){
    tries++;
    if (typeof window.renderPlanner === 'function' && typeof window.loadPlannerNew === 'function') {
      clearInterval(timer);
      init();
    }
    if (tries > 60) clearInterval(timer);
  }, 100);

  function init(){
    function esc(s){
      return String(s||'').replace(/[&<>"']/g,function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      });
    }
    function getBaseURL(){
      try{ if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG && APP_CONFIG.baseURL && APP_CONFIG.baseURL.trim()) return APP_CONFIG.baseURL; }catch(e){}
      try{ if (window.APP_CONFIG && window.APP_CONFIG.baseURL && window.APP_CONFIG.baseURL.trim()) return window.APP_CONFIG.baseURL; }catch(e){}
      return '/api/chat';
    }
    function getModel(){
      try{ if (typeof settings !== 'undefined' && settings && settings.model) return settings.model; }catch(e){}
      try{ if (window.settings && window.settings.model) return window.settings.model; }catch(e){}
      return 'gemini-2.0-flash';
    }

    /* ============ پنل راست ============ */
    window.renderPanelForPlanner = function(){
      document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
      document.getElementById('panelSubText').textContent = 'خوش آمدی 🌟';
      document.getElementById('panelContent').innerHTML =
        '<button onclick="window.__openStudy()" style="display:flex;align-items:center;gap:12px;width:100%;padding:18px 20px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--accent-light),var(--accent-dark));color:#fff;font-family:var(--font-text);font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px -10px var(--accent);transition:transform .3s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'translateY(0)\'">' +
          '<svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.8;flex-shrink:0"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '<div style="text-align:right;flex:1"><div>حالت مطالعه</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">با تایمر و تمرکز کامل</div></div>' +
          '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.2"><path d="m9 18 6-6-6-6"/></svg>' +
        '</button>' +
        '<div class="panel-card" style="margin-top:14px">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>راهنما</span></div>' +
          '<div style="font-size:11.5px;color:var(--text-muted);line-height:2;text-align:right">' +
            '✨ روی دکمه‌ی بالا بزن<br>' +
            '📚 یه کار از لیستت انتخاب کن<br>' +
            '⏱️ زمان دلخواهت رو تنظیم کن<br>' +
            '🎯 تا آخر تایمر سایت قفل میشه' +
          '</div>' +
        '</div>';
    };

    /* ============ حالت مطالعه ============ */
    var studyTimer = null;
    var studySeconds = 0;
    var studyRunning = false;
    var studyPaused = false;

    function buildStudyOverlay(){
      var old = document.getElementById('studyOverlay');
      if (old) old.remove();

      var el = document.createElement('div');
      el.id = 'studyOverlay';
      el.className = 'study-overlay';
      el.innerHTML =
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          '<div class="study-sub">زمان مطالعه رو تنظیم کن</div>' +
          '<div class="stp-wrap" id="studyTimePicker">' +
            '<div class="stp-hint">↑ بکش بالا / ↓ پایین</div>' +
            '<span class="stp-unit">دقیقه</span>' +
            '<span class="stp-num" id="studyTimeNum">25</span>' +
          '</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyStartBtn">شروع مطالعه</button>' +
            '<button class="study-btn secondary" id="studyCancelBtn">لغو</button>' +
          '</div>' +
        '</div>' +
        '<div id="studyRunning" class="study-setup" style="display:none">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-mode-badge">🎯 در حال تمرکز — سایت قفله</div>' +
          '<div class="study-timer" id="studyTimer">' +
            '<span class="study-digit" data-k="m1">0</span>' +
            '<span class="study-digit" data-k="m2">0</span>' +
            '<span class="study-colon">:</span>' +
            '<span class="study-digit" data-k="s1">0</span>' +
            '<span class="study-digit" data-k="s2">0</span>' +
          '</div>' +
          '<div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی. موفق باشی! 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn pause-mode" id="studyPauseBtn"><span id="studyPauseLabel">توقف</span></button>' +
            '<button class="study-btn finish-mode" id="studyFinishBtn">پایان و ثبت</button>' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      /* Time picker با درگ */
      var picker = el.querySelector('#studyTimePicker');
      var numEl = el.querySelector('#studyTimeNum');
      var pickerVal = 25, dragStartY = 0, dragStartVal = 25, dragging = false;
      function setPickerVal(v){
        pickerVal = Math.max(1, Math.min(180, Math.round(v)));
        numEl.textContent = pickerVal;
      }
      function pointerDown(e){
        dragging = true;
        dragStartY = (e.touches ? e.touches[0].clientY : e.clientY);
        dragStartVal = pickerVal;
        picker.classList.add('dragging');
        e.preventDefault();
      }
      function pointerMove(e){
        if (!dragging) return;
        var y = (e.touches ? e.touches[0].clientY : e.clientY);
        setPickerVal(dragStartVal + Math.round((dragStartY - y) / 6));
      }
      function pointerUp(){ if (!dragging) return; dragging = false; picker.classList.remove('dragging'); }
      picker.addEventListener('mousedown', pointerDown);
      document.addEventListener('mousemove', pointerMove);
      document.addEventListener('mouseup', pointerUp);
      picker.addEventListener('touchstart', pointerDown, {passive:false});
      document.addEventListener('touchmove', pointerMove, {passive:false});
      document.addEventListener('touchend', pointerUp);

      window.__studyMinutesGetter = function(){ return pickerVal; };

      el.querySelector('#studyStartBtn').onclick = startStudy;
      el.querySelector('#studyCancelBtn').onclick = closeStudy;
      el.querySelector('#studyExitBtn').onclick = exitStudyConfirm;
      el.querySelector('#studyPauseBtn').onclick = toggleStudyPause;
      el.querySelector('#studyFinishBtn').onclick = finishAndRecord;
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      var mins = window.__studyMinutesGetter ? window.__studyMinutesGetter() : 25;
      studySeconds = mins * 60;
      studyRunning = true;
      studyPaused = false;
      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      updateStudyTimer(true);
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = setInterval(function(){
        if (studyPaused) return;
        studySeconds--;
        updateStudyTimer(false);
        if (studySeconds <= 0){
          clearInterval(studyTimer);
          studyTimer = null;
          studyRunning = false;
          unlockSite();
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد!');
          closeStudy();
        }
      }, 1000);
      lockSite();
    }

    function toggleStudyPause(){
      studyPaused = !studyPaused;
      var lbl = document.getElementById('studyPauseLabel');
      var sub = document.getElementById('studyRunningSub');
      if (studyPaused){
        if (lbl) lbl.textContent = 'ادامه';
        if (sub) sub.textContent = '⏸️ متوقف شده';
      } else {
        if (lbl) lbl.textContent = 'توقف';
        if (sub) sub.textContent = 'تا اتمام تایمر نمیتونی خارج شی. موفق باشی! 💪';
      }
    }

    function setDigit(k, val, animate){
      var el = document.querySelector('.study-digit[data-k="' + k + '"]');
      if (!el) return;
      if (el.textContent === String(val)) return;
      if (animate){
        el.classList.remove('roll');
        void el.offsetWidth;
        el.classList.add('roll');
      }
      el.textContent = String(val);
    }

    function updateStudyTimer(initial){
      if (studySeconds < 0) studySeconds = 0;
      var m = Math.floor(studySeconds / 60);
      var s = studySeconds % 60;
      var mStr = (m < 10 ? '0' : '') + m;
      var sStr = (s < 10 ? '0' : '') + s;
      var animate = !initial;
      setDigit('m1', mStr[0], animate);
      setDigit('m2', mStr[1], animate);
      setDigit('s1', sStr[0], animate);
      setDigit('s2', sStr[1], animate);
    }

    function exitStudyConfirm(){
      if (!confirm('از حالت مطالعه خارج شی؟')) return;
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null;
      studyRunning = false;
      unlockSite();
      closeStudy();
    }

    function finishAndRecord(){
      showPopup('🏆', 'خوب بود!', 'جلسه مطالعه تموم شد.');
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null;
      studyRunning = false;
      unlockSite();
      closeStudy();
    }

    function closeStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      overlay.classList.remove('open');
      setTimeout(function(){ overlay.remove(); }, 500);
    }

    function blockKey(e){
      if (!studyRunning) return;
      var k = e.key || '';
      var ctrl = e.ctrlKey || e.metaKey;
      if (k === 'F5' || k === 'F11' || k === 'Escape' ||
          (ctrl && ['r','R','w','W','n','N','t','T','p','P'].indexOf(k) >= 0)){
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    function blockContext(e){ if (studyRunning) e.preventDefault(); }
    function blockBeforeUnload(e){
      if (!studyRunning) return;
      e.preventDefault();
      e.returnValue = 'در حال مطالعه‌ای!';
      return e.returnValue;
    }
    function lockSite(){
      document.addEventListener('keydown', blockKey, true);
      document.addEventListener('contextmenu', blockContext, true);
      window.addEventListener('beforeunload', blockBeforeUnload);
    }
    function unlockSite(){
      document.removeEventListener('keydown', blockKey, true);
      document.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockBeforeUnload);
    }

    function showPopup(emoji, title, text){
      var old = document.getElementById('sirajPopup');
      if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajPopup';
      el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup">' +
        '<span class="siraj-popup-emoji">' + emoji + '</span>' +
        '<div class="siraj-popup-title">' + title + '</div>' +
        '<div class="siraj-popup-text">' + text + '</div>' +
        '<button class="siraj-popup-btn" onclick="document.getElementById(\'sirajPopup\').classList.remove(\'open\');setTimeout(function(){var p=document.getElementById(\'sirajPopup\');if(p)p.remove();},320)">متوجه شدم</button></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
    }

    window.__openStudy = function(){
      buildStudyOverlay();
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      requestAnimationFrame(function(){ overlay.classList.add('open'); });
    };

    /* ============ مقالات ============ */
    window.renderBlog = function(){
      var v = document.getElementById('view-blog');
      if (!v) return;
      v.innerHTML = '<div class="page-title-bar"><div class="page-title-text">مقالات سراج</div></div>' +
        '<div class="community-hero"><div class="community-icon">' +
          '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>' +
        '</div><div class="community-title">مقالات و یادداشت‌های سراج</div>' +
        '<div class="community-desc">یه فضای صمیمی برای نوشتن مقالات. به‌زودی ✍️</div>' +
        '<div class="community-badge">به‌زودی راه‌اندازی می‌شه</div></div>';
    };

    /* ============ Retry ============ */
    setTimeout(function(){
      window.retryMsg = function(e, btn){
        e.stopPropagation();
        var w = btn.closest('.msg-wrap');
        var t = w.querySelector('.msg').textContent;
        w.classList.remove('selected');
        var all = Array.from(document.querySelectorAll('#box .msg-wrap'));
        var myIdx = all.indexOf(w);
        if (myIdx >= 0){
          for (var i = all.length - 1; i > myIdx; i--){
            if (all[i].classList.contains('bot')) all[i].remove();
          }
        }
        if (window.currentChatId){
          var h = window.loadHistory();
          if (h[window.currentChatId]){
            for (var j = h[window.currentChatId].messages.length - 1; j >= 0; j--){
              if (h[window.currentChatId].messages[j].role === 'assistant'){
                h[window.currentChatId].messages.splice(j, 1);
              } else break;
            }
          }
          window.saveHistory(h);
        }
        w.remove();
        if (window.currentChatId){
          var h2 = window.loadHistory();
          if (h2[window.currentChatId]){
            for (var k = h2[window.currentChatId].messages.length - 1; k >= 0; k--){
              if (h2[window.currentChatId].messages[k].role === 'user' && h2[window.currentChatId].messages[k].content === t){
                h2[window.currentChatId].messages.splice(k, 1);
                break;
              }
            }
          }
          window.saveHistory(h2);
        }
        if (typeof window.renderHistory === 'function') window.renderHistory();
        document.getElementById('q').value = t;
        if (typeof window.handleInput === 'function') window.handleInput();
        if (typeof window.send === 'function') window.send();
      };
    }, 1300);

    /* ============ هوک روی renderPlanner ============ */
    var origRenderPlanner = window.renderPlanner;
    window.renderPlanner = function(){
      origRenderPlanner.apply(this, arguments);
      setTimeout(function(){
        var t = document.querySelector('.planner-tab.active');
        if (!t) return;
        var m = (t.getAttribute('onclick') || '').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);
        var tab = m ? m[1] : 'daily';
        if (typeof window.renderPlannerPane === 'function') window.renderPlannerPane();
      }, 30);
    };

    console.log('[Siraj v2.0 Core] planner loaded ✓');
  }
})();
