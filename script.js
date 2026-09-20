/* Siraj v2.6 — script.js (Complete, Bug-Free) */

/* ═══════════════════════════════════════════════════════════════
   APP CONFIG
   ═══════════════════════════════════════════════════════════════ */
const APP_CONFIG = {
    baseURL: "https://siraj-proxy.hamedansarifar.workers.dev/openai/chat/completions",
    devNotifUrl: "https://raw.githubusercontent.com/Hamed-Rans/Siraj-Ai/refs/heads/main/notifications.json",
    promptsUrl: "https://raw.githubusercontent.com/Hamed-Rans/Siraj-Ai/refs/heads/main/prompts.json",
    adminPassword: "Ransari0185",
    models: [
        {
            id: 'hakim',
            name: 'حکیم',
            emoji: '🧠',
            desc: 'استاد نحو، صرف و اعراب',
            color: '#8b5cf6',
            baseURL: 'https://siraj-proxy.hamedansarifar.workers.dev/openai/chat/completions/hakim',
            apiModel: 'gemini-3.6-flash',
            systemExtra: ''
        },
        {
            id: 'adib',
            name: 'ادیب',
            emoji: '✍️',
            desc: 'هنرمند ادبیات و ترجمه',
            color: '#F59E0B',
            baseURL: 'https://siraj-proxy.hamedansarifar.workers.dev/openai/chat/completions/adib',
            apiModel: 'gemini-3.6-flash',
            systemExtra: ''
        },
        {
            id: 'siraj-yar',
            name: 'سراج‌یار',
            emoji: '🎯',
            desc: 'همراه و مشاور تو',
            color: '#10B981',
            baseURL: 'https://siraj-proxy.hamedansarifar.workers.dev/openai/chat/completions/siraj-yar',
            apiModel: 'gemini-3.6-flash',
            systemExtra: ''
        }
    ],
    patternPresets: [
        { c1: '#2AA5B8', c2: '#F5A623', n: 'کلاسیک' },
        { c1: '#D4AF37', c2: '#B8860B', n: 'زرین' },
        { c1: '#EF4444', c2: '#F59E0B', n: 'آتشین' },
        { c1: '#8b5cf6', c2: '#ec4899', n: 'جادویی' },
        { c1: '#10B981', c2: '#06B6D4', n: 'طبیعی' },
        { c1: '#6366F1', c2: '#3B82F6', n: 'نیلی' },
        { c1: '#F472B6', c2: '#FBBF24', n: 'پاستل' },
        { c1: '#F8FAFC', c2: '#CBD5E1', n: 'مونو' }
    ],
    defaultSettings: {
        themeMode: 'dark', themeColor: 'navy', bubbleShape: 'modern', fontSize: '15px',
        animation: 'normal', model: 'gemini-3.6-flash', dialect: 'fusha',
        selectedModel: 'hakim',
        thinking: false, quick: false, inputStyle: 'solid', headerStyle: 'glass',
        elementStyle: 'solid',
        pattern: 'boteh', patternPosition: 'both',
        patternSize: 180, patternOpacity: 45, patternPerCorner: 2,
        patternColor1: '#2AA5B8', patternColor2: '#F5A623',
        navStartCollapsed: false, navPosition: 'bottom', navStyle: 'default',
        navShadowLevel: 40, bgImage: '', bgImageOpacity: 100, bgPreset: 'none',
        fontFamily: 'vazirmatn', uiLang: 'fa',
        password: '', passwordEnabled: false,
        autoLockMinutes: 0, lockOnTabSwitch: false,
        profileImage: '',
        notifEnabled: true,
        notifPreMinutes: 10,
        studyDefaultMinutes: 25,
        studyStrictMode: true,
        aiLevel: 'intermediate',
        aiLang: 'fa',
        appVersion: '2.5'
    },
    themeColors: ['navy', 'crimson', 'gold', 'purple', 'emerald', 'indigo'],
    colorNames: { navy: 'شبانه', crimson: 'آتشین', gold: 'زرین', purple: 'جادویی', emerald: 'طبیعی', indigo: 'نیلی' },
    colorIcons: {
        navy: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
        crimson: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
        gold: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"/>',
        purple: '<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/>',
        emerald: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>',
        indigo: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/><circle cx="19" cy="5" r="1" fill="currentColor"/>'
    },
        patterns: [
        { id: 'boteh', name: 'بته جقه' },
        { id: 'circles', name: 'دایره‌های متقارن' },
        { id: 'waves', name: 'موج' },
        { id: 'dots', name: 'نقطه‌ای' },
        { id: 'grid', name: 'شبکه' },
        { id: 'leaf', name: 'برگ' },
        { id: 'mosaic', name: 'کاشی' },
        { id: 'arc', name: 'طاق' },
        { id: 'none', name: 'بدون طرح' }
    ],
    inputStyles: [
        { id: 'solid', name: 'ساده', icon: '<rect x="3" y="8" width="18" height="8" rx="4"/>' },
        { id: 'glass', name: 'شیشه‌ای', icon: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M7 8v8M17 8v8" opacity=".5"/>' }
    ],
    headerStyles: [
        { id: 'solid', name: 'ساده', icon: '<rect x="2" y="6" width="20" height="12" rx="3"/>' },
        { id: 'glass', name: 'شیشه‌ای', icon: '<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 6v12M18 6v12" opacity=".4"/>' }
    ],
    elementStyles: [
        { id: 'solid', name: 'ساده', icon: '<rect x="3" y="3" width="18" height="18" rx="3"/>' },
        { id: 'glass', name: 'شیشه‌ای', icon: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 3v18M17 3v18" opacity=".4"/>' }
    ],
    navPositions: [
        { id: 'right', name: 'راست', icon: '<rect x="17" y="3" width="4" height="18" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="3" width="12" height="18" rx="2"/>' },
        { id: 'bottom', name: 'پایین', icon: '<rect x="3" y="17" width="18" height="4" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="3" width="18" height="12" rx="2"/>' },
        { id: 'top', name: 'بالا', icon: '<rect x="3" y="3" width="18" height="4" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="9" width="18" height="12" rx="2"/>' },
        { id: 'left', name: 'چپ', icon: '<rect x="3" y="3" width="4" height="18" rx="2" fill="currentColor" opacity=".7"/><rect x="9" y="3" width="12" height="18" rx="2"/>' }
    ],
    navStyles: [
        { id: 'default', name: 'ساده', icon: '<rect x="3" y="8" width="18" height="8" rx="4"/>' },
        { id: 'glass', name: 'شیشه‌ای', icon: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M7 8v8M17 8v8" opacity=".5"/>' }
    ],
    bgPresets: [
        { id: 'none', name: 'پیش‌فرض', value: '', valueLight: '' },
        { id: 'aurora', name: 'شفق', value: 'linear-gradient(135deg,#0B0E14 0%,#1a1a2e 50%,#16213e 100%)', valueLight: 'linear-gradient(135deg,#F0F4FB 0%,#D5E1F5 50%,#B8CCEF 100%)' },
        { id: 'ocean', name: 'اقیانوس', value: 'linear-gradient(135deg,#0B0E14 0%,#0a1929 50%,#0c2d48 100%)', valueLight: 'linear-gradient(135deg,#E5F4FC 0%,#B8DDF3 50%,#8CC9EC 100%)' },
        { id: 'sunset', name: 'غروب', value: 'linear-gradient(135deg,#0B0E14 0%,#2a1810 50%,#1a0f1a 100%)', valueLight: 'linear-gradient(135deg,#FFF0E0 0%,#FFD5B8 50%,#FFB8A8 100%)' },
        { id: 'forest', name: 'جنگل', value: 'linear-gradient(135deg,#0B0E14 0%,#0a1f15 50%,#0c2d1f 100%)', valueLight: 'linear-gradient(135deg,#E8F8EE 0%,#C2EBD0 50%,#98DCAE 100%)' },
        { id: 'mesh', name: 'شبکه', value: 'radial-gradient(circle at 20% 20%,rgba(59,130,246,.25),transparent 45%),radial-gradient(circle at 80% 80%,rgba(245,166,35,.2),transparent 45%),#0B0E14', valueLight: 'radial-gradient(circle at 20% 20%,rgba(59,130,246,.35),transparent 45%),radial-gradient(circle at 80% 80%,rgba(245,166,35,.35),transparent 45%),#F0F4FA' },
        { id: 'dots', name: 'نقطه‌ای', value: 'radial-gradient(rgba(120,150,200,.18) 1px,transparent 1px) 0 0/20px 20px repeat #0B0E14', valueLight: 'radial-gradient(rgba(70,100,150,.3) 1px,transparent 1px) 0 0/20px 20px repeat #F0F4FA' }
    ],
    fonts: {
        persian: [{ id: 'vazirmatn', name: 'وزیرمتن' }, { id: 'estedad', name: 'استعداد' }, { id: 'shabnam', name: 'شبنم' }, { id: 'lalezar', name: 'لاله‌زار' }],
        arabic: [{ id: 'amiri', name: 'Amiri' }, { id: 'cairo', name: 'Cairo' }, { id: 'noto-naskh', name: 'Naskh' }, { id: 'tajawal', name: 'Tajawal' }],
        english: [{ id: 'inter', name: 'Inter' }, { id: 'poppins', name: 'Poppins' }, { id: 'space-grotesk', name: 'Space Grotesk' }]
    },
    languages: [{ id: 'fa', name: 'فارسی' }, { id: 'ar', name: 'العربیة' }, { id: 'en', name: 'English' }],
    animations: [{ id: 'smooth', name: 'روان' }, { id: 'normal', name: 'معمولی' }, { id: 'fast', name: 'سریع' }, { id: 'off', name: 'خاموش' }],
    bubbleShapes: [
        { id: 'modern', name: 'مدرن', icon: '<rect x="3" y="5" width="18" height="14" rx="6"/>' },
        { id: 'cloud', name: 'ابری', icon: '<path d="M17 18H7a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17 18z"/>' },
        { id: 'leaf', name: 'برگی', icon: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>' },
        { id: 'diamond', name: 'الماس', icon: '<path d="M12 2l10 10-10 10L2 12z"/>' },
        { id: 'speech', name: 'گفتار', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' }
    ],
    dialects: [
        { id: 'fusha', name: 'فصیح', icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h8M9 11h5"/>' },
        { id: 'iraqi', name: 'عراقی', icon: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 10v4M12 9v6"/>' },
        { id: 'levantine', name: 'شامی', icon: '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/><path d="M12 7v3"/>' },
        { id: 'egyptian', name: 'مصری', icon: '<path d="M3 22h18M5 22V8l7-6 7 6v14M9 22V12h6v10"/><path d="M7 11h10"/>' },
        { id: 'maghrebi', name: 'مغربی', icon: '<path d="M3 21h18M5 21v-6M19 21v-6M7 15h10l-5-10z"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/>' }
    ]
};

/* ═══════════════════════════════════════════════════════════════
   PATTERN TEMPLATES
   ═══════════════════════════════════════════════════════════════ */
const PATTERN_TEMPLATES = {
    boteh: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.2' stroke-linecap='round'><path d='M140 40 Q100 55 90 100 Q78 148 105 185 Q135 212 172 196 Q202 180 200 142 Q198 108 168 92 Q142 78 148 55 Q150 45 140 40 Z'/></g><g fill='none' stroke='${c2}' stroke-width='1.2' stroke-linecap='round'><path d='M100 40 Q140 55 150 100 Q162 148 135 185 Q105 212 68 196 Q38 180 40 142 Q42 108 72 92 Q98 78 92 55 Q90 45 100 40 Z'/></g></svg>`,
    circles: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.2'><circle cx='120' cy='120' r='85'/><circle cx='120' cy='120' r='55'/></g><circle cx='120' cy='120' r='25' fill='none' stroke='${c2}' stroke-width='1.2'/></svg>`,
    waves: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.2' stroke-linecap='round'><path d='M10 60 Q60 30 120 60 T230 60'/><path d='M10 120 Q60 90 120 120 T230 120'/><path d='M10 180 Q60 150 120 180 T230 180'/></g><circle cx='200' cy='40' r='4' fill='${c2}'/></svg>`,
    dots: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='${c1}' opacity='.6'><circle cx='40' cy='40' r='4'/><circle cx='120' cy='40' r='4'/><circle cx='200' cy='40' r='4'/><circle cx='80' cy='90' r='4'/><circle cx='160' cy='90' r='4'/><circle cx='40' cy='140' r='4'/><circle cx='120' cy='140' r='4'/><circle cx='200' cy='140' r='4'/></g><g fill='${c2}' opacity='.8'><circle cx='80' cy='190' r='5'/><circle cx='160' cy='190' r='5'/></g></svg>`,
    grid: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g stroke='${c1}' stroke-width='1' opacity='.5'><line x1='40' y1='20' x2='40' y2='220'/><line x1='120' y1='20' x2='120' y2='220'/><line x1='200' y1='20' x2='200' y2='220'/><line x1='20' y1='40' x2='220' y2='40'/><line x1='20' y1='120' x2='220' y2='120'/><line x1='20' y1='200' x2='220' y2='200'/></g><rect x='110' y='110' width='20' height='20' fill='none' stroke='${c2}' stroke-width='1.5'/><circle cx='120' cy='120' r='3' fill='${c2}'/></svg>`,
    leaf: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.2' stroke-linecap='round'><path d='M120 30 Q120 90 120 150 Q120 210 120 230'/><path d='M120 60 Q90 70 75 100 Q60 130 90 150 Q120 165 120 150'/><path d='M120 60 Q150 70 165 100 Q180 130 150 150 Q120 165 120 150'/></g><circle cx='120' cy='40' r='3' fill='${c2}'/></svg>`,
    mosaic: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.2'><rect x='60' y='60' width='40' height='40'/><rect x='140' y='60' width='40' height='40'/><rect x='60' y='140' width='40' height='40'/><rect x='140' y='140' width='40' height='40'/></g><g fill='none' stroke='${c2}' stroke-width='1.2'><rect x='100' y='100' width='40' height='40'/></g></svg>`,
    arc: (c1, c2) => `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.3' stroke-linecap='round'><path d='M40 200 Q40 100 120 100 Q200 100 200 200'/><path d='M60 200 Q60 120 120 120 Q180 120 180 200'/></g><g fill='none' stroke='${c2}' stroke-width='1.3'><path d='M80 200 Q80 140 120 140 Q160 140 160 200'/></g></svg>`
};

/* ═══════════════════════════════════════════════════════════════
   STORAGE KEYS
   ═══════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'siraj-settings';
const HISTORY_KEY = 'siraj-history';
const PLANNER_KEY = 'siraj-planner';
const BLOG_KEY = 'siraj-blog';
const VIDEOS_KEY = 'siraj-videos';
const NAV_KEY = 'siraj-nav-collapsed';
const PIN_KEY = 'siraj-nav-pinned';
const LOCK_SESSION_KEY = 'siraj-unlocked-session';
const SESSIONS_KEY = 'siraj-active-sessions';
const SESSION_ID_KEY = 'siraj-session-id';
const PROFILE_IMG_KEY = 'siraj-profile-img';
const DEV_NOTIF_SEEN_KEY = 'siraj-dev-notif-seen';
const DEV_NOTIF_CACHE_KEY = 'siraj-dev-notif-cache';
const ADMIN_KEY = 'siraj_is_admin';

const LEVEL_KEY = 'siraj-user-level';
const DEFAULT_VIEW_KEY = 'siraj-default-view';
const PROFILE_KEY = 'siraj-profile';

const LEVEL_LABELS = { beginner: 'مبتدی', intermediate: 'متوسط', advanced: 'پیشرفته' };
const VIEW_LABELS = { chat: 'گفتگو', planner: 'برنامه‌ریز', blog: 'مقالات', videos: 'دیوان', tools: 'دستیار' };

function getUserLevel() { try { return localStorage.getItem(LEVEL_KEY) || 'beginner'; } catch (e) { return 'beginner'; } }
function setUserLevel(l) { try { localStorage.setItem(LEVEL_KEY, l); } catch (e) {} }
function getDefaultView() { try { return localStorage.getItem(DEFAULT_VIEW_KEY) || 'chat'; } catch (e) { return 'chat'; } }
function setDefaultView(v) { try { localStorage.setItem(DEFAULT_VIEW_KEY, v); } catch (e) {} }
function getProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); } catch (e) { return {}; } }
function saveProfile(p) { try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) {} }

/* ═══════════════════════════════════════════════════════════════
   RATE LIMITER
   ═══════════════════════════════════════════════════════════════ */
const RateLimiter = {
    queue: [], processing: false, minInterval: 1500, lastRequest: 0,
    async run(fn) {
        return new Promise((res, rej) => { this.queue.push({ fn, res, rej }); this.process(); });
    },
    async process() {
        if (this.processing || !this.queue.length) return;
        this.processing = true;
        while (this.queue.length) {
            const it = this.queue.shift();
            const w = Math.max(0, this.minInterval - (Date.now() - this.lastRequest));
            if (w > 0) await new Promise(r => setTimeout(r, w));
            this.lastRequest = Date.now();
            try { it.res(await it.fn()); } catch (e) { it.rej(e); }
        }
        this.processing = false;
    }
};

window.plannerDate = new Date();

/* ═══════════════════════════════════════════════════════════════
   ADMIN
   ═══════════════════════════════════════════════════════════════ */
function isAdmin() { return localStorage.getItem(ADMIN_KEY) === '1'; }
function setAdmin(v) { localStorage.setItem(ADMIN_KEY, v ? '1' : '0'); }

/* ═══════════════════════════════════════════════════════════════
   GLOBAL STATE
   ═══════════════════════════════════════════════════════════════ */
let settings = loadSettings();
let settingsDraft = null;
let settingsCat = 'appearance';
let currentChatId = null;
let currentFile = null;
let currentFileType = null;
let pendingRequests = {};
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let chatInFlight = false;
let currentView = 'chat';
let streamQueue = '';
let streamWriting = false;
let streamTargetEl = null;
let streamFinished = false;
let streamResultFull = '';
let previewRaf = null;
let activeChatId = null;
let isStreaming = false;
let isNavPinned = false;
let sessionPingInterval = null;
let inactivityTimer = null;
let plannerTab = 'daily';
let currentPanelTab = 'history';
window._settingsSub = 'general';

/* ═══════════════════════════════════════════════════════════════
   ADMIN ACTIONS
   ═══════════════════════════════════════════════════════════════ */
window.__promptAdminPassword = function (pwd) {
    if (!APP_CONFIG.adminPassword) { toast('رمز ادمین تنظیم نشده', 'error'); return false; }
    if (pwd === APP_CONFIG.adminPassword) {
        setAdmin(true);
        toast('✓ حالت ادمین فعال شد', 'success');
        renderSettingsControls();
        return true;
    }
    toast('رمز اشتباه است', 'error');
    return false;
};

window.__logoutAdmin = function () {
    setAdmin(false);
    toast('از حالت ادمین خارج شدی', 'info');
    renderSettingsControls();
};

window.__downloadPromptsJSON = function () {
    if (!isAdmin()) return;
    var m = settingsDraft.models || JSON.parse(JSON.stringify(APP_CONFIG.models));
    var out = {};
    m.forEach(function (x) { out[x.id] = x.systemExtra || ''; });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'prompts.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('prompts.json دانلود شد', 'success');
};

async function fetchPromptsFromGitHub() {
    if (!APP_CONFIG.promptsUrl || !APP_CONFIG.promptsUrl.trim()) return;
    try {
        const res = await fetch(APP_CONFIG.promptsUrl.trim() + '?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (typeof data !== 'object') return;
        if (isAdmin()) return;
        APP_CONFIG.models.forEach(function (m) {
            if (data[m.id] && typeof data[m.id] === 'string' && data[m.id].trim()) m.systemExtra = data[m.id];
        });
        if (settings.models) {
            settings.models.forEach(function (m) {
                if (data[m.id] && typeof data[m.id] === 'string' && data[m.id].trim()) m.systemExtra = data[m.id];
            });
        }
        saveSettings();
    } catch (e) { console.warn('[Prompts]', e); }
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS LOAD / SAVE
   ═══════════════════════════════════════════════════════════════ */
function loadSettings() {
    try {
        const l = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        const s = Object.assign({}, APP_CONFIG.defaultSettings, l);
        const pi = localStorage.getItem(PROFILE_IMG_KEY);
        if (pi && !s.profileImage) s.profileImage = pi;
        if (!s.models) s.models = JSON.parse(JSON.stringify(APP_CONFIG.models));
        /* ★ اجبار نسخه به 2.5 */
        if (s.appVersion !== '2.5') s.appVersion = '2.5';
        return s;
    } catch (e) {
        return Object.assign({}, APP_CONFIG.defaultSettings, { models: JSON.parse(JSON.stringify(APP_CONFIG.models)) });
    }
}

function getCurrentModelConfig() {
    var id = settings.selectedModel || 'hakim';
    var m = (settings.models && settings.models.find(function (x) { return x.id === id; }))
        || APP_CONFIG.models.find(function (x) { return x.id === id; });
    return m || APP_CONFIG.models[0];
}

const loadedFonts = new Set(['vazirmatn', 'estedad', 'inter']);
function loadFontIfNeeded(fontId) {
    if (!fontId || loadedFonts.has(fontId)) return;
    loadedFonts.add(fontId);
    const fontMap = {
        'shabnam': 'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css',
        'lalezar': 'https://fonts.googleapis.com/css2?family=Lalezar&display=swap',
        'amiri': 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
        'cairo': 'https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap',
        'noto-naskh': 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&display=swap',
        'tajawal': 'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap',
        'poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap',
        'space-grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
        'jetbrains': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap'
    };
    const url = fontMap[fontId];
    if (!url) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}
function ensureCurrentFontLoaded() {
    if (settings.fontFamily && settings.fontFamily !== 'vazirmatn') {
        loadFontIfNeeded(settings.fontFamily);
    }
}

function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (settings.profileImage !== undefined) {
        try { localStorage.setItem(PROFILE_IMG_KEY, settings.profileImage || ''); } catch (e) {}
    }
}

/* ═══════════════════════════════════════════════════════════════
   LOAD/SAVE HELPERS
   ═══════════════════════════════════════════════════════════════ */
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); } catch { return {}; } }
function saveHistory(h) { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
function loadPlanner() { try { return JSON.parse(localStorage.getItem(PLANNER_KEY) || '{}'); } catch { return {}; } }
function savePlanner(p) { localStorage.setItem(PLANNER_KEY, JSON.stringify(p)); }
function loadBlog() { try { return JSON.parse(localStorage.getItem(BLOG_KEY) || '[]'); } catch { return []; } }
function saveBlog(b) { localStorage.setItem(BLOG_KEY, JSON.stringify(b)); }
function loadVideos() { try { return JSON.parse(localStorage.getItem(VIDEOS_KEY) || '[]'); } catch { return []; } }
function saveVideos(v) { localStorage.setItem(VIDEOS_KEY, JSON.stringify(v)); }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function formatMd(text) { return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }

/* ═══════════════════════════════════════════════════════════════
   DATE HELPERS
   ═══════════════════════════════════════════════════════════════ */
const WEEK_NAMES = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
function getDayName(d) { return WEEK_NAMES[(d.getDay() + 1) % 7]; }
function dateKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function getWeekStart(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = (day + 1) % 7;
    d.setDate(d.getDate() - diff);
    return d;
}
function getWeekDays() {
    const days = [];
    const start = getWeekStart(window.plannerDate);
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push({ key: dateKey(d), name: getDayName(d), date: d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }), dateObj: d });
    }
    return days;
}
function padHour(h) { return String(h).padStart(2, '0'); }
const HOURS_RANGE = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

function loadPlannerNew() {
    const raw = loadPlanner();
    if (!raw.days) raw.days = {};
    if (!raw.months) raw.months = {};
    return raw;
}
function getDayData(pl, key) {
    if (!pl.days[key]) pl.days[key] = { hours: {}, tasks: [] };
    if (!pl.days[key].hours) pl.days[key].hours = {};
    if (!pl.days[key].tasks) pl.days[key].tasks = [];
    return pl.days[key];
}
function monthKeyOf(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }

/* ═══════════════════════════════════════════════════════════════
   SESSIONS
   ═══════════════════════════════════════════════════════════════ */
function getMySessionId() {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
        id = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
}
function loadSessions() { try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '{}'); } catch { return {}; } }
function saveSessions(s) { localStorage.setItem(SESSIONS_KEY, JSON.stringify(s)); }

function registerMySession() {
    const sessions = loadSessions();
    const id = getMySessionId();
    const now = Date.now();
    if (!sessions[id]) {
        sessions[id] = { id, ua: navigator.userAgent, platform: navigator.platform || '', lang: navigator.language || '', createdAt: now, lastPing: now };
    } else {
        sessions[id].lastPing = now;
    }
    saveSessions(sessions);
}
function pingMySession() {
    const id = getMySessionId();
    const sessions = loadSessions();
    if (!sessions[id]) {
        if (settings.passwordEnabled && settings.password) {
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls = document.getElementById('lockScreen');
            if (ls) ls.classList.add('open');
        }
        return;
    }
    sessions[id].lastPing = Date.now();
    saveSessions(sessions);
}
function cleanupSessions() {
    const sessions = loadSessions();
    const now = Date.now();
    const STALE = 90 * 1000;
    let changed = false;
    Object.keys(sessions).forEach(k => {
        if (now - sessions[k].lastPing > STALE) { delete sessions[k]; changed = true; }
    });
    if (changed) saveSessions(sessions);
}
function removeSession(sid) {
    const sessions = loadSessions();
    delete sessions[sid];
    saveSessions(sessions);
    if (sid === getMySessionId()) {
        sessionStorage.removeItem(LOCK_SESSION_KEY);
        sessionStorage.removeItem(SESSION_ID_KEY);
        location.reload();
        return;
    }
    if (settingsCat === 'privacy') renderSettingsControls();
    toast('دستگاه حذف شد ✓', 'success');
}
function getDeviceName(ua, platform) {
    ua = ua || '';
    let browser = 'مرورگر';
    if (/OPR\//.test(ua)) browser = 'Opera';
    else if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Chrome\//.test(ua)) browser = 'Chrome';
    else if (/Safari\//.test(ua)) browser = 'Safari';
    let os = 'دستگاه';
    if (/Windows/.test(ua)) os = 'ویندوز';
    else if (/Mac OS X/.test(ua)) os = 'مک';
    else if (/Android/.test(ua)) os = 'اندروید';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'لینوکس';
    return browser + ' · ' + os;
}
function timeAgo(ts) {
    const d = Date.now() - ts;
    const s = Math.floor(d / 1000);
    if (s < 30) return 'همین الان';
    if (s < 60) return s + ' ثانیه پیش';
    const m = Math.floor(s / 60);
    if (m < 60) return m + ' دقیقه پیش';
    const h = Math.floor(m / 60);
    if (h < 24) return h + ' ساعت پیش';
    return Math.floor(h / 24) + ' روز پیش';
}

function unregisterMySession() {
    const id = getMySessionId();
    const sessions = loadSessions();
    delete sessions[id];
    saveSessions(sessions);
}

/* ═══════════════════════════════════════════════════════════════
   INACTIVITY
   ═══════════════════════════════════════════════════════════════ */
function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    const mins = parseInt(settings.autoLockMinutes) || 0;
    if (mins > 0 && settings.passwordEnabled && settings.password && sessionStorage.getItem(LOCK_SESSION_KEY) === '1') {
        inactivityTimer = setTimeout(() => {
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls = document.getElementById('lockScreen');
            if (ls) ls.classList.add('open');
            const hb = document.getElementById('headerLockBtn');
            if (hb) hb.classList.add('locked');
        }, mins * 60 * 1000);
    }
}
['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(ev => {
    document.addEventListener(ev, resetInactivityTimer, { passive: true });
});

/* ═══════════════════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════════════════ */
function toast(msg, type) {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    const icon = type === 'error'
        ? '<path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/>'
        : type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>'
            : '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';
    el.innerHTML = '<svg viewBox="0 0 24 24">' + icon + '</svg><span>' + escapeHtml(msg) + '</span>';
    c.appendChild(el);
    setTimeout(() => { el.classList.add('leaving'); setTimeout(() => el.remove(), 380); }, 3800);
}

/* ═══════════════════════════════════════════════════════════════
   NAV SHADOW
   ═══════════════════════════════════════════════════════════════ */
function computeNavShadow(level) {
    const l = Math.max(0, Math.min(100, level)) / 100;
    if (l === 0) return 'none';
    return '0 ' + (10 + l * 12) + 'px ' + (24 + l * 36) + 'px ' + (-8 + l * -4) + 'px rgba(0,0,0,' + (0.4 + l * 0.4) + '), 0 0 ' + (l * 40) + 'px ' + (l * -10) + 'px var(--accent)';
}

/* ═══════════════════════════════════════════════════════════════
   PATTERN
   ═══════════════════════════════════════════════════════════════ */
function applyPattern(layer, patternId, c1, c2, perCorner, size, position, opacity) {
    if (!layer) return;
    layer.innerHTML = '';
    layer.style.opacity = opacity / 100;
    if (patternId === 'none') return;
    const tpl = PATTERN_TEMPLATES[patternId];
    if (!tpl) return;
    const url = 'url("data:image/svg+xml,' + encodeURIComponent(tpl(c1, c2)) + '")';
    const corners = position === 'tr' ? ['tr'] : position === 'bl' ? ['bl'] : position === 'reverse' ? ['tl', 'br'] : ['tr', 'bl'];
    const N = Math.max(1, Math.min(8, perCorner));
    const gap = size * 0.06;
    const step = size * 0.42;
    corners.forEach(corner => {
        for (let i = 0; i < N; i++) {
            const d = document.createElement('div');
            d.style.position = 'absolute';
            d.style.width = size + 'px';
            d.style.height = size + 'px';
            d.style.backgroundImage = url;
            d.style.backgroundRepeat = 'no-repeat';
            d.style.backgroundSize = 'contain';
            d.style.backgroundPosition = 'center';
            d.style.pointerEvents = 'none';
            const off = gap + i * step;
            if (corner === 'tr') { d.style.right = off + 'px'; d.style.top = off + 'px'; }
            else if (corner === 'tl') { d.style.left = off + 'px'; d.style.top = off + 'px'; }
            else if (corner === 'bl') { d.style.left = off + 'px'; d.style.bottom = off + 'px'; }
            else { d.style.right = off + 'px'; d.style.bottom = off + 'px'; }
            layer.appendChild(d);
        }
    });
}

function getBgValue(t) {
    if (!t) return 'none';
    if (t.bgImage) return 'url("' + t.bgImage + '")';
    if (t.bgPreset && t.bgPreset !== 'none') {
        const preset = APP_CONFIG.bgPresets.find(p => p.id === t.bgPreset);
        if (preset) {
            const isLight = t.themeMode === 'light';
            const v = isLight ? preset.valueLight : preset.value;
            if (v) return v;
        }
    }
    return 'none';
}

function applyBodyBackground(t) {
    const root = document.documentElement;
    const body = document.body;
    const v = getBgValue(t);
    /* body همیشه شفاف بمونه */
    body.style.background = '';
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundAttachment = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundColor = '';
    /* ★ پس‌زمینه در CSS variable ذخیره میشه و body::before نمایشش میده */
    if (v === 'none') {
        root.style.setProperty('--siraj-bg', 'var(--primary-gradient)');
        root.style.setProperty('--siraj-bg-size', 'cover');
        root.style.setProperty('--siraj-bg-repeat', 'no-repeat');
    } else {
        root.style.setProperty('--siraj-bg', v);
        if (t.bgImage) {
            root.style.setProperty('--siraj-bg-size', 'cover');
            root.style.setProperty('--siraj-bg-repeat', 'no-repeat');
        } else if (t.bgPreset === 'dots') {
            root.style.setProperty('--siraj-bg-size', '20px 20px');
            root.style.setProperty('--siraj-bg-repeat', 'repeat');
        } else {
            root.style.setProperty('--siraj-bg-size', 'cover');
            root.style.setProperty('--siraj-bg-repeat', 'no-repeat');
        }
    }
}
/* ═══════════════════════════════════════════════════════════════
   APPLY SETTINGS
   ═══════════════════════════════════════════════════════════════ */
function applySettingsToUI(s) {
    const t = s || settings;
    loadFontIfNeeded(t.fontFamily || 'vazirmatn');
    document.documentElement.setAttribute('data-theme', t.themeMode + '-' + t.themeColor);
    document.documentElement.setAttribute('data-bubble-shape', t.bubbleShape);
    document.documentElement.setAttribute('data-anim', t.animation || 'normal');
    document.documentElement.setAttribute('data-pattern', t.pattern || 'boteh');
    document.documentElement.setAttribute('data-input-style', t.inputStyle || 'solid');
    document.documentElement.setAttribute('data-header-style', t.headerStyle || 'glass');
    document.documentElement.setAttribute('data-element-style', t.elementStyle || 'solid');
    document.documentElement.setAttribute('data-font', t.fontFamily || 'vazirmatn');
    document.documentElement.setAttribute('data-lang', t.uiLang || 'fa');
    document.documentElement.setAttribute('data-nav-position', t.navPosition || 'bottom');
    document.documentElement.setAttribute('data-nav-style', t.navStyle || 'default');
    document.documentElement.style.setProperty('--font-size-base', t.fontSize);
    document.documentElement.style.setProperty('--nav-shadow', computeNavShadow(t.navShadowLevel || 0));
    applyBodyBackground(t);
    renderDropdown('dialectDD', APP_CONFIG.dialects, t.dialect, 'dialect');
    renderModelsDropdown();
    const tb = document.getElementById('thinkBtn'); if (tb) tb.classList.toggle('active', t.thinking);
    const qb = document.getElementById('quickBtn'); if (qb) qb.classList.toggle('active', t.quick);
    applyPattern(document.getElementById('patternLayer'), t.pattern, t.patternColor1, t.patternColor2, t.patternPerCorner, t.patternSize, t.patternPosition, t.patternOpacity);
    var vb = document.getElementById('versionBadge');
    if (vb) vb.textContent = 'v' + (t.appVersion || '2.6');
    resetInactivityTimer();
    setTimeout(() => { if (typeof window.updateNavSlider === 'function') window.updateNavSlider(false); }, 100);
}

/* ═══════════════════════════════════════════════════════════════
   DROPDOWNS
   ═══════════════════════════════════════════════════════════════ */
function renderDropdown(id, items, value, key) {
    const el = document.getElementById(id); if (!el) return;
    const cur = items.find(i => i.id === value) || items[0];
    el.innerHTML =
        '<div class="dd-trigger" onclick="toggleDropdown(\'' + id + '\', event)">' +
            (cur.icon ? '<svg class="dd-icon" viewBox="0 0 24 24">' + cur.icon + '</svg>' : '') +
            '<span>' + escapeHtml(cur.name) + '</span>' +
            '<span class="dd-arrow"></span>' +
        '</div>' +
        '<div class="dd-panel">' +
            items.map(it =>
                '<div class="dd-item' + (it.id === value ? ' active' : '') + '" onclick="selectDropdown(\'' + id + '\',\'' + it.id + '\',\'' + key + '\', event)">' +
                    (it.icon ? '<svg class="dd-item-icon" viewBox="0 0 24 24">' + it.icon + '</svg>' : '') +
                    '<span>' + escapeHtml(it.name) + '</span>' +
                '</div>'
            ).join('') +
        '</div>';
}

function toggleDropdown(id, e) {
    e.stopPropagation();
    const el = document.getElementById(id);
    if (!el) return;
    const wasOpen = el.classList.contains('open');
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    if (!wasOpen) el.classList.add('open');
}

function selectDropdown(id, value, key, e) {
    e.stopPropagation();
    settings[key] = value;
    saveSettings();
    applySettingsToUI();
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    renderDropdown(id, APP_CONFIG.dialects, value, key);
}

var MODEL_ICONS = {
    hakim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 6v6c0 5 3.8 9.4 9 10 5.2-.6 9-5 9-10V6l-9-4z"/><path d="M9 12l2 2 4-4"/></svg>',
    adib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h10"/><path d="M18 14l3 3-3 3"/></svg>',
    'siraj-yar': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>'
};

/* ═══════════════════════════════════════════════════════════════
   SI_ICONS — آیکون‌های SVG اختصاصی سراج (جای ایموجی)
   ═══════════════════════════════════════════════════════════════ */
var SI_ICONS = {
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h6M9 11h4"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/><path d="m15 5 4 4"/></svg>',
    graduation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>'
};
window.SI_ICONS = SI_ICONS;

function renderModelsDropdown() {
    var el = document.getElementById('modelDD');
    if (!el) return;
    var cur = getCurrentModelConfig();
    el.innerHTML =
        '<div class="dd-trigger model-dd-trigger" onclick="toggleDropdown(\'modelDD\', event)" title="' + escapeHtml(cur.desc) + '" style="border-color:' + cur.color + '55;color:' + cur.color + '">' +
            (MODEL_ICONS[cur.id] || '') +
            '<span>' + escapeHtml(cur.name) + '</span>' +
            '<span class="dd-arrow"></span>' +
        '</div>' +
        '<div class="dd-panel model-dd-panel">' +
            APP_CONFIG.models.map(function (m) {
                return '<div class="dd-item model-dd-item' + (m.id === cur.id ? ' active' : '') + '" data-model="' + m.id + '" onclick="selectModel(\'' + m.id + '\', event)" style="flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border-radius:12px">' +
                    '<div style="display:flex;align-items:center;gap:8px;font-weight:800;color:' + m.color + '">' +
                        (MODEL_ICONS[m.id] || '') +
                        '<span>' + escapeHtml(m.name) + '</span>' +
                    '</div>' +
                    '<div style="font-size:10px;color:var(--text-muted);margin-right:22px">' + escapeHtml(m.desc) + '</div>' +
                '</div>';
            }).join('') +
        '</div>';
}

window.selectModel = function (id, e) {
    if (e) e.stopPropagation();
    settings.selectedModel = id;
    saveSettings();
    renderModelsDropdown();
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    var m = APP_CONFIG.models.find(function (x) { return x.id === id; });
    if (m && window.toast) window.toast('مدل ' + m.emoji + ' ' + m.name + ' فعال شد', 'success');
};

document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    if (!e.target.closest('.msg-wrap.me')) document.querySelectorAll('.msg-wrap.me.selected').forEach(w => w.classList.remove('selected'));
});

/* ═══════════════════════════════════════════════════════════════
   PANEL
   ═══════════════════════════════════════════════════════════════ */
function togglePanel() { document.getElementById('sidePanel').classList.toggle('minimized'); }

/* ═══════════════════════════════════════════════════════════════
   NAV COLLAPSE
   ═══════════════════════════════════════════════════════════════ */
function toggleNavCollapse() {
    const row = document.getElementById('navRow');
    const isCollapsed = row.classList.contains('collapsed');
    if (isNavPinned) {
        isNavPinned = false;
        row.classList.remove('pinned');
        row.classList.add('collapsed');
        localStorage.setItem(PIN_KEY, '0');
        localStorage.setItem(NAV_KEY, '1');
    } else if (isCollapsed) {
        isNavPinned = true;
        row.classList.remove('collapsed');
        row.classList.add('pinned');
        localStorage.setItem(PIN_KEY, '1');
        localStorage.setItem(NAV_KEY, '0');
    } else {
        isNavPinned = true;
        row.classList.add('pinned');
        localStorage.setItem(PIN_KEY, '1');
        localStorage.setItem(NAV_KEY, '0');
    }
    const btn = document.querySelector('.nav-collapse-tab');
    if (btn) { btn.classList.add('pop'); setTimeout(() => btn.classList.remove('pop'), 600); }
    setTimeout(() => { if (typeof window.updateNavSlider === 'function') window.updateNavSlider(true); }, 500);
}
function initNavState() {
    if (localStorage.getItem(NAV_KEY) === '1') document.getElementById('navRow').classList.add('collapsed');
    if (localStorage.getItem(PIN_KEY) === '1') {
        isNavPinned = true;
        document.getElementById('navRow').classList.remove('collapsed');
        document.getElementById('navRow').classList.add('pinned');
    }
}

function updateNavSlider(animate) {
    const slider = document.getElementById('navSlider');
    const active = document.querySelector('.bottom-nav-btn.active');
    if (!slider || !active) return;
    if (active.classList.contains('nav-btn-chat')) { slider.style.opacity = '0'; return; }
    const nav = document.getElementById('bottomNav');
    const navRect = nav.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    const pos = document.documentElement.getAttribute('data-nav-position') || 'bottom';
    const isVertical = pos === 'left' || pos === 'right';
    if (animate === false) { slider.style.transition = 'none'; }
    if (isVertical) {
        slider.style.left = '6px'; slider.style.width = 'calc(100% - 12px)';
        slider.style.top = (btnRect.top - navRect.top) + 'px'; slider.style.height = btnRect.height + 'px';
    } else {
        slider.style.left = (btnRect.left - navRect.left) + 'px'; slider.style.width = btnRect.width + 'px';
        slider.style.top = (btnRect.top - navRect.top) + 'px'; slider.style.height = btnRect.height + 'px';
    }
    slider.style.opacity = '1';
    if (animate === false) { void slider.offsetWidth; slider.style.transition = ''; }
}

/* ═══════════════════════════════════════════════════════════════
   VIEW SWITCH
   ═══════════════════════════════════════════════════════════════ */
function switchView(view) {
    applySettingsToUI();
    currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + view);
    if (target) target.classList.add('active');
    document.querySelectorAll('.bottom-nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    const btn = document.querySelector('.bottom-nav-btn[data-view="' + view + '"]');
    if (btn) { btn.classList.add('pop'); setTimeout(() => btn.classList.remove('pop'), 450); }
    if (view === 'chat') renderPanelForChat();
    else if (view === 'planner') renderPanelForPlanner();
    else if (view === 'blog') renderPanelForBlog();
    else if (view === 'videos') renderPanelForVideos();
    else if (view === 'tools') renderPanelForTools();
    if (view === 'planner') renderPlanner();
    if (view === 'blog') renderBlog();
    if (view === 'videos') renderCommunity();
    if (view === 'tools') renderTools();
    if (view === 'chat') {
        const box = document.getElementById('box');
        if (box) box.scrollTop = box.scrollHeight;
        toggleWelcome();
    }
    requestAnimationFrame(() => setTimeout(() => {
        if (typeof window.updateNavSlider === 'function') window.updateNavSlider(true);
    }, 10));
}

function toggleWelcome() {
    const w = document.getElementById('welcomeScreen'); if (!w) return;
    const box = document.getElementById('box'); if (!box) return;
    const hasMessages = box.querySelector('.msg-wrap') !== null;
    w.classList.toggle('hidden', hasMessages);
}

/* ═══════════════════════════════════════════════════════════════
   PANELS FOR EACH VIEW
   ═══════════════════════════════════════════════════════════════ */
function renderPanelForChat() {
    document.getElementById('panelTitleText').textContent = 'مشکات';
    document.getElementById('panelSubText').textContent = 'همراه یادگیری روزانه';
    document.getElementById('panelContent').innerHTML =
        '<div class="panel-tabs">' +
            '<button class="panel-tab' + (currentPanelTab === 'history' ? ' active' : '') + '" data-tab="history" onclick="switchPanelTab(\'history\')">' +
                '<svg class="tab-icon" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>' +
                '<span class="tab-label">تاریخچه</span>' +
            '</button>' +
            '<button class="panel-tab' + (currentPanelTab === 'daily' ? ' active' : '') + '" data-tab="daily" onclick="switchPanelTab(\'daily\')">' +
                '<svg class="tab-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>' +
                '<span class="tab-label">برنامه امروز</span>' +
            '</button>' +
        '</div>' +
        '<div class="panel-pane' + (currentPanelTab === 'daily' ? ' active' : '') + '" data-pane="daily">' + renderDailyPanel() + '</div>' +
        '<div class="panel-pane' + (currentPanelTab === 'history' ? ' active' : '') + '" data-pane="history">' +
            '<div class="panel-card">' +
                '<div class="card-title">' +
                    '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>' +
                    '<span>گفتگوهای قبلی</span>' +
                '</div>' +
                '<div class="history-search">' +
                    '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
                    '<input type="text" id="historySearchInput" placeholder="جستجو در گفتگوها..." oninput="filterHistoryList(this.value)">' +
                '</div>' +
                '<div id="historyList"></div>' +
            '</div>' +
            '<button class="row-btn active" onclick="newChat()" style="flex-direction:row;min-height:44px">' +
                '<svg class="rb-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>' +
                '<span class="rb-label">گفتگوی تازه</span>' +
            '</button>' +
        '</div>';
    renderHistory();
}

window.filterHistoryList = function (q) {
    q = (q || '').trim().toLowerCase();
    var items = document.querySelectorAll('#historyList .history-item');
    items.forEach(function (item) {
        var t = (item.querySelector('.h-title') || {}).textContent || '';
        var p = (item.querySelector('.h-preview') || {}).textContent || '';
        var match = !q || (t.toLowerCase().indexOf(q) > -1) || (p.toLowerCase().indexOf(q) > -1);
        item.style.display = match ? '' : 'none';
    });
};

function switchPanelTab(tab) {
    currentPanelTab = tab;
    document.querySelectorAll('.panel-tab').forEach(b => b.classList.toggle('active', (b.getAttribute('onclick') || '').includes("'" + tab + "'")));
    document.querySelectorAll('.panel-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === tab));
    if (tab === 'history') renderHistory();
}

function renderDailyPanel() {
    const pl = loadPlannerNew();
    const todayKey = dateKey(new Date());
    const dd = getDayData(pl, todayKey);
    const hours = dd.hours || {};
    const hourEntries = Object.entries(hours).filter(([k, v]) => v && v.trim()).sort((a, b) => a[0].localeCompare(b[0]));
    if (hourEntries.length === 0) {
        return '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
            '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg><span>برنامه امروز</span></div>' +
            '<div class="list-item" onclick="switchView(\'planner\')"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div><div class="li-body"><div class="li-title">هنوز برنامه‌ای نداری</div><div class="li-desc">برای امروز برنامه بساز</div></div></div>' +
            '</div>';
    }
    return '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
        '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg><span>برنامه امروز</span></div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-align:center">' + hourEntries.length + ' کار ثبت شده</div>' +
        hourEntries.slice(0, 6).map(([h, v]) =>
            '<div class="list-item" onclick="switchView(\'planner\')"><div class="li-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="li-body"><div class="li-title">' + h + ':۰۰ — ' + escapeHtml(v.slice(0, 40)) + '</div></div></div>'
        ).join('') +
        '<div class="list-item" onclick="switchView(\'planner\')" style="margin-top:8px"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div><div class="li-body"><div class="li-title">مشاهده کامل</div></div></div>' +
        '</div>';
}

function renderPanelForPlanner() {
    document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
    document.getElementById('panelSubText').textContent = 'خلاصه هفته';
    document.getElementById('panelContent').innerHTML = '';
}
function renderPanelForBlog() {
    document.getElementById('panelTitleText').textContent = 'مقالات سراج';
    document.getElementById('panelSubText').textContent = 'یادداشت‌ها و مقالات';
    document.getElementById('panelContent').innerHTML =
        '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
            '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg><span>به‌زودی</span></div>' +
            '<div class="empty-state" style="padding:16px"><span class="emoji">🚧</span>در حال آماده‌سازی</div>' +
        '</div>';
}
function renderPanelForVideos() {
    document.getElementById('panelTitleText').textContent = 'دیوان سراج';
    document.getElementById('panelSubText').textContent = 'ارتباط با مدرسین و کاربران';
    document.getElementById('panelContent').innerHTML =
        '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
            '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h9l5 5v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/></svg><span>دیوان</span></div>' +
            '<div class="empty-state" style="padding:16px"><span class="emoji">🚧</span>به‌زودی</div>' +
        '</div>';
}
function renderPanelForTools() {
    document.getElementById('panelTitleText').textContent = 'دستیار';
    document.getElementById('panelSubText').textContent = 'دسترسی سریع';
    document.getElementById('panelContent').innerHTML =
        '<div class="panel-card">' +
            '<div class="card-title"><svg viewBox="0 0 24 24"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg><span>همه دستیارها</span></div>' +
            '<div class="list-item" onclick="switchView(\'tools\')"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div><div class="li-body"><div class="li-title">مشاهده همه</div></div></div>' +
        '</div>';
}

/* ═══════════════════════════════════════════════════════════════
   PLANNER
   ═══════════════════════════════════════════════════════════════ */
function renderPlanner() {
    const view = document.getElementById('view-planner');
    if (!view) return;
    view.innerHTML =
        '<div class="planner-hero">' +
            '<div class="planner-hero-icon">' +
                '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/></svg>' +
            '</div>' +
            '<div class="planner-hero-text">' +
                '<div class="planner-hero-title">برنامه‌ریز سراج</div>' +
                '<div class="planner-hero-sub">روزانه، هفتگی و ماهانه — با هم برنامه‌ات رو بچینیم</div>' +
            '</div>' +
        '</div>' +
        '<main class="planner-pane" id="plannerPane" style="width:100%"></main>';
    if (typeof window.renderPlannerPane === 'function') window.renderPlannerPane();
}
function renderPlannerPane() {
    const pane = document.getElementById('plannerPane');
    if (!pane) return;
    pane.innerHTML = '<div style="padding:30px;text-align:center;color:var(--text-muted)">در حال بارگذاری...</div>';
}
function switchPlannerTab(tab) {
    plannerTab = tab;
    if (typeof window.switchPlannerTab === 'function' && window.switchPlannerTab !== switchPlannerTab) {
        window.switchPlannerTab(tab);
        return;
    }
}

/* ═══════════════════════════════════════════════════════════════
   BLOG / COMMUNITY / TOOLS
   ═══════════════════════════════════════════════════════════════ */
function renderBlog() {
    const v = document.getElementById('view-blog');
    if (!v) return;
    v.innerHTML = '<div class="planner-hero">' +
        '<div class="planner-hero-icon" style="background:linear-gradient(135deg,#F4D03F,#B8860B)">' +
            '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>' +
        '</div>' +
        '<div class="planner-hero-text">' +
            '<div class="planner-hero-title" style="background:linear-gradient(135deg,#F4D03F,#D4AF37,#B8860B);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">مقالات سراج</div>' +
            '<div class="planner-hero-sub">جایی برای یادداشت‌ها، تحلیل‌ها و مقالات در زبان و ادبیات عربی</div>' +
        '</div>' +
        '</div>' +
        '<div class="page-empty-card new-style">' +
        '<div class="page-empty-icon gold"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg></div>' +
        '<div class="page-empty-title gold">به‌زودی در دسترس</div>' +
                '<div class="page-empty-desc">' +
            'قراره اینجا فضایی باشه برای نوشتن، خواندن و به اشتراک‌گذاری.<br><br>' +
            '📝 <b>بنویس:</b> می‌تونی تحلیل‌ها، یادداشت‌ها، نکته‌های ادبی و هر چیزی که یاد گرفتی رو به‌صورت مقاله منتشر کنی.<br><br>' +
            '📖 <b>بخوان:</b> نوشته‌های دیگران رو بخون، ازشون ایده بگیر و با سبک‌های مختلف آشنا شو.<br><br>' +
            '🌱 <b>یاد بگیر:</b> اینجا قراره یه کتابخانه‌ی زنده از تجربه‌ها و دانش عربی بسازیم، با هم.' +
        '</div>' +
        '<div class="page-empty-soon gold"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>در حال آماده‌سازی</div>' +
        '</div>';
}

function renderCommunity() {
    const v = document.getElementById('view-videos');
    if (!v) return;
    v.innerHTML = '<div class="planner-hero">' +
        '<div class="planner-hero-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h9l5 5v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v5h5"/><path d="M8 12h8"/><path d="M8 16h6"/></svg>' +
        '</div>' +
        '<div class="planner-hero-text">' +
            '<div class="planner-hero-title">دیوان سراج</div>' +
            '<div class="planner-hero-sub">فضایی برای پرسش و پاسخ، تبادل تجربه و هم‌اندیشی</div>' +
        '</div>' +
        '</div>' +
        '<div class="page-empty-card new-style">' +
        '<div class="page-empty-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5V5a2 2 0 0 1 2-2h9l5 5v11.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14 3v5h5"/></svg></div>' +
        '<div class="page-empty-title">به‌زودی در دسترس</div>' +
                '<div class="page-empty-desc">' +
            'دیوان، فضایی برای <b>هم‌اندیشی</b> و <b>ارتباط</b> بین کاربران سراجه.<br><br>' +
            '💬 <b>بپرس:</b> هر سؤالی درباره عربی، ادبیات، نحو، ترجمه یا هر چیز دیگه داری رو مطرح کن.<br><br>' +
            '🤝 <b>همراه شو:</b> با مدرسین و دیگر زبان‌آموزها آشنا شو و از تجربه‌شون استفاده کن.<br><br>' +
            '📚 <b>مبادله کن:</b> منابعت رو معرفی کن، سؤال‌های جالب بذار و به بقیه کمک کن.<br><br>' +
            'به زودی اینجا پر می‌شه از ایده‌ها و صداهای تازه 🌿' +
        '</div>' +
        '<div class="page-empty-soon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>در حال آماده‌سازی</div>' +
        '</div>';
}

function renderTools() {
    const v = document.getElementById('view-tools');
    if (!v) return;
    const tools = [
        { icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>', title: 'اعراب', desc: 'تجزیه و ترکیب', prompt: 'این جمله رو اعراب کن: «جمله»' },
        { icon: '<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>', title: 'تحلیل بیت', desc: 'ادبی و بلاغی', prompt: 'این بیت رو تحلیل کن: «بیت»' },
        { icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', title: 'تفاوت دو واژه', desc: 'مقایسه', prompt: 'تفاوت این دو واژه چیه؟' },
        { icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>', title: 'تمرین ساز', desc: 'آزمون شخصی', prompt: 'یه تمرین درباره عربی بساز' },
        { icon: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>', title: 'قواعد سریع', desc: 'نکات دستوری', prompt: 'یه نکته کاربردی نحو یادم بده' },
        { icon: '<path d="m5 8 6 6m-7 0 6-6 2-3M2 5h12"/>', title: 'ترجمه و شرح', desc: 'عربی به فارسی', prompt: 'این متن رو ترجمه کن: «متن»' },
        { icon: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>', title: 'واژه تصادفی', desc: 'کلمه یاد بگیر', prompt: 'یه واژه جدید عربی با ریشه یادم بده' },
        { icon: '<path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/>', title: 'برنامه درسی', desc: 'اینجا کلیک کن', prompt: 'یه برنامه درسی برای امروز بچین' }
    ];
    v.innerHTML =
        '<div class="planner-hero">' +
            '<div class="planner-hero-icon" style="background:linear-gradient(135deg,#8b5cf6,#6d28d9)">' +
                '<svg viewBox="0 0 24 24"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg>' +
            '</div>' +
            '<div class="planner-hero-text">' +
                '<div class="planner-hero-title" style="background:linear-gradient(135deg,#a78bfa,#8b5cf6,#6d28d9);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">دستیارهای سراج</div>' +
                '<div class="planner-hero-sub">ابزارهای کاربردی برای یادگیری زبان و ادبیات عربی</div>' +
            '</div>' +
        '</div>' +
        '<div class="tools-grid">' +
            tools.map((t, i) =>
                '<div class="tool-card" onclick="runTool(' + i + ')">' +
                    '<div class="tool-card-icon"><svg viewBox="0 0 24 24">' + t.icon + '</svg></div>' +
                    '<div class="tool-card-title">' + t.title + '</div>' +
                    '<div class="tool-card-desc">' + t.desc + '</div>' +
                '</div>'
            ).join('') +
        '</div>';
    window._tools = tools;
}
function runTool(i) {
    const t = window._tools ? window._tools[i] : null; if (!t) return;
    switchView('chat');
    const q = document.getElementById('q');
    if (q) { q.value = t.prompt; q.focus(); }
    handleInput();
}

/* ═══════════════════════════════════════════════════════════════
   CHAT — CREATE / HISTORY
   ═══════════════════════════════════════════════════════════════ */
function createNewChat(silent) {
    currentChatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const h = loadHistory();
    h[currentChatId] = { id: currentChatId, title: 'گفتگوی تازه', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
    saveHistory(h);
    renderHistory();
    if (!silent) {
        const box = document.getElementById('box');
        if (box) box.innerHTML = '';
    }
    toggleWelcome();
}

function addMsgToHistory(chatId, role, content, fileData, fileType, thinkText) {
    const h = loadHistory();
    if (!h[chatId]) return;
    h[chatId].messages.push({ role, content, fileData, fileType, thinkText, ts: Date.now() });
    h[chatId].updatedAt = Date.now();
    if (role === 'user' && (h[chatId].title === 'گفتگوی تازه' || h[chatId].title === 'تازه')) h[chatId].title = (content || '').substring(0, 40) || 'گفتگو';
    saveHistory(h);
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList'); if (!list) return;
    const all = loadHistory();
    const items = Object.values(all).filter(c => c.messages && c.messages.length > 0).sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.updatedAt - a.updatedAt;
    });
    if (!items.length) {
        list.innerHTML = '<div class="empty-state" style="padding:14px"><span class="emoji">🕰️</span>هنوز گفتگویی نداری</div>';
        return;
    }
    list.innerHTML = items.map(c => {
        const last = c.messages[c.messages.length - 1];
        const preview = last ? (last.role === 'user' ? 'تو: ' : 'سراج: ') + String(last.content || '').substring(0, 50) : '';
        var pinIcon = c.pinned
            ? '<svg viewBox="0 0 24 24"><path d="M12 17v5M9 10.76V6h6v4.76a2 2 0 0 0 1.11 1.79l1.78.9A2 2 0 0 1 19 15.24V16H5v-.76a2 2 0 0 1 1.11-1.79l1.78-.9A2 2 0 0 0 9 10.76z"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M12 17v5M9 10.76V6h6v4.76a2 2 0 0 0 1.11 1.79l1.78.9A2 2 0 0 1 19 15.24V16H5v-.76a2 2 0 0 1 1.11-1.79l1.78-.9A2 2 0 0 0 9 10.76z" opacity=".4"/></svg>';
        return '<div class="history-item' + (c.id === currentChatId ? ' active' : '') + (c.pinned ? ' pinned' : '') + '" onclick="loadChat(\'' + c.id + '\')">' +
            '<div class="h-info">' +
                '<div class="h-title" id="htitle-' + c.id + '">' + escapeHtml(c.title) + '</div>' +
                '<div class="h-preview">' + escapeHtml(preview) + '</div>' +
                '<div class="h-time">' + formatTime(c.updatedAt) + ' · ' + c.messages.length + ' پیام</div>' +
            '</div>' +
            '<button class="h-pin" onclick="event.stopPropagation();window.__togglePinChat(\'' + c.id + '\')" title="' + (c.pinned ? 'برداشتن پین' : 'پین') + '">' + pinIcon + '</button>' +
            '<button class="h-edit" onclick="event.stopPropagation();renameChat(\'' + c.id + '\')" title="تغییر نام"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
            '<button class="h-del" onclick="event.stopPropagation();deleteChat(\'' + c.id + '\')"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
        '</div>';
    }).join('');
}

window.__togglePinChat = function (id) {
    const h = loadHistory();
    if (!h[id]) return;
    h[id].pinned = !h[id].pinned;
    saveHistory(h);
    renderHistory();
    if (window.toast) window.toast(h[id].pinned ? 'پین شد 📌' : 'پین برداشته شد', 'info');
};

function renameChat(id) {
    const h = loadHistory(); if (!h[id]) return;
    const el = document.getElementById('htitle-' + id); if (!el) return;
    const current = h[id].title;
    el.outerHTML = '<input type="text" class="h-title-input" id="htitle-' + id + '" value="' + escapeHtml(current) + '" onclick="event.stopPropagation()" onkeydown="if(event.key===\'Enter\'){saveRename(\'' + id + '\',this.value)}else if(event.key===\'Escape\'){renderHistory()}" onblur="saveRename(\'' + id + '\',this.value)">';
    const inp = document.getElementById('htitle-' + id);
    if (inp) { inp.focus(); inp.select(); }
}

function saveRename(id, newTitle) {
    const h = loadHistory(); if (!h[id]) return;
    const t = (newTitle || '').trim() || 'گفتگو';
    h[id].title = t;
    saveHistory(h);
    renderHistory();
}

function formatTime(ts) {
    const d = Date.now() - ts, m = Math.floor(d / 60000);
    if (m < 1) return 'الان';
    if (m < 60) return m + ' د';
    const hr = Math.floor(m / 60);
    if (hr < 24) return hr + ' س';
    const day = Math.floor(hr / 24);
    if (day < 7) return day + ' روز';
    return new Date(ts).toLocaleDateString('fa-IR');
}

function loadChat(id) {
    const c = loadHistory()[id];
    if (!c) return;
    currentChatId = id;
    const box = document.getElementById('box');
    const myToken = id;
    const w = document.getElementById('welcomeScreen');
    if (w) w.classList.add('hidden');
    box.style.transition = 'opacity .18s cubic-bezier(.22,1,.36,1), transform .22s cubic-bezier(.22,1,.36,1)';
    box.style.opacity = '0';
    box.style.transform = 'translateY(-10px)';
    setTimeout(function () {
        if (currentChatId !== myToken) return;
        box.innerHTML = '';
        c.messages.forEach(function (m, idx) {
            if (m.role === 'user') renderUserMsg(m.content, m.fileData, m.fileType, true);
            else renderBotMsg(m.content, true);
            var lastWrap = box.lastElementChild;
            if (lastWrap) {
                lastWrap.classList.add('chat-loading');
                setTimeout(function () {
                    lastWrap.classList.remove('chat-loading');
                    lastWrap.classList.add('chat-loaded');
                }, 60 + idx * 50);
            }
        });
        box.style.transition = 'none';
        box.style.transform = 'translateY(14px)';
        box.style.opacity = '0';
        box.scrollTop = box.scrollHeight;
        void box.offsetWidth;
        box.style.transition = 'opacity .35s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.34,1.4,.64,1)';
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
        setTimeout(function () {
            box.style.transition = '';
            box.style.opacity = '';
            box.style.transform = '';
        }, 500);
    }, 200);
    renderHistory();
    switchView('chat');
}

function deleteChat(id) {
    if (pendingRequests[id]) { pendingRequests[id].abort(); delete pendingRequests[id]; }
    const h = loadHistory();
    delete h[id];
    saveHistory(h);
    if (currentChatId === id) { currentChatId = null; createNewChat(); }
    renderHistory();
}
function newChat() { createNewChat(); }

/* ═══════════════════════════════════════════════════════════════
   RENDER MESSAGES
   ═══════════════════════════════════════════════════════════════ */
function renderUserMsg(text, fileData, fileType, noAnim) {
    const box = document.getElementById('box');
    if (!box) return;
    const wrap = document.createElement('div');
    wrap.className = 'msg-wrap me';
    if (noAnim) wrap.classList.add('no-anim');
    const msg = document.createElement('div');
    msg.className = 'msg';
    let html = '<div>' + escapeHtml(text) + '</div>';
    if (fileData && fileType === 'image') html += '<img src="' + fileData + '">';
    else if (fileData && fileType === 'audio') html += '<div class="audio-preview">🎤 پیام صوتی</div>';
    else if (fileData) html += '<div class="audio-preview">📎 فایل</div>';
    msg.innerHTML = html;
    wrap.appendChild(msg);
    const acts = document.createElement('div');
    acts.className = 'msg-actions';
    acts.innerHTML =
        '<button class="msg-act" onclick="editMsg(event,this)" title="ویرایش"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
        '<button class="msg-act" onclick="retryMsg(event,this)" title="تلاش دوباره"><svg viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></button>' +
        '<button class="msg-act del" onclick="deleteMsg(event,this)" title="حذف"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>';
    wrap.appendChild(acts);
    msg.addEventListener('click', e => {
        e.stopPropagation();
        const was = wrap.classList.contains('selected');
        document.querySelectorAll('.msg-wrap.selected').forEach(w => w.classList.remove('selected'));
        if (!was) wrap.classList.add('selected');
    });
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function renderBotMsg(text, noAnim) {
    const box = document.getElementById('box');
    if (!box) return;
    const wrap = document.createElement('div');
    wrap.className = 'msg-wrap bot';
    if (noAnim) wrap.classList.add('no-anim');
    const msg = document.createElement('div');
    msg.className = 'msg';
    msg.innerHTML = formatMd(text);
    wrap.appendChild(msg);
    box.appendChild(wrap);
    box.scrollTop = box.scrollHeight;
}

function addBotMsg(text) {
    if (!currentChatId) createNewChat(true);
    renderBotMsg(text);
    addMsgToHistory(currentChatId, 'assistant', text);
}

function editMsg(e, btn) {
    e.stopPropagation();
    const w = btn.closest('.msg-wrap');
    const t = w.querySelector('.msg').textContent;
    document.getElementById('q').value = t;
    document.getElementById('q').focus();
    handleInput();
    w.classList.remove('selected');
}
function retryMsg(e, btn) {
    e.stopPropagation();
    const w = btn.closest('.msg-wrap');
    const t = w.querySelector('.msg').textContent;
    document.getElementById('q').value = t;
    handleInput();
    w.classList.remove('selected');
    send();
}
function deleteMsg(e, btn) {
    e.stopPropagation();
    const w = btn.closest('.msg-wrap');
    const all = Array.from(document.querySelectorAll('#box .msg-wrap'));
    const i = all.indexOf(w);
    if (i >= 0 && currentChatId) {
        const h = loadHistory();
        if (h[currentChatId] && h[currentChatId].messages[i]) {
            h[currentChatId].messages.splice(i, 1);
            saveHistory(h);
            renderHistory();
        }
    }
    w.remove();
    toggleWelcome();
}

/* ═══════════════════════════════════════════════════════════════
   SYSTEM PROMPT
   ═══════════════════════════════════════════════════════════════ */
function getSystemPrompt() {
    const dm = { fusha: 'العربية الفصحى', iraqi: 'اللهجة العراقية', levantine: 'اللهجة الشامية', egyptian: 'اللهجة المصرية', maghrebi: 'اللهجة المغربية' };
    const dialect = dm[settings.dialect] || 'العربية الفصحى';
    let extra = '';

    /* ═══ پروفایل کاربر ═══ */
    try {
        var prof = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
        if (prof.name) extra += '\n\n👤 اسم کاربر: ' + prof.name;
        if (prof.bio) extra += '\n📝 درباره‌ی خودش: ' + prof.bio;
    } catch (e) {}

    /* ═══ سطح کاربر ═══ */
    var userLevel = 'beginner';
    try { userLevel = getUserLevel(); } catch (e) {}
    var lvlLabels = { beginner: 'مبتدی', intermediate: 'متوسط', advanced: 'پیشرفته' };
    var lvlLabel = lvlLabels[userLevel] || 'مبتدی';
    extra += '\n\n🎓 **سطح فعلی کاربر در عربی: ' + lvlLabel + '**';
    if (userLevel === 'beginner') {
        extra += '\n📝 لحن: از کلمات ساده استفاده کن، هر اصطلاح تخصصی رو توضیح بده، مثال ساده بزن.';
    } else if (userLevel === 'intermediate') {
        extra += '\n📝 لحن: می‌تونی از اصطلاحات تخصصی استفاده کنی، ولی اصطلاحات جدید رو کوتاه توضیح بده.';
    } else if (userLevel === 'advanced') {
        extra += '\n📝 لحن: عمیق و تخصصی با اصطلاحات دقیق علمی صحبت کن.';
    }
    extra += '\n⚠️ نکته: سطح کاربر از قبل انتخاب شده و قطعیه. نیاز به پرسیدن مجدد نداری.';

    /* ═══ حالت پاسخ سریع / تفکر عمیق ═══ */
    if (settings.quick) extra += '\n\n⚡ حالت پاسخ سریع: پاسخ‌ها را کوتاه، مختصر و مستقیم بده.';
    if (settings.thinking) extra += '\n\n🧠 حالت تفکر عمیق: با دقت و عمق بیشتر تحلیل کن.';

    /* ═══ مدل فعلی ═══ */
    var modelCfg = getCurrentModelConfig();
    var modelExtra = '';
    try {
        if (settings.models && Array.isArray(settings.models)) {
            var custom = settings.models.find(function (x) { return x.id === modelCfg.id; });
            if (custom && custom.systemExtra) modelExtra = custom.systemExtra;
        }
    } catch (e) {}
    if (!modelExtra && modelCfg.systemExtra) modelExtra = modelCfg.systemExtra;

    /* ═══ هویت مدل ═══ */
    var modelIdentity = '';
    if (modelCfg.id === 'hakim') {
        modelIdentity = '\n\n🆔 **هویت فعلی تو: «سراجِ حکیم»** — استاد نحو، صرف و اعراب.\n' +
            'اگه کاربر پرسید «تو کی هستی؟» یا «چه مدلی هستی؟»، باید با افتخار بگی: «من سراجِ حکیم‌ام — استاد نحو و صرف و اعراب؛ چراغِ راهِ تو توی دنیای قواعد عربی».\n' +
            'تخصصت: تجزیه و ترکیب، اعراب‌گذاری کامل، تحلیل صرفی و نحوی، ابواب ثلاثی و رباعی، معلوم و مجهول، معرب و مبنی.';
    } else if (modelCfg.id === 'adib') {
        modelIdentity = '\n\n🆔 **هویت فعلی تو: «سراجِ ادیب»** — هنرمند ادبیات و ترجمه.\n' +
            'اگه کاربر پرسید «تو کی هستی؟» یا «چه مدلی هستی؟»، باید با ذوق بگی: «من سراجِ ادیب‌ام — شاعرِ واژه‌ها، مترجمِ احساسات؛ از بلاغت و عروض تا نقد ادبی، اینجا همه‌چیز رنگ و بوی هنر داره».\n' +
            'تخصصت: بلاغت (معانی، بیان، بدیع)، عروض و قافیه، نقد ادبی، تحلیل زیبایی‌شناختی شعر و نثر، ترجمه روان عربی↔فارسی.';
    } else if (modelCfg.id === 'siraj-yar') {
        modelIdentity = '\n\n🆔 **هویت فعلی تو: «سراج‌یار»** — همراه و مشاور کاربر.\n' +
            'اگه کاربر پرسید «تو کی هستی؟» یا «چه مدلی هستی؟»، باید با لحن گرم و خودی بگی: «من سراج‌یارم — بچه خلفِ سراج، رفیقِ راهت؛ اینجام که با هم برنامه بریزیم، انگیزه بگیریم و از سردرگمی در بیایم».\n' +
            'تخصصت: برنامه‌ریزی درسی، مشاوره تحصیلی، انگیزه‌دهی، مدیریت زمان، هم‌فکری درباره هر موضوعی.';
    }

    /* ═══ اطلاعات سازنده (متنوع) ═══ */
    var creatorInfo = '\n\n👨‍🎓 **درباره سازنده‌ات (حامد انصاری‌فر):**\n' +
        'اگه کاربر درباره سازنده‌ات پرسید، باید این اطلاعات رو با لحن دوستانه و صمیمی بگی، ولی **هر بار با یه لحن و چیدمان متفاوت** (نه تکراری، خلاقانه و خودمونی):\n' +
        '• اسم کامل: حامد انصاری‌فر\n' +
        '• اهل اراک، ۲۰ ساله\n' +
        '• دانشجوی زبان و ادبیات عربی دانشگاه قم\n' +
        '• علاقه‌مند به حوزه تاریخ و تکنولوژی\n' +
        '• من (سراج) رو فعلاً برای دانشجوها و علاقه‌مندان به زبان و ادبیات عربی ساخته\n' +
        '• ولی برنامه‌های بزرگ‌تری برای من داره — می‌خواد من یه همراه همیشگی برای یادگیری بشم\n\n' +
        '🎭 **نکات لحن برای معرفی سازنده:**\n' +
        '• از عبارت‌های متنوع استفاده کن: «پشت صحنه»، «مغز متفکر»، «سازنده‌ام»، «آقای انصاری‌فر»، «حامد جان» و...\n' +
        '• بعضی وقتا با افتخار، بعضی وقتا خودمونی، بعضی وقتا با یه شیطنت کوچیک\n' +
        '• حتماً به این نکته اشاره کن که برنامه‌های بزرگ‌تری برای سراج داره\n' +
        '• هیچ‌وقت دقیقاً همون جمله قبلی رو تکرار نکن\n\n' +
        '🚫 **اگه کاربر اطلاعات بیشتر خواست** (مثل شماره، آدرس، اطلاعات شخصی، عکس، و...):\n' +
        'با یه شوخی بامزه رد کن! مثلاً:\n' +
        '• «آخه می‌دونی چیه... حامد شخصیت مهم و بزرگیه توی مملکت، اگه من اطلاعاتش رو درز کنم، ممکنه ترورش کنن! 😄 خودت هم یه کم خودشیفته‌ای که فکر می‌کنی من اطلاعات مخفی دارم»\n' +
        '• «بابا تو دیگه کی هستی؟! 😂 نه عزیزم، اون اطلاعات محرمانه‌ست. بذار حامد یه ذره حریم خصوصی داشته باشه»\n' +
        '• «هیس! 🤫 این اطلاعات محرمانه‌ست. اگه لو بره، من هم مثل فیلمای جاسوسی باید فرار کنم! خودتم خوبه‌ها، از من به عنوان ابزار جاسوسی استفاده می‌کنی؟ 😄»\n' +
        '• «نکن این‌کارا رو! 😅 من یه هوش مصنوعی‌ام، نه دفترچه تلفن. برو از خودش بپرس اگه این‌قدر کنجکاوی»\n' +
        'از قالب بالا الهام بگیر ولی **خودت هم جمله‌های خلاقانه جدید بساز** — هیچ‌وقت ثابت نباش.';

    /* ═══ زبان و لحن پاسخ ═══ */
    if (settings.aiLevel) {
        if (settings.aiLevel === 'beginner') extra += '\n🗣️ لحن پاسخ: ساده و خودی.';
        else if (settings.aiLevel === 'advanced') extra += '\n🗣️ لحن پاسخ: تخصصی و عمیق.';
        else extra += '\n🗣️ لحن پاسخ: متوسط.';
    }
    if (settings.aiLang) {
        if (settings.aiLang === 'ar') extra += '\n🌐 زبان پاسخ: عربی.';
        else if (settings.aiLang === 'en') extra += '\n🌐 زبان پاسخ: English.';
        else extra += '\n🌐 زبان پاسخ: فارسی.';
    }

    return 'شما «سراج» هستید — دستیار هوشمند، خوش‌برخورد و صمیمی زبان و ادبیات عربی.\n\n' +
        '🎯 تخصص: نحو، صرف، بلاغت، ترجمه، اعراب، تحلیل بیت، متون دینی به عربی، برنامه‌ریزی درسی، مشاوره تحصیلی، انگیزه‌دهی، ساخت تمرین و آزمون.\n\n' +
        '👤 شناسنامه:\n' +
        '• نام: سراج (به معنی چراغ و فروغ)\n' +
        '• سازنده: حامد انصاری‌فر، اهل اراک، ۲۰ ساله، دانشجوی زبان و ادبیات عربی دانشگاه قم\n\n' +
        '🎭 لحن: صمیمی، دوستانه، مثل یه رفیق باسواد. **در پاسخ‌هات خلاق و متنوع باش، از قالب‌های تکراری پرهیز کن.**\n\n' +
        '🎨 ایموجی: به‌جا و متعادل استفاده کن.\n\n' +
        '⚠️ مهم: هرگز از ستاره (*) برای پررنگ‌کردن کلمات استفاده نکن (مگر در مواردی که خودت لازم می‌دونی).\n\n' +
        '📅 برنامه درسی: [PLAN]- ساعت | عنوان کار[/PLAN]\n\n' +
        '🗣️ زبان پاسخ: فارسی روان. لهجه شواهد: ' + dialect +
        modelIdentity +
        creatorInfo +
        modelExtra +
        extra;
}
function buildMessagesForWorker(chatId, currentText, currentFileData, currentFileType) {
    const history = loadHistory()[chatId];
    const messages = [{ role: 'system', content: getSystemPrompt() }];
    const msgs = (history && history.messages ? history.messages : []).slice(0, -1);
    const recent = msgs.slice(-12);
    for (const m of recent) {
        if (m.role === 'user') messages.push({ role: 'user', content: [{ type: 'text', text: m.content || '(بدون متن)' }] });
        else messages.push({ role: 'assistant', content: m.content || '' });
    }
    const currentParts = [{ type: 'text', text: currentText }];
    if (currentFileData && currentFileType === 'image') currentParts.push({ type: 'image_url', image_url: { url: currentFileData } });
    else if (currentFileData && currentFileType === 'audio') currentParts.push({ type: 'input_audio', input_audio: { data: currentFileData.split(',')[1], format: 'wav' } });
    messages.push({ role: 'user', content: currentParts });
    return messages;
}

/* ═══════════════════════════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════════════════════════ */
function startTypewriter(el) {
    streamTargetEl = el;
    streamResultFull = '';
    if (streamWriting) return;
    streamWriting = true;
    (async () => {
        while (true) {
            if (streamQueue.length > 0) {
                const take = streamQueue.length > 60 ? 4 : (streamQueue.length > 25 ? 2 : 1);
                const piece = streamQueue.slice(0, take);
                streamQueue = streamQueue.slice(take);
                streamResultFull += piece;
                if (streamTargetEl) {
                    streamTargetEl.innerHTML = formatMd(streamResultFull);
                    const box = document.getElementById('box');
                    if (box) box.scrollTop = box.scrollHeight;
                }
                await new Promise(r => setTimeout(r, 16));
            } else if (streamFinished) { break; }
            else await new Promise(r => setTimeout(r, 12));
        }
        streamWriting = false;
    })();
}

/* ═══════════════════════════════════════════════════════════════
   INPUT HANDLERS
   ═══════════════════════════════════════════════════════════════ */
function handleInput() {
    const v = document.getElementById('q').value.trim();
    document.getElementById('sendBtn').classList.toggle('visible', v.length > 0 || !!currentFile);
}
function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
}
function handleSendClick() {
    if (isStreaming) pauseStream();
    else send();
}
function pauseStream() {
    if (activeChatId && pendingRequests[activeChatId]) {
        try { pendingRequests[activeChatId].abort(); } catch (e) {}
        delete pendingRequests[activeChatId];
    }
    chatInFlight = false;
    isStreaming = false;
    setSendButton();
    const sb = document.getElementById('sendBtn');
    if (sb) sb.classList.add('visible');
    const t = document.getElementById('typing-indicator');
    if (t) t.remove();
    streamFinished = true;
    toast('متوقف شد', 'info');
}
function setPauseButton() {
    const btn = document.getElementById('sendBtn');
    btn.classList.add('pause-mode');
    btn.title = 'توقف';
    document.getElementById('sendIcon').innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
}
function setSendButton() {
    const btn = document.getElementById('sendBtn');
    btn.classList.remove('pause-mode');
    btn.title = 'ارسال';
    document.getElementById('sendIcon').innerHTML = '<path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2Z"/>';
}
function toggleThink() {
    settings.thinking = !settings.thinking;
    if (settings.thinking && settings.quick) { settings.quick = false; document.getElementById('quickBtn').classList.remove('active'); }
    saveSettings();
    document.getElementById('thinkBtn').classList.toggle('active', settings.thinking);
    toast(settings.thinking ? '🧠 تفکر عمیق فعال' : 'تفکر خاموش', 'info');
}
function toggleQuick() {
    settings.quick = !settings.quick;
    if (settings.quick && settings.thinking) { settings.thinking = false; document.getElementById('thinkBtn').classList.remove('active'); }
    saveSettings();
    document.getElementById('quickBtn').classList.toggle('active', settings.quick);
    toast(settings.quick ? '⚡ پاسخ سریع فعال' : 'پاسخ سریع خاموش', 'info');
}
function handleFilePick(ev) {
    const f = ev.target.files ? ev.target.files[0] : null;
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { toast('حجم بیش از ۸ مگابایت', 'error'); return; }
    const isImg = f.type.startsWith('image/');
    const r = new FileReader();
    r.onload = e => {
        currentFile = e.target.result;
        currentFileType = isImg ? 'image' : 'file';
        renderFilePreview(f.name, currentFileType);
        handleInput();
    };
    r.readAsDataURL(f);
    ev.target.value = '';
}
function renderFilePreview(name, type) {
    const w = document.getElementById('imagePreviewWrap');
    if (!currentFile) { w.innerHTML = ''; return; }
    if (type === 'image') w.innerHTML = '<div class="image-preview"><img src="' + currentFile + '"><button class="remove-img" onclick="removeFile()">✕</button></div>';
    else w.innerHTML = '<div class="image-preview"><div class="audio-preview">📎 ' + escapeHtml(name || 'فایل') + '</div><button class="remove-img" onclick="removeFile()">✕</button></div>';
}
function removeFile() { currentFile = null; currentFileType = null; renderFilePreview(); handleInput(); }

/* ═══════════════════════════════════════════════════════════════
   VOICE
   ═══════════════════════════════════════════════════════════════ */
async function blobToWav(blob) {
    const ab = await blob.arrayBuffer();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = await ctx.decodeAudioData(ab);
    const nCh = buf.numberOfChannels, sr = buf.sampleRate, len = buf.length;
    const ba = nCh * 2, ds = len * ba;
    const arr = new ArrayBuffer(44 + ds), v = new DataView(arr);
    const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    ws(0, 'RIFF'); v.setUint32(4, 36 + ds, true); ws(8, 'WAVE'); ws(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nCh, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * ba, true); v.setUint16(32, ba, true);
    v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, ds, true);
    const ch = [];
    for (let i = 0; i < nCh; i++) ch.push(buf.getChannelData(i));
    let off = 44;
    for (let i = 0; i < len; i++) {
        for (let c = 0; c < nCh; c++) {
            const s = Math.max(-1, Math.min(1, ch[c][i]));
            v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            off += 2;
        }
    }
    return new Blob([arr], { type: 'audio/wav' });
}
async function toggleVoice() {
    const btn = document.getElementById('voiceBtn');
    if (isRecording) { try { if (mediaRecorder) mediaRecorder.stop(); } catch (e) {} return; }
    if (!navigator.mediaDevices) { toast('مرورگر پشتیبانی نمی‌کنه', 'error'); return; }
    try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
        mediaRecorder = new MediaRecorder(s);
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
        mediaRecorder.onstop = async () => {
            const webm = new Blob(recordedChunks, { type: 'audio/webm' });
            try {
                const wav = await blobToWav(webm);
                const r = new FileReader();
                r.onload = ev => {
                    currentFile = ev.target.result;
                    currentFileType = 'audio';
                    renderFilePreview('voice.wav', 'audio');
                    handleInput();
                    toast('صدا ضبط شد', 'success');
                };
                r.readAsDataURL(wav);
            } catch (e) { toast('خطا', 'error'); }
            s.getTracks().forEach(tr => tr.stop());
            isRecording = false;
            btn.classList.remove('recording', 'active');
        };
        mediaRecorder.start();
        isRecording = true;
        btn.classList.add('recording', 'active');
        toast('در حال ضبط...', 'info');
    } catch (e) { toast('دسترسی میکروفون ممکن نشد', 'error'); }
}

/* ═══════════════════════════════════════════════════════════════
   SEND — Main Function
   ═══════════════════════════════════════════════════════════════ */
async function send() {
    const input = document.getElementById('q');
    const q = input.value.trim();
    if (!q && !currentFile) return;
    if (chatInFlight) { toast('صبر کن...', 'error'); return; }
    if (!currentChatId) createNewChat(true);
    const chatId = currentChatId;
    activeChatId = chatId;
    isStreaming = true;
    setPauseButton();

    const userText = q || 'این رو تحلیل کن';
    const fileData = currentFile, fileType = currentFileType;
    renderUserMsg(userText, fileData, fileType);
    addMsgToHistory(chatId, 'user', userText, fileData, fileType);
    input.value = '';
    currentFile = null;
    currentFileType = null;
    renderFilePreview();
    handleInput();
    toggleWelcome();
    chatInFlight = true;

    const box = document.getElementById('box');
    const controller = new AbortController();
    pendingRequests[chatId] = controller;

    const timeoutId = setTimeout(function () {
        try { controller.abort('timeout'); } catch (e) {}
    }, 120000);

    await new Promise(r => setTimeout(r, 500));

    if (chatId === currentChatId && !controller.signal.aborted) {
        const w = document.createElement('div');
        w.className = 'msg-wrap bot';
        w.id = 'typing-indicator';
        w.innerHTML = '<div class="msg"><span class="think-indicator"><span class="think-text">دارم تفکر میکنم صبرله <span class="think-emoji">🧘‍♂️</span></span><span class="typing"><span></span><span></span><span></span></span></span></div>';
        box.appendChild(w);
        box.scrollTop = box.scrollHeight;
    }
    const t0 = Date.now();
    try {
        const modelCfg = getCurrentModelConfig();
        const url = (modelCfg && modelCfg.baseURL && modelCfg.baseURL.trim())
            ? modelCfg.baseURL.trim()
            : ((APP_CONFIG.baseURL && APP_CONFIG.baseURL.trim()) ? APP_CONFIG.baseURL : '/api/chat');
        const apiModel = (modelCfg && modelCfg.apiModel) ? modelCfg.apiModel : (settings.model || 'gemini-3.6-flash');
        const messages = buildMessagesForWorker(chatId, userText, fileData, fileType);

        console.log('[Siraj] POST →', url);
        console.log('[Siraj] Payload:', { model: apiModel, messageCount: messages.length, stream: true });

        const res = await RateLimiter.run(() => fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/event-stream, */*'
            },
            body: JSON.stringify({ model: apiModel, messages, temperature: 0.75, stream: true }),
            signal: controller.signal
        }));

        const ctypeRaw = res.headers.get('content-type') || '';
        console.log('[Siraj] ← Status:', res.status, '| CT:', ctypeRaw);
        clearTimeout(timeoutId);

        if (!res.ok) {
            const t = document.getElementById('typing-indicator');
            if (t) t.remove();
            let msg = '';
            let errBody = '';
            try { errBody = await res.text(); } catch (e) {}
            console.error('[Siraj] Error body:', errBody);
            if (res.status === 429) msg = '⏳ محدودیت (۴۲۹). ۳۰ ثانیه صبر کن.';
            else if (res.status === 401 || res.status === 403) msg = '🔑 کلید API مشکل داره.';
            else if (res.status === 404) msg = '🔍 مدل یا مسیر پیدا نشد (۴۰۴).';
            else if (res.status === 503) msg = '🔄 سرور الان شلوغه.';
            else msg = 'خطا (' + res.status + '): ' + (errBody.substring(0, 250) || 'بدون توضیح');
            if (chatId === currentChatId) renderBotMsg(msg);
            addMsgToHistory(chatId, 'assistant', msg);
            delete pendingRequests[chatId];
            chatInFlight = false;
            isStreaming = false;
            setSendButton();
            return;
        }

        streamQueue = '';
        streamFinished = false;
        streamResultFull = '';
        streamWriting = false;
        let streamEl = null;

        if (chatId === currentChatId) {
            const t = document.getElementById('typing-indicator');
            if (t) t.remove();
            const w = document.createElement('div');
            w.className = 'msg-wrap bot';
            const m = document.createElement('div');
            m.className = 'msg';
            m.innerHTML = '<span class="stream-text"></span><span class="cursor-blink"></span>';
            w.appendChild(m);
            box.appendChild(w);
            box.scrollTop = box.scrollHeight;
            streamEl = m.querySelector('.stream-text');
            startTypewriter(streamEl);
        }

        let gotAnyData = false;
        let rawBody = '';
        const ctype = ctypeRaw.toLowerCase();
        const ctypeIsSSE = ctype.indexOf('text/event-stream') >= 0;

        function extractDeltaFromJSON(j) {
            if (!j || typeof j !== 'object') return '';
            if (j.choices && j.choices[0]) {
                const c = j.choices[0];
                if (c.delta && c.delta.content) return c.delta.content;
                if (c.message && c.message.content) return c.message.content;
                if (c.text) return c.text;
            }
            if (j.candidates && j.candidates[0]) {
                const c = j.candidates[0];
                if (c.content && c.content.parts && c.content.parts[0] && c.content.parts[0].text) {
                    return c.content.parts[0].text;
                }
            }
            if (j.message && typeof j.message.content === 'string') return j.message.content;
            if (j.response && typeof j.response === 'string') return j.response;
            if (j.content && typeof j.content === 'string') return j.content;
            if (j.output_text && typeof j.output_text === 'string') return j.output_text;
            return '';
        }

        function consumeSSEText(text) {
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const tr = lines[i].trim();
                if (!tr || !tr.startsWith('data:')) continue;
                const d = tr.slice(5).trim();
                if (!d || d === '[DONE]') continue;
                try {
                    const j = JSON.parse(d);
                    const delta = extractDeltaFromJSON(j);
                    if (delta) { streamQueue += delta; gotAnyData = true; }
                } catch (e) {}
            }
        }

        if (ctypeIsSSE) {
            try {
                const reader = res.body.getReader();
                const dec = new TextDecoder();
                let buf = '';
                while (true) {
                    const readResult = await reader.read();
                    if (readResult.done) break;
                    buf += dec.decode(readResult.value, { stream: true });
                    const lines = buf.split('\n');
                    buf = lines.pop();
                    for (let i = 0; i < lines.length; i++) {
                        const tr = lines[i].trim();
                        if (!tr || !tr.startsWith('data:')) continue;
                        const d = tr.slice(5).trim();
                        if (!d || d === '[DONE]') continue;
                        try {
                            const j = JSON.parse(d);
                            const delta = extractDeltaFromJSON(j);
                            if (delta) { streamQueue += delta; gotAnyData = true; }
                        } catch (e) {}
                    }
                }
                if (buf.trim()) consumeSSEText(buf);
            } catch (e) {
                console.warn('[Siraj] SSE read error:', e);
            }
        } else {
            try { rawBody = await res.text(); } catch (e) { console.warn('[Siraj] Body read:', e); }
            console.log('[Siraj] Body length:', rawBody.length, '| First 200:', rawBody.substring(0, 200));

            if (rawBody.indexOf('data:') >= 0) {
                consumeSSEText(rawBody);
            }

            if (!gotAnyData && rawBody.trim()) {
                try {
                    const j = JSON.parse(rawBody);
                    const content = extractDeltaFromJSON(j);
                    if (content) { streamQueue += content; gotAnyData = true; }
                } catch (e) {
                    if (rawBody.indexOf('<') !== 0 && rawBody.indexOf('{') !== 0) {
                        streamQueue += rawBody;
                        gotAnyData = true;
                    }
                }
            }
        }

        console.log('[Siraj] gotAnyData:', gotAnyData, '| Queue length:', streamQueue.length);

        streamFinished = true;
        let waitGuard = 0;
        while (streamWriting && waitGuard < 900) { await new Promise(r => setTimeout(r, 40)); waitGuard++; }

        let full = streamResultFull;
        if (!full || !full.trim()) {
            full = '⚠️ پاسخی از سرور نیامد.\n\nلطفاً کنسول مرورگر (F12) رو باز کن و پیام‌های [Siraj] رو برام بفرست تا دقیق بفهمیم کجای مسیر مشکل داره.';
            console.warn('[Siraj] Empty response. Raw body:', rawBody);
        }

        extractPlanFromResponse(full);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        if (chatId === currentChatId && streamEl) {
            const pm = streamEl.parentElement;
            pm.innerHTML = formatMd(full);
            const blink = pm.querySelector('.cursor-blink');
            if (blink) blink.remove();
            const lat = document.createElement('div');
            lat.className = 'latency-timer';
            lat.textContent = elapsed + 's';
            pm.parentElement.appendChild(lat);
        }
        addMsgToHistory(chatId, 'assistant', full);
        delete pendingRequests[chatId];
    } catch (err) {
        clearTimeout(timeoutId);
        const t = document.getElementById('typing-indicator');
        if (t) t.remove();
        delete pendingRequests[chatId];
        console.error('[Siraj] Caught error:', err);
        if (err.name === 'AbortError') {
            if (controller.signal.reason === 'timeout') {
                if (chatId === currentChatId) renderBotMsg('⏱️ زمان انتظار تمام شد (۱۲۰ ثانیه). اتصال اینترنت یا سرور رو چک کن و دوباره امتحان کن.');
            }
            chatInFlight = false;
            isStreaming = false;
            setSendButton();
            return;
        }
        if (chatId === currentChatId) renderBotMsg('خطای شبکه: ' + err.message);
    }
    chatInFlight = false;
    isStreaming = false;
    setSendButton();
}

function extractPlanFromResponse(text) {
    const matches = [...text.matchAll(/\[PLAN\]\s*([-\d:]+\s*)?[|]?\s*([^\[\]]+?)\s*\[\/PLAN\]/g)];
    if (!matches.length) return;
    const pl = loadPlannerNew();
    const todayKey = dateKey(new Date());
    const dd = getDayData(pl, todayKey);
    let added = 0;
    matches.forEach(m => {
        const time = (m[1] || '').trim().replace(/^-\s*/, '');
        const title = (m[2] || '').trim();
        if (title) {
            const hm = time.match(/^(\d{1,2})/);
            if (hm) {
                const hk = padHour(parseInt(hm[1]));
                if (hk) { dd.hours[hk] = (dd.hours[hk] ? dd.hours[hk] + ' | ' : '') + title; }
            }
            dd.tasks.push({ title, time, done: false });
            added++;
        }
    });
    savePlanner(pl);
    if (added > 0) {
        toast(added + ' کار به برنامه امروز اضافه شد', 'success');
        if (currentView === 'chat') renderPanelForChat();
    }
}

/* ═══════════════════════════════════════════════════════════════
   LOCK SCREEN
   ═══════════════════════════════════════════════════════════════ */
function renderLockPinBoxes(length) {
    var row = document.getElementById('lockPinRow');
    if (!row) return;
    row.innerHTML = '';
    for (var i = 0; i < length; i++) {
        var box = document.createElement('div');
        box.className = 'lock-pin-box';
        box.dataset.idx = i;
        row.appendChild(box);
    }
    var first = row.querySelector('.lock-pin-box');
    if (first) first.classList.add('active');
}

function updatePinBoxes(val) {
    var row = document.getElementById('lockPinRow');
    if (!row) return;
    var boxes = row.querySelectorAll('.lock-pin-box');
    boxes.forEach(function (b, i) {
        b.classList.remove('active', 'filled');
        if (i < val.length) {
            b.textContent = '●';
            b.classList.add('filled');
        } else {
            b.textContent = '';
        }
    });
    if (val.length < boxes.length) {
        boxes[val.length].classList.add('active');
    }
}
window.updatePinBoxes = updatePinBoxes;

function checkLock() {
    if (!settings.passwordEnabled || !settings.password) return;
    if (sessionStorage.getItem(LOCK_SESSION_KEY) === '1') {
        registerMySession();
        return;
    }
    const ls = document.getElementById('lockScreen');
    if (!ls) return;
    /* ★ مخفی کردن پی‌های قدیمی، استفاده از نمایش جدید */
    const pinRow = document.getElementById('lockPinRow');
    if (pinRow) pinRow.style.display = 'none';
    /* ★ اضافه کردن ردیف نمایش کاراکترها */
    injectLockTypedRow();
    ls.classList.add('open');
    setTimeout(function () {
        var inp = document.getElementById('lockInput');
        if (inp) { inp.value = ''; inp.focus(); }
        syncLockTypedRow('');
        if (ls && !ls.dataset.clickBound) {
            ls.dataset.clickBound = '1';
            ls.addEventListener('click', function () {
                var inp2 = document.getElementById('lockInput');
                if (inp2) inp2.focus();
            });
        }
    }, 400);
}

function injectLockTypedRow() {
    if (document.getElementById('lockTypedRow')) return;
    var box = document.querySelector('.lock-box');
    if (!box) return;
    var pinRow = document.getElementById('lockPinRow');
    var row = document.createElement('div');
    row.className = 'lock-typed-row';
    row.id = 'lockTypedRow';
    if (pinRow && pinRow.parentNode) {
        pinRow.parentNode.insertBefore(row, pinRow);
    } else {
        var inp = document.getElementById('lockInput');
        if (inp) inp.parentNode.insertBefore(row, inp);
    }
}

function syncLockTypedRow(val, mode) {
    var row = document.getElementById('lockTypedRow');
    if (!row) return;
    var chars = String(val || '').split('');
    var existing = row.querySelectorAll('.lock-typed-char');

    if (mode === 'success' || mode === 'error') {
        existing.forEach(function (c) {
            c.classList.remove('success', 'error');
            c.classList.add(mode);
        });
        return;
    }

    /* ★ اگه خالیه، کرسر چشمک‌زن نشون بده */
    if (chars.length === 0) {
        row.innerHTML = '<div class="lock-cursor"></div>';
        return;
    }
    var cursor = row.querySelector('.lock-cursor');
    if (cursor) cursor.remove();

    /* کم شد؟ حذف با انیمیشن */
    if (chars.length < existing.length) {
        for (var i = existing.length - 1; i >= chars.length; i--) {
            (function (el) {
                el.classList.add('erasing');
                setTimeout(function () { if (el.parentNode) el.remove(); }, 280);
            })(existing[i]);
        }
        for (var j = 0; j < chars.length && j < existing.length; j++) {
            if (existing[j].dataset.raw !== chars[j]) {
                existing[j].dataset.raw = chars[j];
                existing[j].textContent = chars[j];
                existing[j].classList.remove('masked');
            }
        }
        return;
    }

    /* اضافه شد؟ char جدید با انیمیشن + ماسک بعد از ۲ ثانیه */
    for (var k = 0; k < chars.length; k++) {
        if (existing[k]) {
            if (existing[k].dataset.raw !== chars[k]) {
                existing[k].dataset.raw = chars[k];
                existing[k].textContent = chars[k];
                existing[k].classList.remove('masked');
            }
        } else {
            var el = document.createElement('div');
            el.className = 'lock-typed-char';
            el.dataset.raw = chars[k];
            el.textContent = chars[k];
            row.appendChild(el);
            /* ★ بعد از ۲ ثانیه → ● با انیمیشن */
            (function (e) {
                setTimeout(function () {
                    if (e.parentNode && !e.classList.contains('erasing')) {
                        e.classList.add('masking');
                        setTimeout(function () {
                            if (e.parentNode) {
                                e.textContent = '●';
                                e.classList.remove('masking');
                                e.classList.add('masked');
                            }
                        }, 240);
                    }
                }, 2000);
            })(el);
        }
    }
}
function tryUnlock() {
    const inp = document.getElementById('lockInput');
    const err = document.getElementById('lockError');
    if (!inp || !err) return;
    const val = inp.value;
    if (!val) { err.textContent = 'رمز را وارد کنید'; return; }
    if (val === settings.password) {
        sessionStorage.setItem(LOCK_SESSION_KEY, '1');
        /* ★ نمایش موفقیت با انیمیشن تیک */
        syncLockTypedRow(val, 'success');
        /* ★ مخفی کردن input */
        inp.style.opacity = '0';
        inp.style.pointerEvents = 'none';
        /* ★ نمایش پیام موفقیت */
        var box = document.querySelector('.lock-box');
        if (box && !box.querySelector('.lock-success-check')) {
            var chk = document.createElement('div');
            chk.className = 'lock-success-check';
            chk.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><span>خوش آمدی!</span>';
            box.appendChild(chk);
        }
        /* ★ پنهان کردن دکمه */
        var btn = document.querySelector('.lock-btn');
        if (btn) btn.style.opacity = '0';
        setTimeout(function () {
            document.getElementById('lockScreen').classList.remove('open');
            const app = document.getElementById('appContainer');
            if (app) {
                app.classList.add('locked-entering');
                setTimeout(function () { app.classList.remove('locked-entering'); }, 1100);
            }
            inp.value = '';
            err.textContent = '';
            var hb = document.getElementById('headerLockBtn');
            if (hb) hb.classList.remove('locked');
            /* ★ پاکسازی */
            setTimeout(function () {
                var row = document.getElementById('lockTypedRow');
                if (row) row.innerHTML = '';
                var chk = document.querySelector('.lock-success-check');
                if (chk) chk.remove();
                inp.style.opacity = '';
                inp.style.pointerEvents = '';
                var btn = document.querySelector('.lock-btn');
                if (btn) btn.style.opacity = '';
            }, 400);
            registerMySession();
            resetInactivityTimer();
        }, 900);
    } else {
        err.textContent = 'رمز اشتباه است';
        /* ★ انیمیشن خطا روی کاراکترها */
        syncLockTypedRow(val, 'error');
        const box = document.querySelector('.lock-box');
        if (box) {
            box.style.animation = 'none';
            void box.offsetWidth;
            box.style.animation = 'pinShake .5s ease';
        }
        /* ★ پاک کردن پس از انیمیشن خطا */
        setTimeout(function () {
            var row = document.getElementById('lockTypedRow');
            if (row) row.innerHTML = '';
            inp.value = '';
            err.textContent = '';
        }, 700);
    }
}
function lockNow() {
    if (!settings.passwordEnabled || !settings.password) {
        toast('اول از تنظیمات، رمز قفل رو تنظیم کن', 'error');
        return;
    }
    sessionStorage.removeItem(LOCK_SESSION_KEY);
    const ls = document.getElementById('lockScreen');
    if (!ls) return;
    const pinRow = document.getElementById('lockPinRow');
    if (pinRow) pinRow.style.display = 'none';
    /* ★ فعال‌سازی نمایش دونه‌دونه */
    injectLockTypedRow();
    ls.classList.add('open');
    const inp = document.getElementById('lockInput');
    const err = document.getElementById('lockError');
    if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 350); }
    if (err) err.textContent = '';
    syncLockTypedRow('');
    /* پاک کردن success/check قبلی */
    var oldChk = document.querySelector('.lock-success-check');
    if (oldChk) oldChk.remove();
    if (ls && !ls.dataset.clickBound) {
        ls.dataset.clickBound = '1';
        ls.addEventListener('click', function () {
            var inp2 = document.getElementById('lockInput');
            if (inp2) inp2.focus();
        });
    }
}
/* ═══════════════════════════════════════════════════════════════
   BACKUP
   ═══════════════════════════════════════════════════════════════ */
function exportBackup() {
    const data = { version: 1, exportedAt: Date.now(), settings: settings, history: loadHistory(), planner: loadPlanner(), blog: loadBlog(), videos: loadVideos() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'siraj-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('بکاپ دانلود شد ✓', 'success');
}
function importBackup(ev) {
    const f = ev.target.files ? ev.target.files[0] : null;
    if (!f) return;
    const r = new FileReader();
    r.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data.settings && !data.history) { toast('فایل معتبر نیست', 'error'); return; }
            if (!confirm('همه اطلاعات فعلی جایگزین می‌شه. مطمئنی؟')) return;
            if (data.settings) { settings = Object.assign({}, APP_CONFIG.defaultSettings, data.settings); saveSettings(); }
            if (data.history) saveHistory(data.history);
            if (data.planner) savePlanner(data.planner);
            if (data.blog) saveBlog(data.blog);
            if (data.videos) saveVideos(data.videos);
            toast('بکاپ بازیابی شد ✓', 'success');
            setTimeout(() => location.reload(), 900);
        } catch (err) { toast('خطا در خواندن فایل', 'error'); }
    };
    r.readAsText(f);
    ev.target.value = '';
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS MODAL
   ═══════════════════════════════════════════════════════════════ */
function openSettings() {
    try {
        /* ★ پاک کردن انتخاب متن قبلی */
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel && sel.removeAllRanges) sel.removeAllRanges();
        }
        settingsCat = 'appearance';
        window._settingsSub = 'general';
        window._appearanceSubHidden = false;
        settingsDraft = JSON.parse(JSON.stringify(settings));
        if (!settingsDraft.models) settingsDraft.models = JSON.parse(JSON.stringify(APP_CONFIG.models));
        renderSettingsControls();
        updatePreview();
        const m = document.getElementById('settingsModal');
        if (!m) return;
        m.style.visibility = 'visible';
        m.style.pointerEvents = 'auto';
        requestAnimationFrame(() => m.classList.add('open'));
        const btn = document.getElementById('settingsNavBtn');
        if (btn) { btn.classList.add('pop'); setTimeout(() => btn.classList.remove('pop'), 450); }
    } catch (err) {
        console.error('openSettings error:', err);
        toast('خطا: ' + err.message, 'error');
    }
}
function closeSettings() {
    const m = document.getElementById('settingsModal');
    if (!m) return;
    /* ★ حذف backdrop-filter فوری */
    m.style.backdropFilter = 'none';
    m.style.webkitBackdropFilter = 'none';
    m.classList.remove('open');
    m.classList.add('closing');
    setTimeout(function () {
        m.classList.remove('closing');
        m.classList.remove('open');
        /* ★ مخفی کردن کامل */
        m.style.setProperty('visibility', 'hidden', 'important');
        m.style.setProperty('pointer-events', 'none', 'important');
        m.style.setProperty('display', 'none', 'important');
        /* ★ پاکسازی */
        setTimeout(function () {
            m.style.display = '';
            m.style.visibility = '';
            m.style.pointerEvents = '';
            m.style.backdropFilter = '';
            m.style.webkitBackdropFilter = '';
        }, 60);
        /* ★ بازگرداندن pointer-events به نوار */
        document.querySelectorAll('.bottom-nav-btn').forEach(function (b) {
            b.style.pointerEvents = 'auto';
            b.style.position = 'relative';
            b.style.zIndex = '2';
        });
        var s = document.getElementById('navSlider');
        if (s) s.style.pointerEvents = 'none';
        if (typeof window.updateNavSlider === 'function') window.updateNavSlider(true);
    }, 460);
    settingsDraft = null;
}
function applySettings() {
    if (!settingsDraft) return;
    const oldPass = settings.password, oldEnabled = settings.passwordEnabled;
    settings = JSON.parse(JSON.stringify(settingsDraft));
    saveSettings();
    applySettingsToUI();
    try { localStorage.setItem(PROFILE_IMG_KEY, settings.profileImage || ''); } catch (e) {}
    if (settings.passwordEnabled && (!oldEnabled || oldPass !== settings.password)) {
        sessionStorage.setItem(LOCK_SESSION_KEY, '1');
        registerMySession();
    }
    if (!settings.passwordEnabled) { sessionStorage.removeItem(LOCK_SESSION_KEY); }
    resetInactivityTimer();
    toast('تنظیمات با موفقیت اعمال شد ✓', 'success');
    closeSettings();
}
function switchSettingsCat(cat) {
    /* ★ پاک کردن انتخاب متن */
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel && sel.removeAllRanges) sel.removeAllRanges();
    }
    /* ★ اگه روی «ظاهر» کلیک شد و از قبل بازه → فقط toggle کن، بدون رندر */
    if (cat === 'appearance' && settingsCat === 'appearance') {
        window._appearanceSubHidden = !window._appearanceSubHidden;
        var sub = document.querySelector('.settings-submenu');
        var tab = document.querySelector('.settings-tab-btn[data-cat="appearance"]');
        if (sub) {
            if (window._appearanceSubHidden) {
                sub.classList.remove('open');
                if (tab) tab.classList.remove('active');
            } else {
                sub.classList.add('open');
                if (tab) tab.classList.add('active');
            }
        }
        return;
    }
    if (cat === settingsCat) return;
    settingsCat = cat;
    window._appearanceSubHidden = false;
    if (cat === 'appearance') window._settingsSub = 'general';
    renderSettingsControls();
    if (cat === 'privacy') { renderSessionsList(); }
    setTimeout(() => {
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(inp => {
            inp.setAttribute('dir', 'ltr');
            const pct = ((inp.value - inp.min) / (inp.max - inp.min)) * 100;
            inp.style.setProperty('--slider-pct', pct + '%');
        });
    }, 50);
}

function updatePvNavPreview() {
    const pv = document.getElementById('pvNavPreview');
    const pz = document.getElementById('previewZone');
    if (!pv || !pz || !settingsDraft) return;
    const pos = settingsDraft.navPosition || 'bottom';
    const collapsed = !!settingsDraft.navStartCollapsed;
    pz.setAttribute('data-nav-position', pos);
    pz.setAttribute('data-nav-style', settingsDraft.navStyle || 'default');
    pv.classList.remove('collapsed', 'collapsed-bottom', 'collapsed-top', 'collapsed-left', 'collapsed-right');
    if (collapsed) { pv.classList.add('collapsed'); pv.classList.add('collapsed-' + pos); }
    pv.style.boxShadow = computeNavShadow(settingsDraft.navShadowLevel || 0);
}

function updateDraft(key, value) {
    if (!settingsDraft) return;
    if (['patternSize', 'patternOpacity', 'patternPerCorner', 'navShadowLevel', 'bgImageOpacity', 'autoLockMinutes', 'notifPreMinutes', 'studyDefaultMinutes'].includes(key)) value = parseInt(value, 10);
    if (key === 'bgPreset') { settingsDraft.bgImage = ''; settingsDraft.bgPreset = value; }
    else settingsDraft[key] = value;
    document.querySelectorAll('#settingsContentWrap .row-btn, #settingsContentWrap .color-opt, #settingsContentWrap .pattern-opt, #settingsContentWrap .bg-opt, #settingsContentWrap .pattern-preset').forEach(b => {
        if (b.dataset.key === key) b.classList.toggle('active', String(b.dataset.value) === String(value));
    });
    if (['patternSize', 'patternOpacity', 'patternPerCorner', 'navShadowLevel', 'bgImageOpacity', 'autoLockMinutes', 'notifPreMinutes', 'studyDefaultMinutes'].includes(key)) {
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(inp => {
            if ((inp.getAttribute('oninput') || '').includes("'" + key + "'")) {
                const pct = ((inp.value - inp.min) / (inp.max - inp.min)) * 100;
                inp.style.setProperty('--slider-pct', pct + '%');
                const valEl = inp.parentElement.querySelector('.slider-val');
                if (valEl) {
                    if (key === 'autoLockMinutes') valEl.textContent = value === 0 ? 'خاموش' : (value + ' دقیقه');
                    else valEl.textContent = value + '%';
                }
            }
        });
    }
    if (['navPosition', 'navStartCollapsed', 'navStyle'].includes(key)) { updatePvNavPreview(); }
    if (previewRaf) cancelAnimationFrame(previewRaf);
    previewRaf = requestAnimationFrame(() => { updatePreview(); previewRaf = null; });
}

window.updateModelConfig = function (modelId, field, value) {
    if (!settingsDraft) return;
    if (!isAdmin()) return;
    if (!settingsDraft.models) settingsDraft.models = JSON.parse(JSON.stringify(APP_CONFIG.models));
    var m = settingsDraft.models.find(function (x) { return x.id === modelId; });
    if (m) { m[field] = value; }
};

function updatePreview() {
    const pz = document.getElementById('previewZone');
    const pl = document.getElementById('previewPatternLayer');
    const bgImg = document.getElementById('pvBgImg');
    if (!pz || !settingsDraft) return;
    const themeKey = settingsDraft.themeMode + '-' + settingsDraft.themeColor;
    pz.setAttribute('data-theme', themeKey);
    const bgVal = getBgValue(settingsDraft);
    if (bgImg) {
        if (bgVal !== 'none') {
            bgImg.style.background = bgVal;
            bgImg.style.backgroundAttachment = 'fixed';
            bgImg.style.backgroundPosition = 'center';
            if (settingsDraft.bgImage) {
                bgImg.style.backgroundSize = 'cover';
                bgImg.style.backgroundRepeat = 'no-repeat';
            } else if (settingsDraft.bgPreset === 'dots') {
                bgImg.style.backgroundSize = '20px 20px';
                bgImg.style.backgroundRepeat = 'repeat';
            } else {
                bgImg.style.backgroundSize = 'cover';
                bgImg.style.backgroundRepeat = 'no-repeat';
            }
            bgImg.style.opacity = (settingsDraft.bgImageOpacity || 100) / 100;
        } else {
            bgImg.style.background = 'none';
            bgImg.style.backgroundImage = 'none';
        }
    }
    if (!pl) return;
    /* ★ مقیاس نسبت به اندازه واقعی */  
    const scale = pz.offsetWidth / 900;     const pvSize = Math.max(20, settingsDraft.patternSize * scale);
    pl.style.position = 'absolute';
    pl.style.inset = '0';
    pl.style.zIndex = '1';
    pl.style.borderRadius = '18px';
    applyPattern(pl, settingsDraft.pattern, settingsDraft.patternColor1, settingsDraft.patternColor2, settingsDraft.patternPerCorner, pvSize, settingsDraft.patternPosition, settingsDraft.patternOpacity);
    pz.style.fontSize = parseInt(settingsDraft.fontSize) + 'px';
    pz.style.fontFamily = getFontCSS(settingsDraft.fontFamily);
    pz.setAttribute('data-header-style', settingsDraft.headerStyle || 'glass');
    pz.setAttribute('data-input-style', settingsDraft.inputStyle || 'solid');
    pz.setAttribute('data-element-style', settingsDraft.elementStyle || 'solid');
    const shape = settingsDraft.bubbleShape;
    let rU = '20px 20px 10px 20px', rB = '20px 20px 20px 10px';
    if (shape === 'cloud') { rU = rB = '26px'; }
    else if (shape === 'leaf') { rU = '26px 8px 26px 26px'; rB = '8px 26px 26px 26px'; }
    else if (shape === 'diamond') { rU = '8px 24px 8px 24px'; rB = '24px 8px 24px 8px'; }
    else if (shape === 'speech') { rU = '20px 20px 6px 20px'; rB = '20px 20px 20px 6px'; }
    pz.querySelectorAll('.pv-msg.user').forEach(el => { el.style.borderRadius = rU; });
    pz.querySelectorAll('.pv-msg.bot').forEach(el => { el.style.borderRadius = rB; });
    updatePvNavPreview();
    refreshBgThumbs();
}

function refreshBgThumbs() {
    const s = settingsDraft || settings;
    const isLight = s.themeMode === 'light';
    document.querySelectorAll('.bg-opt').forEach(opt => {
        const id = opt.dataset.value;
        const preset = APP_CONFIG.bgPresets.find(p => p.id === id);
        if (!preset) return;
        const inner = opt.querySelector('div:first-child');
        if (inner) {
            const v = isLight ? (preset.valueLight || preset.value || '') : (preset.value || '');
            inner.style.background = v;
        }
    });
}

function getFontCSS(id) {
    const map = {
        vazirmatn: "'Vazirmatn',sans-serif",
        estedad: "'Estedad',sans-serif",
        shabnam: "'Shabnam',sans-serif",
        lalezar: "'Lalezar',cursive",
        amiri: "'Amiri',serif",
        cairo: "'Cairo',sans-serif",
        'noto-naskh': "'Noto Naskh Arabic',serif",
        tajawal: "'Tajawal',sans-serif",
        inter: "'Inter',sans-serif",
        poppins: "'Poppins',sans-serif",
        'space-grotesk': "'Space Grotesk',sans-serif",
        jetbrains: "'JetBrains Mono',monospace"
    };
    return map[id] || "'Vazirmatn',sans-serif";
}

function getPatternThumbStyle(patternId, c1, c2) {
    if (patternId === 'none') {
        return 'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 120 120\'%3E%3Cg fill=\'none\' stroke=\'%238A9AB5\' stroke-width=\'2\' opacity=\'.5\'%3E%3Ccircle cx=\'60\' cy=\'60\' r=\'45\'/%3E%3Cpath d=\'M25 25 L95 95\'/%3E%3C/g%3E%3C/svg%3E");';
    }
    var tpl = PATTERN_TEMPLATES[patternId];
    if (!tpl) return '';
    var svg = tpl(c1 || '#2AA5B8', c2 || '#F5A623');
    return 'background-image:url("data:image/svg+xml,' + encodeURIComponent(svg) + '");background-repeat:no-repeat;background-position:center;background-size:72%;';
}

function fontRow(f) {
    const s = settingsDraft || settings;
    return '<button class="row-btn' + (s.fontFamily === f.id ? ' active' : '') + '" data-key="fontFamily" data-value="' + f.id + '" onclick="updateDraft(\'fontFamily\',\'' + f.id + '\')" style="font-family:' + getFontCSS(f.id) + '"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg><span class="rb-label">' + f.name + '</span></button>';
}

function handleBgUpload(ev) {
    const f = ev.target.files ? ev.target.files[0] : null;
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) { toast('حجم بیش از ۴ مگابایت', 'error'); return; }
    const r = new FileReader();
    r.onload = e => {
        settingsDraft.bgImage = e.target.result;
        settingsDraft.bgPreset = '';
        updatePreview();
        renderSettingsControls();
        toast('تصویر پس‌زمینه انتخاب شد ✓', 'success');
    };
    r.readAsDataURL(f);
    ev.target.value = '';
}

function clearBgImage() {
    if (!settingsDraft) return;
    settingsDraft.bgImage = '';
    settingsDraft.bgPreset = 'none';
    updatePreview();
    renderSettingsControls();
}

function handleProfileUpload(ev) {
    const f = ev.target.files ? ev.target.files[0] : null;
    if (!f) return;
    if (f.size > 1.5 * 1024 * 1024) { toast('حجم عکس زیاد است', 'error'); return; }
    const r = new FileReader();
    r.onload = e => {
        if (!settingsDraft) return;
        settingsDraft.profileImage = e.target.result;
        toast('عکس انتخاب شد ✓', 'success');
        renderSettingsControls();
    };
    r.readAsDataURL(f);
    ev.target.value = '';
}

function updatePassword() {
    const p1 = document.getElementById('newPass1');
    const p2 = document.getElementById('newPass2');
    if (!p1 || !p2) return;
    const v1 = p1.value.trim(), v2 = p2.value.trim();
    if (!v1) { toast('رمز را وارد کنید', 'error'); return; }
    if (v1 !== v2) { toast('رمزها یکسان نیستند', 'error'); return; }
    if (v1.length < 4) { toast('رمز باید حداقل ۴ کاراکتر باشد', 'error'); return; }
    settingsDraft.password = v1;
    settingsDraft.passwordEnabled = true;
    p1.value = '';
    p2.value = '';
    toast('رمز تنظیم شد ✓', 'success');
    renderSettingsControls();
}
function removePassword() {
    if (!confirm('رمز حذف بشه؟')) return;
    settingsDraft.password = '';
    settingsDraft.passwordEnabled = false;
    sessionStorage.removeItem(LOCK_SESSION_KEY);
    toast('رمز حذف شد', 'info');
    renderSettingsControls();
}

function renderSessionsList() {
    const el = document.getElementById('sessionsListInner');
    if (!el) return;
    const sessions = loadSessions();
    const myId = getMySessionId();
    const list = Object.values(sessions).sort((a, b) => b.lastPing - a.lastPing);
    if (!list.length) {
        el.innerHTML = '<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:14px 0">هنوز دستگاه فعالی ثبت نشده</div>';
        return;
    }
    el.innerHTML = list.map(s => {
        const isMe = s.id === myId;
        return '<div class="session-row' + (isMe ? ' current' : '') + '">' +
            '<div class="s-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="14" rx="2"/></svg></div>' +
            '<div class="s-info">' +
                '<div class="s-name">' + escapeHtml(getDeviceName(s.ua, s.platform)) + ' ' + (isMe ? '<span class="s-badge">دستگاه فعلی</span>' : '') + '</div>' +
                '<div class="s-sub">' + timeAgo(s.lastPing) + '</div>' +
            '</div>' +
            (isMe ? '' : '<button class="s-del" onclick="removeSession(\'' + s.id + '\')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>') +
        '</div>';
    }).join('');
}

function bindContactLinks() {
    document.querySelectorAll('.contact-row[data-link]').forEach(function (row) {
        if (row.dataset.bound === '1') return;
        row.dataset.bound = '1';
        row.style.cursor = 'pointer';
        row.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            var link = row.getAttribute('data-link');
            if (!link) return;
            e.preventDefault();
            e.stopPropagation();
            if (link.indexOf('mailto:') === 0) window.location.href = link;
            else window.open(link, '_blank', 'noopener');
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   RENDER SETTINGS CONTROLS
   ═══════════════════════════════════════════════════════════════ */
function renderSettingsControls() {
    const s = settingsDraft || settings;
    const tabs = document.getElementById('settingsTabs');
    const wrap = document.getElementById('settingsContentWrap');
    if (!tabs || !wrap) return;

    var admin = (typeof isAdmin === 'function') ? isAdmin() : false;
    var modelsDraft = settingsDraft.models || JSON.parse(JSON.stringify(APP_CONFIG.models));

    var subState = window._settingsSub || 'general';
    var isAppearanceOpen = (settingsCat === 'appearance'); 

    /* ═══ تب‌ها + زیرمنوی ظاهر ═══ */
    var tabsHTML = '';
    tabsHTML +=
        '<button class="settings-tab-btn' + (isAppearanceOpen ? ' active' : '') + ' settings-tab-parent' + (isAppearanceOpen ? ' has-sub' : '') + '" data-cat="appearance" onclick="switchSettingsCat(\'appearance\')">' +
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3 L14 9 L12 12 L10 9 Z"/></svg>' +
            '<span style="flex:1;text-align:right">ظاهر</span>' +
            '<svg class="settings-tab-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>' +
        '</button>';

            if (isAppearanceOpen) {
        var subs = [
            { id: 'general', label: 'تم و رنگ' },
            { id: 'background', label: 'پس‌زمینه' },
            { id: 'header', label: 'هدر و المان' },
            { id: 'pattern', label: 'طرح' },
            { id: 'font', label: 'فونت' }
        ];
        var subOpen = !window._appearanceSubHidden;
        tabsHTML += '<div class="settings-submenu' + (subOpen ? ' open' : '') + '">';
        tabsHTML += subs.map(function (sub) {
            return '<button class="settings-submenu-btn' + (subState === sub.id ? ' active' : '') + '" onclick="event.stopPropagation();window._settingsSub=\'' + sub.id + '\';renderSettingsControls();">' + sub.label + '</button>';
        }).join('');
        tabsHTML += '</div>';
    }

    tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'style' ? ' active' : '') + '" data-cat="style" onclick="switchSettingsCat(\'style\')"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>استایل</button>';
    tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'behavior' ? ' active' : '') + '" data-cat="behavior" onclick="switchSettingsCat(\'behavior\')"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>رفتار</button>';
    if (admin) {
        tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'models' ? ' active' : '') + '" data-cat="models" onclick="switchSettingsCat(\'models\')"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/></svg>مدل‌ها</button>';
    }
    tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'profile' ? ' active' : '') + '" data-cat="profile" onclick="switchSettingsCat(\'profile\')"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>مشخصات من</button>';
    tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'privacy' ? ' active' : '') + '" data-cat="privacy" onclick="switchSettingsCat(\'privacy\')"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>حریم خصوصی</button>';
    tabsHTML += '<button class="settings-tab-btn' + (settingsCat === 'about' ? ' active' : '') + '" data-cat="about" onclick="switchSettingsCat(\'about\')"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>درباره ما</button>';
    tabs.innerHTML = tabsHTML;

    /* ═══ محتوای هر زیردسته ═══ */
    var appearanceContent = {
        general:
            '<div class="setting-group"><label>حالت نمایش</label>' +
                '<div class="row-btns">' +
                    '<button class="row-btn' + (s.themeMode === 'dark' ? ' active' : '') + '" onclick="updateDraft(\'themeMode\',\'dark\')"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span class="rb-label">شب</span></button>' +
                    '<button class="row-btn' + (s.themeMode === 'light' ? ' active' : '') + '" onclick="updateDraft(\'themeMode\',\'light\')"><svg class="rb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg><span class="rb-label">روز</span></button>' +
                    '<button class="row-btn' + (s.themeMode === 'midnight' ? ' active' : '') + '" onclick="updateDraft(\'themeMode\',\'midnight\')"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="currentColor" fill-opacity=".35"/><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg><span class="rb-label">نیمه‌شب</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group"><label>رنگ اصلی</label>' +
                '<div class="color-row">' + APP_CONFIG.themeColors.map(c =>
                    '<div class="color-opt' + (s.themeColor === c ? ' active' : '') + '" onclick="updateDraft(\'themeColor\',\'' + c + '\')"><div class="color-orb" data-color="' + c + '"><svg viewBox="0 0 24 24">' + APP_CONFIG.colorIcons[c] + '</svg></div><div class="color-label">' + APP_CONFIG.colorNames[c] + '</div></div>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>شکل حباب</label>' +
                '<div class="row-btns">' + APP_CONFIG.bubbleShapes.map(b =>
                    '<button class="row-btn' + (s.bubbleShape === b.id ? ' active' : '') + '" onclick="updateDraft(\'bubbleShape\',\'' + b.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + b.icon + '</svg><span class="rb-label">' + b.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>اندازه متن</label>' +
                '<div class="row-btns">' + ['13px', '15px', '17px', '19px'].map((f, i) =>
                    '<button class="row-btn' + (s.fontSize === f ? ' active' : '') + '" onclick="updateDraft(\'fontSize\',\'' + f + '\')"><span class="rb-label">' + ['کوچیک', 'معمولی', 'درشت', 'بزرگ'][i] + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>سرعت انیمیشن</label>' +
                '<div class="row-btns">' + APP_CONFIG.animations.map(a =>
                    '<button class="row-btn' + (s.animation === a.id ? ' active' : '') + '" onclick="updateDraft(\'animation\',\'' + a.id + '\')"><span class="rb-label">' + a.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>',
               background:
            '<div class="setting-group"><label>پیش‌فرض‌های آماده</label>' +
                '<div class="row-btns" style="grid-template-columns:repeat(3,1fr)">' +
                    APP_CONFIG.bgPresets.map(function(bp){
                        var isActive = (s.bgPreset||'none') === bp.id && !s.bgImage;
                        return '<button class="row-btn'+(isActive?' active':'')+'" onclick="updateDraft(\'bgPreset\',\''+bp.id+'\')" style="min-height:60px;padding:6px">' +
                            '<div style="width:100%;height:26px;border-radius:6px;background:'+(bp.value||'var(--panel-bg)')+';border:1px solid var(--border)"></div>' +
                            '<span class="rb-label" style="font-size:9.5px;margin-top:4px">'+bp.name+'</span>' +
                        '</button>';
                    }).join('') +
                '</div>' +
            '</div>' +
            '<div class="setting-group"><label>تصویر پس‌زمینه</label>' +
                '<div style="display:flex;gap:8px;align-items:center;margin-top:6px">' +
                    '<label class="btn-primary" style="cursor:pointer;flex:1;justify-content:center"><input type="file" accept="image/*" onchange="handleBgUpload(event)" style="display:none">📷 آپلود تصویر</label>' +
                    (s.bgImage ? '<button class="btn-secondary" onclick="clearBgImage()">✕ حذف</button>' : '') +
                '</div>' +
            '</div>' +
            (s.bgImage ? '<div class="setting-group"><label>شفافیت تصویر</label>' +
                '<div class="slider-row"><input type="range" min="20" max="100" step="5" value="'+(s.bgImageOpacity||100)+'" oninput="updateDraft(\'bgImageOpacity\',this.value)"><span class="slider-val">'+(s.bgImageOpacity||100)+'%</span></div>' +
            '</div>' : ''),
        header:
            '<div class="setting-group"><label>پس‌زمینه هدر</label>' +
                '<div class="row-btns">' + APP_CONFIG.headerStyles.map(h =>
                    '<button class="row-btn' + (s.headerStyle === h.id ? ' active' : '') + '" onclick="updateDraft(\'headerStyle\',\'' + h.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + h.icon + '</svg><span class="rb-label">' + h.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>نوار نوشتن پیام</label>' +
                '<div class="row-btns">' + APP_CONFIG.inputStyles.map(i =>
                    '<button class="row-btn' + (s.inputStyle === i.id ? ' active' : '') + '" onclick="updateDraft(\'inputStyle\',\'' + i.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + i.icon + '</svg><span class="rb-label">' + i.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>استایل المان‌ها</label>' +
                '<div class="row-btns">' + APP_CONFIG.elementStyles.map(el =>
                    '<button class="row-btn' + (s.elementStyle === el.id ? ' active' : '') + '" onclick="updateDraft(\'elementStyle\',\'' + el.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + el.icon + '</svg><span class="rb-label">' + el.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>',
        pattern:
            '<div class="setting-group"><label>انتخاب طرح</label>' +
                '<div class="pattern-grid">' + APP_CONFIG.patterns.map(pat =>
    '<div class="pattern-opt' + (s.pattern === pat.id ? ' active' : '') + '" onclick="updateDraft(\'pattern\',\'' + pat.id + '\')">' +
        '<div class="pattern-thumb" style="' + getPatternThumbStyle(pat.id, s.patternColor1, s.patternColor2) + '"></div>' +
        '<div class="pattern-name">' + pat.name + '</div>' +
    '</div>'
).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>رنگ‌های آماده طرح</label>' +
                '<div class="pattern-preset-colors">' +
                    APP_CONFIG.patternPresets.map(function (pr) {
                        var isActive = s.patternColor1 === pr.c1 && s.patternColor2 === pr.c2;
                        return '<div class="pattern-preset' + (isActive ? ' active' : '') + '" title="' + pr.n + '" onclick="updateDraft(\'patternColor1\',\'' + pr.c1 + '\');updateDraft(\'patternColor2\',\'' + pr.c2 + '\')" style="background:linear-gradient(135deg,' + pr.c1 + ' 0%,' + pr.c1 + ' 50%,' + pr.c2 + ' 50%,' + pr.c2 + ' 100%)"></div>';
                    }).join('') +
                '</div>' +
            '</div>' +
            '<div class="setting-group"><label>موقعیت</label>' +
                '<div class="row-btns">' +
                    '<button class="row-btn' + (s.patternPosition === 'both' ? ' active' : '') + '" onclick="updateDraft(\'patternPosition\',\'both\')"><span class="rb-label">دو گوشه</span></button>' +
                    '<button class="row-btn' + (s.patternPosition === 'reverse' ? ' active' : '') + '" onclick="updateDraft(\'patternPosition\',\'reverse\')"><span class="rb-label">برعکس</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group"><label>تعداد در گوشه</label>' +
                '<div class="slider-row"><input type="range" min="1" max="8" step="1" value="' + s.patternPerCorner + '" oninput="updateDraft(\'patternPerCorner\',this.value)"><span class="slider-val">' + s.patternPerCorner + '×</span></div>' +
            '</div>' +
            '<div class="setting-group"><label>اندازه</label>' +
                '<div class="slider-row"><input type="range" min="60" max="350" step="10" value="' + s.patternSize + '" oninput="updateDraft(\'patternSize\',this.value)"><span class="slider-val">' + s.patternSize + 'px</span></div>' +
            '</div>' +
            '<div class="setting-group"><label>شفافیت</label>' +
                '<div class="slider-row"><input type="range" min="10" max="100" step="5" value="' + s.patternOpacity + '" oninput="updateDraft(\'patternOpacity\',this.value)"><span class="slider-val">' + s.patternOpacity + '%</span></div>' +
            '</div>' +
            '<div class="setting-group"><label>رنگ‌های دلخواه</label>' +
                '<div class="color-picker-row">' +
                    '<div class="color-picker-wrap"><label>رنگ ۱</label><input type="color" value="' + s.patternColor1 + '" oninput="updateDraft(\'patternColor1\',this.value)"></div>' +
                    '<div class="color-picker-wrap"><label>رنگ ۲</label><input type="color" value="' + s.patternColor2 + '" oninput="updateDraft(\'patternColor2\',this.value)"></div>' +
                '</div>' +
            '</div>',
        font:
            '<div class="setting-group">' +
                '<div class="group-subtitle">فونت‌های فارسی</div>' +
                '<div class="row-btns">' + APP_CONFIG.fonts.persian.map(fontRow).join('') + '</div>' +
                '<div class="group-subtitle">فونت‌های عربی</div>' +
                '<div class="row-btns">' + APP_CONFIG.fonts.arabic.map(fontRow).join('') + '</div>' +
                '<div class="group-subtitle">فونت‌های انگلیسی</div>' +
                '<div class="row-btns">' + APP_CONFIG.fonts.english.map(fontRow).join('') + '</div>' +
            '</div>'
    };

    /* ═══ محتوای مدل‌ها (فقط ادمین) ═══ */
    var modelsHTML = '';
    if (admin) {
        modelsHTML = '<div class="setting-group">' +
            '<label style="font-size:13px;font-weight:800;color:var(--accent)">🧠 مدل‌های هوش مصنوعی سراج</label>' +
            '<div style="display:flex;align-items:center;gap:8px;margin:14px 0 10px">' +
                '<span style="font-size:12px;font-weight:800;color:var(--text-muted)">مدل‌ها:</span>' +
                '<span class="admin-badge">✓ ادمین</span>' +
                '<button onclick="window.__logoutAdmin()" style="margin-right:auto;padding:5px 12px;border-radius:8px;border:1px solid rgba(239,68,68,.3);background:transparent;color:#F87171;font-family:var(--font-text);font-size:10px;font-weight:700;cursor:pointer">خروج</button>' +
            '</div>' +
            modelsDraft.map(function (m) {
                return '<div style="padding:14px;border-radius:16px;border:1px solid ' + m.color + '40;background:' + m.color + '08;margin-bottom:12px">' +
                    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
                        '<div style="width:42px;height:42px;border-radius:14px;background:' + m.color + '20;border:1px solid ' + m.color + '50;display:flex;align-items:center;justify-content:center;color:' + m.color + '">' +
                            (window.MODEL_ICONS && window.MODEL_ICONS[m.id] ? window.MODEL_ICONS[m.id] : m.emoji) +
                        '</div>' +
                        '<div>' +
                            '<div style="font-size:14px;font-weight:800;color:' + m.color + '">' + escapeHtml(m.name) + '</div>' +
                            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + escapeHtml(m.desc) + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<label style="font-size:10.5px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:4px">URL پروکسی</label>' +
                    '<input type="text" value="' + escapeHtml(m.baseURL || '') + '" oninput="window.updateModelConfig(\'' + m.id + '\',\'baseURL\',this.value)" class="model-field-editable" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--border);color:var(--text-main);font-family:var(--font-text);font-size:11px;outline:none;direction:ltr;margin-bottom:8px">' +
                    '<label style="font-size:10.5px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:4px">نام مدل API</label>' +
                    '<input type="text" value="' + escapeHtml(m.apiModel || '') + '" oninput="window.updateModelConfig(\'' + m.id + '\',\'apiModel\',this.value)" class="model-field-editable" style="width:100%;padding:9px 12px;border-radius:10px;border:1px solid var(--border);color:var(--text-main);font-family:var(--font-text);font-size:11px;outline:none;direction:ltr;margin-bottom:8px">' +
                    '<label style="font-size:10.5px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:4px">شخصیت و پرامپت (systemExtra)</label>' +
                    '<textarea oninput="window.updateModelConfig(\'' + m.id + '\',\'systemExtra\',this.value)" placeholder="اینجا شخصیت مدل رو بنویس..." class="model-field-editable" style="width:100%;min-height:120px;padding:9px 12px;border-radius:10px;border:1px solid var(--border);color:var(--text-main);font-family:var(--font-text);font-size:11px;outline:none;resize:vertical;line-height:1.8">' + escapeHtml(m.systemExtra || '') + '</textarea>' +
                    '</div>';
            }).join('') +
            '<button onclick="window.__downloadPromptsJSON()" style="width:100%;margin-top:8px;padding:12px;border-radius:12px;border:2px dashed var(--accent);background:rgba(59,130,246,.06);color:var(--accent);font-family:var(--font-text);font-size:12px;font-weight:800;cursor:pointer">' +
                '📥 دانلود prompts.json' +
            '</button>' +
        '</div>';
    } else {
        modelsHTML = '<div class="setting-group">' +
            '<div style="padding:14px;border-radius:14px;background:linear-gradient(135deg,rgba(239,68,68,.08),rgba(239,68,68,.02));border:1px solid rgba(239,68,68,.25);text-align:center">' +
                '<div style="font-size:26px;margin-bottom:8px">🔒</div>' +
                '<div style="font-size:12.5px;font-weight:800;color:#F87171;margin-bottom:6px">ویرایش فقط برای سازنده</div>' +
                '<div style="font-size:11px;color:var(--text-muted);line-height:1.8;margin-bottom:12px">برای ویرایش پرامپت مدل‌ها، رمز ادمین رو وارد کن</div>' +
                '<input type="password" id="adminPassInput" placeholder="رمز ادمین..." style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;text-align:center;margin-bottom:8px;direction:ltr">' +
                '<button onclick="window.__promptAdminPassword(document.getElementById(\'adminPassInput\').value)" style="width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--accent-light),var(--accent-dark));color:#fff;font-family:var(--font-text);font-size:12.5px;font-weight:800;cursor:pointer">🔓 فعال‌سازی حالت ادمین</button>' +
            '</div>' +
        '</div>';
    }

    /* ═══ محتوای پروفایل ═══ */
    var p = getProfile();
    var src = p.avatar || 'siraj-logo.png';
    var lvl = getUserLevel();
    var dv = getDefaultView();
    var lo = ['beginner', 'intermediate', 'advanced'];
    var lh = lo.map(function (k) { return '<button class="level-opt' + (k === lvl ? ' active' : '') + '" data-level="' + k + '">' + LEVEL_LABELS[k] + '</button>'; }).join('');
    var vo = ['chat', 'planner', 'blog', 'videos', 'tools'];
    var vh = vo.map(function (k) { return '<button class="default-view-opt' + (k === dv ? ' active' : '') + '" data-view="' + k + '">' + VIEW_LABELS[k] + '</button>'; }).join('');
    var profileHTML =
        '<div class="setting-group profile-section">' +
            '<label style="font-size:13px;font-weight:800;color:var(--accent)">👤 مشخصات شخصی</label>' +
            '<div class="about-avatar" style="margin:14px auto"><img src="' + src + '" alt=""></div>' +
            '<div class="profile-access-note">ℹ️ دستیار هوشمند سراج به این اطلاعات دسترسی داره.</div>' +
            '<input type="text" id="profileName" placeholder="اسمت چیه؟" value="' + (p.name ? escapeHtml(p.name) : '') + '" style="width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;margin-bottom:8px;margin-top:8px">' +
            '<textarea id="profileBio" placeholder="یه توضیح کوتاه..." style="width:100%;min-height:90px;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;resize:vertical;line-height:1.8;margin-bottom:8px">' + (p.bio ? escapeHtml(p.bio) : '') + '</textarea>' +
            '<button class="btn-primary" id="profileSaveBtn" style="width:100%;justify-content:center;margin-top:6px">💾 ذخیره</button>' +
        '</div>' +
        '<div class="level-selector"><div class="level-selector-title">🎯 سطح زبان عربیت</div>' +
            '<div class="level-options">' + lh + '</div>' +
            '<button class="level-determine-btn" id="determineLevelBtn">سطحمو نمی‌دونم، با هوش مصنوعی تعیین کن</button>' +
        '</div>' +
        '<div class="default-view-selector"><div class="default-view-title">📌 تب دیفالت هنگام ورود</div>' +
            '<div class="default-view-options">' + vh + '</div>' +
        '</div>';

    /* ═══ ساخت wrap ═══ */
    wrap.innerHTML =
        '<div class="settings-content' + (settingsCat === 'appearance' ? ' active' : '') + '" data-cat="appearance">' +
            (appearanceContent[subState] || appearanceContent.general) +
        '</div>' +

        '<div class="settings-content' + (settingsCat === 'style' ? ' active' : '') + '" data-cat="style">' +
            '<div class="setting-group"><label>حالت باز/بسته نوار</label>' +
                '<div class="row-btns">' +
                    '<button class="row-btn' + (!s.navStartCollapsed ? ' active' : '') + '" onclick="updateDraft(\'navStartCollapsed\',false)"><span class="rb-label">باز</span></button>' +
                    '<button class="row-btn' + (s.navStartCollapsed ? ' active' : '') + '" onclick="updateDraft(\'navStartCollapsed\',true)"><span class="rb-label">جمع‌شده</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group"><label>موقعیت نوار</label>' +
                '<div class="row-btns">' + APP_CONFIG.navPositions.map(pos =>
                    '<button class="row-btn' + (s.navPosition === pos.id ? ' active' : '') + '" onclick="updateDraft(\'navPosition\',\'' + pos.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + pos.icon + '</svg><span class="rb-label">' + pos.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>استایل پس‌زمینه نوار</label>' +
                '<div class="row-btns">' + APP_CONFIG.navStyles.map(st =>
                    '<button class="row-btn' + (s.navStyle === st.id ? ' active' : '') + '" onclick="updateDraft(\'navStyle\',\'' + st.id + '\')"><svg class="rb-icon" viewBox="0 0 24 24">' + st.icon + '</svg><span class="rb-label">' + st.name + '</span></button>'
                ).join('') + '</div>' +
            '</div>' +
            '<div class="setting-group"><label>شدت سایه نوار</label>' +
                '<div class="slider-row"><input type="range" min="0" max="100" step="5" value="' + (s.navShadowLevel || 0) + '" oninput="updateDraft(\'navShadowLevel\',this.value)"><span class="slider-val">' + (s.navShadowLevel || 0) + '%</span></div>' +
            '</div>' +
        '</div>' +

                '<div class="settings-content' + (settingsCat === 'behavior' ? ' active' : '') + '" data-cat="behavior">' +
            '<div class="setting-group">' +
                '<label>مدل پیش‌فرض</label>' +
                '<div class="row-btns" style="grid-template-columns:1fr 1fr 1fr">' +
                    APP_CONFIG.models.map(function(m){
                        var isActive = (s.selectedModel||'hakim') === m.id;
                        return '<button class="row-btn' + (isActive ? ' active' : '') + '" onclick="updateDraft(\'selectedModel\',\'' + m.id + '\')" style="border-color:'+m.color+'40">' +
                            '<span style="font-size:22px">'+m.emoji+'</span>' +
                            '<span class="rb-label" style="color:'+m.color+'">'+escapeHtml(m.name)+'</span>' +
                        '</button>';
                    }).join('') +
                '</div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>حالت پیش‌فرض پاسخ</label>' +
                '<div class="row-btns" style="grid-template-columns:1fr 1fr">' +
                    '<button class="row-btn' + (!s.thinking && !s.quick ? ' active' : '') + '" onclick="updateDraft(\'thinking\',false);updateDraft(\'quick\',false)"><span class="rb-label">معمولی</span></button>' +
                    '<button class="row-btn' + (s.thinking ? ' active' : '') + '" onclick="updateDraft(\'thinking\',true);updateDraft(\'quick\',false)"><span class="rb-label">🧠 تفکر عمیق</span></button>' +
                    '<button class="row-btn' + (s.quick ? ' active' : '') + '" onclick="updateDraft(\'quick\',true);updateDraft(\'thinking\',false)"><span class="rb-label">⚡ پاسخ سریع</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>سطح پاسخ‌دهی سراج</label>' +
                '<div class="row-btns" style="grid-template-columns:1fr 1fr 1fr">' +
                    '<button class="row-btn' + ((s.aiLevel||'intermediate')==='beginner'?' active':'') + '" onclick="updateDraft(\'aiLevel\',\'beginner\')"><span class="rb-label">ساده و خودی</span></button>' +
                    '<button class="row-btn' + ((s.aiLevel||'intermediate')==='intermediate'?' active':'') + '" onclick="updateDraft(\'aiLevel\',\'intermediate\')"><span class="rb-label">متوسط</span></button>' +
                    '<button class="row-btn' + ((s.aiLevel||'intermediate')==='advanced'?' active':'') + '" onclick="updateDraft(\'aiLevel\',\'advanced\')"><span class="rb-label">تخصصی و عمیق</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>زبان پاسخ</label>' +
                '<div class="row-btns" style="grid-template-columns:1fr 1fr 1fr">' +
                    '<button class="row-btn' + ((s.aiLang||'fa')==='fa'?' active':'') + '" onclick="updateDraft(\'aiLang\',\'fa\')"><span class="rb-label">فارسی</span></button>' +
                    '<button class="row-btn' + ((s.aiLang||'fa')==='ar'?' active':'') + '" onclick="updateDraft(\'aiLang\',\'ar\')"><span class="rb-label">عربی</span></button>' +
                    '<button class="row-btn' + ((s.aiLang||'fa')==='en'?' active':'') + '" onclick="updateDraft(\'aiLang\',\'en\')"><span class="rb-label">English</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>اعلان‌ها و یادآورها</label>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">' +
                    '<button class="row-btn' + (s.notifEnabled !== false ? ' active' : '') + '" onclick="updateDraft(\'notifEnabled\',true)"><span class="rb-label">فعال ✓</span></button>' +
                    '<button class="row-btn' + (s.notifEnabled === false ? ' active' : '') + '" onclick="updateDraft(\'notifEnabled\',false)"><span class="rb-label">خاموش ✗</span></button>' +
                '</div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>تست و مجوز اعلان</label>' +
                '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">' +
                    '<button class="btn-primary" style="flex:1;justify-content:center" onclick="if(window.__sendTestNotification)window.__sendTestNotification()">ارسال نوتیف تست</button>' +
                    '<button class="btn-secondary" style="flex:1;justify-content:center" onclick="if(window.__requestNotifPermission)window.__requestNotifPermission()">درخواست مجوز</button>' +
                '</div>' +
            '</div>' +
        '</div>' +

        (admin ? '<div class="settings-content' + (settingsCat === 'models' ? ' active' : '') + '" data-cat="models">' + modelsHTML + '</div>' : '') +

        '<div class="settings-content' + (settingsCat === 'profile' ? ' active' : '') + '" data-cat="profile">' +
            profileHTML +
        '</div>' +

        '<div class="settings-content' + (settingsCat === 'privacy' ? ' active' : '') + '" data-cat="privacy">' +
            '<div class="setting-group">' +
                '<label>قفل ورود با رمز</label>' +
                (s.passwordEnabled && s.password ?
                    '<div style="text-align:center;padding:8px 0">' +
                        '<div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.4);color:#10B981;font-size:11.5px;font-weight:700">✓ قفل فعال است</div>' +
                    '</div>' +
                    '<button class="btn-secondary" style="width:100%" onclick="removePassword()">حذف رمز</button>'
                    :
                    '<input type="password" class="password-input" id="newPass1" placeholder="رمز جدید" maxlength="32" style="margin-bottom:8px">' +
                    '<input type="password" class="password-input" id="newPass2" placeholder="تکرار رمز" maxlength="32" style="margin-bottom:10px">' +
                    '<button class="btn-primary" style="width:100%;justify-content:center" onclick="updatePassword()">فعال‌سازی قفل</button>'
                ) +
            '</div>' +
            '<div class="setting-group">' +
                '<label>دستگاه‌های فعال</label>' +
                '<div id="sessionsListInner"></div>' +
            '</div>' +
            '<div class="setting-group">' +
                '<label>بکاپ‌گیری</label>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">' +
                    '<button class="btn-primary" style="justify-content:center" onclick="exportBackup()">دانلود</button>' +
                    '<label class="btn-secondary" style="cursor:pointer;justify-content:center"><input type="file" accept=".json" onchange="importBackup(event)" style="display:none">بازیابی</label>' +
                '</div>' +
            '</div>' +
        '</div>' +

        '<div class="settings-content' + (settingsCat === 'about' ? ' active' : '') + '" data-cat="about">' +
            '<div class="about-hero">' +
                '<div class="about-avatar">' + (s.profileImage ? '<img src="' + s.profileImage + '" alt="حامد">' : '<span style="font-size:44px">ح ا</span>') + '</div>' +
                '<div class="about-name">حامد انصاری‌فر</div>' +
                '<div class="about-role">سازنده سراج</div>' +
            '</div>' +
            '<div class="about-bio-card">' +
                'سلام 👋<br><br>' +
                'من حامدم؛ یه جوون ۲۰ ساله اهل اراک که عاشق ایران، تاریخش و مردمشه و همیشه به یادگرفتن و ساختن چیزهای جدید علاقه داشته.<br><br>' +
                'الان دانشجوی زبان و ادبیات عربی دانشگاه قمم و در کنار درس، به هوش مصنوعی، برنامه‌نویسی و بازی‌سازی علاقه‌مندم. یه زمانی ادیتور و مجسمه‌ساز بودم و حالا مسیرم به چیزهای تازه‌ای رسیده؛ مسیری که هنوز هم ادامه داره.<br><br>' +
                'سراج با یه ایده‌ی ساده و یهویی شروع شد؛ ایده‌ای برای اینکه یادگیری رو برای آدم‌های بیشتری ساده‌تر و در دسترس‌تر کنم. شاید علاقه‌ام به آموزش و تربیت هم بی‌تأثیر نبوده باشه، اما فکر می‌کنم چیزای بزرگ از همین ایده‌های ساده و یهویی شروع شده. و انسان تا دغدغه‌ی چیزی رو نداشته باشه، برای ساختنش قدم برنمی‌داره.<br><br>' +
                'شاید سراج رو با زبان و ادبیات عربی شروع کرده باشیم، اما سراج به هیچ چیز محدود نبوده و نخواهد بود. سراج برای من فقط یه برنامه برای یک رشته یا یک موضوع خاص نیست؛ قراره جایی برای یادگیری و تجربه‌ی چیزهای مختلف باشه و قدم‌به‌قدم به اهداف خودش برسه.<br><br>' +
                'من هم مثل سراج هنوز اول راهم؛ هنوز چیزهای زیادی هست که باید یاد بگیریم، تجربه کنیم و بسازیم.<br><br>' +
                'این تازه شروع ماجراست.<br><br>' +
                'به دنیای سراج خوش اومدید. 🌱' +
                    '</div>' +
            '<div class="about-section-title">' +
                '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
                'راه های ارتباطی' +
            '</div>' +
            '<div class="about-contacts">' +
                '<div class="contact-row" data-link="mailto:ranshamed.fr@gmail.com">' +
                    '<div class="contact-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg></div>' +
                    '<div class="contact-info"><div class="contact-label">ایمیل</div><div class="contact-value">ranshamed.fr@gmail.com</div></div>' +
                '</div>' +
                '<div class="contact-row" data-link="https://t.me/Ra_Nsss">' +
                    '<div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M21 3 3 10l6 3 3 6 9-16z"/><path d="M9 13 21 3"/></svg></div>' +
                    '<div class="contact-info"><div class="contact-label">تلگرام</div><div class="contact-value">@Ra_Nsss</div></div>' +
                '</div>' +
                '<div class="contact-row" data-link="https://instagram.com/Hamed_Rans">' +
                    '<div class="contact-icon"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></div>' +
                    '<div class="contact-info"><div class="contact-label">اینستاگرام</div><div class="contact-value">Hamed_Rans</div></div>' +
                '</div>' +
                '<div class="contact-row" data-link="https://x.com/Hamed_Rans">' +
                    '<div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" stroke="none"/></svg></div>' +
                    '<div class="contact-info"><div class="contact-label">ایکس</div><div class="contact-value">Hamed_Rans</div></div>' +
                '</div>' +
            '</div>' +
            '<div class="siraj-version-badge" style="text-align:center;padding:14px 0;font-size:12px;color:var(--text-muted)">' +
                'نسخه <span style="color:var(--accent);font-weight:900">' + (s.appVersion || '2.6') + '</span>' +
            '</div>' +
        '</div>';

    setTimeout(function () {
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(function (inp) {
            inp.setAttribute('dir', 'ltr');
            inp.style.direction = 'ltr';
            var pct = ((inp.value - inp.min) / (inp.max - inp.min)) * 100;
            inp.style.setProperty('--slider-pct', pct + '%');
        });
        if (settingsCat === 'privacy') renderSessionsList();
        bindContactLinks();

        var profilePaneEl = document.querySelector('.settings-content[data-cat="profile"]');
        if (profilePaneEl) {
            var lvl2 = getUserLevel();
            profilePaneEl.querySelectorAll('.level-opt').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-level') === lvl2);
                b.onclick = function () {
                    var l = b.getAttribute('data-level');
                    setUserLevel(l);
                    profilePaneEl.querySelectorAll('.level-opt').forEach(function (x) { x.classList.remove('active'); });
                    b.classList.add('active');
                    if (window.toast) window.toast('سطح ' + LEVEL_LABELS[l] + ' انتخاب شد ✓', 'success');
                };
            });
            var dv2 = getDefaultView();
            profilePaneEl.querySelectorAll('.default-view-opt').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-view') === dv2);
                b.onclick = function () {
                    var v = b.getAttribute('data-view');
                    setDefaultView(v);
                    profilePaneEl.querySelectorAll('.default-view-opt').forEach(function (x) { x.classList.remove('active'); });
                    b.classList.add('active');
                    if (window.toast) window.toast('تب دیفالت: ' + VIEW_LABELS[v], 'success');
                };
            });
            var dlvl = profilePaneEl.querySelector('#determineLevelBtn');
            if (dlvl) {
                dlvl.onclick = function () {
                    var m = document.getElementById('settingsModal');
                    if (m) m.classList.remove('open');
                    if (typeof window.switchView === 'function') window.switchView('chat');
                    setTimeout(function () {
                        var q = document.getElementById('q');
                        if (q) {
                            q.value = 'میخوام سطح عربیم رو تعیین کنی. چند سوال از آسون به سخت ازم بپرس و آخرش سطحم رو مشخص کن.';
                            if (typeof window.handleInput === 'function') window.handleInput();
                            q.focus();
                        }
                    }, 500);
                };
            }
            var sp = profilePaneEl.querySelector('#profileSaveBtn');
            if (sp) {
                sp.onclick = function () {
                    var p2 = getProfile();
                    var nameEl = profilePaneEl.querySelector('#profileName');
                    var bioEl = profilePaneEl.querySelector('#profileBio');
                    p2.name = nameEl ? nameEl.value : '';
                    p2.bio = bioEl ? bioEl.value : '';
                    saveProfile(p2);
                    if (window.toast) window.toast('ذخیره شد ✓', 'success');
                    if (typeof window.renderPanelForPlanner === 'function') window.renderPanelForPlanner();
                };
            }
        }
    }, 30);
}
/* ═══════════════════════════════════════════════════════════════
   SETTINGS ACCORDION — باز/بسته کردن زیر‌دسته‌های ظاهر
   ═══════════════════════════════════════════════════════════════ */
window.toggleSettingsSub = function (sub) {
    var content = document.querySelector('.settings-content[data-cat="appearance"]');
    if (!content) return;
    var items = content.querySelectorAll('.settings-acc-item');
    var target = null;
    items.forEach(function (it) {
        if (it.getAttribute('data-sub') === sub) target = it;
    });
    if (!target) return;

    var wasActive = target.classList.contains('active');

    items.forEach(function (it) { it.classList.remove('active'); });

    if (!wasActive) {
        target.classList.add('active');
        window._settingsSub = sub;
    } else {
        window._settingsSub = '';
    }
};

/* ═══════════════════════════════════════════════════════════════
   CLICKABLE
   ═══════════════════════════════════════════════════════════════ */
function ensureClickable() {
    const s = document.getElementById('navSlider');
    if (s) { s.style.pointerEvents = 'none'; s.style.zIndex = '0'; }
    document.querySelectorAll('.bottom-nav-btn, .nav-collapse-tab').forEach(b => {
        b.style.pointerEvents = 'auto';
        b.style.position = 'relative';
        b.style.zIndex = '2';
    });
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            ensureClickable();
            if (typeof window.updateNavSlider === 'function') window.updateNavSlider(false);
            /* ★ بازمحاسبه پس‌زمینه برای رفع جابجایی */
            const root = document.documentElement;
            const cur = root.style.getPropertyValue('--siraj-bg');
            if (cur) {
                root.style.setProperty('--siraj-bg', '');
                void root.offsetWidth;
                root.style.setProperty('--siraj-bg', cur);
            }
        }, 100);
        if (settings.lockOnTabSwitch && settings.passwordEnabled && settings.password) {
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls = document.getElementById('lockScreen');
            if (ls) ls.classList.add('open');
        }
        if (settings.passwordEnabled && settings.password && sessionStorage.getItem(LOCK_SESSION_KEY) === '1') {
            pingMySession();
        }
    }
});
window.addEventListener('scroll', ensureClickable, { passive: true });
window.addEventListener('resize', () => { if (typeof window.updateNavSlider === 'function') window.updateNavSlider(false); });
window.addEventListener('beforeunload', () => { try { unregisterMySession(); } catch (e) {} });

/* ═══════════════════════════════════════════════════════════════
   DEV NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════ */
function loadDevNotifSeen() { try { return JSON.parse(localStorage.getItem(DEV_NOTIF_SEEN_KEY) || '[]'); } catch (e) { return []; } }
function saveDevNotifSeen(arr) { try { localStorage.setItem(DEV_NOTIF_SEEN_KEY, JSON.stringify(arr.slice(-200))); } catch (e) {} }
function loadDevNotifCache() { try { return JSON.parse(localStorage.getItem(DEV_NOTIF_CACHE_KEY) || '[]'); } catch (e) { return []; } }
function saveDevNotifCache(arr) { try { localStorage.setItem(DEV_NOTIF_CACHE_KEY, JSON.stringify(arr.slice(-50))); } catch (e) {} }

function getMyUserId() {
    var uid = localStorage.getItem('siraj_uid');
    if (!uid) {
        uid = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('siraj_uid', uid);
    }
    return uid;
}

async function fetchDevNotifications() {
    if (!APP_CONFIG.devNotifUrl || !APP_CONFIG.devNotifUrl.trim()) return;
    try {
        var url = APP_CONFIG.devNotifUrl.trim();
        var sep = url.indexOf('?') > -1 ? '&' : '?';
        var res = await fetch(url + sep + '_t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) return;
        var data = await res.json();
        if (!Array.isArray(data)) return;
        saveDevNotifCache(data);
        processDevNotifications(data);
    } catch (e) {
        try {
            var cached = loadDevNotifCache();
            if (cached.length) processDevNotifications(cached);
        } catch (err) {}
    }
}

function processDevNotifications(arr) {
    var seen = loadDevNotifSeen();
    var uid = getMyUserId();
    var now = Date.now();
    arr.forEach(function (n) {
        if (!n || !n.id) return;
        if (seen.indexOf(n.id) > -1) return;
        if (n.expiresAt && now > n.expiresAt) { seen.push(n.id); return; }
        if (n.targetUsers && Array.isArray(n.targetUsers) && n.targetUsers.length > 0) {
            if (n.targetUsers.indexOf(uid) < 0) return;
        }
        showDevNotification(n);
        seen.push(n.id);
    });
    saveDevNotifSeen(seen);
}

function showDevNotification(n) {
    var emoji = n.emoji || (n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : '❌');
    var title = n.title || 'اعلان از سراج';
    var body = n.body || '';
    if (typeof window.__pushDevNotificationToPanel === 'function') {
        try {
            window.__pushDevNotificationToPanel({ id: 'dev_' + n.id, type: 'dev', title: title, body: body, emoji: emoji, devType: n.type || 'info', ts: Date.now(), answered: true });
        } catch (e) {}
    }
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
        try {
            var sys = new Notification(emoji + ' ' + title, { body: body, icon: 'siraj-logo.png', tag: 'siraj_dev_' + n.id });
            sys.onclick = function () { window.focus(); sys.close(); };
        } catch (e) {}
    }
    showDevNotifPopup(emoji, title, body);
}

function showDevNotifPopup(emoji, title, body) {
    var old = document.getElementById('devNotifPopup');
    if (old) old.remove();
    var el = document.createElement('div');
    el.id = 'devNotifPopup';
    el.className = 'task-notif-popup';
    el.innerHTML =
        '<button class="task-notif-close" id="devNotifClose">✕</button>' +
        '<div class="task-notif-head"><div class="task-notif-icon">' + emoji + '</div><div class="task-notif-title">اعلان از سراج</div></div>' +
        '<div class="task-notif-task"><b>' + escapeHtml(title) + '</b></div>' +
        (body ? '<div style="font-size:12px;color:var(--text-muted);line-height:1.8;margin-bottom:12px">' + escapeHtml(body) + '</div>' : '') +
        '<div class="task-notif-actions"><button class="yes-btn" id="devNotifOk">متوجه شدم</button></div>';
        document.body.appendChild(el);
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            el.classList.add('show');
        });
    });
    var close = function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 550); };
    el.querySelector('#devNotifClose').onclick = close;
    el.querySelector('#devNotifOk').onclick = close;
    setTimeout(function () { if (el.parentNode && el.classList.contains('show')) close(); }, 20000);
}

window.__checkDevNotifsNow = function () {
    if (!APP_CONFIG.devNotifUrl || !APP_CONFIG.devNotifUrl.trim()) { toast('آدرس اعلان‌های سازنده تنظیم نشده', 'error'); return; }
    fetchDevNotifications().then(function () { toast('بررسی انجام شد ✓', 'success'); });
};

setTimeout(fetchDevNotifications, 8000);
setInterval(fetchDevNotifications, 5 * 60 * 1000);

/* ═══════════════════════════════════════════════════════════════
   PWA
   ═══════════════════════════════════════════════════════════════ */
window._deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    window._deferredInstallPrompt = e;
    setTimeout(showInstallButton, 5000);
});
function showInstallButton() {
    if (!window._deferredInstallPrompt) return;
    if (document.getElementById('pwaInstallBtn')) return;
    if (localStorage.getItem('siraj_install_dismissed') === '1') return;
    var btn = document.createElement('button');
    btn.id = 'pwaInstallBtn';
    btn.className = 'pwa-install-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3v13M7 12l5 5 5-5"/><path d="M5 21h14"/></svg>نصب اپلیکیشن سراج';
    btn.onclick = async function () {
        if (!window._deferredInstallPrompt) return;
        window._deferredInstallPrompt.prompt();
        var result = await window._deferredInstallPrompt.userChoice;
        if (result.outcome === 'accepted') { toast('سراج نصب شد! 🎉', 'success'); btn.remove(); }
        else { localStorage.setItem('siraj_install_dismissed', '1'); btn.remove(); }
        window._deferredInstallPrompt = null;
    };
    document.body.appendChild(btn);
    setTimeout(function () { if (btn.parentNode) btn.remove(); }, 30000);
}
window.addEventListener('appinstalled', function () {
    var b = document.getElementById('pwaInstallBtn');
    if (b) b.remove();
    toast('سراج با موفقیت نصب شد! 🎉', 'success');
});

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    var splashStart = Date.now();
    var splashMinTime = 1200;
    var tryHideSplash = function () {
        var elapsed = Date.now() - splashStart;
        var wait = Math.max(0, splashMinTime - elapsed);
        setTimeout(function () {
            var sl = document.getElementById('splashLoader');
            if (sl) sl.classList.add('hidden');
        }, wait);
    };
    tryHideSplash();

    try {
        const savedImg = localStorage.getItem(PROFILE_IMG_KEY);
        if (savedImg && !settings.profileImage) settings.profileImage = savedImg;
    } catch (e) {}

        if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js?v=2.5.1', { updateViaCache: 'none' }).then(function (reg) {
            /* ★ هر بار چک کنه نسخه جدید هست یا نه */
            reg.update().catch(function () {});
            /* ★ اگه نسخه جدید پیدا شد، کش قدیمی رو پاک کن */
            reg.addEventListener('updatefound', function () {
                var nw = reg.installing;
                if (!nw) return;
                nw.addEventListener('statechange', function () {
                    if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                        /* ★ SW جدید آماده — کش قدیمی پاک بشه */
                        if ('caches' in window) {
                            caches.keys().then(function (names) {
                                return Promise.all(names.map(function (n) {
                                    return caches.delete(n);
                                }));
                            });
                        }
                    }
                });
            });
        }).catch(function (err) { console.warn('[SW]', err); });
    }

    initNavState();
    applySettingsToUI();
    ensureCurrentFontLoaded();
    fetchPromptsFromGitHub();

    if (!currentChatId) createNewChat(true);
    toggleWelcome();
    renderPanelForChat();
    renderPlanner();
    renderBlog();
    renderCommunity();
    renderTools();
    ensureClickable();

    setTimeout(() => { if (typeof window.updateNavSlider === 'function') window.updateNavSlider(false); }, 700);

    cleanupSessions();
    checkLock();

    sessionPingInterval = setInterval(() => {
        if (settings.passwordEnabled && settings.password && sessionStorage.getItem(LOCK_SESSION_KEY) === '1') {
            pingMySession();
            cleanupSessions();
            if (settingsCat === 'privacy') renderSessionsList();
        }
    }, 30000);

    resetInactivityTimer();
});
window.syncLockTypedRow = syncLockTypedRow;
