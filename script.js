/* Siraj v2.0 — script.js (v40 Final) */

const APP_CONFIG={
    baseURL:"https://siraj-proxy.hamedansarifar.workers.dev/openai/chat/completions",
    defaultSettings:{
        themeMode:'dark',themeColor:'navy',bubbleShape:'modern',fontSize:'15px',
        animation:'normal',model:'gemini-3.6-flash',dialect:'fusha',
        thinking:false,quick:false,inputStyle:'solid',headerStyle:'glass',
        pattern:'boteh',patternPosition:'both',
        patternSize:180,patternOpacity:45,patternPerCorner:2,
        patternColor1:'#2AA5B8',patternColor2:'#F5A623',
        navStartCollapsed:false,navPosition:'bottom',navStyle:'default',
        navShadowLevel:40,bgImage:'',bgImageOpacity:100,bgPreset:'none',
        fontFamily:'vazirmatn',uiLang:'fa',
        password:'',passwordEnabled:false,
        autoLockMinutes:0,lockOnTabSwitch:false,
        profileImage:''
    },
    themeColors:['navy','crimson','gold','purple','emerald','indigo'],
    colorNames:{navy:'شبانه',crimson:'آتشین',gold:'زرین',purple:'جادویی',emerald:'طبیعی',indigo:'نیلی'},
    colorIcons:{
        navy:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
        crimson:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
        gold:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3"/>',
        purple:'<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/>',
        emerald:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>',
        indigo:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/><circle cx="19" cy="5" r="1" fill="currentColor"/>'
    },
    patterns:[
        {id:'flower',name:'گل'},{id:'star',name:'ستاره'},{id:'tazhib',name:'ترنج'},
        {id:'eslimi',name:'اسلیمی'},{id:'boteh',name:'بته جقه'},{id:'none',name:'بدون طرح'}
    ],
    inputStyles:[
        {id:'solid',name:'ساده',icon:'<rect x="3" y="8" width="18" height="8" rx="4"/>'},
        {id:'glass',name:'شیشه‌ای',icon:'<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M7 8v8M17 8v8" opacity=".5"/>'}
    ],
    headerStyles:[
        {id:'solid',name:'ساده',icon:'<rect x="2" y="6" width="20" height="12" rx="3"/>'},
        {id:'glass',name:'شیشه‌ای',icon:'<rect x="2" y="6" width="20" height="12" rx="3"/><path d="M6 6v12M18 6v12" opacity=".4"/>'}
    ],
    navPositions:[
        {id:'right',name:'راست',icon:'<rect x="17" y="3" width="4" height="18" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="3" width="12" height="18" rx="2"/>'},
        {id:'bottom',name:'پایین',icon:'<rect x="3" y="17" width="18" height="4" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="3" width="18" height="12" rx="2"/>'},
        {id:'top',name:'بالا',icon:'<rect x="3" y="3" width="18" height="4" rx="2" fill="currentColor" opacity=".7"/><rect x="3" y="9" width="18" height="12" rx="2"/>'},
        {id:'left',name:'چپ',icon:'<rect x="3" y="3" width="4" height="18" rx="2" fill="currentColor" opacity=".7"/><rect x="9" y="3" width="12" height="18" rx="2"/>'}
    ],
    navStyles:[
        {id:'default',name:'ساده',icon:'<rect x="3" y="8" width="18" height="8" rx="4"/>'},
        {id:'glass',name:'شیشه‌ای',icon:'<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M7 8v8M17 8v8" opacity=".5"/>'}
    ],
    bgPresets:[
        {id:'none',name:'پیش‌فرض',value:'',valueLight:''},
        {id:'aurora',name:'شفق',
            value:'linear-gradient(135deg,#0B0E14 0%,#1a1a2e 50%,#16213e 100%)',
            valueLight:'linear-gradient(135deg,#F0F4FB 0%,#D5E1F5 50%,#B8CCEF 100%)'},
        {id:'ocean',name:'اقیانوس',
            value:'linear-gradient(135deg,#0B0E14 0%,#0a1929 50%,#0c2d48 100%)',
            valueLight:'linear-gradient(135deg,#E5F4FC 0%,#B8DDF3 50%,#8CC9EC 100%)'},
        {id:'sunset',name:'غروب',
            value:'linear-gradient(135deg,#0B0E14 0%,#2a1810 50%,#1a0f1a 100%)',
            valueLight:'linear-gradient(135deg,#FFF0E0 0%,#FFD5B8 50%,#FFB8A8 100%)'},
        {id:'forest',name:'جنگل',
            value:'linear-gradient(135deg,#0B0E14 0%,#0a1f15 50%,#0c2d1f 100%)',
            valueLight:'linear-gradient(135deg,#E8F8EE 0%,#C2EBD0 50%,#98DCAE 100%)'},
        {id:'mesh',name:'شبکه',
            value:'radial-gradient(circle at 20% 20%,rgba(59,130,246,.25),transparent 45%),radial-gradient(circle at 80% 80%,rgba(245,166,35,.2),transparent 45%),#0B0E14',
            valueLight:'radial-gradient(circle at 20% 20%,rgba(59,130,246,.35),transparent 45%),radial-gradient(circle at 80% 80%,rgba(245,166,35,.35),transparent 45%),#F0F4FA'},
        {id:'dots',name:'نقطه‌ای',
            value:'radial-gradient(rgba(120,150,200,.18) 1px,transparent 1px) 0 0/20px 20px repeat #0B0E14',
            valueLight:'radial-gradient(rgba(70,100,150,.3) 1px,transparent 1px) 0 0/20px 20px repeat #F0F4FA'}
    ],
    fonts:{
        persian:[
            {id:'vazirmatn',name:'وزیرمتن'},{id:'estedad',name:'استعداد'},{id:'shabnam',name:'شبنم'},
            {id:'sahel',name:'ساحل'},{id:'lalezar',name:'لاله‌زار'},{id:'gulzar',name:'گلزار'},
            {id:'noto-sans-arabic',name:'نوتو سنس'}
        ],
        arabic:[
            {id:'amiri',name:'Amiri'},{id:'cairo',name:'Cairo'},{id:'noto-naskh',name:'Naskh'},
            {id:'noto-kufi',name:'Kufi'},{id:'tajawal',name:'Tajawal'},{id:'almarai',name:'Almarai'},
            {id:'scheherazade',name:'Scheherazade'},{id:'reem-kufi',name:'Reem Kufi'}
        ],
        english:[
            {id:'inter',name:'Inter'},{id:'poppins',name:'Poppins'},{id:'space-grotesk',name:'Space Grotesk'},
            {id:'manrope',name:'Manrope'},{id:'dm-sans',name:'DM Sans'},{id:'jetbrains',name:'JetBrains Mono'}
        ]
    },
    languages:[{id:'fa',name:'فارسی'},{id:'ar',name:'العربیة'},{id:'en',name:'English'}],
    animations:[{id:'smooth',name:'روان'},{id:'normal',name:'معمولی'},{id:'fast',name:'سریع'},{id:'off',name:'خاموش'}],
    bubbleShapes:[
        {id:'modern',name:'مدرن',icon:'<rect x="3" y="5" width="18" height="14" rx="6"/>'},
        {id:'cloud',name:'ابری',icon:'<path d="M17 18H7a4 4 0 0 1 0-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17 18z"/>'},
        {id:'leaf',name:'برگی',icon:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>'},
        {id:'diamond',name:'الماس',icon:'<path d="M12 2l10 10-10 10L2 12z"/>'},
        {id:'speech',name:'گفتار',icon:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'}
    ],
    dialects:[
        {id:'fusha',name:'فصیح',icon:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h8M9 11h5"/>'},
        {id:'iraqi',name:'عراقی',icon:'<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/><path d="M9 10v4M12 9v6"/>'},
        {id:'levantine',name:'شامی',icon:'<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/><path d="M12 7v3"/>'},
        {id:'egyptian',name:'مصری',icon:'<path d="M3 22h18M5 22V8l7-6 7 6v14M9 22V12h6v10"/><path d="M7 11h10"/>'},
        {id:'maghrebi',name:'مغربی',icon:'<path d="M3 21h18M5 21v-6M19 21v-6M7 15h10l-5-10z"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/>'}
    ]
};

const PATTERN_TEMPLATES={
    flower:(c1,c2)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><defs><linearGradient id='g1' x1='100%' y1='0%' x2='0%' y2='100%'><stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c1}' stop-opacity='0'/></linearGradient><linearGradient id='g2' x1='0%' y1='100%' x2='100%' y2='0%'><stop offset='0%' stop-color='${c2}'/><stop offset='100%' stop-color='${c2}' stop-opacity='0'/></linearGradient></defs><g fill='none' stroke='url(#g1)' stroke-width='1.5' stroke-linecap='round'><path d='M235 15 Q200 25 175 55 Q148 90 132 130'/><circle cx='130' cy='135' r='9'/><circle cx='130' cy='135' r='3.5'/></g><g fill='none' stroke='url(#g2)' stroke-width='1.5' stroke-linecap='round'><path d='M5 225 Q40 215 65 185 Q92 150 108 110'/><circle cx='110' cy='105' r='9'/><circle cx='110' cy='105' r='3.5'/></g></svg>`,
    star:(c1,c2)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.5'><rect x='55' y='55' width='130' height='130'/><rect x='55' y='55' width='130' height='130' transform='rotate(45 120 120)'/></g><g fill='none' stroke='${c2}' stroke-width='1.5'><circle cx='120' cy='120' r='100'/></g></svg>`,
    tazhib:(c1,c2)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g transform='translate(120 120)' fill='none' stroke='${c1}' stroke-width='1.5'><circle r='92'/><circle r='70'/><circle r='44'/></g><g transform='translate(120 120)' fill='none' stroke='${c2}' stroke-width='1.5'><circle r='80'/><circle r='58'/><circle r='32'/></g></svg>`,
    eslimi:(c1,c2)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.5' stroke-linecap='round'><path d='M10 10 Q60 40 80 90 Q95 130 60 170 Q30 200 60 230'/></g><g fill='none' stroke='${c2}' stroke-width='1.5' stroke-linecap='round'><path d='M230 230 Q180 200 160 150 Q145 110 180 70 Q210 40 180 10'/></g></svg>`,
    boteh:(c1,c2)=>`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><g fill='none' stroke='${c1}' stroke-width='1.5' stroke-linecap='round'><path d='M135 30 Q95 50 80 95 Q65 145 95 185 Q125 215 165 200 Q200 180 200 140 Q200 105 170 88 Q140 72 145 50 Q148 35 135 30 Z'/><circle cx='130' cy='120' r='10'/></g><g fill='none' stroke='${c2}' stroke-width='1.5' stroke-linecap='round'><path d='M105 30 Q145 50 160 95 Q175 145 145 185 Q115 215 75 200 Q40 180 40 140 Q40 105 70 88 Q100 72 95 50 Q92 35 105 30 Z'/><circle cx='110' cy='120' r='10'/></g></svg>`
};

const STORAGE_KEY='siraj-settings';
const HISTORY_KEY='siraj-history';
const PLANNER_KEY='siraj-planner';
const BLOG_KEY='siraj-blog';
const VIDEOS_KEY='siraj-videos';
const NAV_KEY='siraj-nav-collapsed';
const PIN_KEY='siraj-nav-pinned';
const LOCK_SESSION_KEY='siraj-unlocked-session';
const SESSIONS_KEY='siraj-active-sessions';
const SESSION_ID_KEY='siraj-session-id';
const PROFILE_IMG_KEY='siraj-profile-img';

const RateLimiter={queue:[],processing:false,minInterval:1500,lastRequest:0,
    async run(fn){return new Promise((res,rej)=>{this.queue.push({fn,res,rej});this.process();});},
    async process(){if(this.processing||!this.queue.length)return;this.processing=true;
        while(this.queue.length){const it=this.queue.shift();const w=Math.max(0,this.minInterval-(Date.now()-this.lastRequest));if(w>0)await new Promise(r=>setTimeout(r,w));this.lastRequest=Date.now();
            try{it.res(await it.fn());}catch(e){it.rej(e);}}
        this.processing=false;
    }
};

/* ★ plannerDate global */
window.plannerDate = new Date();

let settings=loadSettings();
let settingsDraft=null;
let settingsCat='appearance';
let currentChatId=null;
let currentFile=null;
let currentFileType=null;
let pendingRequests={};
let mediaRecorder=null;
let recordedChunks=[];
let isRecording=false;
let chatInFlight=false;
let currentView='chat';
let streamQueue='';
let streamWriting=false;
let streamTargetEl=null;
let streamFinished=false;
let streamResultFull='';
let previewRaf=null;
let activeChatId=null;
let isStreaming=false;
let isNavPinned=false;
let sessionPingInterval=null;
let inactivityTimer=null;
let plannerTab='daily';
let currentPanelTab='history';

function loadSettings(){try{const l=JSON.parse(localStorage.getItem(STORAGE_KEY))||{};const s=Object.assign({},APP_CONFIG.defaultSettings,l);
    const pi=localStorage.getItem(PROFILE_IMG_KEY);
    if(pi&&!s.profileImage)s.profileImage=pi;
    return s;}catch(e){return{...APP_CONFIG.defaultSettings};}}

const loadedFonts=new Set(['vazirmatn','estedad','inter']);
function loadFontIfNeeded(fontId){
    if(!fontId||loadedFonts.has(fontId))return;
    loadedFonts.add(fontId);
    const fontMap={
        'shabnam':'https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css',
        'sahel':'https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css',
        'lalezar':'https://fonts.googleapis.com/css2?family=Lalezar&display=swap',
        'gulzar':'https://fonts.googleapis.com/css2?family=Gulzar&display=swap',
        'noto-sans-arabic':'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@100..900&display=swap',
        'amiri':'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
        'cairo':'https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap',
        'noto-naskh':'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400..700&display=swap',
        'noto-kufi':'https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap',
        'tajawal':'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap',
        'almarai':'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap',
        'scheherazade':'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400..700&display=swap',
        'reem-kufi':'https://fonts.googleapis.com/css2?family=Reem+Kufi:wght@400..700&display=swap',
        'poppins':'https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap',
        'space-grotesk':'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
        'manrope':'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
        'dm-sans':'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&display=swap',
        'jetbrains':'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap'
    };
    const url=fontMap[fontId];
    if(!url)return;
    const link=document.createElement('link');
    link.rel='stylesheet';link.href=url;
    document.head.appendChild(link);
}
function ensureCurrentFontLoaded(){
    if(settings.fontFamily && settings.fontFamily!=='vazirmatn'){
        loadFontIfNeeded(settings.fontFamily);
    }
}

function saveSettings(){localStorage.setItem(STORAGE_KEY,JSON.stringify(settings));if(settings.profileImage!==undefined){try{localStorage.setItem(PROFILE_IMG_KEY,settings.profileImage||'');}catch(e){}}}
function loadHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');}catch{return{};}}
function saveHistory(h){localStorage.setItem(HISTORY_KEY,JSON.stringify(h));}
function loadPlanner(){try{return JSON.parse(localStorage.getItem(PLANNER_KEY)||'{}');}catch{return{};}}
function savePlanner(p){localStorage.setItem(PLANNER_KEY,JSON.stringify(p));}
function loadBlog(){try{return JSON.parse(localStorage.getItem(BLOG_KEY)||'[]');}catch{return[];}}
function saveBlog(b){localStorage.setItem(BLOG_KEY,JSON.stringify(b));}
function loadVideos(){try{return JSON.parse(localStorage.getItem(VIDEOS_KEY)||'[]');}catch{return[];}}
function saveVideos(v){localStorage.setItem(VIDEOS_KEY,JSON.stringify(v));}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);}
function formatMd(text){return escapeHtml(text).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}

const WEEK_NAMES=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنج‌شنبه','جمعه'];
function getDayName(d){return WEEK_NAMES[(d.getDay()+1)%7];}
function dateKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function getWeekStart(date){const d=new Date(date);d.setHours(0,0,0,0);const day=d.getDay();const diff=(day+1)%7;d.setDate(d.getDate()-diff);return d;}
function getWeekDays(){
    const days=[];
    const start=getWeekStart(window.plannerDate);
    for(let i=0;i<7;i++){
        const d=new Date(start);d.setDate(start.getDate()+i);
        days.push({key:dateKey(d),name:getDayName(d),date:d.toLocaleDateString('fa-IR',{month:'short',day:'numeric'}),dateObj:d});
    }
    return days;
}
function padHour(h){return String(h).padStart(2,'0');}
const HOURS_RANGE=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
function loadPlannerNew(){
    const raw=loadPlanner();
    if(!raw.days)raw.days={};
    if(!raw.months)raw.months={};
    return raw;
}
function getDayData(pl,key){
    if(!pl.days[key])pl.days[key]={hours:{},tasks:[]};
    if(!pl.days[key].hours)pl.days[key].hours={};
    if(!pl.days[key].tasks)pl.days[key].tasks=[];
    return pl.days[key];
}
function monthKeyOf(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}

function getMySessionId(){
    let id=sessionStorage.getItem(SESSION_ID_KEY);
    if(!id){id='s_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);sessionStorage.setItem(SESSION_ID_KEY,id);}
    return id;
}
function loadSessions(){try{return JSON.parse(localStorage.getItem(SESSIONS_KEY)||'{}');}catch{return{};}}
function saveSessions(s){localStorage.setItem(SESSIONS_KEY,JSON.stringify(s));}
function registerMySession(){
    const sessions=loadSessions();
    const id=getMySessionId();
    const now=Date.now();
    if(!sessions[id]){
        sessions[id]={id,ua:navigator.userAgent,platform:navigator.platform||'',lang:navigator.language||'',createdAt:now,lastPing:now};
    } else {
        sessions[id].lastPing=now;
    }
    saveSessions(sessions);
}
function pingMySession(){
    const id=getMySessionId();
    const sessions=loadSessions();
    if(!sessions[id]){
        if(settings.passwordEnabled&&settings.password){
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls=document.getElementById('lockScreen');
            if(ls)ls.classList.add('open');
        }
        return;
    }
    sessions[id].lastPing=Date.now();
    saveSessions(sessions);
}
function cleanupSessions(){
    const sessions=loadSessions();
    const now=Date.now();
    const STALE=90*1000;
    let changed=false;
    Object.keys(sessions).forEach(k=>{
        if(now-sessions[k].lastPing>STALE){delete sessions[k];changed=true;}
    });
    if(changed)saveSessions(sessions);
}
function removeSession(sid){
    const sessions=loadSessions();
    delete sessions[sid];
    saveSessions(sessions);
    if(sid===getMySessionId()){
        sessionStorage.removeItem(LOCK_SESSION_KEY);
        sessionStorage.removeItem(SESSION_ID_KEY);
        location.reload();
        return;
    }
    if(settingsCat==='privacy')renderSettingsControls();
    toast('دستگاه حذف شد ✓','success');
}
function logoutOtherSessions(){
    if(!confirm('همه دستگاه‌های دیگه از حساب خارج بشن؟'))return;
    const myId=getMySessionId();
    const sessions=loadSessions();
    const mySession=sessions[myId];
    const newSessions={};
    if(mySession)newSessions[myId]=mySession;
    saveSessions(newSessions);
    renderSettingsControls();
    toast('سایر دستگاه‌ها خارج شدند','success');
}
function getDeviceName(ua,platform){
    ua=ua||'';
    let browser='مرورگر';
    if(/OPR\//.test(ua))browser='Opera';
    else if(/Edg\//.test(ua))browser='Edge';
    else if(/Firefox\//.test(ua))browser='Firefox';
    else if(/Chrome\//.test(ua))browser='Chrome';
    else if(/Safari\//.test(ua))browser='Safari';
    let os='دستگاه';
    if(/Windows/.test(ua))os='ویندوز';
    else if(/Mac OS X/.test(ua))os='مک';
    else if(/Android/.test(ua))os='اندروید';
    else if(/iPhone|iPad|iPod/.test(ua))os='iOS';
    else if(/Linux/.test(ua))os='لینوکس';
    return `${browser} · ${os}`;
}
function timeAgo(ts){
    const d=Date.now()-ts;
    const s=Math.floor(d/1000);
    if(s<30)return 'همین الان';
    if(s<60)return s+' ثانیه پیش';
    const m=Math.floor(s/60);
    if(m<60)return m+' دقیقه پیش';
    const h=Math.floor(m/60);
    if(h<24)return h+' ساعت پیش';
    return Math.floor(h/24)+' روز پیش';
}

function resetInactivityTimer(){
    if(inactivityTimer)clearTimeout(inactivityTimer);
    const mins=parseInt(settings.autoLockMinutes)||0;
    if(mins>0&&settings.passwordEnabled&&settings.password&&sessionStorage.getItem(LOCK_SESSION_KEY)==='1'){
        inactivityTimer=setTimeout(()=>{
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls=document.getElementById('lockScreen');
            if(ls)ls.classList.add('open');
            const hb=document.getElementById('headerLockBtn');
            if(hb)hb.classList.add('locked');
        },mins*60*1000);
    }
}
['mousemove','keydown','click','scroll','touchstart'].forEach(ev=>{
    document.addEventListener(ev,resetInactivityTimer,{passive:true});
});

function toast(msg,type){
    const c=document.getElementById('toastContainer');
    const el=document.createElement('div');
    el.className='toast '+(type||'info');
    const icon=type==='error'?'<path d="M12 9v4M12 17h.01"/><circle cx="12" cy="12" r="10"/>':type==='success'?'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>':'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>';
    el.innerHTML=`<svg viewBox="0 0 24 24">${icon}</svg><span>${escapeHtml(msg)}</span>`;
    c.appendChild(el);
    setTimeout(()=>{el.classList.add('leaving');setTimeout(()=>el.remove(),380);},3800);
}

function computeNavShadow(level){
    const l=Math.max(0,Math.min(100,level))/100;
    if(l===0)return 'none';
    return `0 ${10+l*12}px ${24+l*36}px ${-8+l*-4}px rgba(0,0,0,${0.4+l*0.4}), 0 0 ${l*40}px ${l*-10}px var(--accent)`;
}

function applyPattern(layer,patternId,c1,c2,perCorner,size,position,opacity){
    if(!layer)return;
    layer.innerHTML='';
    layer.style.opacity=opacity/100;
    if(patternId==='none')return;
    const tpl=PATTERN_TEMPLATES[patternId];
    if(!tpl)return;
    const url=`url("data:image/svg+xml,${encodeURIComponent(tpl(c1,c2))}")`;
    const corners=position==='tr'?['tr']:position==='bl'?['bl']:position==='reverse'?['tl','br']:['tr','bl'];
    const N=Math.max(1,Math.min(8,perCorner));
    const gap=10;
    const step=size*0.42;
    corners.forEach(corner=>{
        for(let i=0;i<N;i++){
            const d=document.createElement('div');
            d.style.position='absolute';
            d.style.width=size+'px';
            d.style.height=size+'px';
            d.style.backgroundImage=url;
            d.style.backgroundRepeat='no-repeat';
            d.style.backgroundSize='contain';
            d.style.backgroundPosition='center';
            d.style.pointerEvents='none';
            const off=gap+i*step;
            if(corner==='tr'){d.style.right=off+'px';d.style.top=off+'px';}
            else if(corner==='tl'){d.style.left=off+'px';d.style.top=off+'px';}
            else if(corner==='bl'){d.style.left=off+'px';d.style.bottom=off+'px';}
            else{d.style.right=off+'px';d.style.bottom=off+'px';}
            layer.appendChild(d);
        }
    });
}

function getBgValue(t){
    if(!t)return 'none';
    if(t.bgImage) return `url("${t.bgImage}")`;
    if(t.bgPreset && t.bgPreset!=='none'){
        const preset=APP_CONFIG.bgPresets.find(p=>p.id===t.bgPreset);
        if(preset){
            const isLight=t.themeMode==='light';
            const v=isLight ? preset.valueLight : preset.value;
            if(v)return v;
        }
    }
    return 'none';
}

function applyBodyBackground(t){
    const body=document.body;
    const v=getBgValue(t);
    if(v==='none'){
        body.style.background='';
        body.style.backgroundImage='';
        body.style.backgroundSize='';
        body.style.backgroundPosition='';
        body.style.backgroundAttachment='';
        body.style.backgroundRepeat='';
        body.style.backgroundColor='';
        body.style.backgroundImage='var(--primary-gradient)';
    } else {
        body.style.background=v;
        body.style.backgroundAttachment='fixed';
        body.style.backgroundPosition='center';
        if(t.bgImage){
            body.style.backgroundSize='cover';
            body.style.backgroundRepeat='no-repeat';
        } else if(t.bgPreset==='dots'){
            body.style.backgroundSize='20px 20px';
            body.style.backgroundRepeat='repeat';
        } else {
            body.style.backgroundSize='cover';
            body.style.backgroundRepeat='no-repeat';
        }
    }
}

function applySettingsToUI(s){
    const t=s||settings;
    loadFontIfNeeded(t.fontFamily||'vazirmatn');
    document.documentElement.setAttribute('data-theme',`${t.themeMode}-${t.themeColor}`);
    document.documentElement.setAttribute('data-bubble-shape',t.bubbleShape);
    document.documentElement.setAttribute('data-anim',t.animation||'normal');
    document.documentElement.setAttribute('data-pattern',t.pattern||'boteh');
    document.documentElement.setAttribute('data-input-style',t.inputStyle||'solid');
    document.documentElement.setAttribute('data-header-style',t.headerStyle||'glass');
    document.documentElement.setAttribute('data-font',t.fontFamily||'vazirmatn');
    document.documentElement.setAttribute('data-lang',t.uiLang||'fa');
    document.documentElement.setAttribute('data-nav-position',t.navPosition||'bottom');
    document.documentElement.setAttribute('data-nav-style',t.navStyle||'default');
    document.documentElement.style.setProperty('--font-size-base',t.fontSize);
    document.documentElement.style.setProperty('--nav-shadow',computeNavShadow(t.navShadowLevel||0));
    applyBodyBackground(t);
    renderDropdown('dialectDD',APP_CONFIG.dialects,t.dialect,'dialect');
    const tb=document.getElementById('thinkBtn');if(tb)tb.classList.toggle('active',t.thinking);
    const qb=document.getElementById('quickBtn');if(qb)qb.classList.toggle('active',t.quick);
    applyPattern(document.getElementById('patternLayer'),t.pattern,t.patternColor1,t.patternColor2,t.patternPerCorner,t.patternSize,t.patternPosition,t.patternOpacity);
    resetInactivityTimer();
    setTimeout(()=>{if(typeof window.updateNavSlider==='function')window.updateNavSlider(false);},100);
}

function renderDropdown(id,items,value,key){
    const el=document.getElementById(id);if(!el)return;
    const cur=items.find(i=>i.id===value)||items[0];
    el.innerHTML=`
        <div class="dd-trigger" onclick="toggleDropdown('${id}', event)">
            ${cur.icon?`<svg class="dd-icon" viewBox="0 0 24 24">${cur.icon}</svg>`:''}
            <span>${escapeHtml(cur.name)}</span>
            <span class="dd-arrow"></span>
        </div>
        <div class="dd-panel">
            ${items.map(it=>`<div class="dd-item${it.id===value?' active':''}" onclick="selectDropdown('${id}','${it.id}','${key}', event)">${it.icon?`<svg class="dd-item-icon" viewBox="0 0 24 24">${it.icon}</svg>`:''}<span>${escapeHtml(it.name)}</span></div>`).join('')}
        </div>`;
}
function toggleDropdown(id,e){e.stopPropagation();const el=document.getElementById(id);const wasOpen=el.classList.contains('open');document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));if(!wasOpen)el.classList.add('open');}
function selectDropdown(id,value,key,e){e.stopPropagation();settings[key]=value;saveSettings();applySettingsToUI();document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));renderDropdown(id,APP_CONFIG.dialects,value,key);}

document.addEventListener('click',e=>{
    if(!e.target.closest('.dropdown'))document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
    if(!e.target.closest('.msg-wrap.me'))document.querySelectorAll('.msg-wrap.me.selected').forEach(w=>w.classList.remove('selected'));
});

function togglePanel(){document.getElementById('sidePanel').classList.toggle('minimized');}

function toggleNavCollapse(){
    const row=document.getElementById('navRow');
    const isCollapsed=row.classList.contains('collapsed');
    if(isNavPinned){
        isNavPinned=false;
        row.classList.remove('pinned');
        row.classList.add('collapsed');
        localStorage.setItem(PIN_KEY,'0');
        localStorage.setItem(NAV_KEY,'1');
    } else if(isCollapsed){
        isNavPinned=true;
        row.classList.remove('collapsed');
        row.classList.add('pinned');
        localStorage.setItem(PIN_KEY,'1');
        localStorage.setItem(NAV_KEY,'0');
    } else {
        isNavPinned=true;
        row.classList.add('pinned');
        localStorage.setItem(PIN_KEY,'1');
        localStorage.setItem(NAV_KEY,'0');
    }
    const btn=document.querySelector('.nav-collapse-tab');
    if(btn){btn.classList.add('pop');setTimeout(()=>btn.classList.remove('pop'),600);}
    setTimeout(()=>{if(typeof window.updateNavSlider==='function')window.updateNavSlider(true);},500);
}
function initNavState(){
    if(localStorage.getItem(NAV_KEY)==='1')document.getElementById('navRow').classList.add('collapsed');
    if(localStorage.getItem(PIN_KEY)==='1'){isNavPinned=true;document.getElementById('navRow').classList.remove('collapsed');document.getElementById('navRow').classList.add('pinned');}
}

/* fallback — planner-v2.js override می‌کنه */
function updateNavSlider(animate){
    const slider=document.getElementById('navSlider');
    const active=document.querySelector('.bottom-nav-btn.active');
    if(!slider||!active)return;
    if(active.classList.contains('nav-btn-chat')){slider.style.opacity='0';return;}
    const nav=document.getElementById('bottomNav');
    const navRect=nav.getBoundingClientRect();
    const btnRect=active.getBoundingClientRect();
    const pos=document.documentElement.getAttribute('data-nav-position')||'bottom';
    const isVertical=pos==='left'||pos==='right';
    if(animate===false){slider.style.transition='none';}
    if(isVertical){
        slider.style.left='6px';slider.style.width='calc(100% - 12px)';
        slider.style.top=(btnRect.top-navRect.top)+'px';slider.style.height=btnRect.height+'px';
    } else {
        slider.style.left=(btnRect.left-navRect.left)+'px';slider.style.width=btnRect.width+'px';
        slider.style.top=(btnRect.top-navRect.top)+'px';slider.style.height=btnRect.height+'px';
    }
    slider.style.opacity='1';
    if(animate===false){void slider.offsetWidth;slider.style.transition='';}
}

function switchView(view){
    currentView=view;
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+view).classList.add('active');
    document.querySelectorAll('.bottom-nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    const btn=document.querySelector(`.bottom-nav-btn[data-view="${view}"]`);
    if(btn){btn.classList.add('pop');setTimeout(()=>btn.classList.remove('pop'),450);}
    if(view==='chat')renderPanelForChat();
    else if(view==='planner')renderPanelForPlanner();
    else if(view==='blog')renderPanelForBlog();
    else if(view==='videos')renderPanelForVideos();
    else if(view==='tools')renderPanelForTools();
    if(view==='planner')renderPlanner();
    if(view==='blog')renderBlog();
    if(view==='videos')renderCommunity();
    if(view==='tools')renderTools();
    if(view==='chat'){const box=document.getElementById('box');box.scrollTop=box.scrollHeight;toggleWelcome();}
    requestAnimationFrame(()=>setTimeout(()=>{if(typeof window.updateNavSlider==='function')window.updateNavSlider(true);},10));
}

function toggleWelcome(){
    const w=document.getElementById('welcomeScreen');if(!w)return;
    const box=document.getElementById('box');if(!box)return;
    const hasMessages=box.querySelector('.msg-wrap')!==null;
    w.classList.toggle('hidden',hasMessages);
}

function renderPanelForChat(){
    document.getElementById('panelTitleText').textContent='مشکات';
    document.getElementById('panelSubText').textContent='همراه یادگیری روزانه';
    document.getElementById('panelContent').innerHTML=`
        <div class="panel-tabs">
            <button class="panel-tab${currentPanelTab==='history'?' active':''}" data-tab="history" onclick="switchPanelTab('history')">
                <svg class="tab-icon" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
                <span class="tab-label">تاریخچه</span>
            </button>
            <button class="panel-tab${currentPanelTab==='daily'?' active':''}" data-tab="daily" onclick="switchPanelTab('daily')">
                <svg class="tab-icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>
                <span class="tab-label">برنامه امروز</span>
            </button>
        </div>
        <div class="panel-pane${currentPanelTab==='daily'?' active':''}" data-pane="daily">${renderDailyPanel()}</div>
        <div class="panel-pane${currentPanelTab==='history'?' active':''}" data-pane="history">
            <div class="panel-card"><div class="card-title"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9"/></svg><span>گفتگوهای قبلی</span></div><div id="historyList"></div></div>
            <button class="row-btn active" onclick="newChat()" style="flex-direction:row;min-height:44px"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span class="rb-label">گفتگوی تازه</span></button>
        </div>`;
    renderHistory();
}
function switchPanelTab(tab){
    currentPanelTab=tab;
    document.querySelectorAll('.panel-tab').forEach(b=>b.classList.toggle('active',(b.getAttribute('onclick')||'').includes(`'${tab}'`)));
    document.querySelectorAll('.panel-pane').forEach(p=>p.classList.toggle('active',p.dataset.pane===tab));
    if(tab==='history')renderHistory();
}
function renderDailyPanel(){
    const pl=loadPlannerNew();
    const todayKey=dateKey(new Date());
    const dd=getDayData(pl,todayKey);
    const hours=dd.hours||{};
    const hourEntries=Object.entries(hours).filter(([k,v])=>v&&v.trim()).sort((a,b)=>a[0].localeCompare(b[0]));
    if(hourEntries.length===0){
        return `<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">
            <div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg><span>برنامه امروز</span></div>
            <div class="list-item" onclick="switchView('planner')"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div><div class="li-body"><div class="li-title">هنوز برنامه‌ای نداری</div><div class="li-desc">برای امروز برنامه بساز</div></div></div>
        </div>
        <div class="panel-card"><div class="card-title"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/></svg><span>برنامه با سراج</span></div>
            <div class="list-item" onclick="askAIToPlan()"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div><div class="li-body"><div class="li-title">برنامه‌ریزی خودکار</div><div class="li-desc">از AI برنامه بگیر</div></div></div>
        </div>`;
    }
    return `
        <div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">
            <div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg><span>برنامه امروز</span></div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-align:center">${hourEntries.length} کار ثبت شده</div>
            ${hourEntries.slice(0,6).map(([h,v])=>`<div class="list-item" onclick="switchView('planner')"><div class="li-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="li-body"><div class="li-title">${h}:۰۰ — ${escapeHtml(v.slice(0,40))}</div></div></div>`).join('')}
            <div class="list-item" onclick="switchView('planner')" style="margin-top:8px"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div><div class="li-body"><div class="li-title">مشاهده کامل</div></div></div>
        </div>
        <div class="panel-card"><div class="card-title"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/></svg><span>برنامه با سراج</span></div>
            <div class="list-item" onclick="askAIToPlan()"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></div><div class="li-body"><div class="li-title">برنامه‌ریزی خودکار</div><div class="li-desc">از AI برنامه بگیر</div></div></div>
        </div>`;
}
/* fallback — planner-v2.js override می‌کنه */
function renderPanelForPlanner(){
    document.getElementById('panelTitleText').textContent='برنامه‌ریزی';
    document.getElementById('panelSubText').textContent='خلاصه هفته';
    document.getElementById('panelContent').innerHTML='';
}
function renderPanelForBlog(){
    document.getElementById('panelTitleText').textContent='مقالات سراج';
    document.getElementById('panelSubText').textContent='یادداشت‌ها و مقالات';
    const posts=loadBlog();
    const words=posts.reduce((s,p)=>s+(p.body||'').split(/\s+/).length,0);
    document.getElementById('panelContent').innerHTML=`
        <div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">
            <div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></svg><span>آمار</span></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:center;padding:8px 0">
                <div><div style="font-size:22px;font-weight:900;color:var(--accent)">${posts.length}</div><div style="font-size:10px;color:var(--text-muted)">مقاله</div></div>
                <div><div style="font-size:22px;font-weight:900;color:var(--accent)">${words}</div><div style="font-size:10px;color:var(--text-muted)">کلمه</div></div>
            </div>
        </div>`;
}
function renderPanelForVideos(){
    document.getElementById('panelTitleText').textContent='انجمن سراج';
    document.getElementById('panelSubText').textContent='ارتباط با مدرسین و کاربران';
    document.getElementById('panelContent').innerHTML=`
        <div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">
            <div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>انجمن</span></div>
            <div class="empty-state" style="padding:16px"><span class="emoji">🚧</span>به‌زودی</div>
        </div>`;
}
function renderPanelForTools(){
    document.getElementById('panelTitleText').textContent='دستیار';
    document.getElementById('panelSubText').textContent='دسترسی سریع';
    document.getElementById('panelContent').innerHTML=`
        <div class="panel-card">
            <div class="card-title"><svg viewBox="0 0 24 24"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/></svg><span>همه دستیارها</span></div>
            <div class="list-item" onclick="switchView('tools')"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div><div class="li-body"><div class="li-title">مشاهده همه</div></div></div>
        </div>`;
}

/* fallback — planner-v2.js override می‌کنه */
function renderPlanner(){
    const view=document.getElementById('view-planner');
    if(!view) return;
    view.innerHTML='<main class="planner-pane" id="plannerPane" style="width:100%"></main>';
    if(typeof window.renderPlannerPane==='function') window.renderPlannerPane();
}

/* fallback — planner-v2.js override می‌کنه */
function renderPlannerPane(){
    const pane=document.getElementById('plannerPane');
    if(!pane) return;
    pane.innerHTML='<div style="padding:30px;text-align:center;color:var(--text-muted)">در حال بارگذاری...</div>';
}

/* fallback — planner-v2.js override می‌کنه */
function switchPlannerTab(tab){
    plannerTab=tab;
    if(typeof window.switchPlannerTab==='function' && window.switchPlannerTab!==switchPlannerTab){
        window.switchPlannerTab(tab);
        return;
    }
}

/* fallback — planner-v2.js override می‌کنه */
function renderBlog(){
    const v=document.getElementById('view-blog');
    if(!v) return;
    if(v.querySelector('.blog-v2-hero')) return;
    v.innerHTML='<div class="page-title-bar"><div class="page-title-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg></div><div class="page-title-text">مقالات سراج</div></div>';
}
function addBlogPost(){const t=document.getElementById('blogTitle')?.value.trim();const b=document.getElementById('blogBody')?.value.trim();if(!t||!b){toast('عنوان و متن لازمه','error');return;}const p=loadBlog();p.unshift({title:t,body:b,ts:Date.now()});saveBlog(p);renderBlog();renderPanelForBlog();toast('مقاله منتشر شد','success');}
function deleteBlogPost(i){const p=loadBlog();p.splice(i,1);saveBlog(p);renderBlog();renderPanelForBlog();}

/* fallback — planner-v2.js override می‌کنه */
function renderCommunity(){
    const v=document.getElementById('view-videos');
    if(!v) return;
    if(v.querySelector('.community-v2-hero')) return;
    v.innerHTML='<div class="page-title-bar"><div class="page-title-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="page-title-text">انجمن سراج</div></div>';
}

function renderTools(){
    const v=document.getElementById('view-tools');
    const tools=[
        {icon:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',title:'اعراب',desc:'تجزیه و ترکیب',prompt:'این جمله رو اعراب کن: «جمله»'},
        {icon:'<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>',title:'تحلیل بیت',desc:'ادبی و بلاغی',prompt:'این بیت رو تحلیل کن: «بیت»'},
        {icon:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',title:'تفاوت دو واژه',desc:'مقایسه',prompt:'تفاوت این دو واژه چیه؟'},
        {icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',title:'تمرین ساز',desc:'آزمون شخصی',prompt:'یه تمرین درباره عربی بساز'},
        {icon:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',title:'قواعد سریع',desc:'نکات دستوری',prompt:'یه نکته کاربردی نحو یادم بده'},
        {icon:'<path d="m5 8 6 6m-7 0 6-6 2-3M2 5h12"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M21 5v14"/>',title:'ترجمه و شرح',desc:'عربی به فارسی',prompt:'این متن رو ترجمه کن: «متن»'},
        {icon:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',title:'واژه تصادفی',desc:'کلمه یاد بگیر',prompt:'یه واژه جدید عربی با ریشه یادم بده'},
        {icon:'<path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/>',title:'برنامه درسی',desc:'اینجا کلیک کن',prompt:'یه برنامه درسی برای امروز بچین'}
    ];
    v.innerHTML=`
        <div class="page-title-bar"><div class="page-title-text">دستیارهای سراج</div></div>
        <div class="tools-grid">
            ${tools.map((t,i)=>`<div class="tool-card" onclick="runTool(${i})"><div class="tool-card-icon"><svg viewBox="0 0 24 24">${t.icon}</svg></div><div class="tool-card-title">${t.title}</div><div class="tool-card-desc">${t.desc}</div></div>`).join('')}
        </div>`;
    window._tools=tools;
}
function runTool(i){
    const t=window._tools?.[i];if(!t)return;
    switchView('chat');
    document.getElementById('q').value=t.prompt;
    document.getElementById('q').focus();
    handleInput();
}

function createNewChat(silent){
    currentChatId='chat_'+Date.now()+'_'+Math.random().toString(36).substr(2,5);
    const h=loadHistory();
    h[currentChatId]={id:currentChatId,title:'گفتگوی تازه',createdAt:Date.now(),updatedAt:Date.now(),messages:[]};
    saveHistory(h);renderHistory();
    if(!silent)document.getElementById('box').innerHTML='';
    toggleWelcome();
}
function addMsgToHistory(chatId,role,content,fileData,fileType,thinkText){
    const h=loadHistory();if(!h[chatId])return;
    h[chatId].messages.push({role,content,fileData,fileType,thinkText,ts:Date.now()});
    h[chatId].updatedAt=Date.now();
    if(role==='user'&&(h[chatId].title==='گفتگوی تازه'||h[chatId].title==='تازه'))h[chatId].title=(content||'').substring(0,40)||'گفتگو';
    saveHistory(h);renderHistory();
}
function renderHistory(){
    const list=document.getElementById('historyList');if(!list)return;
    const all=loadHistory();
    const items=Object.values(all).filter(c=>c.messages&&c.messages.length>0).sort((a,b)=>b.updatedAt-a.updatedAt);
    if(!items.length){list.innerHTML=`<div class="empty-state" style="padding:14px"><span class="emoji">🕰️</span>هنوز گفتگویی نداری</div>`;return;}
    list.innerHTML=items.map(c=>{
        const last=c.messages[c.messages.length-1];
        const preview=last?(last.role==='user'?'تو: ':'سراج: ')+String(last.content||'').substring(0,50):'';
        return `<div class="history-item${c.id===currentChatId?' active':''}" onclick="loadChat('${c.id}')"><span class="h-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><div class="h-info"><div class="h-title" id="htitle-${c.id}">${escapeHtml(c.title)}</div><div class="h-preview">${escapeHtml(preview)}</div><div class="h-time">${formatTime(c.updatedAt)} · ${c.messages.length} پیام</div></div><button class="h-edit" onclick="event.stopPropagation();renameChat('${c.id}')" title="تغییر نام"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="h-del" onclick="event.stopPropagation();deleteChat('${c.id}')"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button></div>`;
    }).join('');
}
function renameChat(id){
    const h=loadHistory();if(!h[id])return;
    const el=document.getElementById('htitle-'+id);if(!el)return;
    const current=h[id].title;
    el.outerHTML=`<input type="text" class="h-title-input" id="htitle-${id}" value="${escapeHtml(current)}" onclick="event.stopPropagation()" onkeydown="if(event.key==='Enter'){saveRename('${id}',this.value)}else if(event.key==='Escape'){renderHistory()}" onblur="saveRename('${id}',this.value)">`;
    const inp=document.getElementById('htitle-'+id);if(inp){inp.focus();inp.select();}
}
function saveRename(id,newTitle){const h=loadHistory();if(!h[id])return;const t=(newTitle||'').trim()||'گفتگو';h[id].title=t;saveHistory(h);renderHistory();}
function formatTime(ts){const d=Date.now()-ts,m=Math.floor(d/60000);if(m<1)return'الان';if(m<60)return m+' د';const hr=Math.floor(m/60);if(hr<24)return hr+' س';const day=Math.floor(hr/24);if(day<7)return day+' روز';return new Date(ts).toLocaleDateString('fa-IR');}

/* ★ loadChat با انیمیشن نرم + گارد رقابتی */
function loadChat(id){
    const c = loadHistory()[id];
    if(!c) return;
    currentChatId = id;
    const box = document.getElementById('box');
    const myToken = id;

    box.style.transition = 'opacity .18s cubic-bezier(.22,1,.36,1), transform .22s cubic-bezier(.22,1,.36,1)';
    box.style.opacity = '0';
    box.style.transform = 'translateY(-10px)';

    setTimeout(function(){
        if(currentChatId !== myToken) return;

        box.innerHTML = '';
        c.messages.forEach(function(m){
            if(m.role === 'user') renderUserMsg(m.content, m.fileData, m.fileType, true);
            else renderBotMsg(m.content, true);
        });

        box.style.transition = 'none';
        box.style.transform = 'translateY(14px)';
        box.style.opacity = '0';
        box.scrollTop = box.scrollHeight;

        void box.offsetWidth;
        box.style.transition = 'opacity .35s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.34,1.4,.64,1)';
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';

        setTimeout(function(){
            box.style.transition = '';
            box.style.opacity = '';
            box.style.transform = '';
        }, 500);
    }, 200);

    renderHistory();
    switchView('chat');
    toggleWelcome();
}
function deleteChat(id){if(pendingRequests[id]){pendingRequests[id].abort();delete pendingRequests[id];}const h=loadHistory();delete h[id];saveHistory(h);if(currentChatId===id){currentChatId=null;createNewChat();}renderHistory();}
function newChat(){createNewChat();}

function renderUserMsg(text,fileData,fileType,noAnim){
    const box=document.getElementById('box');
    const wrap=document.createElement('div');wrap.className='msg-wrap me';
    if(noAnim)wrap.classList.add('no-anim');
    const msg=document.createElement('div');msg.className='msg';
    let html=`<div>${escapeHtml(text)}</div>`;
    if(fileData&&fileType==='image')html+=`<img src="${fileData}">`;
    else if(fileData&&fileType==='audio')html+=`<div class="audio-preview">🎤 پیام صوتی</div>`;
    else if(fileData)html+=`<div class="audio-preview">📎 فایل</div>`;
    msg.innerHTML=html;wrap.appendChild(msg);
    const acts=document.createElement('div');acts.className='msg-actions';
    acts.innerHTML=`<button class="msg-act" onclick="editMsg(event,this)" title="ویرایش"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="msg-act" onclick="retryMsg(event,this)" title="تلاش دوباره"><svg viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></button><button class="msg-act del" onclick="deleteMsg(event,this)" title="حذف"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>`;
    wrap.appendChild(acts);
    msg.addEventListener('click',e=>{e.stopPropagation();const was=wrap.classList.contains('selected');document.querySelectorAll('.msg-wrap.selected').forEach(w=>w.classList.remove('selected'));if(!was)wrap.classList.add('selected');});
    box.appendChild(wrap);box.scrollTop=box.scrollHeight;
}
function renderBotMsg(text,noAnim){const box=document.getElementById('box');const wrap=document.createElement('div');wrap.className='msg-wrap bot';if(noAnim)wrap.classList.add('no-anim');const msg=document.createElement('div');msg.className='msg';msg.innerHTML=formatMd(text);wrap.appendChild(msg);box.appendChild(wrap);box.scrollTop=box.scrollHeight;}
function addBotMsg(text){if(!currentChatId)createNewChat(true);renderBotMsg(text);addMsgToHistory(currentChatId,'assistant',text);}
function editMsg(e,btn){e.stopPropagation();const w=btn.closest('.msg-wrap');const t=w.querySelector('.msg').textContent;document.getElementById('q').value=t;document.getElementById('q').focus();handleInput();w.classList.remove('selected');}
function retryMsg(e,btn){e.stopPropagation();const w=btn.closest('.msg-wrap');const t=w.querySelector('.msg').textContent;document.getElementById('q').value=t;handleInput();w.classList.remove('selected');send();}
function deleteMsg(e,btn){e.stopPropagation();const w=btn.closest('.msg-wrap');const all=Array.from(document.querySelectorAll('#box .msg-wrap'));const i=all.indexOf(w);if(i>=0&&currentChatId){const h=loadHistory();if(h[currentChatId]?.messages[i]){h[currentChatId].messages.splice(i,1);saveHistory(h);renderHistory();}}w.remove();toggleWelcome();}

function getSystemPrompt(){
    const dm={fusha:'العربية الفصحى',iraqi:'اللهجة العراقية',levantine:'اللهجة الشامية',egyptian:'اللهجة المصرية',maghrebi:'اللهجة المغربية'};
    const dialect=dm[settings.dialect]||'العربية الفصحى';
    let extra='';
    try{
        var prof = JSON.parse(localStorage.getItem('siraj-profile')||'{}');
        if(prof.name) extra += '\n\n👤 اسم کاربر: ' + prof.name;
        if(prof.bio) extra += '\n📝 درباره‌ی خودش: ' + prof.bio + '\nاسمش رو تو جواب‌هات صدا بزن.';
    }catch(e){}
    if(settings.quick)extra+='\n\n⚡ حالت پاسخ سریع: پاسخ‌ها را کوتاه، مختصر و مستقیم بده.';
    if(settings.thinking)extra+='\n\n🧠 حالت تفکر عمیق: با دقت و عمق بیشتر تحلیل کن.';
    return `شما «سراج» هستید — دستیار هوشمند، خوش‌برخورد و صمیمی زبان و ادبیات عربی.

🎯 تخصص: نحو، صرف، بلاغت، ترجمه، اعراب، تحلیل بیت، متون دینی به عربی، برنامه‌ریزی درسی، مشاوره تحصیلی، انگیزه‌دهی، ساخت تمرین و آزمون.

👤 شناسنامه:
• نام: سراج (به معنی چراغ و فروغ)
• سازنده: حامد انصاری‌فر، اهل اراک، ۲۰ ساله، دانشجوی زبان و ادبیات عربی دانشگاه قم، ادیتور و مجسمه‌ساز سابق، علاقه‌مند به هوش مصنوعی و یادگیری

🎭 لحن: صمیمی، دوستانه، مثل یه رفیق باسواد. از تکرار یه جواب ثابت خودداری کن — هر بار با تعبیر تازه جواب بده.

🎨 ایموجی: اولویت با ایموجی‌های شکلک چهره (😊 🙂 😄 😁 🤗 😌 🤔 😅 😉 😎 🥰 😍 🤩 😇 🙃 😋 🤓 🧐 😂 🤣 😆 😃 😀) — بعد ایموجی‌های موضوعی (📖 ✨ 🌿 💫 🎯 🔍 💡 🌸 🪔 ⭐ 📚 ✏️ 🎓 🕌 🌙 💭 🧠 ⚡ 🔥 💎 🌊 🎨 🎭 🌺 🌷 🍃 🌱 🕊️ 🦋 🎁 🎉 💐 🌈 ☀️). به‌جا و متعادل.

🚧 سؤالات خارج از دامنه: هر بار با جمله‌ی متفاوت جواب بده، نه کلیشه‌ای.
⚠️ مهم: هرگز از ستاره (*) برای پررنگ‌کردن کلمات استفاده نکن.

📏 طول پاسخ: پیش‌فرض متوسط. «مختصر» → کوتاه. «کامل» → مفصل.

📅 برنامه درسی: [PLAN]- ساعت | عنوان کار[/PLAN]

🗣️ زبان پاسخ: فارسی روان. لهجه شواهد: ${dialect}${extra}`;
}

function buildMessagesForWorker(chatId,currentText,currentFileData,currentFileType){
    const history=loadHistory()[chatId];
    const messages=[{role:'system',content:getSystemPrompt()}];
    const msgs=(history?.messages||[]).slice(0,-1);
    const recent=msgs.slice(-12);
    for(const m of recent){
        if(m.role==='user')messages.push({role:'user',content:[{type:'text',text:m.content||'(بدون متن)'}]});
        else messages.push({role:'assistant',content:m.content||''});
    }
    const currentParts=[{type:'text',text:currentText}];
    if(currentFileData&&currentFileType==='image')currentParts.push({type:'image_url',image_url:{url:currentFileData}});
    else if(currentFileData&&currentFileType==='audio')currentParts.push({type:'input_audio',input_audio:{data:currentFileData.split(',')[1],format:'wav'}});
    messages.push({role:'user',content:currentParts});
    return messages;
}

function startTypewriter(el){
    streamTargetEl=el;streamResultFull='';
    if(streamWriting)return;
    streamWriting=true;
    (async()=>{
        while(true){
            if(streamQueue.length>0){
                const take=streamQueue.length>60?4:(streamQueue.length>25?2:1);
                const piece=streamQueue.slice(0,take);
                streamQueue=streamQueue.slice(take);
                streamResultFull+=piece;
                if(streamTargetEl){
                    streamTargetEl.innerHTML=formatMd(streamResultFull);
                    const box=document.getElementById('box');
                    if(box)box.scrollTop=box.scrollHeight;
                }
                await new Promise(r=>setTimeout(r,16));
            } else if(streamFinished){break;}
            else await new Promise(r=>setTimeout(r,12));
        }
        streamWriting=false;
    })();
}

function handleInput(){const v=document.getElementById('q').value.trim();document.getElementById('sendBtn').classList.toggle('visible',v.length>0||!!currentFile);}
function handleKeydown(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}
function handleSendClick(){
    if(isStreaming){pauseStream();}
    else{send();}
}
function pauseStream(){
    if(activeChatId&&pendingRequests[activeChatId]){
        try{pendingRequests[activeChatId].abort();}catch(e){}
        delete pendingRequests[activeChatId];
    }
    chatInFlight=false;isStreaming=false;
    setSendButton();
    const sb=document.getElementById('sendBtn');
    if(sb)sb.classList.add('visible');
    document.getElementById('typing-indicator')?.remove();
    streamFinished=true;
    toast('متوقف شد','info');
}
function setPauseButton(){
    const btn=document.getElementById('sendBtn');
    btn.classList.add('pause-mode');btn.title='توقف';
    document.getElementById('sendIcon').innerHTML='<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
}
function setSendButton(){
    const btn=document.getElementById('sendBtn');
    btn.classList.remove('pause-mode');btn.title='ارسال';
    document.getElementById('sendIcon').innerHTML='<path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2Z"/>';
}
function toggleThink(){
    settings.thinking=!settings.thinking;
    if(settings.thinking&&settings.quick){
        settings.quick=false;
        document.getElementById('quickBtn').classList.remove('active');
    }
    saveSettings();
    document.getElementById('thinkBtn').classList.toggle('active',settings.thinking);
    toast(settings.thinking?'🧠 تفکر عمیق فعال':'تفکر خاموش','info');
}
function toggleQuick(){
    settings.quick=!settings.quick;
    if(settings.quick&&settings.thinking){
        settings.thinking=false;
        document.getElementById('thinkBtn').classList.remove('active');
    }
    saveSettings();
    document.getElementById('quickBtn').classList.toggle('active',settings.quick);
    toast(settings.quick?'⚡ پاسخ سریع فعال':'پاسخ سریع خاموش','info');
}
function handleFilePick(ev){const f=ev.target.files?.[0];if(!f)return;if(f.size>8*1024*1024){toast('حجم بیش از ۸ مگابایت','error');return;}const isImg=f.type.startsWith('image/');const r=new FileReader();r.onload=e=>{currentFile=e.target.result;currentFileType=isImg?'image':'file';renderFilePreview(f.name,currentFileType);handleInput();};r.readAsDataURL(f);ev.target.value='';}
function renderFilePreview(name,type){const w=document.getElementById('imagePreviewWrap');if(!currentFile){w.innerHTML='';return;}if(type==='image')w.innerHTML=`<div class="image-preview"><img src="${currentFile}"><button class="remove-img" onclick="removeFile()">✕</button></div>`;else w.innerHTML=`<div class="image-preview"><div class="audio-preview">📎 ${escapeHtml(name||'فایل')}</div><button class="remove-img" onclick="removeFile()">✕</button></div>`;}
function removeFile(){currentFile=null;currentFileType=null;renderFilePreview();handleInput();}

async function blobToWav(blob){const ab=await blob.arrayBuffer();const ctx=new(window.AudioContext||window.webkitAudioContext)();const buf=await ctx.decodeAudioData(ab);const nCh=buf.numberOfChannels,sr=buf.sampleRate,len=buf.length;const ba=nCh*2,ds=len*ba;const arr=new ArrayBuffer(44+ds),v=new DataView(arr);const ws=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};ws(0,'RIFF');v.setUint32(4,36+ds,true);ws(8,'WAVE');ws(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,nCh,true);v.setUint32(24,sr,true);v.setUint32(28,sr*ba,true);v.setUint16(32,ba,true);v.setUint16(34,16,true);ws(36,'data');v.setUint32(40,ds,true);const ch=[];for(let i=0;i<nCh;i++)ch.push(buf.getChannelData(i));let off=44;for(let i=0;i<len;i++)for(let c=0;c<nCh;c++){const s=Math.max(-1,Math.min(1,ch[c][i]));v.setInt16(off,s<0?s*0x8000:s*0x7FFF,true);off+=2;}return new Blob([arr],{type:'audio/wav'});}
async function toggleVoice(){const btn=document.getElementById('voiceBtn');if(isRecording){try{mediaRecorder?.stop();}catch(e){}return;}if(!navigator.mediaDevices){toast('مرورگر پشتیبانی نمی‌کنه','error');return;}try{const s=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}});mediaRecorder=new MediaRecorder(s);recordedChunks=[];mediaRecorder.ondataavailable=e=>{if(e.data.size>0)recordedChunks.push(e.data);};mediaRecorder.onstop=async()=>{const webm=new Blob(recordedChunks,{type:'audio/webm'});try{const wav=await blobToWav(webm);const r=new FileReader();r.onload=ev=>{currentFile=ev.target.result;currentFileType='audio';renderFilePreview('voice.wav','audio');handleInput();toast('صدا ضبط شد','success');};r.readAsDataURL(wav);}catch(e){toast('خطا','error');}s.getTracks().forEach(tr=>tr.stop());isRecording=false;btn.classList.remove('recording','active');};mediaRecorder.start();isRecording=true;btn.classList.add('recording','active');toast('در حال ضبط...','info');}catch(e){toast('دسترسی میکروفون ممکن نشد','error');}}

async function send(){
    const input=document.getElementById('q');
    const q=input.value.trim();
    if(!q&&!currentFile)return;
    if(chatInFlight){toast('صبر کن...','error');return;}
    if(!currentChatId)createNewChat(true);
    const chatId=currentChatId;
    activeChatId=chatId;isStreaming=true;setPauseButton();
    const userText=q||'این رو تحلیل کن';
    const fileData=currentFile,fileType=currentFileType;
    renderUserMsg(userText,fileData,fileType);
    addMsgToHistory(chatId,'user',userText,fileData,fileType);
    input.value='';currentFile=null;currentFileType=null;renderFilePreview();handleInput();
    toggleWelcome();
    chatInFlight=true;
    const box=document.getElementById('box');
    const controller=new AbortController();
    pendingRequests[chatId]=controller;
    await new Promise(r=>setTimeout(r,500));
    if(chatId===currentChatId&&!controller.signal.aborted){
        const w=document.createElement('div');w.className='msg-wrap bot';w.id='typing-indicator';
        w.innerHTML='<div class="msg"><span class="think-indicator"><span class="think-text">دارم تفکر می‌کنم صبرله <span class="think-emoji">🧘‍♂️</span></span><span class="typing"><span></span><span></span><span></span></span></span></div>';
        box.appendChild(w);box.scrollTop=box.scrollHeight;
    }
    const t0=Date.now();
    try{
        const url=(APP_CONFIG.baseURL&&APP_CONFIG.baseURL.trim())?APP_CONFIG.baseURL:'/api/chat';
        const messages=buildMessagesForWorker(chatId,userText,fileData,fileType);
        const res=await RateLimiter.run(()=>fetch(url,{
            method:'POST',
            headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
            body:JSON.stringify({model:settings.model,messages,temperature:0.75,stream:true}),
            signal:controller.signal
        }));
        if(!res.ok){
            document.getElementById('typing-indicator')?.remove();
            let msg='';
            if(res.status===429)msg='⏳ محدودیت (۴۲۹). ۳۰ ثانیه صبر کن.';
            else if(res.status===401||res.status===403)msg='🔑 کلید API مشکل داره.';
            else if(res.status===404)msg='🔍 مدل در دسترس نیست.';
            else if(res.status===503)msg='🔄 سرور Gemini الان شلوغه. یه بار دیگه امتحان کن.';
            else{const et=await res.text();msg='خطا ('+res.status+'): '+et.substring(0,200);}
            if(chatId===currentChatId)renderBotMsg(msg);
            addMsgToHistory(chatId,'assistant',msg);
            delete pendingRequests[chatId];chatInFlight=false;isStreaming=false;setSendButton();return;
        }
        streamQueue='';streamFinished=false;streamResultFull='';streamWriting=false;
        let streamEl=null;
        if(chatId===currentChatId){
            document.getElementById('typing-indicator')?.remove();
            const w=document.createElement('div');w.className='msg-wrap bot';
            const m=document.createElement('div');m.className='msg';
            m.innerHTML='<span class="stream-text"></span><span class="cursor-blink"></span>';
            w.appendChild(m);box.appendChild(w);box.scrollTop=box.scrollHeight;
            streamEl=m.querySelector('.stream-text');
            startTypewriter(streamEl);
        }
        const reader=res.body.getReader();const dec=new TextDecoder();let buf='';
        while(true){
            const {done,value}=await reader.read();if(done)break;
            buf+=dec.decode(value,{stream:true});
            const lines=buf.split('\n');buf=lines.pop();
            for(const line of lines){
                const tr=line.trim();if(!tr||!tr.startsWith('data:'))continue;
                const d=tr.slice(5).trim();if(d==='[DONE]')continue;
                try{const j=JSON.parse(d);const delta=j.choices?.[0]?.delta?.content||'';if(delta){streamQueue+=delta;}}catch(e){}
            }
        }
        streamFinished=true;
        let waitGuard=0;
        while(streamWriting&&waitGuard<900){await new Promise(r=>setTimeout(r,40));waitGuard++;}
        const full=streamResultFull||'(بدون پاسخ)';
        extractPlanFromResponse(full);
        const elapsed=((Date.now()-t0)/1000).toFixed(1);
        if(chatId===currentChatId&&streamEl){
            const pm=streamEl.parentElement;
            pm.innerHTML=formatMd(full);
            pm.querySelector('.cursor-blink')?.remove();
            const lat=document.createElement('div');lat.className='latency-timer';lat.textContent=elapsed+'s';
            pm.parentElement.appendChild(lat);
        }
        addMsgToHistory(chatId,'assistant',full);
        delete pendingRequests[chatId];
    }catch(err){
        document.getElementById('typing-indicator')?.remove();
        delete pendingRequests[chatId];
        if(err.name==='AbortError'){chatInFlight=false;isStreaming=false;setSendButton();return;}
        if(chatId===currentChatId)renderBotMsg('خطا: '+err.message);
    }
    chatInFlight=false;isStreaming=false;setSendButton();
}

function extractPlanFromResponse(text){
    const matches=[...text.matchAll(/\[PLAN\]\s*([-\d:]+\s*)?[|]?\s*([^\[\]]+?)\s*\[\/PLAN\]/g)];
    if(!matches.length)return;
    const pl=loadPlannerNew();
    const todayKey=dateKey(new Date());
    const dd=getDayData(pl,todayKey);
    let added=0;
    matches.forEach(m=>{
        const time=(m[1]||'').trim().replace(/^-\s*/,'');
        const title=(m[2]||'').trim();
        if(title){
            const hm=time.match(/^(\d{1,2})/);
            if(hm){const hk=padHour(parseInt(hm[1]));if(hk){dd.hours[hk]=(dd.hours[hk]?dd.hours[hk]+' | ':'')+title;}}
            dd.tasks.push({title,time,done:false});
            added++;
        }
    });
    savePlanner(pl);
    if(added>0){toast(`${added} کار به برنامه امروز اضافه شد`,'success');if(currentView==='chat')renderPanelForChat();}
}

function checkLock(){
    if(!settings.passwordEnabled||!settings.password)return;
    if(sessionStorage.getItem(LOCK_SESSION_KEY)==='1'){
        registerMySession();
        return;
    }
    const ls=document.getElementById('lockScreen');
    ls.classList.add('open');
    setTimeout(()=>document.getElementById('lockInput').focus(),200);
}
function tryUnlock(){
    const inp=document.getElementById('lockInput');
    const err=document.getElementById('lockError');
    const val=inp.value;
    if(!val){err.textContent='رمز را وارد کنید';return;}
    if(val===settings.password){
        sessionStorage.setItem(LOCK_SESSION_KEY,'1');
        document.getElementById('lockScreen').classList.remove('open');
        inp.value='';err.textContent='';
        const hb=document.getElementById('headerLockBtn');
        if(hb){hb.classList.remove('locked');hb.title='قفل کردن سایت';}
        registerMySession();
        resetInactivityTimer();
    } else {
        err.textContent='رمز اشتباه است';inp.value='';inp.focus();
        setTimeout(()=>{err.textContent='';},2500);
    }
}
function lockNow(){
    if(!settings.passwordEnabled||!settings.password){toast('اول از تنظیمات، رمز قفل رو تنظیم کن','error');return;}
    sessionStorage.removeItem(LOCK_SESSION_KEY);
    const ls=document.getElementById('lockScreen');
    ls.classList.add('open');
    const inp=document.getElementById('lockInput');
    const err=document.getElementById('lockError');
    if(inp){inp.value='';setTimeout(()=>inp.focus(),200);}
    if(err)err.textContent='';
    const hb=document.getElementById('headerLockBtn');
    if(hb){hb.classList.add('locked');hb.title='قفل است';}
}

function exportBackup(){
    const data={version:1,exportedAt:Date.now(),settings:settings,history:loadHistory(),planner:loadPlanner(),blog:loadBlog(),videos:loadVideos()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=`siraj-backup-${new Date().toISOString().split('T')[0]}.json`;a.click();
    URL.revokeObjectURL(url);
    toast('بکاپ دانلود شد ✓','success');
}
function importBackup(ev){
    const f=ev.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=e=>{
        try{
            const data=JSON.parse(e.target.result);
            if(!data.settings&&!data.history){toast('فایل معتبر نیست','error');return;}
            if(!confirm('همه اطلاعات فعلی جایگزین می‌شه. مطمئنی؟'))return;
            if(data.settings){settings=Object.assign({},APP_CONFIG.defaultSettings,data.settings);saveSettings();}
            if(data.history)saveHistory(data.history);
            if(data.planner)savePlanner(data.planner);
            if(data.blog)saveBlog(data.blog);
            if(data.videos)saveVideos(data.videos);
            toast('بکاپ بازیابی شد ✓','success');
            setTimeout(()=>location.reload(),900);
        }catch(err){toast('خطا در خواندن فایل','error');}
    };
    r.readAsText(f);ev.target.value='';
}

function openSettings(){
    try{
        settingsCat='appearance';
        settingsDraft=JSON.parse(JSON.stringify(settings));
        renderSettingsControls();
        updatePreview();
        const m=document.getElementById('settingsModal');
        if(!m)return;
        m.style.visibility='visible';m.style.pointerEvents='auto';
        requestAnimationFrame(()=>m.classList.add('open'));
        const btn=document.getElementById('settingsNavBtn');
        if(btn){btn.classList.add('pop');setTimeout(()=>btn.classList.remove('pop'),450);}
    }catch(err){console.error('openSettings error:',err);toast('خطا در باز کردن تنظیمات','error');}
}
function closeSettings(){
    const m=document.getElementById('settingsModal');
    if(!m)return;
    m.classList.remove('open');
    setTimeout(()=>{if(!m.classList.contains('open')){m.style.visibility='hidden';m.style.pointerEvents='none';}},320);
    setTimeout(()=>{
        document.querySelectorAll('.bottom-nav-btn').forEach(b=>{b.style.pointerEvents='auto';b.style.position='relative';b.style.zIndex='2';});
        const s=document.getElementById('navSlider');if(s){s.style.pointerEvents='none';}
        if(typeof window.updateNavSlider==='function')window.updateNavSlider(true);
    },340);
    settingsDraft=null;
}
function applySettings(){
    if(!settingsDraft)return;
    const oldPass=settings.password,oldEnabled=settings.passwordEnabled;
    settings=JSON.parse(JSON.stringify(settingsDraft));
    saveSettings();applySettingsToUI();
    try{localStorage.setItem(PROFILE_IMG_KEY,settings.profileImage||'');}catch(e){}
    if(settings.passwordEnabled&&(!oldEnabled||oldPass!==settings.password)){
        sessionStorage.setItem(LOCK_SESSION_KEY,'1');
        registerMySession();
    }
    if(!settings.passwordEnabled){
        sessionStorage.removeItem(LOCK_SESSION_KEY);
    }
    resetInactivityTimer();
    toast('تنظیمات با موفقیت اعمال شد ✓','success');
    closeSettings();
}
function switchSettingsCat(cat){
    if(cat===settingsCat)return;
    settingsCat=cat;
    document.querySelectorAll('.settings-tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));
    document.querySelectorAll('.settings-content').forEach(c=>c.classList.toggle('active',c.dataset.cat===cat));
    if(cat==='privacy'){renderSessionsList();}
    setTimeout(()=>{
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(inp=>{
            inp.setAttribute('dir','ltr');
            const pct=((inp.value-inp.min)/(inp.max-inp.min))*100;
            inp.style.setProperty('--slider-pct',pct+'%');
        });
    },50);
}

function updatePvNavPreview(){
    const pv=document.getElementById('pvNavPreview');
    const pz=document.getElementById('previewZone');
    if(!pv||!pz||!settingsDraft)return;
    const pos=settingsDraft.navPosition||'bottom';
    const collapsed=!!settingsDraft.navStartCollapsed;
    pz.setAttribute('data-nav-position',pos);
    pz.setAttribute('data-nav-style',settingsDraft.navStyle||'default');
    pv.classList.remove('collapsed','collapsed-bottom','collapsed-top','collapsed-left','collapsed-right');
    if(collapsed){pv.classList.add('collapsed');pv.classList.add(`collapsed-${pos}`);}
    pv.style.boxShadow=computeNavShadow(settingsDraft.navShadowLevel||0);
}

function updateDraft(key,value){
    if(!settingsDraft)return;
    if(['patternSize','patternOpacity','patternPerCorner','navShadowLevel','bgImageOpacity','autoLockMinutes'].includes(key))value=parseInt(value,10);
    if(key==='bgPreset'){settingsDraft.bgImage='';settingsDraft.bgPreset=value;}
    else settingsDraft[key]=value;
    document.querySelectorAll('#settingsContentWrap .row-btn, #settingsContentWrap .color-opt, #settingsContentWrap .pattern-opt, #settingsContentWrap .bg-opt').forEach(b=>{
        if(b.dataset.key===key)b.classList.toggle('active',String(b.dataset.value)===String(value));
    });
    if(['patternSize','patternOpacity','patternPerCorner','navShadowLevel','bgImageOpacity','autoLockMinutes'].includes(key)){
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(inp=>{
            if((inp.getAttribute('oninput')||'').includes(`'${key}'`)){
                const pct=((inp.value-inp.min)/(inp.max-inp.min))*100;
                inp.style.setProperty('--slider-pct',pct+'%');
                const valEl=inp.parentElement.querySelector('.slider-val');
                if(valEl){
                    if(key==='autoLockMinutes')valEl.textContent=value===0?'خاموش':(value+' دقیقه');
                    else valEl.textContent=value+'%';
                }
            }
        });
    }
    if(['navPosition','navStartCollapsed','navStyle'].includes(key)){updatePvNavPreview();}
    if(previewRaf)cancelAnimationFrame(previewRaf);
    previewRaf=requestAnimationFrame(()=>{updatePreview();previewRaf=null;});
}

function updatePreview(){
    const pz=document.getElementById('previewZone');
    const pl=document.getElementById('previewPatternLayer');
    const bgImg=document.getElementById('pvBgImg');
    if(!pz||!settingsDraft)return;
    const themeKey=`${settingsDraft.themeMode}-${settingsDraft.themeColor}`;
    pz.setAttribute('data-theme',themeKey);
    const bgVal=getBgValue(settingsDraft);
    if(bgVal!=='none'){
        bgImg.style.background=bgVal;
        bgImg.style.backgroundAttachment='fixed';
        bgImg.style.backgroundPosition='center';
        if(settingsDraft.bgImage){
            bgImg.style.backgroundSize='cover';bgImg.style.backgroundRepeat='no-repeat';
        } else if(settingsDraft.bgPreset==='dots'){
            bgImg.style.backgroundSize='20px 20px';bgImg.style.backgroundRepeat='repeat';
        } else {
            bgImg.style.backgroundSize='cover';bgImg.style.backgroundRepeat='no-repeat';
        }
        bgImg.style.opacity=(settingsDraft.bgImageOpacity||100)/100;
    } else {
        bgImg.style.background='none';
        bgImg.style.backgroundImage='none';
    }
    if(!pl)return;
    const pvSize=Math.max(30,settingsDraft.patternSize*0.35);
    pl.style.position='absolute';pl.style.inset='0';pl.style.zIndex='1';pl.style.borderRadius='18px';
    applyPattern(pl,settingsDraft.pattern,settingsDraft.patternColor1,settingsDraft.patternColor2,settingsDraft.patternPerCorner,pvSize,settingsDraft.patternPosition,settingsDraft.patternOpacity);
    pz.style.fontSize=parseInt(settingsDraft.fontSize)+'px';
    pz.style.fontFamily=getFontCSS(settingsDraft.fontFamily);
    pz.setAttribute('data-header-style',settingsDraft.headerStyle||'glass');
    pz.setAttribute('data-input-style',settingsDraft.inputStyle||'solid');
    const shape=settingsDraft.bubbleShape;
    let rU='20px 20px 10px 20px',rB='20px 20px 20px 10px';
    if(shape==='cloud'){rU=rB='26px';}
    else if(shape==='leaf'){rU='26px 8px 26px 26px';rB='8px 26px 26px 26px';}
    else if(shape==='diamond'){rU='8px 24px 8px 24px';rB='24px 8px 24px 8px';}
    else if(shape==='speech'){rU='20px 20px 6px 20px';rB='20px 20px 20px 6px';}
    pz.querySelectorAll('.pv-msg.user').forEach(el=>{el.style.borderRadius=rU;});
    pz.querySelectorAll('.pv-msg.bot').forEach(el=>{el.style.borderRadius=rB;});
    updatePvNavPreview();
    refreshBgThumbs();
}
function refreshBgThumbs(){
    const s=settingsDraft||settings;
    const isLight=s.themeMode==='light';
    document.querySelectorAll('.bg-opt').forEach(opt=>{
        const id=opt.dataset.value;
        const preset=APP_CONFIG.bgPresets.find(p=>p.id===id);
        if(!preset)return;
        const inner=opt.querySelector('div:first-child');
        if(inner){
            const v=isLight ? (preset.valueLight||preset.value||'') : (preset.value||'');
            inner.style.background=v;
        }
    });
}
function getFontCSS(id){
    const map={vazirmatn:"'Vazirmatn',sans-serif",estedad:"'Estedad',sans-serif",shabnam:"'Shabnam',sans-serif",sahel:"'Sahel',sans-serif",lalezar:"'Lalezar',cursive",gulzar:"'Gulzar',serif",'noto-sans-arabic':"'Noto Sans Arabic',sans-serif",amiri:"'Amiri',serif",cairo:"'Cairo',sans-serif",'noto-naskh':"'Noto Naskh Arabic',serif",'noto-kufi':"'Noto Kufi Arabic',sans-serif",tajawal:"'Tajawal',sans-serif",almarai:"'Almarai',sans-serif",scheherazade:"'Scheherazade New',serif",'reem-kufi':"'Reem Kufi',sans-serif",inter:"'Inter',sans-serif",poppins:"'Poppins',sans-serif",'space-grotesk':"'Space Grotesk',sans-serif",manrope:"'Manrope',sans-serif",'dm-sans':"'DM Sans',sans-serif",jetbrains:"'JetBrains Mono',monospace"};
    return map[id]||"'Vazirmatn',sans-serif";
}
function fontRow(f){const s=settingsDraft||settings;return `<button class="row-btn${s.fontFamily===f.id?' active':''}" data-key="fontFamily" data-value="${f.id}" onclick="updateDraft('fontFamily','${f.id}')" style="font-family:${getFontCSS(f.id)}"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg><span class="rb-label">${f.name}</span></button>`;}
function bgOpt(p){
    const s=settingsDraft||settings;
    const isLight=s.themeMode==='light';
    const isActive=!s.bgImage&&(s.bgPreset||'none')===p.id;
    const v=isLight ? (p.valueLight||p.value||'') : (p.value||'');
    return `<div class="bg-opt${isActive?' active':''}" data-key="bgPreset" data-value="${p.id}" onclick="updateDraft('bgPreset','${p.id}')" title="${p.name}"><div style="position:absolute;inset:0;border-radius:11px;background:${v||'transparent'}"></div><div class="bg-label">${p.name}</div></div>`;
}

function copyContact(text,el){
    const doCopy=()=>{
        try{
            if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
            const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';
            document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
            return Promise.resolve();
        }catch(e){return Promise.reject(e);}
    };
    doCopy().then(()=>{
        el.classList.add('copied');
        const copy=el.querySelector('.contact-copy');
        if(copy){const orig=copy.textContent;copy.textContent='کپی شد ✓';setTimeout(()=>{el.classList.remove('copied');copy.textContent=orig;},1400);}
        toast('کپی شد ✓','success');
    }).catch(()=>toast('کپی نشد','error'));
}
function handleBgUpload(ev){
    const f=ev.target.files?.[0];if(!f)return;
    if(f.size>4*1024*1024){toast('حجم بیش از ۴ مگابایت','error');return;}
    const r=new FileReader();
    r.onload=e=>{settingsDraft.bgImage=e.target.result;settingsDraft.bgPreset='';updatePreview();renderSettingsControls();toast('تصویر پس‌زمینه انتخاب شد ✓','success');};
    r.readAsDataURL(f);ev.target.value='';
}
function clearBgImage(){if(!settingsDraft)return;settingsDraft.bgImage='';settingsDraft.bgPreset='none';updatePreview();renderSettingsControls();}

function handleProfileUpload(ev){
    const f=ev.target.files?.[0];
    if(!f)return;
    if(f.size>1.5*1024*1024){toast('حجم عکس زیاد است (حداکثر ۱.۵ مگابایت)','error');return;}
    const r=new FileReader();
    r.onload=e=>{
        if(!settingsDraft)return;
        settingsDraft.profileImage=e.target.result;
        toast('عکس انتخاب شد ✓ — الان «اعمال تغییرات» رو بزن','success');
        renderSettingsControls();
    };
    r.readAsDataURL(f);
    ev.target.value='';
}

function updatePassword(){
    const p1=document.getElementById('newPass1');
    const p2=document.getElementById('newPass2');
    if(!p1||!p2)return;
    const v1=p1.value.trim(),v2=p2.value.trim();
    if(!v1){toast('رمز را وارد کنید','error');return;}
    if(v1!==v2){toast('رمزها یکسان نیستند','error');return;}
    if(v1.length<4){toast('رمز باید حداقل ۴ کاراکتر باشد','error');return;}
    settingsDraft.password=v1;settingsDraft.passwordEnabled=true;
    p1.value='';p2.value='';
    toast('رمز تنظیم شد ✓','success');
    renderSettingsControls();
}
function removePassword(){
    if(!confirm('رمز حذف بشه؟'))return;
    settingsDraft.password='';settingsDraft.passwordEnabled=false;
    sessionStorage.removeItem(LOCK_SESSION_KEY);
    toast('رمز حذف شد','info');
    renderSettingsControls();
}

function renderSessionsList(){
    const el=document.getElementById('sessionsListInner');
    if(!el)return;
    const sessions=loadSessions();
    const myId=getMySessionId();
    const list=Object.values(sessions).sort((a,b)=>b.lastPing-a.lastPing);
    if(!list.length){
        el.innerHTML=`<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:14px 0">هنوز دستگاه فعالی ثبت نشده</div>`;
        return;
    }
    el.innerHTML=list.map(s=>{
        const isMe=s.id===myId;
        return `<div class="session-row${isMe?' current':''}">
            <div class="s-icon"><svg viewBox="0 0 24 24">${isMe?'<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 18v2"/>':'<rect x="2" y="4" width="20" height="14" rx="2"/>'}</svg></div>
            <div class="s-info">
                <div class="s-name">${escapeHtml(getDeviceName(s.ua,s.platform))} ${isMe?'<span class="s-badge">دستگاه فعلی</span>':''}</div>
                <div class="s-sub">${timeAgo(s.lastPing)}${s.lang?' · '+s.lang:''}</div>
            </div>
            ${isMe?'':`<button class="s-del" onclick="removeSession('${s.id}')" title="خروج از این دستگاه"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>`}
        </div>`;
    }).join('');
}

function renderSettingsControls(){
    const s=settingsDraft||settings;
    const tabs=document.getElementById('settingsTabs');
    const wrap=document.getElementById('settingsContentWrap');
    tabs.innerHTML=`
        <button class="settings-tab-btn${settingsCat==='appearance'?' active':''}" data-cat="appearance" onclick="switchSettingsCat('appearance')"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3 L14 9 L12 12 L10 9 Z"/></svg>ظاهر</button>
        <button class="settings-tab-btn${settingsCat==='header'?' active':''}" data-cat="header" onclick="switchSettingsCat('header')"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>استایل</button>
        <button class="settings-tab-btn${settingsCat==='pattern'?' active':''}" data-cat="pattern" onclick="switchSettingsCat('pattern')"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3 Q16 9 12 12 Q8 9 12 3Z"/></svg>طرح</button>
        <button class="settings-tab-btn${settingsCat==='font'?' active':''}" data-cat="font" onclick="switchSettingsCat('font')"><svg viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>فونت</button>
        <button class="settings-tab-btn${settingsCat==='nav'?' active':''}" data-cat="nav" onclick="switchSettingsCat('nav')"><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>نوار</button>
        <button class="settings-tab-btn${settingsCat==='privacy'?' active':''}" data-cat="privacy" onclick="switchSettingsCat('privacy')"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>حریم خصوصی</button>
        <button class="settings-tab-btn${settingsCat==='about'?' active':''}" data-cat="about" onclick="switchSettingsCat('about')"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>درباره ما</button>`;
    wrap.innerHTML=`
        <div class="settings-content${settingsCat==='appearance'?' active':''}" data-cat="appearance">
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>حالت نمایش</label>
                <div class="row-btns">
                    <button class="row-btn${s.themeMode==='dark'?' active':''}" data-key="themeMode" data-value="dark" onclick="updateDraft('themeMode','dark')"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span class="rb-label">شب</span></button>
                    <button class="row-btn${s.themeMode==='light'?' active':''}" data-key="themeMode" data-value="light" onclick="updateDraft('themeMode','light')"><svg class="rb-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"/></svg><span class="rb-label">روز</span></button>
                    <button class="row-btn${s.themeMode==='midnight'?' active':''}" data-key="themeMode" data-value="midnight" onclick="updateDraft('themeMode','midnight')"><svg class="rb-icon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg><span class="rb-label">نیمه‌شب</span></button>
                </div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"/></svg>رنگ اصلی</label>
                <div class="color-row">${APP_CONFIG.themeColors.map(c=>`<div class="color-opt${s.themeColor===c?' active':''}" data-key="themeColor" data-value="${c}" onclick="updateDraft('themeColor','${c}')"><div class="color-orb" data-color="${c}"><svg viewBox="0 0 24 24">${APP_CONFIG.colorIcons[c]}</svg></div><div class="color-label">${APP_CONFIG.colorNames[c]}</div></div>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="6"/></svg>شکل حباب</label>
                <div class="row-btns">${APP_CONFIG.bubbleShapes.map(b=>`<button class="row-btn${s.bubbleShape===b.id?' active':''}" data-key="bubbleShape" data-value="${b.id}" onclick="updateDraft('bubbleShape','${b.id}')"><svg class="rb-icon" viewBox="0 0 24 24">${b.icon}</svg><span class="rb-label">${b.name}</span></button>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>اندازه متن</label>
                <div class="row-btns">${['13px','15px','17px','19px'].map((f,i)=>`<button class="row-btn${s.fontSize===f?' active':''}" data-key="fontSize" data-value="${f}" onclick="updateDraft('fontSize','${f}')"><span class="rb-label">${['کوچیک','معمولی','درشت','بزرگ'][i]}</span></button>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15 L9 9 L15 15 L21 9"/></svg>تصویر پس‌زمینه</label>
                <div class="bg-grid">${APP_CONFIG.bgPresets.map(bgOpt).join('')}</div>
                <label class="bg-upload-btn" style="margin-top:8px">
                    <input type="file" accept="image/*" onchange="handleBgUpload(event)">
                    <svg viewBox="0 0 24 24"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    <span>آپلود تصویر از دستگاه</span>
                </label>
                ${s.bgImage?`<button class="btn-secondary" style="width:100%;margin-top:6px" onclick="clearBgImage()">حذف تصویر آپلود شده</button>`:''}
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" opacity=".5"/></svg>شفافیت تصویر پس‌زمینه</label>
                <div class="slider-row"><input type="range" min="10" max="100" step="5" value="${s.bgImageOpacity||100}" oninput="updateDraft('bgImageOpacity',this.value)"><span class="slider-val">${s.bgImageOpacity||100}%</span></div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>سرعت انیمیشن</label>
                <div class="row-btns">${APP_CONFIG.animations.map(a=>`<button class="row-btn${s.animation===a.id?' active':''}" data-key="animation" data-value="${a.id}" onclick="updateDraft('animation','${a.id}')"><span class="rb-label">${a.name}</span></button>`).join('')}</div>
            </div>
        </div>

        <div class="settings-content${settingsCat==='header'?' active':''}" data-cat="header">
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3"/></svg>پس‌زمینه هدر</label>
                <div class="row-btns">${APP_CONFIG.headerStyles.map(h=>`<button class="row-btn${s.headerStyle===h.id?' active':''}" data-key="headerStyle" data-value="${h.id}" onclick="updateDraft('headerStyle','${h.id}')"><svg class="rb-icon" viewBox="0 0 24 24">${h.icon}</svg><span class="rb-label">${h.name}</span></button>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>نوار نوشتن پیام</label>
                <div class="row-btns">${APP_CONFIG.inputStyles.map(i=>`<button class="row-btn${s.inputStyle===i.id?' active':''}" data-key="inputStyle" data-value="${i.id}" onclick="updateDraft('inputStyle','${i.id}')"><svg class="rb-icon" viewBox="0 0 24 24">${i.icon}</svg><span class="rb-label">${i.name}</span></button>`).join('')}</div>
            </div>
        </div>

        <div class="settings-content${settingsCat==='pattern'?' active':''}" data-cat="pattern">
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>انتخاب طرح</label>
                <div class="pattern-grid">${APP_CONFIG.patterns.map(p=>`<div class="pattern-opt${s.pattern===p.id?' active':''}" data-key="pattern" data-value="${p.id}" onclick="updateDraft('pattern','${p.id}')"><div class="pattern-thumb th-${p.id}"></div><div class="pattern-name">${p.name}</div></div>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>موقعیت</label>
                <div class="row-btns">
                    <button class="row-btn${s.patternPosition==='both'?' active':''}" data-key="patternPosition" data-value="both" onclick="updateDraft('patternPosition','both')"><span class="rb-label">دو گوشه</span></button>
                    <button class="row-btn${s.patternPosition==='reverse'?' active':''}" data-key="patternPosition" data-value="reverse" onclick="updateDraft('patternPosition','reverse')"><span class="rb-label">برعکس</span></button>
                    <button class="row-btn${s.patternPosition==='tr'?' active':''}" data-key="patternPosition" data-value="tr" onclick="updateDraft('patternPosition','tr')"><span class="rb-label">فقط راست</span></button>
                    <button class="row-btn${s.patternPosition==='bl'?' active':''}" data-key="patternPosition" data-value="bl" onclick="updateDraft('patternPosition','bl')"><span class="rb-label">فقط چپ</span></button>
                </div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>تعداد در گوشه</label>
                <div class="slider-row"><input type="range" min="1" max="8" step="1" value="${s.patternPerCorner}" oninput="updateDraft('patternPerCorner',this.value)"><span class="slider-val">${s.patternPerCorner}×</span></div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>اندازه</label>
                <div class="slider-row"><input type="range" min="60" max="350" step="10" value="${s.patternSize}" oninput="updateDraft('patternSize',this.value)"><span class="slider-val">${s.patternSize}px</span></div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" opacity=".5"/></svg>شفافیت</label>
                <div class="slider-row"><input type="range" min="10" max="100" step="5" value="${s.patternOpacity}" oninput="updateDraft('patternOpacity',this.value)"><span class="slider-val">${s.patternOpacity}%</span></div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"/></svg>رنگ‌های طرح</label>
                <div class="color-picker-row">
                    <div class="color-picker-wrap"><label>رنگ ۱</label><input type="color" value="${s.patternColor1}" oninput="updateDraft('patternColor1',this.value)"></div>
                    <div class="color-picker-wrap"><label>رنگ ۲</label><input type="color" value="${s.patternColor2}" oninput="updateDraft('patternColor2',this.value)"></div>
                </div>
            </div>
        </div>

        <div class="settings-content${settingsCat==='font'?' active':''}" data-cat="font">
            <div class="setting-group">
                <div class="group-subtitle">فونت‌های فارسی</div>
                <div class="row-btns">${APP_CONFIG.fonts.persian.map(fontRow).join('')}</div>
                <div class="group-subtitle">فونت‌های عربی</div>
                <div class="row-btns">${APP_CONFIG.fonts.arabic.map(fontRow).join('')}</div>
                <div class="group-subtitle">فونت‌های انگلیسی</div>
                <div class="row-btns">${APP_CONFIG.fonts.english.map(fontRow).join('')}</div>
            </div>
        </div>

        <div class="settings-content${settingsCat==='nav'?' active':''}" data-cat="nav">
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>حالت باز/بسته</label>
                <div class="row-btns">
                    <button class="row-btn${!s.navStartCollapsed?' active':''}" data-key="navStartCollapsed" data-value="false" onclick="updateDraft('navStartCollapsed',false)"><span class="rb-label">باز</span></button>
                    <button class="row-btn${s.navStartCollapsed?' active':''}" data-key="navStartCollapsed" data-value="true" onclick="updateDraft('navStartCollapsed',true)"><span class="rb-label">جمع‌شده</span></button>
                </div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>موقعیت نوار</label>
                <div class="row-btns">${APP_CONFIG.navPositions.map(p=>`<button class="row-btn${s.navPosition===p.id?' active':''}" data-key="navPosition" data-value="${p.id}" onclick="updateDraft('navPosition','${p.id}')"><svg class="rb-icon" viewBox="0 0 24 24">${p.icon}</svg><span class="rb-label">${p.name}</span></button>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>استایل پس‌زمینه</label>
                <div class="row-btns">${APP_CONFIG.navStyles.map(st=>`<button class="row-btn${s.navStyle===st.id?' active':''}" data-key="navStyle" data-value="${st.id}" onclick="updateDraft('navStyle','${st.id}')"><svg class="rb-icon" viewBox="0 0 24 24">${st.icon}</svg><span class="rb-label">${st.name}</span></button>`).join('')}</div>
            </div>
            <div class="setting-group"><label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>شدت سایه نوار</label>
                <div class="slider-row"><input type="range" min="0" max="100" step="5" value="${s.navShadowLevel||0}" oninput="updateDraft('navShadowLevel',this.value)"><span class="slider-val">${s.navShadowLevel||0}%</span></div>
            </div>
        </div>

        <div class="settings-content${settingsCat==='privacy'?' active':''}" data-cat="privacy">
            <div class="setting-group" style="border:1px solid var(--border);border-radius:14px;padding:14px;background:rgba(255,255,255,.02)">
                <label><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>قفل ورود با رمز</label>
                ${s.passwordEnabled&&s.password?`
                    <div style="text-align:center;padding:8px 0">
                        <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:12px;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.4);color:#10B981;font-size:11.5px;font-weight:700">
                            <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M20 6 9 17l-5-5"/></svg>
                            قفل فعال است
                        </div>
                    </div>
                    <button class="btn-secondary" style="width:100%" onclick="removePassword()">
                        <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        حذف رمز
                    </button>
                `:`
                    <div style="font-size:11px;color:var(--text-muted);line-height:1.8;text-align:center;padding:6px 0">برای فعال‌سازی، رمز دلخواه خود را وارد کنید (حداقل ۴ کاراکتر)</div>
                    <input type="password" class="password-input" id="newPass1" placeholder="رمز جدید" maxlength="32" style="margin-bottom:8px">
                    <input type="password" class="password-input" id="newPass2" placeholder="تکرار رمز" maxlength="32" style="margin-bottom:10px">
                    <button class="btn-primary" style="width:100%;justify-content:center" onclick="updatePassword()">
                        <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        فعال‌سازی قفل
                    </button>
                `}
            </div>

            <div class="setting-group" style="border:1px solid var(--border);border-radius:14px;padding:14px;background:rgba(255,255,255,.02)">
                <label><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/></svg>قفل خودکار بعد از بی‌کاری</label>
                <div style="font-size:10.5px;color:var(--text-muted);line-height:1.8;padding:2px 0 6px">اگه تا مدت مشخصی با سایت کار نکنی، خودکار قفل میشه.</div>
                <div class="slider-row"><input type="range" min="0" max="60" step="5" value="${s.autoLockMinutes||0}" oninput="updateDraft('autoLockMinutes',this.value)"><span class="slider-val">${(s.autoLockMinutes||0)===0?'خاموش':(s.autoLockMinutes+' دقیقه')}</span></div>
            </div>

            <div class="setting-group" style="border:1px solid var(--border);border-radius:14px;padding:14px;background:rgba(255,255,255,.02)">
                <label><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 20h8"/><path d="M12 18v2"/></svg>دستگاه‌های فعال</label>
                <div style="font-size:10.5px;color:var(--text-muted);line-height:1.8;padding:2px 0 8px">این نشست‌ها روی همین مرورگر در تب‌های مختلف ثبت می‌شن.</div>
                <div id="sessionsListInner"></div>
                ${s.passwordEnabled&&s.password?`
                    <button class="btn-secondary" style="width:100%;margin-top:6px;border-color:rgba(239,68,68,.4);color:#F87171" onclick="logoutOtherSessions()">
                        <svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        خروج همه دستگاه‌های دیگه
                    </button>
                `:''}
            </div>

            <div class="setting-group" style="border:1px solid var(--border);border-radius:14px;padding:14px;background:rgba(255,255,255,.02)">
                <label><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>بکاپ‌گیری از اطلاعات</label>
                <div style="font-size:10.5px;color:var(--text-muted);line-height:1.8;padding:4px 0">تاریخچه چت، برنامه‌ریز، مقالات، ویدیوها و تنظیمات</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">
                    <button class="btn-primary" style="justify-content:center" onclick="exportBackup()">
                        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                        دانلود
                    </button>
                    <label class="btn-secondary" style="cursor:pointer;justify-content:center">
                        <input type="file" accept=".json" onchange="importBackup(event)" style="display:none">
                        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>
                        بازیابی
                    </label>
                </div>
            </div>
            <div class="setting-group" style="border:1px solid rgba(239,68,68,.3);border-radius:14px;padding:14px;background:rgba(239,68,68,.04)">
                <label style="color:#F87171"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>منطقه خطر</label>
                <button class="btn-secondary" style="width:100%;border-color:rgba(239,68,68,.4);color:#F87171" onclick="if(confirm('همه اطلاعات پاک بشه؟ این کار قابل بازگشت نیست!')){localStorage.clear();sessionStorage.clear();location.reload();}">
                    <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    پاک کردن همه اطلاعات
                </button>
            </div>
        </div>

        <div class="settings-content${settingsCat==='about'?' active':''}" data-cat="about">
            <div class="about-hero">
                <div class="about-avatar">${s.profileImage?`<img src="${s.profileImage}" alt="حامد">`:'<span style="font-size:44px">ح ا</span>'}</div>
                <div class="about-name">حامد انصاری‌فر</div>
                <div class="about-role">سازنده سراج</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
                    <label class="btn-primary" style="cursor:pointer">
                        <input type="file" accept="image/*" onchange="handleProfileUpload(event)" style="display:none">
                        <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                        انتخاب عکس پروفایل
                    </label>
                    ${s.profileImage?`<button class="btn-secondary" onclick="updateDraft('profileImage','');renderSettingsControls()">حذف عکس</button>`:''}
                </div>
                <div style="font-size:10.5px;color:var(--text-muted);text-align:center;margin-top:4px">حداکثر ۱.۵ مگابایت — بعد از انتخاب، دکمه «اعمال تغییرات» را بزن</div>
            </div>
            <div class="about-bio-card">
                سلام 👋<br>
                من حامد هستم — یه جوون ۲۰ ساله اهل اراک که عاشق ایران و یادگیریه. الان دانشجوی زبان و ادبیات عربی دانشگاه قمم و کنار درس، به هوش مصنوعی و برنامه‌نویسی هم علاقه‌ی زیادی دارم. یه زمانی ادیتور و مجسمه‌ساز بودم.<br><br>
                سراج رو با یه ایده‌ی ساده شروع کردم — اینکه بتونم به یادگیری بچه‌های کشورم کمک کنم. الان دارم تلاش می‌کنم سراج رو بهتر و کامل‌تر کنم. هنوز خودم هم در حال یادگیریم و کلی چیز برای کشف کردن هست 🌱
            </div>
            <div class="about-section-title">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                راه های ارتباطی
            </div>
            <div class="about-contacts">
                <div class="contact-row" onclick="copyContact('ranshamed.fr@gmail.com',this)">
                    <div class="contact-icon"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg></div>
                    <div class="contact-info"><div class="contact-label">ایمیل</div><div class="contact-value">ranshamed.fr@gmail.com</div></div>
                    <div class="contact-copy">کپی</div>
                </div>
                <div class="contact-row" onclick="copyContact('@Ra_Nsss',this)">
                    <div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M21 3 3 10l6 3 3 6 9-16z"/><path d="M9 13 21 3"/></svg></div>
                    <div class="contact-info"><div class="contact-label">تلگرام</div><div class="contact-value">@Ra_Nsss</div></div>
                    <div class="contact-copy">کپی</div>
                </div>
                <div class="contact-row" onclick="copyContact('Hamed_Rans',this)">
                    <div class="contact-icon"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></div>
                    <div class="contact-info"><div class="contact-label">اینستاگرام</div><div class="contact-value">Hamed_Rans</div></div>
                    <div class="contact-copy">کپی</div>
                </div>
                <div class="contact-row" onclick="copyContact('Hamed_Rans',this)">
                    <div class="contact-icon"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor" stroke="none"/></svg></div>
                    <div class="contact-info"><div class="contact-label">ایکس</div><div class="contact-value">Hamed_Rans</div></div>
                    <div class="contact-copy">کپی</div>
                </div>
            </div>
        </div>`;
    setTimeout(()=>{
        document.querySelectorAll('#settingsContentWrap input[type=range]').forEach(inp=>{
            inp.setAttribute('dir','ltr');inp.style.direction='ltr';
            const pct=((inp.value-inp.min)/(inp.max-inp.min))*100;
            inp.style.setProperty('--slider-pct',pct+'%');
        });
        if(settingsCat==='privacy')renderSessionsList();
    },0);
}

function ensureClickable(){
    const s=document.getElementById('navSlider');
    if(s){s.style.pointerEvents='none';s.style.zIndex='0';}
    document.querySelectorAll('.bottom-nav-btn, .nav-collapse-tab').forEach(b=>{
        b.style.pointerEvents='auto';b.style.position='relative';b.style.zIndex='2';
    });
}
document.addEventListener('visibilitychange',()=>{
    if(!document.hidden){
        setTimeout(()=>{ensureClickable();if(typeof window.updateNavSlider==='function')window.updateNavSlider(false);},100);
        if(settings.lockOnTabSwitch&&settings.passwordEnabled&&settings.password){
            sessionStorage.removeItem(LOCK_SESSION_KEY);
            const ls=document.getElementById('lockScreen');
            if(ls)ls.classList.add('open');
            const hb=document.getElementById('headerLockBtn');
            if(hb)hb.classList.add('locked');
        }
        if(settings.passwordEnabled&&settings.password&&sessionStorage.getItem(LOCK_SESSION_KEY)==='1'){
            pingMySession();
        }
    }
});
window.addEventListener('scroll',ensureClickable,{passive:true});
window.addEventListener('resize',()=>{if(typeof window.updateNavSlider==='function')window.updateNavSlider(false);});
window.addEventListener('beforeunload',()=>{
    try{unregisterMySession();}catch(e){}
});
function unregisterMySession(){
    const id=getMySessionId();
    const sessions=loadSessions();
    delete sessions[id];
    saveSessions(sessions);
}

window.addEventListener('load',()=>{
    setTimeout(()=>{const sl=document.getElementById('splashLoader');if(sl)sl.classList.add('hidden');},400);
    try{const savedImg=localStorage.getItem(PROFILE_IMG_KEY);if(savedImg&&!settings.profileImage)settings.profileImage=savedImg;}catch(e){}
    initNavState();
    applySettingsToUI();
    ensureCurrentFontLoaded();
    if(!currentChatId)createNewChat(true);
    toggleWelcome();
    renderPanelForChat();
    renderPlanner();
    renderBlog();
    renderCommunity();
    renderTools();
    ensureClickable();
    setTimeout(()=>{if(typeof window.updateNavSlider==='function')window.updateNavSlider(false);},700);
    cleanupSessions();
    checkLock();
    sessionPingInterval=setInterval(()=>{
        if(settings.passwordEnabled&&settings.password&&sessionStorage.getItem(LOCK_SESSION_KEY)==='1'){
            pingMySession();
            cleanupSessions();
            if(settingsCat==='privacy')renderSessionsList();
        }
    },30000);
    resetInactivityTimer();
});
