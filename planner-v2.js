/* Siraj v2.6 — planner-v2.js (Complete with all patches) */
(function(){
  'use strict';

  function _boot(){
    if(typeof window.renderPlanner==='function' && typeof window.loadPlannerNew==='function'){
      try{ init(); }catch(e){ console.error('[Planner]', e); }
      return true;
    }
    return false;
  }
  if(!_boot()){
    var boot=setInterval(function(){ if(_boot()) clearInterval(boot); }, 100);
  }

  function init(){

    var PROFILE_KEY      = 'siraj-profile';
    var REMINDER_KEY     = 'siraj-reminders';
    var STUDY_CHAT_KEY   = 'siraj-study-chat-session';
    var LEVEL_KEY        = 'siraj-user-level';
    var DEFAULT_VIEW_KEY = 'siraj-default-view';
    var DAILY_STATE_KEY  = 'siraj-daily-state';
    var USER_AVATAR_URL  = 'siraj-logo.png';
    var VIEW_ORDER       = ['planner','tools','chat','blog','videos'];
    var _currentMainView = 'chat';
    var _lastTab         = 'daily';
    var _injectingHeaderActions = false;
    var _studyDragHandlers = null;
    var SOUND_FILES = {
      nature:'sounds/ocean.mp3', forest:'sounds/forest.mp3',
      hall:'sounds/hall.mp3',    rain:'sounds/rain.mp3'
    };

    var LEVEL_LABELS = {beginner:'مبتدی', intermediate:'متوسط', advanced:'پیشرفته'};
    var VIEW_LABELS  = {chat:'گفتگو', planner:'برنامه‌ریز', blog:'مقالات', videos:'دیوان', tools:'دستیار'};

    if(typeof window._plannerNavState === 'undefined'){
      window._plannerNavState = { daily:false, weekly:false, monthly:false, yearly:false };
    }
    if(typeof window._savedPlannerDate === 'undefined'){
      window._savedPlannerDate = { daily:null, weekly:null, monthly:null, yearly:null };
    }
    if(typeof window.plannerDate === 'undefined'){
      window.plannerDate = new Date();
    }

    /* ═══ SI_ICONS — آیکون‌های SVG اختصاصی سراج ═══ */
    var SI_ICONS = {
      target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      books: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h6M9 11h4"/></svg>',
      pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/><path d="m15 5 4 4"/></svg>',
      graduation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5"/></svg>',
      library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
      checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
      flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
      lamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21h6"/><path d="M12 21v-5"/><path d="M6 16h12l-2-8H8z"/><path d="M12 8V5"/><path d="M9 5h6"/><circle cx="12" cy="12.5" r="1.2" fill="currentColor" stroke="none" opacity=".55"/></svg>',
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
      award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
      chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M7 16v-5M12 16v-9M17 16v-3"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 14.09 8.26 19.5 9l-4 3.5L16.5 18 12 15.5 7.5 18 8.5 12.5 4.5 9l5.41-.74z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>'
    };
            ,
      calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
      award: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
      chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18"/><path d="M7 16v-5M12 16v-9M17 16v-3"/></svg>',
      sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 14.09 8.26 19.5 9l-4 3.5L16.5 18 12 15.5 7.5 18 8.5 12.5 4.5 9l5.41-.74z"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 15.09 8.26 22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
      wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11.5V6a1.5 1.5 0 0 1 3 0v5"/><path d="M10 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M13 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M16 11V8a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-3a1.5 1.5 0 0 1 3 0"/></svg>'
    };
    window.SI_ICONS = SI_ICONS;

    var DAILY_POEMS = [
      {text:'وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ۞ وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا', by:'أحمد شوقي', meaning:'به آرزو کردن به هدف نمی‌رسی، بلکه دنیا با غلبه و تلاش به دست میاد.'},
      {text:'وَمَنْ يَتَصَبَّرْ يَجِدْ خَيْراً بِصَبْرِهِ ۞ وَمَنْ يَتَعَجَّلْ يَجْنِ غَيْرَ مَا يَشْتَهي', by:'متنبی', meaning:'هر کس شکیبایی کنه، با صبرش خیر می‌بینه؛ هر کس عجله کنه، چیزی جز آرزوش به دست نمیاره.'},
      {text:'تَعَلَّمْ فَلَيْسَ الْمَرْءُ يُولَدُ عَالِم', by:'متنبی', meaning:'یاد بگیر! چون هیچ انسانی عالم به دنیا نمیاد.'},
      {text:'وَمَا الْحُرُّ مَنْ يَحْيَا بِغَيْرِ حُرِّيَّةٍ', by:'أبو القاسم الشابي', meaning:'آزاده کسی نیست که بدون آزادی زندگی کنه.'},
      {text:'إِذَا الشَّعْبُ أَرَادَ الْحَيَاةَ فَلَا بُدَّ أَنْ يَسْتَجِيبَ الْقَدَرُ', by:'أبو القاسم الشابي', meaning:'اگه ملتی بخواد زندگی کنه، سرنوشت باید تسلیم بشه.'},
      {text:'دَعِ الْأَيَّامَ تَفْعَلُ مَا تَشَاءُ', by:'الإمام الشافعي', meaning:'بذار روزگار هر کاری می‌خواد بکنه.'},
      {text:'وَمَا أَنَا بِالَّذِي يَرْضَى بِذُلٍّ', by:'عنتره', meaning:'من کسی نیستم که به خواری راضی بشم.'}
    ];
    var DAILY_WORDS = [
      {text:'«کِتاب» یعنی کتاب. ریشه: ک-ت-ب. جمع: کُتُب.'},
      {text:'«قَلَم» یعنی قلم. ریشه: ق-ل-م. جمع: أقلام.'},
      {text:'«باب» یعنی در. ریشه: ب-و-ب. جمع: أبواب.'},
      {text:'«ماء» یعنی آب. جمع: میاه.'},
      {text:'«یَوم» یعنی روز. جمع: أیام.'},
      {text:'«شَمس» یعنی خورشید. جمع: شُموس.'},
      {text:'«قَمَر» یعنی ماه. ریشه: ق-م-ر. جمع: أقمار.'},
      {text:'«بَیت» یعنی خانه. جمع: بیوت.'},
      {text:'«طالِب» یعنی دانش‌آموز. جمع: طُلّاب.'},
      {text:'«مَدْرَسَة» یعنی مدرسه. جمع: مدارس.'},
      {text:'«صَبْر» یعنی شکیبایی. ریشه: ص-ب-ر.'},
      {text:'«عِلْم» یعنی دانش. ریشه: ع-ل-م.'},
      {text:'«أَدَب» یعنی ادب. ریشه: أ-د-ب.'}
    ];
    var DAILY_RULES = [
      {text:'«مُبْتَدَأ» و «خبر» هر دو مرفوع هستن.'},
      {text:'فعل ماضی برای گذشته و مضارع برای حال.'},
      {text:'«إنَّ» و «أنَّ» اسم رو منصوب و خبر رو مرفوع می‌کنن.'},
      {text:'فعل مضارع با «سـ» یعنی آینده‌ی نزدیک، با «سوف» آینده‌ی دور.'},
      {text:'«كان» و اخواتش اسم رو مرفوع و خبر رو منصوب می‌کنن.'},
      {text:'اسم فاعل بر وزن «فاعل» و اسم مفعول بر وزن «مفعول».'},
      {text:'«مِن، إلى، عَن، عَلى، في» از حروف جر هستن.'},
      {text:'تمییز، حال، و مفعول‌به همه از منصوبات هستن.'},
      {text:'لای نفی جنس: اسمش منصوب و خبرش مرفوع.'},
      {text:'اسلوب شرط: «إن» شرطیه دو فعل مضارع رو مجزوم می‌کنه.'},
      {text:'«مفعول مطلق» مصدر منصوبیه که برای تأکید فعل میاد.'},
      {text:'اسم تفضیل بر وزن «أفعَل» و اسم مبالغه بر وزن «فَعّال».'}
    ];

    function _hashStr(s){var h=0;for(var i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h=h&h;}return Math.abs(h);}
    function getTodayItem(dateKey){
      var seed=_hashStr(dateKey);
      var mode=seed%3;
      if(mode===0){
        var p=DAILY_POEMS[seed%DAILY_POEMS.length];
        return {type:'بیت',badge:'📖 بیت امروز',text:p.text,by:p.by,meaning:p.meaning,isAr:true};
      } else if(mode===1){
        var words=[];
        for(var i=0;i<3;i++) words.push(DAILY_WORDS[(seed+i)%DAILY_WORDS.length].text);
        return {type:'کلمه',badge:'📚 سه کلمه امروز',words:words,text:words.join(' | ')};
      } else {
        var r=DAILY_RULES[seed%DAILY_RULES.length];
        return {type:'قواعد',badge:'✏️ قاعده امروز',text:r.text};
      }
    }
    function loadDailyState(){ try{return JSON.parse(localStorage.getItem(DAILY_STATE_KEY)||'{}');}catch(e){return{};} }
    function saveDailyState(s){ try{localStorage.setItem(DAILY_STATE_KEY,JSON.stringify(s));}catch(e){} }
    function setItemState(dateKey,state){
      var s=loadDailyState();
      if(state===null) delete s[dateKey];
      else s[dateKey]=state;
      saveDailyState(s);
    }
    function getItemState(dateKey){
      var s=loadDailyState();
      return s[dateKey]||null;
    }
    function getAllLearned(){
      var s=loadDailyState(); var out=[];
      Object.keys(s).sort().reverse().forEach(function(dk){
        if(s[dk]==='learned'||s[dk]==='learned-review'){
          var it=getTodayItem(dk);
          if(it) out.push({dateKey:dk,item:it,state:s[dk]});
        }
      });
      return out;
    }
    function getAllPractice(){
      var s=loadDailyState(); var out=[];
      Object.keys(s).sort().reverse().forEach(function(dk){
        if(s[dk]==='practice'){
          var it=getTodayItem(dk);
          if(it) out.push({dateKey:dk,item:it,state:s[dk]});
        }
      });
      return out;
    }

    function toFa(n){var fa=['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];return String(n).replace(/\d/g,function(d){return fa[+d];});}
    function toFaPl(n){return toFa(n);}
    function formatMinutes(mins){mins=Math.max(0,Math.round(mins));if(mins<60)return toFa(mins)+' دقیقه';var h=Math.floor(mins/60),m=mins%60;if(m===0)return toFa(h)+' ساعت';return toFa(h)+' ساعت و '+toFa(m)+' دقیقه';}
    function formatTimer(mins){mins=Math.max(0,Math.round(mins));var h=Math.floor(mins/60),m=mins%60;return toFa(String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'));}
    function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function getUserLevel(){try{return localStorage.getItem(LEVEL_KEY)||'beginner';}catch(e){return 'beginner';}}
    function setUserLevel(l){try{localStorage.setItem(LEVEL_KEY,l);}catch(e){}}
    function getDefaultView(){try{return localStorage.getItem(DEFAULT_VIEW_KEY)||'chat';}catch(e){return 'chat';}}
    function setDefaultView(v){try{localStorage.setItem(DEFAULT_VIEW_KEY,v);}catch(e){}}
    function getBaseURL(){
      try{if(typeof APP_CONFIG!=='undefined'&&APP_CONFIG&&APP_CONFIG.baseURL)return APP_CONFIG.baseURL;}catch(e){}
      try{if(window.APP_CONFIG&&window.APP_CONFIG.baseURL)return window.APP_CONFIG.baseURL;}catch(e){}
      return '/api/chat';
    }
    function getModel(){
      try{if(typeof settings!=='undefined'&&settings&&settings.model)return settings.model;}catch(e){}
      try{if(window.settings&&window.settings.model)return window.settings.model;}catch(e){}
      return 'gemini-2.5-flash';
    }
    function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch(e){return{};}}
    function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));}catch(e){}}
    function profilePrompt(){
      var p=getProfile();
      if(!p.name&&!p.bio) return '';
      var out='\n\n👤 اطلاعات کاربر:\n';
      if(p.name) out+='• اسمش: '+p.name+'\n';
      if(p.bio)  out+='• درباره‌ی خودش: '+p.bio+'\n';
      out+='• سطح عربیش: '+LEVEL_LABELS[getUserLevel()]+'\n';
      return out;
    }
    function loadReminders(){try{return JSON.parse(localStorage.getItem(REMINDER_KEY)||'{}');}catch(e){return{};}}
    function saveReminders(r){try{localStorage.setItem(REMINDER_KEY,JSON.stringify(r));}catch(e){}}
    function getDayReminders(k){return loadReminders()[k]||[];}
    function setDayReminders(k,list){var r=loadReminders();if(list.length)r[k]=list;else delete r[k];saveReminders(r);}
    function timeUntilEndOfDay(){
      var now=new Date();
      var end=new Date(); end.setHours(23,59,59,999);
      var ms=end-now;
      var h=Math.floor(ms/3600000);
      var m=Math.floor((ms%3600000)/60000);
      return {h:h,m:m,text:h>0?toFa(h)+' ساعت و '+toFa(m)+' دقیقه':toFa(m)+' دقیقه'};
    }

    var IRAN_EVENTS = {
      '01-01':'نوروز','01-02':'عید نوروز','01-03':'عید نوروز','01-04':'عید نوروز',
      '01-06':'روز امید','01-12':'روز جمهوری اسلامی','01-13':'سیزده‌بدر',
      '01-19':'شهادت حضرت علی (ع)','01-21':'شهادت امام علی (ع)','01-22':'شب قدر',
      '01-23':'شب قدر','01-25':'روز بزرگداشت عطار','02-01':'عید فطر',
      '02-02':'تعطیل عید فطر','02-10':'روز ملی خلیج فارس','02-12':'روز معلم',
      '02-25':'روز بزرگداشت فردوسی','03-01':'روز بهره‌وری','03-06':'سالگرد آزادسازی خرمشهر',
      '03-14':'رحلت امام خمینی','03-15':'قیام ۱۵ خرداد','04-01':'روز اصناف',
      '04-07':'روز قوه قضائیه','04-10':'روز صنعت و معدن','04-14':'روز قلم',
      '04-25':'روز بهزیستی','05-05':'روز کارمند','05-08':'روز بزرگداشت سهروردی',
      '05-14':'روز بزرگداشت خیام','06-05':'روز بزرگداشت رازی','06-27':'روز شعر و ادب فارسی',
      '06-31':'آغاز هفته دفاع مقدس','07-13':'روز نیروی انتظامی','07-20':'روز بزرگداشت حافظ',
      '08-08':'روز نوجوان','08-13':'روز دانش‌آموز','08-24':'روز کتاب و کتابخوانی',
      '09-16':'روز دانشجو','10-05':'روز خانواده','10-19':'روز بزرگداشت مولوی',
      '11-12':'پیروزی انقلاب اسلامی','11-22':'روز بزرگداشت خواجه نصیر',
      '12-05':'روز بزرگداشت خواجه نصیرالدین طوسی','12-20':'روز بزرگداشت نظامی گنجوی',
      '12-29':'روز ملی شدن صنعت نفت'
    };
    function getIranianEvent(dayKey){
      try{
        var parts=dayKey.split('-');
        var gDate=new Date(parseInt(parts[0]),parseInt(parts[1])-1,parseInt(parts[2]));
        var faMonth=new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(gDate);
        var faDay  =new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric'}).format(gDate);
        var key=String(faMonth).padStart(2,'0')+'-'+String(faDay).padStart(2,'0');
        return IRAN_EVENTS[key]||'';
      }catch(e){return '';}
    }

    function getTab(){
      var btn=document.querySelector('.panel-planner-tab.active');
      if(!btn) return 'daily';
      var m=(btn.getAttribute('onclick')||'').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);
      return m?m[1]:'daily';
    }
    function dateParts(d){
      try{return{
        weekday:d.toLocaleDateString('fa-IR',{weekday:'long'}),
        dayNum:d.toLocaleDateString('fa-IR',{day:'numeric'}),
        monthName:d.toLocaleDateString('fa-IR',{month:'long'}),
        yearNum:d.toLocaleDateString('fa-IR',{year:'numeric'})
      };}catch(e){return{weekday:'',dayNum:'',monthName:'',yearNum:''};}
    }
    function weekOfMonth(){
      var d=window.plannerDate||new Date();
      try{
        var day=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric'}).format(d));
        return Math.ceil(day/7);
      }catch(e){return 1;}
    }
    var ORD=['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){n=Math.max(1,Math.min(6,n));return ORD[n-1];}
    function weekStart(d){var x=new Date(d);x.setHours(0,0,0,0);var diff=(x.getDay()+1)%7;x.setDate(x.getDate()-diff);return x;}
    function myWeekDays(){
      var d=weekStart(window.plannerDate||new Date());
      var days=[];
      for(var i=0;i<7;i++){
        var dt=new Date(d); dt.setDate(d.getDate()+i);
        days.push({key:window.dateKey(dt),name:window.getDayName(dt),date:dt.toLocaleDateString('fa-IR',{month:'short',day:'numeric'}),dateObj:dt});
      }
      return days;
    }

    function isCurrentDay(){return window.dateKey(window.plannerDate||new Date())===window.dateKey(new Date());}
    function isCurrentWeek(){
      var t=new Date();var pd=window.plannerDate||new Date();
      var ws=weekStart(pd);var we=new Date(ws);we.setDate(we.getDate()+6);we.setHours(23,59,59,999);
      return t>=ws && t<=we;
    }
    function isCurrentMonth(){var t=new Date();var pd=window.plannerDate||new Date();return t.getFullYear()===pd.getFullYear() && t.getMonth()===pd.getMonth();}
    function isCurrentYear(){var t=new Date();var pd=window.plannerDate||new Date();return t.getFullYear()===pd.getFullYear();}

    function showPopup(emoji,title,text){
      var old=document.getElementById('sirajPopup'); if(old) old.remove();
      var el=document.createElement('div');el.id='sirajPopup';el.className='siraj-popup-overlay';
      el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><button class="siraj-popup-btn" id="sirajPopupOk">متوجه شدم</button></div>';
            document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      el.querySelector('#sirajPopupOk').onclick=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
    }
    function showConfirm(emoji,title,text,onYes,yesText,noText){
      var old=document.getElementById('sirajConfirmPopup'); if(old) old.remove();
      var el=document.createElement('div');el.id='sirajConfirmPopup';el.className='siraj-popup-overlay';
      el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions"><button class="siraj-popup-btn secondary" id="sirajConfirmNo">'+(noText||'نه')+'</button><button class="siraj-popup-btn" id="sirajConfirmYes">'+(yesText||'بله')+'</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
      el.querySelector('#sirajConfirmYes').onclick=function(){close();if(onYes)onYes();};
      el.querySelector('#sirajConfirmNo').onclick=close;
    }
    function showTriple(emoji,title,text,opt1,opt2,opt3){
      var old=document.getElementById('sirajTriplePopup'); if(old) old.remove();
      var el=document.createElement('div');el.id='sirajTriplePopup';el.className='siraj-popup-overlay';
      el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions-3"><button class="siraj-popup-btn secondary" id="sirajTriple1">'+opt1.text+'</button><button class="siraj-popup-btn secondary" id="sirajTriple2">'+opt2.text+'</button><button class="siraj-popup-btn" id="sirajTriple3">'+opt3.text+'</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},320);};
      el.querySelector('#sirajTriple1').onclick=function(){close();if(opt1.onClick)opt1.onClick();};
      el.querySelector('#sirajTriple2').onclick=function(){close();if(opt2.onClick)opt2.onClick();};
      el.querySelector('#sirajTriple3').onclick=function(){close();if(opt3.onClick)opt3.onClick();};
    }

    function makeSelect(id,value,options,label){
      var cur=options.find(function(o){return o.value===value;})||options[0];
      var items=options.map(function(o){
        return '<div class="siraj-select-item '+(o.value===value?'active':'')+'" data-value="'+o.value+'">'+(o.dot?'<span class="dot '+o.dot+'"></span>':'')+'<span>'+esc(o.label)+'</span></div>';
      }).join('');
      return '<div class="siraj-select" id="'+id+'">'+(label?'<div class="siraj-select-label">'+esc(label)+'</div>':'')+'<div class="siraj-select-trigger"><span class="siraj-select-value">'+(cur.dot?'<span class="dot '+cur.dot+'"></span>':'')+esc(cur.label)+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel">'+items+'</div></div>';
    }
    function bindSelects(root,handlers){
      if(!root) return;
      root.querySelectorAll('.siraj-select').forEach(function(sel){
        var trig=sel.querySelector('.siraj-select-trigger'); if(!trig) return;
        trig.onclick=function(e){
          e.stopPropagation();
          var was=sel.classList.contains('open');
          document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
          if(!was) sel.classList.add('open');
        };
        sel.querySelectorAll('.siraj-select-item').forEach(function(item){
          item.onclick=function(e){
            e.stopPropagation();
            var val=item.getAttribute('data-value');
            sel.classList.remove('open');
            if(handlers&&handlers[sel.id]) handlers[sel.id](val,item);
          };
        });
      });
    }
    document.addEventListener('click',function(){
      document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
    });

    function smartUpdateHero(tab,direction){
      var c=document.querySelector('.phc-center'); if(!c) return;
      var d=new Date(window.plannerDate||new Date());
      var map={};
      if(tab==='daily'){
        var p=dateParts(d);
        map.weekday=p.weekday;map.dayNum=p.dayNum;map.monthName=p.monthName;map.yearNum=p.yearNum;
      } else if(tab==='weekly'){
        var days=myWeekDays();var p2=dateParts(d);
        map.monthName2=p2.monthName;map.yearNum2=p2.yearNum;
        map.weekOrdinal='هفته '+weekOrd(weekOfMonth())+' ماه';
        map.weekRange='از '+days[0].date+' تا '+days[6].date;
      } else if(tab==='monthly'){
        var p3=dateParts(d);map.monthName3=p3.monthName;map.yearNum3=p3.yearNum;
        var pl=window.loadPlannerNew();
        var mk=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
        var goals=(pl.months[mk]&&pl.months[mk].goals)||[];
        var dg=goals.filter(function(g){return g.done;}).length;
        map.monthStat=toFa(dg)+' از '+toFa(goals.length)+' هدف این ماه انجام شده';
      } else if(tab==='yearly'){
        map.yearNum4=d.toLocaleDateString('fa-IR',{year:'numeric'});
      }
      var isNext=direction!=='right';
      c.querySelectorAll('[data-anim-key]').forEach(function(el){
        var k=el.getAttribute('data-anim-key');
        if(map[k]===undefined) return;
        var nv=map[k];
        if(el.textContent.trim()===nv) return;
        el.classList.remove('heroOutRight','heroOutLeft','heroInFromLeft','heroInFromRight');
        void el.offsetWidth;
        el.classList.add(isNext?'heroOutRight':'heroOutLeft');
        setTimeout(function(){
          el.classList.remove('heroOutRight','heroOutLeft');
          el.textContent=nv;
          void el.offsetWidth;
          el.classList.add(isNext?'heroInFromLeft':'heroInFromRight');
          setTimeout(function(){el.classList.remove('heroInFromLeft','heroInFromRight');},400);
        },220);
      });
      var bbEl=c.querySelector('.phc-back-inline');
      if(bbEl){
        var hideIt=false;
        if(tab==='daily') hideIt=isCurrentDay();
        else if(tab==='weekly') hideIt=isCurrentWeek();
        else if(tab==='monthly') hideIt=isCurrentMonth();
        else if(tab==='yearly') hideIt=isCurrentYear();
        if(hideIt){
          bbEl.classList.add('hidden');
          bbEl.classList.remove('appearing');
        } else {
          var wasHidden=bbEl.classList.contains('hidden');
          bbEl.classList.remove('hidden');
          if(wasHidden){
            bbEl.classList.remove('appearing');
            void bbEl.offsetWidth;
            bbEl.classList.add('appearing');
          }
        }
      }
      var tb=c.querySelector('.phc-today');
      if(tb){
        var isT=window.dateKey(d)===window.dateKey(new Date());
        if(isT){
          if(tb.style.display==='none'||!tb.style.display){
            tb.style.display='';
            tb.classList.remove('phc-today-anim');
            void tb.offsetWidth;
            tb.classList.add('phc-today-anim');
          }
        } else tb.style.display='none';
      }
    }

    function moveDate(dir,unit){
      var d=new Date(window.plannerDate||new Date());
      if(unit==='day') d.setDate(d.getDate()+dir);
      else if(unit==='week') d.setDate(d.getDate()+dir*7);
      else if(unit==='month'){d.setDate(1);d.setMonth(d.getMonth()+dir);}
      else if(unit==='year') d.setFullYear(d.getFullYear()+dir);
      window.plannerDate=d;
      var tab = getTab();
      if(tab && window._savedPlannerDate){
        window._savedPlannerDate[tab] = new Date(d);
        window._plannerNavState[tab] = true;
      }
      refreshBody(dir>0?'left':'right');
    }
    window.__navDay=function(d){moveDate(d,'day');};
    window.__navWeek=function(d){moveDate(d,'week');};
    window.__navMonth=function(d){moveDate(d,'month');};
    window.__navYear=function(d){moveDate(d,'year');};
    window.__goToday=function(){
      window.plannerDate=new Date();
      var tab = getTab();
      if(tab && window._savedPlannerDate){
        window._savedPlannerDate[tab] = new Date();
        window._plannerNavState[tab] = true;
      }
      refreshBody('left');
    };
    window.__goThisWeek=window.__goToday;
    window.__goThisMonth=window.__goToday;
    window.__goThisYear=window.__goToday;

    function refreshBody(direction){
      var pane=document.getElementById('plannerPane'); if(!pane) return;
      if(pane.dataset.animating==='1') return;
      var tab=getTab();
      var isSameTab=pane.dataset.lastTab===tab;
      pane.dataset.lastTab=tab;
      var dir=direction||'left';
      if(isSameTab){
        smartUpdateHero(tab,dir);
        var body=pane.querySelector('.planner-body-content');
        if(!body){renderPane(tab);return;}
        if(tab==='monthly'){
          var cal=pane.querySelector('.month-calendar');
          if(cal){
            var outC=dir==='left'?'cal-out-right':'cal-out-left';
            var inC =dir==='left'?'cal-in-from-left':'cal-in-from-right';
            cal.classList.add(outC);
            setTimeout(function(){
              var html=monthlyContentHTML();
              body.innerHTML=html;
              bindPaneEvents(tab);
              var newCal=body.querySelector('.month-calendar');
              if(newCal){
                newCal.classList.remove('cal-in-from-left','cal-in-from-right');
                void newCal.offsetWidth;
                newCal.classList.add(inC);
                setTimeout(function(){newCal.classList.remove(inC);},420);
              }
            },220);
            return;
          }
        }
        var html='';
        if(tab==='daily') html=dailyContentHTML();
        else if(tab==='weekly') html=weeklyContentHTML();
        else if(tab==='yearly') html=yearlyContentHTML();
        body.innerHTML=html;
        bindPaneEvents(tab);
        if(tab==='weekly') setTimeout(setupWeekSummaryClicks,50);
        body.style.animation='none';
        void body.offsetWidth;
        body.style.animation='bodyFadeIn .3s ease';
        return;
      }
      pane.dataset.animating='1';
      pane.style.pointerEvents='none';
      var html='';
      if(tab==='daily') html=viewDaily();
      else if(tab==='weekly') html=viewWeekly();
      else if(tab==='monthly') html=viewMonthly();
      else if(tab==='yearly') html=viewYearly();
      pane.innerHTML=html;
      bindPaneEvents(tab);
      if(tab==='weekly') setTimeout(setupWeekSummaryClicks,50);
      var hero=pane.querySelector('.planner-hero-card');
      var bodyEl=pane.querySelector('.planner-body-content');
      if(hero){ hero.style.opacity='0'; hero.style.transform='translateY(-10px)'; }
      if(bodyEl){ bodyEl.style.opacity='0'; bodyEl.style.transform='translateY(20px)'; }
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          if(hero){
            hero.style.transition='opacity .4s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.34,1.2,.64,1)';
            hero.style.opacity='1'; hero.style.transform='translateY(0)';
          }
          if(bodyEl){
            bodyEl.style.transition='opacity .45s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.34,1.2,.64,1)';
            bodyEl.style.opacity='1'; bodyEl.style.transform='translateY(0)';
          }
          setTimeout(function(){
            if(hero){hero.style.transition='';hero.style.opacity='';hero.style.transform='';}
            if(bodyEl){bodyEl.style.transition='';bodyEl.style.opacity='';bodyEl.style.transform='';}
          },620);
        });
      });
      setTimeout(function(){pane.style.pointerEvents='';delete pane.dataset.animating;},50);
    }
    window.__refreshCurrentTab=refreshBody;

    window.switchPlannerTab=function(tab){
      var prev = getTab();
      if(prev && prev !== tab && window._plannerNavState[prev]){
        window._savedPlannerDate[prev] = new Date(window.plannerDate||new Date());
      }
      _lastTab=tab;
      document.querySelectorAll('.panel-planner-tab').forEach(function(b){b.classList.remove('active');});
      var idx={daily:0,weekly:1,monthly:2,yearly:3}[tab];
      var btns=document.querySelectorAll('.panel-planner-tab');
      if(btns[idx]) btns[idx].classList.add('active');
      if(!window._plannerNavState[tab]){
        window.plannerDate = new Date();
        window._plannerNavState[tab] = true;
      } else if(window._savedPlannerDate[tab]){
        window.plannerDate = new Date(window._savedPlannerDate[tab]);
      }
      var pane=document.getElementById('plannerPane');
      if(pane) pane.dataset.lastTab='';
      refreshBody('left');
      if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
    };

    function renderPane(tab){
      var pane=document.getElementById('plannerPane'); if(!pane) return;
      pane.innerHTML='';
      void pane.offsetWidth;
      if(tab==='daily') pane.innerHTML=viewDaily();
      else if(tab==='weekly') pane.innerHTML=viewWeekly();
      else if(tab==='monthly') pane.innerHTML=viewMonthly();
      else if(tab==='yearly') pane.innerHTML=viewYearly();
      bindPaneEvents(tab);
      if(tab==='weekly') setTimeout(setupWeekSummaryClicks,50);
      pane.dataset.lastTab=tab;
    }
    window.renderPlannerPane=function(){renderPane(getTab());};

    function bindPaneEvents(tab){
      var pane=document.getElementById('plannerPane'); if(!pane) return;
      if(tab==='daily'){
        bindSelects(pane,{
          pNewTime:function(val,item){var el=pane.querySelector('#pNewTime .siraj-select-value');if(el)el.textContent=item.textContent.trim();window.__pendingTime=val;},
          pNewPri:function(val,item){var el=pane.querySelector('#pNewPri .siraj-select-value');if(el)el.innerHTML=item.innerHTML;window.__pendingPri=val;}
        });
      }
    }

    /* ═══ HERO FUNCTIONS ═══ */
    function heroDaily(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var key=window.dateKey(d);
      var isToday=key===window.dateKey(new Date());
      var monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if(!pl.months[monthKey]) pl.months[monthKey]={goals:[]};
      var goals=pl.months[monthKey].goals||[];
      var goal=goals.length?(goals.find(function(g){return !g.done;})||goals[0]):null;
      var p=dateParts(d);
      var backBtn = isToday
        ? '<button class="phc-back-inline hidden" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد امروز</span></button>'
        : '<button class="phc-back-inline appearing" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد امروز</span></button>';
      return '<div class="planner-hero-card">'
        +'<button class="phc-nav-btn" onclick="window.__navDay(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>'
        +'<div class="phc-center">'
        +'<div class="phc-day">'
        +'<span data-anim-key="weekday">'+esc(p.weekday||'')+'</span>'
        +'<span class="phc-today" style="'+(isToday?'':'display:none')+'">امروز</span>'
        +backBtn
        +'</div>'
        +'<div class="phc-date"><span data-anim-key="dayNum">'+esc(p.dayNum||'')+'</span> <span data-anim-key="monthName">'+esc(p.monthName||'')+'</span> <span data-anim-key="yearNum">'+esc(p.yearNum||'')+'</span></div>'
        +(goal?'<div class="phc-goal"><span>🎯</span><span>هدف ماه: '+esc(goal.text)+'</span></div>':'<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>')
        +'</div>'
        +'<button class="phc-nav-btn" onclick="window.__navDay(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>'
        +'</div>';
    }
    function heroWeekly(){
      var d=new Date(window.plannerDate||new Date());
      var days=myWeekDays();
      var p=dateParts(d);
      var ic=isCurrentWeek();
      var backBtn = ic
        ? '<button class="phc-back-inline hidden" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد این هفته</span></button>'
        : '<button class="phc-back-inline appearing" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد این هفته</span></button>';
      return '<div class="planner-hero-card">'
        +'<button class="phc-nav-btn" onclick="window.__navWeek(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>'
        +'<div class="phc-center">'
        +'<div class="phc-day">'
        +'<span data-anim-key="monthName2">'+esc(p.monthName||'')+'</span>'
        +'<span data-anim-key="yearNum2">'+esc(p.yearNum||'')+'</span>'
        +backBtn
        +'</div>'
        +'<div class="phc-date"><span data-anim-key="weekOrdinal">هفته '+weekOrd(weekOfMonth())+' ماه</span> — <span data-anim-key="weekRange">از '+esc(days[0].date||'')+' تا '+esc(days[6].date||'')+'</span></div>'
        +'</div>'
        +'<button class="phc-nav-btn" onclick="window.__navWeek(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>'
        +'</div>';
    }
    function heroMonthly(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var p=dateParts(d);
      var monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if(!pl.months[monthKey]) pl.months[monthKey]={goals:[]};
      var goals=pl.months[monthKey].goals||[];
      var dg=goals.filter(function(g){return g.done;}).length;
      var ic=isCurrentMonth();
      var backBtn = ic
        ? '<button class="phc-back-inline hidden" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد این ماه</span></button>'
        : '<button class="phc-back-inline appearing" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد این ماه</span></button>';
      return '<div class="planner-hero-card">'
        +'<button class="phc-nav-btn" onclick="window.__navMonth(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>'
        +'<div class="phc-center">'
        +'<div class="phc-day">'
        +'<span data-anim-key="monthName3">'+esc(p.monthName||'')+'</span>'
        +'<span data-anim-key="yearNum3">'+esc(p.yearNum||'')+'</span>'
        +backBtn
        +'</div>'
        +'<div class="phc-date" data-anim-key="monthStat">'+toFa(dg)+' از '+toFa(goals.length)+' هدف این ماه انجام شده</div>'
        +'</div>'
        +'<button class="phc-nav-btn" onclick="window.__navMonth(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>'
        +'</div>';
    }
    function heroYearly(){
      var d=new Date(window.plannerDate||new Date());
      var y=d.getFullYear();
      var pl=window.loadPlannerNew();
      if(!pl.years) pl.years={};
      if(!pl.years[y]) pl.years[y]={goals:[]};
      var goals=pl.years[y].goals||[];
      var done=goals.filter(function(g){return g.done;}).length;
      var ic=isCurrentYear();
      var backBtn = ic
        ? '<button class="phc-back-inline hidden" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد امسال</span></button>'
        : '<button class="phc-back-inline appearing" onclick="window.__goToday()"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg><span>برگرد امسال</span></button>';
      return '<div class="planner-hero-card">'
        +'<button class="phc-nav-btn" onclick="window.__navYear(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>'
        +'<div class="phc-center">'
        +'<div class="phc-day">'
        +'<span data-anim-key="yearNum4">'+esc(d.toLocaleDateString('fa-IR',{year:'numeric'})||'')+'</span>'
        +backBtn
        +'</div>'
        +'<div class="phc-date">'+toFa(done)+' از '+toFa(goals.length)+' هدف سالانه انجام شده</div>'
        +'</div>'
        +'<button class="phc-nav-btn" onclick="window.__navYear(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>'
        +'</div>';
    }

    function weekStatsHTML(){
      var pl=window.loadPlannerNew();var days=myWeekDays();
      var sm=0,dw=0,dwo=0;
      days.forEach(function(day){
        var dd=window.getDayData(pl,day.key);
        (dd.tasks||[]).forEach(function(tk){
          if(tk.done){
            if(tk.studiedMinutes){sm+=tk.studiedMinutes;dw++;}else dwo++;
          }
        });
      });
      if(!sm&&!dw&&!dwo) return '';
      return '<div class="week-stats-bar">'
        +'<div class="wsb-item"><span>⏱️</span><b>'+formatMinutes(sm)+'</b> مطالعه</div>'
        +'<div class="wsb-item"><span>✅</span>'+toFa(dw)+' با زمان</div>'
        +(dwo>0?'<div class="wsb-item warn"><span>⚪</span>'+toFa(dwo)+' بدون زمان</div>':'')
        +'</div>';
    }
    function getStreakDays(){
      var pl=window.loadPlannerNew();
      var d=new Date();d.setHours(0,0,0,0);
      var streak=0,isToday=true;
      for(var i=0;i<365;i++){
        var key=window.dateKey(d);
        var dd=window.getDayData(pl,key);
        var hasDone=(dd.tasks||[]).some(function(tk){return tk.done;});
        if(hasDone) streak++;
        else if(!isToday) break;
        isToday=false;
        d.setDate(d.getDate()-1);
      }
      return streak;
    }
    function streakHTML(){
      var s=getStreakDays();
      if(s<2) return '';
      var msg=s>=30?'فوق‌العاده‌ای! 🏆':s>=14?'عالی پیش می‌ری! ✨':s>=7?'ادامه بده! 💪':'خوب شروع کردی! 🌱';
      return '<div class="daily-streak"><span class="ds-fire">'+SI_ICONS.flame+'</span><span class="ds-num">'+toFa(s)+'</span><span class="ds-text">روز پشت‌سرهم فعالی — '+msg+'</span></div>';
    }

    function dailyWordHTML(){
      var d=new Date(window.plannerDate||new Date());
      var dk=window.dateKey(d);
      var state=getItemState(dk);
      if(state!==null) return '';
      var it=getTodayItem(dk);
      if(!it) return '';
      var badgeIcon = it.type === 'بیت' ? SI_ICONS.bookOpen
                    : it.type === 'کلمه' ? SI_ICONS.books
                    : SI_ICONS.pencil;
      var badgeText = it.badge.replace(/^[^\s]+\s/,'');
      var html='<div class="daily-cards"><div class="daily-card">';
      html+='<div class="daily-card-head">'
        +'<span class="daily-card-badge"><span class="badge-icon">'+badgeIcon+'</span>'+esc(badgeText)+'</span>'
        +'<div class="daily-card-actions">'
        +'<button class="daily-action-btn learn-yes" onclick="window.__dailyLearn(\'learned\')">✓ یاد گرفتم</button>'
        +'<button class="daily-action-btn learn-no" onclick="window.__dailyLearn(\'practice\')">✗ یاد نگرفتم</button>'
        +'<button class="daily-action-btn learn-study" onclick="window.__dailyLearnChat()">🎓 یادگیری با سراج</button>'
        +'</div></div>';
      if(it.words){
        html+='<div class="daily-card-words">';
        it.words.forEach(function(w,i){
          html+='<div class="dcw-item"><span class="dcw-num">'+toFa(i+1)+'</span><span class="dcw-text">'+esc(w)+'</span></div>';
        });
        html+='</div>';
      } else {
        html+='<div class="daily-card-body">';
        html+='<div class="daily-card-text ar">'+esc(it.text)+'</div>';
        if(it.meaning){html+='<div class="daily-card-meaning">'+esc(it.meaning)+'</div>';}
        if(it.by){html+='<div class="daily-card-author">'+esc(it.by)+'</div>';}
        html+='</div>';
      }
      html+='</div></div>';
      return html;
    }

    window.__dailyLearn=function(mode){
      var d=new Date(window.plannerDate||new Date());
      var dk=window.dateKey(d);
      var remain=timeUntilEndOfDay();
      if(mode==='learned'){
        var old=document.getElementById('sirajPopup'); if(old) old.remove();
        var el=document.createElement('div');el.id='sirajPopup';el.className='siraj-popup-overlay';
        el.innerHTML='<div class="siraj-popup">'
          +'<span class="siraj-popup-emoji">🎉</span>'
          +'<div class="siraj-popup-title">آفرین!</div>'
          +'<div class="siraj-popup-text">هنوز '+remain.text+' تا آخر امروز مونده — چیکارش کنم؟</div>'
          +'<div class="siraj-popup-actions">'
          +'<button class="siraj-popup-btn secondary" id="dLearnDelete">🗑️ حذف کن</button>'
          +'<button class="siraj-popup-btn" id="dLearnKeep">📚 بذار مرور کنم</button>'
          +'</div></div>';
        document.body.appendChild(el);
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){ el.classList.add('open'); });
        });
        var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
        el.querySelector('#dLearnDelete').onclick=function(){
          close();setItemState(dk,null);
          if(window.toast) window.toast('از یادگرفته‌ها حذف شد','info');
          refreshBody('left');
          if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
        };
        el.querySelector('#dLearnKeep').onclick=function(){
          close();setItemState(dk,'learned-review');
          if(window.toast) window.toast('به یادگرفته‌ها اضافه شد ✓','success');
          refreshBody('left');
          if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
        };
      } else {
        setItemState(dk,'practice');
        var old2=document.getElementById('sirajPopup'); if(old2) old2.remove();
        var el2=document.createElement('div');el2.id='sirajPopup';el2.className='siraj-popup-overlay';
        el2.innerHTML='<div class="siraj-popup">'
          +'<span class="siraj-popup-emoji">💪</span>'
          +'<div class="siraj-popup-title">نگران نباش</div>'
          +'<div class="siraj-popup-text">هنوز '+remain.text+' تا آخر امروز مونده — هنوز می‌تونی یادش بگیری 🌱<br><br>توی «کتابخانه یادگیری» هست برات.</div>'
          +'<button class="siraj-popup-btn" id="dPracOk">باشه</button></div>';
        document.body.appendChild(el2);
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){ el2.classList.add('open'); });
        });
        el2.querySelector('#dPracOk').onclick=function(){el2.classList.remove('open');setTimeout(function(){el2.remove();},380);};
        refreshBody('left');
        if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
      }
    };

    window.__dailyLearnChat=function(){
      var d=new Date(window.plannerDate||new Date());
      var dk=window.dateKey(d);
      var it=getTodayItem(dk);
      if(!it) return;
      var promptText;
      if(it.words){
        promptText='می‌خوام این کلمات رو با هم یاد بگیریم. برام توضیح بده و مثال بزن:\n\n'+it.words.map(function(w,i){return (i+1)+'. '+w;}).join('\n');
      } else {
        promptText='می‌خوام این '+it.type+' رو با هم یاد بگیریم و بررسی کنیم:\n\n'+it.text;
        if(it.meaning) promptText+='\n\nمعنی: '+it.meaning;
        if(it.by) promptText+='\n— '+it.by;
        promptText+='\n\nبرام شرح بده، نکات بلاغی و ادبیش رو بگو و با چند مثال کمکم کن یادش بگیرم.';
      }
      if(typeof window.switchView==='function') window.switchView('chat');
      setTimeout(function(){
        var q=document.getElementById('q');
        if(q){q.value=promptText;if(typeof window.handleInput==='function') window.handleInput();q.focus();}
      },500);
    };

    window.__dailyStudy=function(){
      var d=new Date(window.plannerDate||new Date());
      var dk=window.dateKey(d);
      var it=getTodayItem(dk);
      if(!it) return;
      window.__openStudy('مرور '+it.type+' امروز');
    };

    function showConfetti(){
      var old=document.getElementById('sirajConfetti');if(old) old.remove();
      var el=document.createElement('div');el.id='sirajConfetti';el.className='confetti-wrap';
      var colors=['#F59E0B','#10B981','#3B82F6','#EF4444','#A855F7','#EC4899','#FBBF24','#06B6D4'];
      var html='';
      for(var i=0;i<80;i++){
        var l=Math.random()*100,de=Math.random()*0.6,du=2.2+Math.random()*1.6;
        var c=colors[Math.floor(Math.random()*colors.length)];
        var sz=6+Math.random()*8;
        html+='<span class="confetti-piece" style="left:'+l+'%;background:'+c+';width:'+sz+'px;height:'+sz+'px;animation-delay:'+de+'s;animation-duration:'+du+'s"></span>';
      }
      el.innerHTML=html;
      document.body.appendChild(el);
      setTimeout(function(){if(el.parentNode)el.remove();},4200);
    }
    function maybeCelebrate(dayKey){
      dayKey=dayKey||window.dateKey(window.plannerDate||new Date());
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dayKey);
      var tasks=(dd.tasks||[]);
      if(tasks.length===0) return;
      if(tasks.every(function(t){return t.done;})){
        showConfetti();
        setTimeout(function(){showPopup('🎉','آفرین!','همه‌ی کارهای امروز رو انجام دادی! 🏆');},400);
      }
    }

    /* ═══════════════════════════════════════════════════════════════
       NOTIFICATION SYSTEM
       ═══════════════════════════════════════════════════════════════ */
    var NOTIF_KEY      = 'siraj-notif-history';
    var NOTIF_SEEN_KEY = 'siraj-notif-seen';
    var NOTIF_PRE_KEY  = 'siraj_notif_pre_';
    var NOTIF_END_KEY  = 'siraj_notif_end_';
    var _notifTab      = 'all';

    function timeAgoShort(ts){
      var d = Date.now() - ts;
      var s = Math.floor(d/1000);
      if(s < 60) return 'الان';
      var m = Math.floor(s/60);
      if(m < 60) return m + ' د';
      var h = Math.floor(m/60);
      if(h < 24) return h + ' س';
      return Math.floor(h/24) + ' روز';
    }
    function loadNotifHistory(){try{return JSON.parse(localStorage.getItem(NOTIF_KEY)||'[]');}catch(e){return [];}}
    function saveNotifHistory(a){try{localStorage.setItem(NOTIF_KEY, JSON.stringify(a.slice(-100)));}catch(e){}}
    function addNotifToHistory(n){
      var list = loadNotifHistory();
      list.push(n);
      saveNotifHistory(list);
      updateNotifBadge();
      var panel = document.getElementById('notifPanel');
      if(panel && panel.classList.contains('open')) renderNotifPanel();
    }
    function updateNotifBadge(){
      var btn = document.getElementById('notifBtn');
      if(!btn) return;
      var list = loadNotifHistory();
      var seen = parseInt(localStorage.getItem(NOTIF_SEEN_KEY)||'0');
      var unseen = list.filter(function(n){
        return (n.ts||0) > seen && (n.type === 'pre' || n.type === 'end');
      }).length;
      var badge = btn.querySelector('.notif-badge');
      if(unseen > 0){
        if(!badge){
          badge = document.createElement('span');
          badge.className = 'notif-badge';
          badge.style.transition = 'all .35s cubic-bezier(.34,1.4,.64,1)';
          badge.style.transform = 'scale(0) translateY(-6px)';
          badge.style.opacity = '0';
          btn.appendChild(badge);
          requestAnimationFrame(function(){
            badge.style.transform = 'scale(1) translateY(0)';
            badge.style.opacity = '1';
          });
          btn.classList.add('shake');
          setTimeout(function(){ btn.classList.remove('shake'); }, 750);
        }
        var faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        badge.textContent = unseen > 9 ? '۹+' : String(unseen).replace(/\d/g, function(d){ return faDigits[+d]; });
      } else if(badge){
        badge.style.transition = 'all .35s cubic-bezier(.34,1.4,.64,1)';
        badge.style.transform = 'scale(0) translateY(-6px)';
        badge.style.opacity = '0';
        setTimeout(function(){ if(badge.parentNode) badge.remove(); }, 360);
      }
    }
    function markAllNotifsRead(){
      var list = loadNotifHistory();
      var now = Date.now();
      var changed = false;
      list.forEach(function(n){
        if(!n.readAt){ n.readAt = now; changed = true; }
      });
      if(changed) saveNotifHistory(list);
      localStorage.setItem(NOTIF_SEEN_KEY, String(now));
      updateNotifBadge();
    }
    function checkTaskNotifications(){
      try{
        var preMin = 10;
        try{if(typeof settings !== 'undefined' && settings.notifPreMinutes){preMin = parseInt(settings.notifPreMinutes) || 10;}}catch(e){}
        var notifEnabled = true;
        try{if(typeof settings !== 'undefined' && settings.notifEnabled === false) notifEnabled = false;}catch(e){}
        if(!notifEnabled) return;

        var now = new Date();
        var todayKey = window.dateKey(now);
        var pl = window.loadPlannerNew();
        var dd = window.getDayData(pl, todayKey);
        var tasks = dd.tasks || [];
        var currentHour = now.getHours();
        var currentMin = now.getMinutes();
        var nowMins = currentHour * 60 + currentMin;

        tasks.forEach(function(t){
          if(t.done || !t.time) return;
          var m = t.time.match(/^(\d{1,2})/);
          if(!m) return;
          var startHour = parseInt(m[1]);
          var preTime = startHour * 60 - preMin;
          var endTime = (startHour + 1) * 60;
          var preKey = NOTIF_PRE_KEY + todayKey + '_' + t.id;
          var endKey = NOTIF_END_KEY + todayKey + '_' + t.id;

          if(nowMins >= preTime && nowMins < endTime && !localStorage.getItem(preKey)){
            localStorage.setItem(preKey, '1');
            fireNotification({
              id: 'n_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
              type: 'pre', taskId: t.id, taskTitle: t.title,
              dayKey: todayKey, time: t.time, ts: Date.now(), answered: false
            });
          }
          if(nowMins >= endTime && !localStorage.getItem(endKey)){
            localStorage.setItem(endKey, '1');
            fireNotification({
              id: 'n_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
              type: 'end', taskId: t.id, taskTitle: t.title,
              dayKey: todayKey, time: t.time, ts: Date.now(), answered: false
            });
          }
        });
      }catch(e){ console.warn('[NotifCheck]', e); }
    }

    function fireNotification(n){
      addNotifToHistory(n);
      showNotifLivePopup(n);
      if(document.hidden && 'Notification' in window && Notification.permission === 'granted'){
        try{
          var title = n.type === 'pre' ? '🔔 یادت نره' : '⏰ وقت تمومه';
          var body  = n.type === 'pre'
            ? 'کار «'+n.taskTitle+'» رو شروع کن'
            : 'کار «'+n.taskTitle+'» رو انجام دادی؟';
          var sys = new Notification(title, { body: body, icon:'siraj-logo.png', tag:'siraj_notif_'+n.id });
          sys.onclick = function(){ window.focus(); showNotifLivePopup(n); sys.close(); };
        }catch(e){}
      }
    }

    function showNotifLivePopup(n){
      var old = document.getElementById('notifLivePopup');
      if(old) old.remove();
      var el = document.createElement('div');
      el.id = 'notifLivePopup';
      el.className = 'task-notif-popup';
      var icon  = n.type === 'pre' ? '⏰' : '🔔';
      var title = n.type === 'pre' ? 'یادآور کار' : 'پایان زمان کار';
      var text  = n.type === 'pre'
        ? 'کار «'+esc(n.taskTitle)+'» رو شروع کن'
        : 'کار «'+esc(n.taskTitle)+'» رو انجام دادی؟';
      var actions = n.type === 'pre'
        ? '<button class="yes-btn" id="nlYes">✓ انجام دادم</button><button class="no-btn" id="nlResched">⏰ انتقال</button>'
        : '<button class="yes-btn" id="nlYes">✓ انجام دادم</button><button class="no-btn" id="nlNo">✗ نه</button>';
      el.innerHTML =
        '<button class="task-notif-close" id="nlClose">✕</button>'
        +'<div class="task-notif-head"><div class="task-notif-icon">'+icon+'</div><div class="task-notif-title">'+title+'</div></div>'
        +'<div class="task-notif-task">'+text+'</div>'
        +'<div class="task-notif-actions">'+actions+'</div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          el.classList.add('show');
        });
      });
      var close = function(){ el.classList.remove('show'); setTimeout(function(){ el.remove(); }, 550); };
      el.querySelector('#nlClose').onclick = close;
      el.querySelector('#nlYes').onclick = function(){ close(); markTaskDone(n.taskId, n.dayKey); markNotifAnswered(n.id); };
      if(n.type === 'pre'){
        el.querySelector('#nlResched').onclick = function(){ close(); smartReschedule(n.taskId, n.dayKey); markNotifAnswered(n.id); };
      } else {
        el.querySelector('#nlNo').onclick = function(){ close(); showNotifChoicePopup(n); markNotifAnswered(n.id); };
      }
      setTimeout(function(){ if(el.parentNode && el.classList.contains('show')) close(); }, 5000);
    }

    function markNotifAnswered(id){
      var list = loadNotifHistory();
      var n = list.find(function(x){ return x.id === id; });
      if(n){ n.answered = true; saveNotifHistory(list); }
      var panel = document.getElementById('notifPanel');
      if(panel && panel.classList.contains('open')) renderNotifPanel();
    }

    function markTaskDone(taskId, dayKey){
      try{
        var pl = window.loadPlannerNew();
        var dd = window.getDayData(pl, dayKey);
        var idx = (dd.tasks||[]).findIndex(function(t){ return t.id === taskId; });
        if(idx < 0) return;
        dd.tasks[idx].done = true;
        window.savePlanner(pl);
        if(window.toast) window.toast('✓ انجام شد','success');
        refreshBody('left');
        if(dayKey === window.dateKey(window.plannerDate||new Date())){maybeCelebrate(dayKey);}
      }catch(e){}
    }
    function deleteTask(taskId, dayKey){
      try{
        var pl = window.loadPlannerNew();
        var dd = window.getDayData(pl, dayKey);
        var idx = (dd.tasks||[]).findIndex(function(t){ return t.id === taskId; });
        if(idx < 0) return;
        dd.tasks.splice(idx, 1);
        window.savePlanner(pl);
        if(window.toast) window.toast('حذف شد','info');
        refreshBody('left');
      }catch(e){}
    }
    function findNextFreeSlot(pl, fromDayKey){
      var HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var base = new Date(fromDayKey + 'T12:00:00');
      if(isNaN(base.getTime())) base = new Date();
      var nowHour = new Date().getHours();
      for(var d = 0; d < 7; d++){
        var day = new Date(base);
        day.setDate(day.getDate() + d);
        var dayKey = window.dateKey(day);
        var dd = window.getDayData(pl, dayKey);
        var startIdx = 0;
        if(d === 0){
          var found = -1;
          for(var k=0;k<HOURS.length;k++){ if(HOURS[k] > nowHour){ found = k; break; } }
          if(found < 0) continue;
          startIdx = found;
        }
        for(var i = startIdx; i < HOURS.length; i++){
          var h = HOURS[i];
          var occupied = (dd.tasks||[]).some(function(t){
            if(t.done || !t.time) return false;
            var m = t.time.match(/^(\d{1,2})/);
            return m && parseInt(m[1]) === h;
          });
          if(!occupied) return { dayKey: dayKey, hour: h };
        }
      }
      return null;
    }
    function smartReschedule(taskId, dayKey){
      try{
        var pl = window.loadPlannerNew();
        var dd = window.getDayData(pl, dayKey);
        var idx = (dd.tasks||[]).findIndex(function(t){ return t.id === taskId; });
        if(idx < 0) return;
        var slot = findNextFreeSlot(pl, dayKey);
        if(!slot){ if(window.toast) window.toast('جای خالی پیدا نشد','error'); return; }
        var newTime = slot.hour + ':00 تا ' + (slot.hour+1) + ':00';
        if(slot.dayKey !== dayKey){
          var task = dd.tasks.splice(idx, 1)[0];
          task.time = newTime;
          var newDD = window.getDayData(pl, slot.dayKey);
          if(!newDD.tasks) newDD.tasks = [];
          newDD.tasks.push(task);
        } else {
          dd.tasks[idx].time = newTime;
        }
        window.savePlanner(pl);
        if(window.toast) window.toast('به ساعت '+slot.hour+' منتقل شد ✓','success');
        refreshBody('left');
      }catch(e){ console.warn('[Resched]', e); }
    }
    function showNotifChoicePopup(n){
      var old = document.getElementById('notifChoicePopup');
      if(old) old.remove();
      var el = document.createElement('div');
      el.id = 'notifChoicePopup';
      el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup">'
        +'<span class="siraj-popup-emoji">🤔</span>'
        +'<div class="siraj-popup-title">چیکارش کنم؟</div>'
        +'<div class="siraj-popup-text">کار «'+esc(n.taskTitle)+'» رو انجام ندادی.<br>می‌خوای منتقلش کنی یا حذفش کنی؟</div>'
        +'<div class="siraj-popup-actions-3">'
        +'<button class="siraj-popup-btn secondary" id="ncpDel">🗑️ حذف</button>'
        +'<button class="siraj-popup-btn secondary" id="ncpResch">⏰ انتقال</button>'
        +'<button class="siraj-popup-btn" id="ncpKeep">✋ بعداً</button>'
        +'</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ el.remove(); }, 380); };
      el.querySelector('#ncpDel').onclick = function(){ close(); deleteTask(n.taskId, n.dayKey); };
      el.querySelector('#ncpResch').onclick = function(){ close(); smartReschedule(n.taskId, n.dayKey); };
      el.querySelector('#ncpKeep').onclick = close;
    }

    function renderNotifPanel(){
      var list = document.getElementById('notifList');
      if(!list) return;
      var all = loadNotifHistory();
      var seen = parseInt(localStorage.getItem(NOTIF_SEEN_KEY)||'0');
      var unreadList = all.filter(function(n){ return !n.readAt && (n.ts||0) > seen; });
      var readList = all.filter(function(n){ return n.readAt || (n.ts||0) <= seen; });
      var history;
      if(_notifTab === 'unread') history = unreadList.slice().reverse();
      else if(_notifTab === 'read') history = readList.slice().reverse();
      else history = all.slice().reverse();

      var tabsEl = document.getElementById('notifTabs');
      if(tabsEl){
        tabsEl.innerHTML =
          '<button class="notif-tab'+(_notifTab==='all'?' active':'')+'" onclick="event.stopPropagation();window.__setNotifTab(\'all\',event)">همه <span class="notif-tab-count">'+toFaPl(all.length)+'</span></button>'
          +'<button class="notif-tab'+(_notifTab==='unread'?' active':'')+'" onclick="event.stopPropagation();window.__setNotifTab(\'unread\',event)">نخوانده <span class="notif-tab-count">'+toFaPl(unreadList.length)+'</span></button>'
          +'<button class="notif-tab'+(_notifTab==='read'?' active':'')+'" onclick="event.stopPropagation();window.__setNotifTab(\'read\',event)">خوانده <span class="notif-tab-count">'+toFaPl(readList.length)+'</span></button>';
      }

      if(history.length === 0){
        var emptyMsg = _notifTab === 'unread' ? 'اعلان نخوانده نداری' : _notifTab === 'read' ? 'اعلان خوانده‌شده نداری' : 'هنوز اعلانی نداری';
        list.innerHTML = '<div class="notif-empty"><span class="emoji">🔔</span>'+emptyMsg+'</div>';
        return;
      }

      list.innerHTML = history.map(function(n){
        var isUnread = !n.readAt && (n.ts||0) > seen;
        var unread = isUnread ? ' unread' : '';
        var typeCls = n.type === 'pre' ? ' notif-pre' : n.type === 'end' ? ' notif-end' : n.type === 'dev' ? ' notif-dev' : '';
        var icon = n.emoji || (n.type === 'pre' ? '⏰' : n.type === 'end' ? '🔔' : '📢');
        var title = n.type === 'pre' ? 'یادآور کار' : n.type === 'end' ? 'پایان زمان کار' : (n.title || 'اعلان از سراج');
        var text = n.type === 'pre'
          ? 'کار «'+esc(n.taskTitle)+'» — یادت نره شروع کنی!'
          : n.type === 'end'
            ? 'کار «'+esc(n.taskTitle)+'» — انجامش دادی؟'
            : esc(n.body || '');
        var actions = '';
        if(!n.answered && n.type !== 'dev'){
          if(n.type === 'pre'){
            actions = '<div class="notif-item-actions">'
              +'<button class="notif-btn yes" onclick="event.stopPropagation();window.__notifDone(\''+n.id+'\')">✓ انجام دادم</button>'
              +'<button class="notif-btn reschedule" onclick="event.stopPropagation();window.__notifResched(\''+n.id+'\')">⏰ انتقال</button>'
              +'</div>';
          } else if(n.type === 'end'){
            actions = '<div class="notif-item-actions">'
              +'<button class="notif-btn yes" onclick="event.stopPropagation();window.__notifDone(\''+n.id+'\')">✓ انجام دادم</button>'
              +'<button class="notif-btn no" onclick="event.stopPropagation();window.__notifNo(\''+n.id+'\')">✗ نه</button>'
              +'</div>';
          }
        }
        return '<div class="notif-item'+unread+typeCls+'" onclick="window.__markOneNotifRead(\''+n.id+'\')">'
          +'<div class="notif-item-head">'
          +'<span class="notif-item-icon">'+icon+'</span>'
          +'<span class="notif-item-title">'+title+'</span>'
          +'<span class="notif-item-time">'+timeAgoShort(n.ts)+'</span>'
          +'</div>'
          +'<div class="notif-item-text">'+text+'</div>'
          +actions
          +'</div>';
      }).join('');
    }

    window.__setNotifTab = function(t, ev){
      if(ev && ev.stopPropagation) ev.stopPropagation();
      _notifTab = t;
      renderNotifPanel();
    };
    window.__markOneNotifRead = function(id){
      var list = loadNotifHistory();
      var n = list.find(function(x){ return x.id === id; });
      if(!n) return;
      if(!n.readAt){
        n.readAt = Date.now();
        saveNotifHistory(list);
        var currentSeen = parseInt(localStorage.getItem(NOTIF_SEEN_KEY)||'0');
        if(n.ts > currentSeen){localStorage.setItem(NOTIF_SEEN_KEY, String(Math.min(n.ts, Date.now())));}
        updateNotifBadge();
        renderNotifPanel();
      }
    };

    function __notifOutsideClose(e){
      var p = document.getElementById('notifPanel');
      if(!p) return;
      if(!e.target.closest('#notifPanel') && !e.target.closest('#notifBtn')){
        p.classList.remove('open');
        document.removeEventListener('click', __notifOutsideClose);
      }
    }

    window.__toggleNotifPanel = function(){
      var panel = document.getElementById('notifPanel');
      if(panel){
        var wasOpen = panel.classList.contains('open');
        if(wasOpen){
          panel.classList.remove('open');
          document.removeEventListener('click', __notifOutsideClose);
        } else {
          renderNotifPanel();
          markAllNotifsRead();
          panel.classList.add('open');
          setTimeout(function(){ document.addEventListener('click', __notifOutsideClose); }, 50);
        }
        return;
      }
      panel = document.createElement('div');
      panel.id = 'notifPanel';
      panel.className = 'notif-panel';
      panel.innerHTML =
        '<div class="notif-header">'
        +'<div class="notif-header-title">🔔 اعلان‌ها</div>'
        +'<button class="notif-clear-btn" id="notifClearBtn">پاک کردن</button>'
        +'</div>'
        +'<div class="notif-tabs" id="notifTabs"></div>'
        +'<div class="notif-list" id="notifList"></div>';
      document.body.appendChild(panel);
      /* ★ موقعیت پنل نسبت به دکمه نوتیف */
      var notifBtn = document.getElementById('notifBtn');
      if (notifBtn) {
        var rect = notifBtn.getBoundingClientRect();
        var panelLeft = rect.left;
        var panelW = Math.min(380, window.innerWidth - 32);
        if (panelLeft + panelW > window.innerWidth - 8) {
          panelLeft = window.innerWidth - panelW - 8;
        }
        if (panelLeft < 8) panelLeft = 8;
        panel.style.setProperty('left', panelLeft + 'px', 'important');
        panel.style.setProperty('top', (rect.bottom + 12) + 'px', 'important');
        panel.style.setProperty('transform-origin', 'top left', 'important');
      }
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          panel.classList.add('open');
        });
      });
      panel.querySelector('#notifClearBtn').onclick = function(e){
        e.stopPropagation();
        saveNotifHistory([]);
        renderNotifPanel();
        updateNotifBadge();
      };
      panel.addEventListener('click', function(e){ e.stopPropagation(); });
      setTimeout(function(){ document.addEventListener('click', __notifOutsideClose); }, 100);
      renderNotifPanel();
      markAllNotifsRead();
    };

    window.__notifDone = function(id){
      var list = loadNotifHistory();
      var n = list.find(function(x){ return x.id === id; });
      if(!n) return;
      n.answered = true;
      saveNotifHistory(list);
      markTaskDone(n.taskId, n.dayKey);
      renderNotifPanel();
    };
    window.__notifNo = function(id){
      var list = loadNotifHistory();
      var n = list.find(function(x){ return x.id === id; });
      if(!n) return;
      n.answered = true;
      saveNotifHistory(list);
      renderNotifPanel();
      var p = document.getElementById('notifPanel');
      if(p) p.classList.remove('open');
      showNotifChoicePopup(n);
    };
    window.__notifResched = function(id){
      var list = loadNotifHistory();
      var n = list.find(function(x){ return x.id === id; });
      if(!n) return;
      n.answered = true;
      saveNotifHistory(list);
      smartReschedule(n.taskId, n.dayKey);
      renderNotifPanel();
    };

    window.__sendTestNotification = function(){
      try{
        if('Notification' in window && Notification.permission === 'default'){
          Notification.requestPermission().then(function(p){
            if(p === 'granted'){
              fireNotification({id:'n_test_'+Date.now(),type:'pre',taskId:'test',taskTitle:'این یک نوتیف تست هست 🎯',dayKey:window.dateKey(new Date()),time:'',ts:Date.now(),answered:false});
            }
          });
        } else if(Notification.permission === 'granted'){
          fireNotification({id:'n_test_'+Date.now(),type:'pre',taskId:'test',taskTitle:'این یک نوتیف تست هست 🎯',dayKey:window.dateKey(new Date()),time:'',ts:Date.now(),answered:false});
        } else {
          if(window.toast) window.toast('ابتدا اجازه نوتیف رو از مرورگر بگیر','error');
        }
      }catch(e){if(window.toast) window.toast('خطا در ارسال نوتیف','error');}
    };

    window.__requestNotifPermission = function(){
      if(!('Notification' in window)){ if(window.toast) window.toast('مرورگر پشتیبانی نمی‌کنه','error'); return; }
      if(Notification.permission === 'granted'){ if(window.toast) window.toast('اجازه نوتیف از قبل داده شده ✓','success'); return; }
      Notification.requestPermission().then(function(p){
        if(p === 'granted' && window.toast) window.toast('اجازه نوتیف داده شد ✓','success');
        else if(p === 'denied' && window.toast) window.toast('اجازه رد شد','error');
      });
    };

    window.__pushDevNotificationToPanel = function(n){
      try{ addNotifToHistory(n); }catch(e){ console.warn('[DevNotif]', e); }
    };

    setTimeout(function(){
      if('Notification' in window && Notification.permission === 'default'){
        try{ Notification.requestPermission(); }catch(e){}
      }
      updateNotifBadge();
      checkTaskNotifications();
    }, 1500);
    setInterval(checkTaskNotifications, 30000);
    setInterval(updateNotifBadge, 15000);

    /* ═══ DAILY CONTENT ═══ */
    function dailyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var key=window.dateKey(d);
      var dd=window.getDayData(pl,key);
      var allTasks=(dd.tasks||[]);
      var active=allTasks.filter(function(tk){return !tk.done;});
      var done=allTasks.filter(function(tk){return tk.done;});

      var punishmentHTML = '';
      var punishments = (dd.tasks||[]).filter(function(tk){ return !tk.done && tk.isPunishment; });
      if(punishments.length > 0){
        punishmentHTML = punishments.map(function(tk){
          return '<div class="punishment-reminder"><span class="pr-icon">⚖️</span><div><span class="pr-title">تنبیه فعال</span>'+esc(tk.title)+'</div></div>';
        }).join('');
      }

      var activeHTML = active.length===0
        ? '<div class="tasks-empty"><span class="emoji">📝</span>کاری در جریان نداری<br>از کادر بالا کار جدید اضافه کن</div>'
        : '<div class="tasks-list">'+active.map(function(tk){
            var idx=allTasks.indexOf(tk);
            var pm={high:'بالا',med:'متوسط',low:'پایین'};
            var punishBadge = tk.isPunishment ? '<span class="punishment-badge">تنبیه</span>' : '';
            return '<div class="task-item pri-'+(tk.priority||'med')+'" onclick="window.__taskClick(event, \''+key+'\', '+idx+')">'
              +'<button class="task-check" onclick="event.stopPropagation();window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>'
              +'<div class="task-info"><div class="task-title">'+punishBadge+esc(tk.title)+'</div>'
              +'<div class="task-meta">'+(tk.time?'<span>🕐 '+esc(tk.time)+'</span>':'')+'<span class="task-badge pri-'+(tk.priority||'med')+'">'+(pm[tk.priority]||'متوسط')+'</span></div></div>'
              +'<button class="task-del" onclick="event.stopPropagation();window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
              +'</div>';
          }).join('')+'</div>';

      var doneHTML = done.length===0
        ? '<div class="tasks-done-empty">هنوز کاری انجام ندادی</div>'
        : '<div class="tasks-list tasks-done-list">'+done.map(function(tk){
            var idx=allTasks.indexOf(tk);
            var tb=tk.studiedMinutes
              ? '<span class="studied-badge">⏱️ '+formatMinutes(tk.studiedMinutes)+'</span>'
              : '<span class="no-time-badge">⚪ بدون زمان</span>';
            return '<div class="task-item done pri-'+(tk.priority||'med')+'" style="cursor:default">'
              +'<button class="task-check checked" onclick="window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>'
              +'<div class="task-info"><div class="task-title">'+esc(tk.title)+'</div><div class="task-meta">'+tb+'</div></div>'
              +'<button class="task-del" onclick="window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
              +'</div>';
          }).join('')+'</div>';

      var ho=[{value:'',label:'ساعت (اختیاری)'}].concat(
        [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(function(h){
          return {value:h+':00 تا '+(h+1)+':00',label:'ساعت '+h+' تا '+(h+1)};
        })
      );
      var po=[{value:'high',label:'بالا',dot:'red'},{value:'med',label:'متوسط',dot:'yellow'},{value:'low',label:'پایین',dot:'green'}];
      window.__pendingTime='';window.__pendingPri='med';

      return streakHTML()+punishmentHTML+dailyWordHTML()+weekStatsHTML()
        +'<div class="task-add-form">'
        +'<input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()">'
        +'<div class="task-form-selects">'+makeSelect('pNewTime','',ho)+makeSelect('pNewPri','med',po,'اولویت‌بندی')+'</div>'
        +'<button class="task-add-btn" onclick="window.__dAddTask()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن</button>'
        +'</div>'
        +'<div class="tasks-list-title"><span class="title-icon">'+SI_ICONS.target+'</span>در جریان:</div>'+activeHTML
        +'<div class="tasks-list-title done-title"><span class="title-icon">'+SI_ICONS.checkCircle+'</span>انجام شده ('+toFa(done.length)+'):</div>'+doneHTML;
    }
    function viewDaily(){return heroDaily()+'<div class="planner-body-content">'+dailyContentHTML()+'</div>';}

    var _libCat='all';
    var _libState='learned';

    window.__openLibrary=function(){
      var old=document.getElementById('learnLibrary');if(old) old.remove();
      var learned=getAllLearned();
      var practice=getAllPractice();
      var el=document.createElement('div');el.id='learnLibrary';el.className='learn-library-overlay';
      el.innerHTML='<div class="learn-library-box">'
        +'<div class="learn-library-header">'
        +'<div class="learn-library-title"><span>📚</span> کتابخانه یادگیری</div>'
        +'<button class="learn-library-close" id="libClose">✕</button>'
        +'</div>'
        +'<div class="learn-library-stats">'
        +'<div class="ll-stat"><div class="ll-stat-num">'+toFa(learned.length)+'</div><div class="ll-stat-lbl">یادگرفته</div></div>'
        +'<div class="ll-stat"><div class="ll-stat-num">'+toFa(practice.length)+'</div><div class="ll-stat-lbl">نیاز به تمرین</div></div>'
        +'</div>'
        +'<div class="learn-library-filters">'
        +'<div class="ll-filter-group">'
        +'<span class="ll-filter-label">دسته:</span>'
        +'<button class="ll-filter'+( _libCat==='all'?' active':'')+'" data-cat="all">همه</button>'
        +'<button class="ll-filter'+( _libCat==='بیت'?' active':'')+'" data-cat="بیت">📖 شعر</button>'
        +'<button class="ll-filter'+( _libCat==='کلمه'?' active':'')+'" data-cat="کلمه">📚 کلمه</button>'
        +'<button class="ll-filter'+( _libCat==='قواعد'?' active':'')+'" data-cat="قواعد">✏️ قواعد</button>'
        +'</div>'
        +'<div class="ll-filter-group">'
        +'<span class="ll-filter-label">وضعیت:</span>'
        +'<button class="ll-filter'+(_libState==='learned'?' active':'')+'" data-state="learned">✅ یادگرفته</button>'
        +'<button class="ll-filter'+(_libState==='practice'?' active':'')+'" data-state="practice">📚 یادنگرفته</button>'
        +'</div>'
        +'</div>'
        +'<div class="learn-library-list" id="libList"></div>'
        +'<button class="lib-study-btn" id="libStudyBtn">🎓 ورود به حالت مطالعه</button>'
        +'</div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){el.classList.add('open');});
      });
      el.querySelector('#libClose').onclick=closeLibrary;
      el.addEventListener('click',function(e){if(e.target===el) closeLibrary();});
      el.querySelector('#libStudyBtn').onclick=function(){
        var catName = _libCat==='all'?'همه':_libCat;
        var stateName = _libState==='learned'?'یادگرفته‌ها':'تمرین‌ها';
        closeLibrary();
        window.__openStudy('مرور '+stateName+' — '+catName);
      };
      el.querySelectorAll('.ll-filter').forEach(function(b){
        b.onclick=function(){
          if(b.dataset.cat){
            _libCat=b.dataset.cat;
            el.querySelectorAll('.ll-filter[data-cat]').forEach(function(x){x.classList.remove('active');});
            b.classList.add('active');
          } else if(b.dataset.state){
            _libState=b.dataset.state;
            el.querySelectorAll('.ll-filter[data-state]').forEach(function(x){x.classList.remove('active');});
            b.classList.add('active');
          }
          renderLibList();
        };
      });
      renderLibList();
    };

    function closeLibrary(){
      var el=document.getElementById('learnLibrary');if(!el) return;
      if(el.dataset.closing==='1') return;
      el.dataset.closing='1';
      el.classList.remove('open');
      setTimeout(function(){if(el.parentNode)el.remove();},550);
    }

    function renderLibList(){
      var listEl=document.getElementById('libList');if(!listEl) return;
      var items = _libState==='learned'?getAllLearned():getAllPractice();
      if(_libCat!=='all') items=items.filter(function(x){return x.item.type===_libCat;});
      if(items.length===0){
        var label = _libState==='learned'?'یادگرفته':'یادنگرفته';
        listEl.innerHTML='<div class="ll-empty"><span class="emoji">'+(_libState==='learned'?'🎓':'📚')+'</span>هنوز چیزی تو بخش '+label+' نداری</div>';
        return;
      }
      listEl.innerHTML=items.map(function(x){
        var it=x.item;
        var dObj=new Date(x.dateKey);
        var faDate=toFa(dObj.toLocaleDateString('fa-IR',{day:'numeric',month:'long'}));
        var html='<div class="ll-item">'
          +'<div class="ll-item-head">'
          +'<span class="ll-item-type">'+esc(it.type)+'</span>'
          +'<span class="ll-item-date">'+faDate+'</span>'
          +'</div>';
        if(it.words){
          html+='<div class="ll-item-text">'+it.words.map(function(w,i){return toFa(i+1)+'. '+esc(w);}).join('<br>')+'</div>';
        } else {
          html+='<div class="ll-item-text'+(it.isAr?' ar':'')+'">'+esc(it.text)+'</div>';
          if(it.meaning) html+='<div class="ll-item-by" style="font-style:normal">📝 '+esc(it.meaning)+'</div>';
          if(it.by) html+='<div class="ll-item-by">— '+esc(it.by)+'</div>';
        }
        html+='<div class="ll-item-actions">';
        if(_libState==='practice'){
          html+='<button class="ll-action ask-siraj" onclick="window.__askSiraj(\''+x.dateKey+'\')">🎓 رفع مشکل با سراج</button>';
          html+='<button class="ll-action mark-learned" onclick="window.__markLearned(\''+x.dateKey+'\')">✓ یاد گرفتم</button>';
        } else {
          html+='<button class="ll-action ask-siraj" onclick="window.__askSiraj(\''+x.dateKey+'\')">🎓 مرور با سراج</button>';
        }
        html+='<button class="ll-action delete" onclick="window.__deleteLearned(\''+x.dateKey+'\')">🗑️ حذف</button>';
        html+='</div></div>';
        return html;
      }).join('');
    }

    window.__markLearned=function(dk){
      setItemState(dk,'learned-review');
      if(window.toast) window.toast('✓ به یادگرفته‌ها اضافه شد','success');
      renderLibList();
      if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
    };
    window.__deleteLearned=function(dk){
      setItemState(dk,null);
      if(window.toast) window.toast('حذف شد','info');
      renderLibList();
      if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
      refreshBody('left');
    };
    window.__askSiraj=function(dk){
      var it=getTodayItem(dk);
      if(!it) return;
      closeLibrary();
      var promptText;
      if(it.words){
        promptText='این کلمات رو برام توضیح بده و کمکم کن یادشون بگیرم:\n\n'+it.words.map(function(w,i){return (i+1)+'. '+w;}).join('\n');
      } else {
        promptText='درباره این '+it.type+' کمکم کن یاد بگیرم:\n\n'+it.text;
        if(it.meaning) promptText+='\n\nمعنی: '+it.meaning;
        if(it.by) promptText+='\n— '+it.by;
        promptText+='\n\nبرام توضیح بده و با چند مثال کمکم کن یادش بگیرم.';
      }
      if(typeof window.switchView==='function') window.switchView('chat');
      setTimeout(function(){
        var q=document.getElementById('q');
        if(q){q.value=promptText;if(typeof window.handleInput==='function') window.handleInput();q.focus();}
      },500);
    };

    window.__taskClick=function(e,dayKey,idx){
      e.stopPropagation();
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dayKey);
      var task=dd.tasks[idx];
      if(!task||task.done) return;
      showConfirm('🎯','ورود به اتاق مطالعه','کار «'+task.title+'» رو شروع کنی؟',function(){
        window.__studyTask=task.title;
        window.__studyTaskSourceId=task.id;
        window.__studyTaskSourceDay=dayKey;
        window.__openStudy();
      },'بریم','نه');
    };

    window.__dToggleTask=function(i,forceMode){
      var pl=window.loadPlannerNew();
      var key=window.dateKey(window.plannerDate||new Date());
      var dd=window.getDayData(pl,key);
      if(!dd.tasks[i]) return;
      var task=dd.tasks[i];
      if(task.done||forceMode==='silent'){
        var wd=task.done;
        task.done=!task.done;
        if(!task.done) delete task.studiedMinutes;
        window.savePlanner(pl);
        if(task.done&&!wd) maybeCelebrate(key);
        refreshBody('left');
        return;
      }
      showTriple('✅','کار انجام شد!','زمانش ثبت نشد ⏱️ چطور ثبت کنیم؟',
        {text:'همینطور ثبت',onClick:function(){task.done=true;window.savePlanner(pl);maybeCelebrate(key);refreshBody('left');}},
        {text:'دقیقه بزن',onClick:function(){
          var m=prompt('چند دقیقه؟','25');
          if(m===null){refreshBody('left');return;}
          m=parseInt(m);if(isNaN(m)||m<1) m=25;
          task.done=true;task.studiedMinutes=m;
          window.savePlanner(pl);maybeCelebrate(key);refreshBody('left');
        }},
        {text:'بریم مطالعه 🎯',onClick:function(){
          window.__studyTask=task.title;
          window.__studyTaskSourceId=task.id;
          window.__studyTaskSourceDay=key;
          window.__openStudy();
        }}
      );
    };

    window.__dAddTask=function(){
      var inp=document.getElementById('pNewTitle');if(!inp) return;
      var t=inp.value.trim();if(!t) return;
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var dd=window.getDayData(pl,window.dateKey(d));
      dd.tasks.push({
        id:'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        title:t,time:window.__pendingTime||'',priority:window.__pendingPri||'med',
        done:false,createdAt:Date.now()
      });
      window.savePlanner(pl);
      inp.value='';
      window.__pendingTime='';window.__pendingPri='med';
      refreshBody('left');
    };
    window.__dDeleteTask=function(i){
      var pl=window.loadPlannerNew();
      var key=window.dateKey(window.plannerDate||new Date());
      var dd=window.getDayData(pl,key);
      if(!dd.tasks[i]) return;
      dd.tasks.splice(i,1);
      window.savePlanner(pl);
      refreshBody('left');
    };

    function buildWeekCell(day,hk,pl){
      var dd=window.getDayData(pl,day.key);
      var ht=(dd.tasks||[]).filter(function(tk){return tk.time&&tk.time.indexOf(hk+':00')===0;});
      var ft=ht[0];
      if(ft){
        var isDone=ft.done;
        return '<div class="week-cell-task'+(isDone?' done':'')+'">'
          +'<span class="wt-title">'+esc(ft.title)+'</span>'
          +'<div class="wt-actions">'
          +'<button type="button" class="wt-btn edit" onclick="event.stopPropagation();window.__wEditTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>'
          +'<button type="button" class="wt-btn tick'+(isDone?' on':'')+'" onclick="event.stopPropagation();window.__wTickTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>'
          +'<button type="button" class="wt-btn del" onclick="event.stopPropagation();window.__wDeleteTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
          +'</div></div>';
      }
      return '<div class="week-cell-edit" data-day="'+day.key+'" data-hour="'+hk+'">'
        +'<input type="text" class="wc-input" placeholder="+ افزودن..." onkeydown="if(event.key===\'Enter\'){event.preventDefault();window.__wQuickSave(this)}" oninput="window.__wInputChange(this)">'
        +'<div class="wc-btns">'
        +'<button type="button" class="wc-btn save" onclick="event.preventDefault();event.stopPropagation();window.__wQuickSave(this.closest(\'.week-cell-edit\').querySelector(\'.wc-input\'))">✓ ثبت</button>'
        +'<button type="button" class="wc-btn cancel" onclick="event.preventDefault();event.stopPropagation();window.__wQuickCancel(this)">✕ لغو</button>'
        +'</div></div>';
    }

    function weeklyContentHTML(){
      var pl=window.loadPlannerNew();
      var days=myWeekDays();
      var tk=window.dateKey(new Date());
      var hr='<tr><th class="hour-col">ساعت</th>'+days.map(function(day){
        var isT=day.key===tk;
        return '<th'+(isT?' style="background:var(--accent-soft);color:var(--accent)"':'')+'>'+esc(day.name)+'<div style="font-size:9.5px;opacity:.7;margin-top:2px">'+esc(day.date)+'</div></th>';
      }).join('')+'</tr>';
      var HOURS=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var br=HOURS.map(function(h){
        var hk=String(h).padStart(2,'0');
        var cells=days.map(function(day){
          var isT=day.key===tk;
          var dd=window.getDayData(pl,day.key);
          var hasT=(dd.tasks||[]).some(function(x){return x.time&&x.time.indexOf(hk+':00')===0;});
          return '<td class="task-cell'+(isT?' today':'')+(hasT?' has-task':'')+'">'+buildWeekCell(day,hk,pl)+'</td>';
        }).join('');
        return '<tr><td class="hour-cell">'+toFa(hk)+':۰۰</td>'+cells+'</tr>';
      }).join('');
      var tt=0,dc=0;
      days.forEach(function(day){
        var dd=window.getDayData(pl,day.key);
        (dd.tasks||[]).forEach(function(x){tt++;if(x.done)dc++;});
      });
      var pct=tt?Math.round((dc/tt)*100):0;
      var sh='<div class="week-summary">'
        +'<div class="ws-box" data-stat="total"><div class="ws-num">'+toFa(tt)+'</div><div class="ws-lbl">کل کارها</div></div>'
        +'<div class="ws-box" data-stat="done"><div class="ws-num">'+toFa(dc)+'</div><div class="ws-lbl">انجام شده</div></div>'
        +'<div class="ws-box" data-stat="progress"><div class="ws-num">'+toFa(pct)+'%</div><div class="ws-lbl">پیشرفت</div></div>'
        +'</div>';
      return '<div class="week-grid-wrap"><table class="week-table"><thead>'+hr+'</thead><tbody>'+br+'</tbody></table></div>'+sh;
    }
    function viewWeekly(){return heroWeekly()+'<div class="planner-body-content">'+weeklyContentHTML()+'</div>';}

    window.__wInputChange=function(inp){
      var w=inp.closest('.week-cell-edit');if(!w) return;
      var b=w.querySelector('.wc-btns');if(!b) return;
      if(inp.value.trim().length>0) b.classList.add('visible');else b.classList.remove('visible');
    };
    window.__wQuickCancel=function(btn){
      var w=btn.closest('.week-cell-edit');if(!w) return;
      var i=w.querySelector('.wc-input');if(i){i.value='';i.blur();}
      var b=w.querySelector('.wc-btns');if(b)b.classList.remove('visible');
    };
    window.__wQuickSave=function(inp){
      if(!inp) return;
      var v=(inp.value||'').trim();if(!v) return;
      var w=inp.closest('.week-cell-edit');if(!w) return;
      var dk=w.getAttribute('data-day'),hk=w.getAttribute('data-hour');
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dk);
      if(!dd.tasks) dd.tasks=[];
      dd.tasks.push({
        id:'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        title:v,time:hk+':00 تا '+(parseInt(hk)+1)+':00',
        priority:'med',done:false,createdAt:Date.now()
      });
      window.savePlanner(pl);
      var td=w.closest('td');
      if(td){
        var days=myWeekDays();
        var day=days.find(function(x){return x.key===dk;});
        if(day){td.classList.add('has-task');td.innerHTML=buildWeekCell(day,hk,pl);}
      }
      updateWeekStats();
    };
    function updateWeekStats(){
      var sw=document.querySelector('.week-summary');if(!sw) return;
      var pl=window.loadPlannerNew();
      var days=myWeekDays();
      var tt=0,dc=0;
      days.forEach(function(day){
        var dd=window.getDayData(pl,day.key);
        (dd.tasks||[]).forEach(function(x){tt++;if(x.done)dc++;});
      });
      var pct=tt?Math.round((dc/tt)*100):0;
      var nums=sw.querySelectorAll('.ws-num');
      if(nums.length>=3){nums[0].textContent=toFa(tt);nums[1].textContent=toFa(dc);nums[2].textContent=toFa(pct)+'%';}
    }
    function setupWeekSummaryClicks(){
      document.querySelectorAll('.week-summary .ws-box').forEach(function(box){
        box.onclick=function(){
          var s=box.getAttribute('data-stat');
          var cells;
          if(s==='total') cells=document.querySelectorAll('.week-cell-task');
          else if(s==='done') cells=document.querySelectorAll('.week-cell-task.done');
          else cells=document.querySelectorAll('.week-cell-task:not(.done)');
          if(!cells.length){if(window.toast) window.toast('چیزی برای نمایش نیست','info');return;}
          cells.forEach(function(c){
            c.classList.remove('highlight');
            void c.offsetWidth;
            c.classList.add('highlight');
            setTimeout(function(){c.classList.remove('highlight');},1700);
          });
          var first=cells[0];
          if(first&&first.scrollIntoView) first.scrollIntoView({behavior:'smooth',block:'center'});
        };
      });
    }
    window.__wTickTask=function(dk,ti){
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dk);
      var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});
      if(idx<0) return;
      var t=dd.tasks[idx];
      if(t.done){t.done=false;delete t.studiedMinutes;window.savePlanner(pl);refreshBody('left');return;}
      showTriple('✅','کار انجام شد!','چطور ثبت کنیم؟',
        {text:'همینطور ثبت',onClick:function(){t.done=true;window.savePlanner(pl);maybeCelebrate(dk);refreshBody('left');}},
        {text:'دقیقه بزن',onClick:function(){
          var m=prompt('چند دقیقه؟','25');
          if(m===null){refreshBody('left');return;}
          m=parseInt(m);if(isNaN(m)||m<1) m=25;
          t.done=true;t.studiedMinutes=m;
          window.savePlanner(pl);maybeCelebrate(dk);refreshBody('left');
        }},
        {text:'بریم مطالعه 🎯',onClick:function(){
          window.__studyTask=t.title;
          window.__studyTaskSourceId=t.id;
          window.__studyTaskSourceDay=dk;
          window.__openStudy();
        }}
      );
    };
    window.__wDeleteTask=function(dk,ti){
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dk);
      var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});
      if(idx<0) return;
      dd.tasks.splice(idx,1);
      window.savePlanner(pl);refreshBody('left');
    };
    window.__wEditTask=function(dk,ti){
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,dk);
      var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});
      if(idx<0) return;
      var c=dd.tasks[idx];
      var nt=prompt('عنوان جدید:',c.title);
      if(nt===null) return;
      nt=nt.trim();if(!nt) return;
      dd.tasks[idx].title=nt;
      window.savePlanner(pl);refreshBody('left');
    };

    function monthlyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var year=d.getFullYear(),month=d.getMonth();
      var mk=year+'-'+String(month+1).padStart(2,'0');
      if(!pl.months[mk]) pl.months[mk]={goals:[]};
      var goals=pl.months[mk].goals||[];
      var fom=new Date(year,month,1);
      var dim=new Date(year,month+1,0).getDate();
      var so=(fom.getDay()+1)%7;
      var tk=window.dateKey(new Date());
      var sk=window.dateKey(d);
      var wd=['ش','ی','د','س','چ','پ','ج'];
      var cells=[];
      for(var i=0;i<so;i++) cells.push('<div class="cal-day empty"></div>');
      for(var dd=1;dd<=dim;dd++){
        var dt=new Date(year,month,dd);
        var k=window.dateKey(dt);
        var isT=k===tk,isS=k===sk,isF=dt.getDay()===5;
        var dData=window.getDayData(pl,k);
        var dC=(dData.tasks||[]).filter(function(x){return x.done;}).length;
        var total=(dData.tasks||[]).length;
        var rems=getDayReminders(k);
        var evt=getIranianEvent(k);
        var dc='';
        if(total>0){
          var r=dC/total;
          if(r>=1) dc='day-done'; else if(r>0) dc='day-partial'; else dc='day-pending';
        }
        if(isF) dc+=' friday';
        var ic='';
        if(rems.length) ic+='<span class="cal-day-icon icon-evt">'+SI_ICONS.bell+(rems.length>1?'<b>'+toFa(rems.length)+'</b>':'')+'</span>';
        if(evt) ic+='<span class="cal-day-icon icon-occ">'+SI_ICONS.star+'</span>';
        var si='';
        if(total>0){
          if(dC===total) si='<span class="cal-day-status st-done">✓</span>';
          else if(dC>0) si='<span class="cal-day-status st-partial">◐</span>';
          else si='<span class="cal-day-status st-pending">✗</span>';
        }
        cells.push('<div class="cal-day'+(isT?' today':'')+(isS?' selected':'')+(dc?' '+dc:'')+'" title="'+(evt||'')+'" onclick="window.__calDayClick('+dd+')">'
          +'<span class="cal-day-num">'+toFa(dd)+'</span>'+si
          +(ic?'<div class="cal-day-icons-row">'+ic+'</div>':'')
          +'</div>');
      }
      var gh='';
      if(goals.length===0) gh='<div class="mg-empty-compact"><span class="title-icon">'+SI_ICONS.target+'</span>هنوز هدفی نداری</div>';
      else gh='<div class="month-goals-list">'+goals.map(function(g,i){
        return '<div class="month-goal'+(g.done?' done':'')+'">'
          +'<label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleMonthGoalLocal(\''+mk+'\','+i+',this)"><span class="mg-check"></span></label>'
          +'<span class="mg-text">'+esc(g.text)+'</span>'
          +'<button class="mg-del" onclick="window.__deleteMonthGoalLocal(\''+mk+'\','+i+')">✕</button>'
          +'</div>';
      }).join('')+'</div>';
      var dg=goals.filter(function(g){return g.done;}).length;
      return '<div class="monthly-layout">'
        +'<div class="monthly-side"><div class="month-goals compact">'
                +'<div class="month-goals-title"><span class="title-icon">'+SI_ICONS.target+'</span><span>اهداف این ماه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(dg)+'/'+toFa(goals.length)+'</span>':'')+'</div>'
        +gh
        +'<div class="month-goal-add compact"><input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\''+mk+'\')"><button onclick="addMonthGoal(\''+mk+'\')">+</button></div>'
        +'</div></div>'
        +'<div class="monthly-main">'
        +'<div class="cal-legend">'
        +'<span class="cl-item done"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>کامل</span>'
        +'<span class="cl-item partial"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3.5 2"/></svg>نیمه</span>'
        +'<span class="cl-item pending"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>انجام نشده</span>'
        +'<span class="cl-item evt"><svg class="cl-icon-svg" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/></svg>یادآور</span>'
        +'<span class="cl-item occ"><svg class="cl-icon-svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>مناسبت</span>'
        +'</div>'
        +'<div class="month-calendar">'
        +'<div class="cal-weekdays">'+wd.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('')+'</div>'
        +'<div class="cal-grid">'+cells.join('')+'</div>'
        +'</div></div></div>';
    }
    function viewMonthly(){return heroMonthly()+'<div class="planner-body-content">'+monthlyContentHTML()+'</div>';}

    window.__calDayClick=function(day){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
      var dd=window.getDayData(pl,k);
      var tasks=dd.tasks||[];
      var dC=tasks.filter(function(t){return t.done;}).length;
      var rems=getDayReminders(k);
      var ne=getIranianEvent(k);
      var tl=tasks.length?tasks.map(function(t){
        return '<div class="cal-popup-task'+(t.done?' done':'')+'">'+(t.done?'✓':'○')+' '+esc(t.title)+'</div>';
      }).join(''):'';
      var rl=rems.length?rems.map(function(r,i){
        return '<div class="cal-rem-item'+(r.done?' done':'')+'">'
          +'<label class="mg-check-wrap" style="width:18px;height:18px;min-width:18px"><input type="checkbox" '+(r.done?'checked':'')+' onchange="window.__toggleReminder(\''+k+'\','+i+',this)"><span class="mg-check" style="width:18px;height:18px;min-width:18px"></span></label>'
          +'<span class="cal-rem-text">'+esc(r.text)+(r.time?' <span class="cal-rem-time">🕐 '+esc(r.time)+'</span>':'')+'</span>'
          +'<button class="cal-rem-del" onclick="window.__delReminder(\''+k+'\','+i+')">✕</button>'
          +'</div>';
      }).join(''):'';
      var old=document.getElementById('calDayPopup');if(old) old.remove();
      var el=document.createElement('div');el.id='calDayPopup';el.className='siraj-popup-overlay';
       el.innerHTML='<div class="siraj-popup cal-popup-wide">'
        +'<div class="siraj-popup-title">'+SI_ICONS.calendar+' '+toFa(day)+' '+d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'})+'</div>'
        +(ne?'<div class="cal-national-badge">🇮🇷 '+esc(ne)+'</div>':'')
        +'<div class="cal-popup-section">'
        +'<div class="cal-popup-label">'+SI_ICONS.target+' کارها</div>'
        +(tasks.length===0?'<div class="cal-popup-empty">کاری ثبت نشده</div>':'<div class="cal-popup-text">'+toFa(dC)+' از '+toFa(tasks.length)+' انجام شده</div>'+tl)
        +'</div>'
        +'<div class="cal-popup-section">'
        +'<div class="cal-popup-label">'+SI_ICONS.bell+' یادآورها</div>'
        +'<div class="cal-rem-list">'+(rl||'<div class="cal-popup-empty">یادآوری نداری</div>')+'</div>'
        +'<div class="cal-rem-add"><input type="text" id="newRemText" placeholder="یادآور جدید..." onkeydown="if(event.key===\'Enter\')window.__addReminder(\''+k+'\')"><input type="text" id="newRemTime" placeholder="ساعت" maxlength="5"><button onclick="window.__addReminder(\''+k+'\')">افزودن</button></div>'
        +'</div>'
        +'<div class="siraj-popup-actions">'
        +'<button class="siraj-popup-btn secondary" id="calPopupClose">بستن</button>'
        +'<button class="siraj-popup-btn" id="calPopupGo">برو به این روز</button>'
        +'</div></div>';
           document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
      el.querySelector('#calPopupClose').onclick=close;
      el.querySelector('#calPopupGo').onclick=function(){close();selectMonthDay(day);};
    };

    function selectMonthDay(day){
      window.plannerDate=new Date(window.plannerDate.getFullYear(),window.plannerDate.getMonth(),day);
      window.switchPlannerTab('daily');
    }
    window.__addReminder=function(key){
      var inp=document.getElementById('newRemText');
      var tInp=document.getElementById('newRemTime');
      if(!inp) return;
      var v=inp.value.trim();if(!v) return;
      var list=getDayReminders(key);
      list.push({text:v,time:(tInp?tInp.value.trim():''),done:false});
      setDayReminders(key,list);
      window.__calDayClick(parseInt(key.split('-')[2],10));
    };
    window.__toggleReminder=function(key,i,checkbox){
      var list=getDayReminders(key);
      if(!list[i]) return;
      list[i].done=!!checkbox.checked;
      setDayReminders(key,list);
    };
    window.__delReminder=function(key,i){
      var list=getDayReminders(key);
      list.splice(i,1);
      setDayReminders(key,list);
      window.__calDayClick(parseInt(key.split('-')[2],10));
    };

    function yearlyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var y=d.getFullYear();
      if(!pl.years) pl.years={};
      if(!pl.years[y]) pl.years[y]={goals:[]};
      var goals=pl.years[y].goals||[];
      var gh='';
      if(goals.length===0) gh='<div class="mg-empty-compact"><span class="title-icon">'+SI_ICONS.award+'</span>هنوز هدفی نداری</div>';
      else gh='<div class="month-goals-list">'+goals.map(function(g,i){
        return '<div class="month-goal'+(g.done?' done':'')+'">'
          +'<label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleYearGoalLocal('+y+','+i+',this)"><span class="mg-check"></span></label>'
          +'<span class="mg-text">'+esc(g.text)+'</span>'
          +'<button class="mg-del" onclick="window.__deleteYearGoalLocal('+y+','+i+')">✕</button>'
          +'</div>';
      }).join('')+'</div>';
      var dg=goals.filter(function(g){return g.done;}).length;
      var months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      var cmi=-1;
      try{
        var fm=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(new Date()));
        if(fm>=1&&fm<=12) cmi=fm-1;
      }catch(e){}
      var mc=months.map(function(mName,idx){
        var mk=y+'-'+String(idx+1).padStart(2,'0');
        var mg=(pl.months[mk]&&pl.months[mk].goals)||[];
        var md=mg.filter(function(g){return g.done;}).length;
        var pct=mg.length?Math.round((md/mg.length)*100):0;
        var isC=idx===cmi;
        return '<div class="year-month-card'+(isC?' current':'')+'" onclick="window.__goToMonth('+idx+')">'
          +'<div class="ymc-name">'+mName+'</div>'
          +'<div class="ymc-bar"><div class="ymc-fill" style="width:'+pct+'%"></div></div>'
          +'<div class="ymc-stat">'+toFa(md)+'/'+toFa(mg.length)+'</div>'
          +'</div>';
      }).join('');
      return '<div class="monthly-layout">'
        +'<div class="monthly-side"><div class="month-goals year-goals compact">'
        +'<div class="month-goals-title"><span class="title-icon">'+SI_ICONS.award+'</span><span>اهداف سالانه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(dg)+'/'+toFa(goals.length)+'</span>':'')+'</div>'
        +gh
        +'<div class="month-goal-add compact"><input type="text" id="newYearGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addYearGoal('+y+')"><button onclick="addYearGoal('+y+')">+</button></div>'
        +'</div></div>'
        +'<div class="monthly-main"><div class="year-overview">'
        +'<div class="year-overview-title"><span class="title-icon">'+SI_ICONS.chart+'</span>نگاه کلی به ماه‌ها</div>'
        +'<div class="year-months-grid">'+mc+'</div>'
        +'</div></div></div>';
    }
    function viewYearly(){return heroYearly()+'<div class="planner-body-content">'+yearlyContentHTML()+'</div>';}

    window.__goToMonth=function(mi){
      var base=new Date(window.plannerDate||new Date());
      var faYear=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(base));
      var ref=new Date(faYear+621,2,15);
      for(var i=0;i<40;i++){
        try{
          var fY=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(ref));
          var fM=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(ref));
          var fD=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric'}).format(ref));
          if(fY===faYear&&fM===1&&fD===1) break;
        }catch(e){}
        ref.setDate(ref.getDate()+1);
      }
      for(var j=0;j<400;j++){
        try{
          var fY2=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(ref));
          var fM2=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(ref));
          if(fY2===faYear&&fM2===(mi+1)){window.plannerDate=new Date(ref);window.switchPlannerTab('monthly');return;}
        }catch(e){}
        ref.setDate(ref.getDate()+1);
      }
    };

    window.__toggleMonthGoalLocal=function(mk,i,cb){
      var pl=window.loadPlannerNew();
      if(!pl.months[mk]||!pl.months[mk].goals[i]) return;
      pl.months[mk].goals[i].done=!!cb.checked;
      window.savePlanner(pl);
      var p=cb.closest('.month-goal');if(p)p.classList.toggle('done',!!cb.checked);
      var t=document.querySelector('.month-goals-title .mg-counter');
      if(t){var gs=pl.months[mk].goals;t.textContent=toFa(gs.filter(function(g){return g.done;}).length)+'/'+toFa(gs.length);}
    };
    window.__deleteMonthGoalLocal=function(mk,i){
      var pl=window.loadPlannerNew();
      if(!pl.months[mk]||!pl.months[mk].goals) return;
      pl.months[mk].goals.splice(i,1);
      window.savePlanner(pl);refreshBody('left');
    };
    window.__toggleYearGoalLocal=function(y,i,cb){
      var pl=window.loadPlannerNew();
      if(!pl.years||!pl.years[y]||!pl.years[y].goals[i]) return;
      pl.years[y].goals[i].done=!!cb.checked;
      window.savePlanner(pl);
      var p=cb.closest('.month-goal');if(p)p.classList.toggle('done',!!cb.checked);
    };
    window.__deleteYearGoalLocal=function(y,i){
      var pl=window.loadPlannerNew();
      if(!pl.years||!pl.years[y]||!pl.years[y].goals) return;
      pl.years[y].goals.splice(i,1);
      window.savePlanner(pl);refreshBody('left');
    };
    window.addMonthGoal=function(mk){
      var inp=document.getElementById('newGoalInput');if(!inp) return;
      var v=inp.value.trim();if(!v) return;
      var pl=window.loadPlannerNew();
      if(!pl.months[mk]) pl.months[mk]={goals:[]};
      pl.months[mk].goals.push({text:v,done:false});
      window.savePlanner(pl);inp.value='';refreshBody('left');
    };
    window.addYearGoal=function(y){
      var inp=document.getElementById('newYearGoalInput');if(!inp) return;
      var v=inp.value.trim();if(!v) return;
      var pl=window.loadPlannerNew();
      if(!pl.years) pl.years={};
      if(!pl.years[y]) pl.years[y]={goals:[]};
      pl.years[y].goals.push({text:v,done:false});
      window.savePlanner(pl);inp.value='';refreshBody('left');
    };

        window.renderPanelForPlanner=function(){
      var p=getProfile();
      var te=document.getElementById('panelTitleText');
      var se=document.getElementById('panelSubText');
      if(te) te.textContent='برنامه‌ریزی';
      if(se) se.textContent=p.name?('سلام '+p.name+'، خوشومدی'):'سلام، خوشومدی';
      var tab=getTab();
      var tabs=[
        {id:'daily',label:'روزانه',icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'},
        {id:'weekly',label:'هفتگی',icon:'<path d="M3 21h18"/><path d="M5 21v-6M9 21v-10M13 21v-7M17 21v-13M21 21v-4"/>'},
        {id:'monthly',label:'ماهانه',icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'},
        {id:'yearly',label:'سالانه',icon:'<path d="M3 20h18"/><path d="m7 20 5-14 5 14"/>'}
      ];
      var th='<div class="panel-planner-tabs">'+tabs.map(function(t){
        return '<button class="panel-planner-tab'+(t.id===tab?' active':'')+'" onclick="window.switchPlannerTab(\''+t.id+'\')"><svg viewBox="0 0 24 24">'+t.icon+'</svg><span>'+t.label+'</span></button>';
      }).join('')+'</div>';

      var learned=getAllLearned();
      var practice=getAllPractice();
      var lc=learned.length,pc=practice.length;

      var pc2=document.getElementById('panelContent');if(!pc2) return;
      pc2.innerHTML=th
        +'<button onclick="window.__openStudy()" class="panel-study-btn" style="margin-top:14px">'
        +'<span class="panel-btn-icon">'+SI_ICONS.lamp+'</span>'
        +'<div style="text-align:right;flex:1"><div>حالت مطالعه</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">با تایمر و تمرکز</div></div>'
        +'</button>'
        +'<button onclick="window.__openLibrary()" class="panel-library-btn">'
        +'<span class="panel-btn-icon">'+SI_ICONS.library+'</span>'
        +'<div style="text-align:right;flex:1"><div>کتابخانه یادگیری</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">یادگرفته‌ها و تمرین‌ها'+(lc+pc>0?' · '+toFa(lc+pc)+' آیتم':'')+'</div></div>'
        +'</button>'
        +'<div class="panel-card guide-card" style="margin-top:10px">'
        +'<div class="card-title"><span class="title-icon">'+SI_ICONS.bookOpen+'</span>راهنما</div>'
        +'<div class="guide-list">'
        +'<div class="guide-item"><span class="guide-icon">'+SI_ICONS.sparkle+'</span>روی حالت مطالعه بزن</div>'
        +'<div class="guide-item"><span class="guide-icon">'+SI_ICONS.books+'</span>یه کار انتخاب کن</div>'
        +'<div class="guide-item"><span class="guide-icon">'+SI_ICONS.clock+'</span>زمان تنظیم کن</div>'
        +'<div class="guide-item"><span class="guide-icon">'+SI_ICONS.graduation+'</span>کتابخانه یادگیری رو ببین</div>'
        +'</div></div>';
    };
    function playSound(t){
      stopAudio();
      var u=SOUND_FILES[t];if(!u) return;
      var a=new Audio(u);
      a.loop=true;a.volume=masterVolume;a.preload='auto';
      a.play().catch(function(err){console.warn('[Sound]',err.message);});
      currentAudio=a;
    }
    function setMasterVolume(v){masterVolume=Math.max(0,Math.min(1,v));if(currentAudio) currentAudio.volume=masterVolume;}

    function loadStudyChat(){try{return JSON.parse(sessionStorage.getItem(STUDY_CHAT_KEY)||'[]');}catch(e){return[];}}
    function saveStudyChat(){try{sessionStorage.setItem(STUDY_CHAT_KEY,JSON.stringify(studyChatHistory));}catch(e){}}
    function clearStudyChat(){studyChatHistory=[];try{sessionStorage.removeItem(STUDY_CHAT_KEY);}catch(e){}}
    var studyChatHistory=loadStudyChat();
    var studyTimer=null,studySeconds=0,studyRunning=false,studyPaused=false,studyTotalMinutes=0;

    function buildStudyOverlay(){
      var old=document.getElementById('studyOverlay');if(old) old.remove();
      var pl=window.loadPlannerNew();
      var tk=window.dateKey(new Date());
      var ddT=window.getDayData(pl,tk);
      var aTasks=(ddT.tasks||[]).filter(function(x){return !x.done;}).map(function(x){return {id:x.id,title:x.title,dayKey:tk};});
      var hT=aTasks.length>0;
      var tf=hT
        ? '<div class="siraj-select" id="studyTaskSelect" style="width:100%"><div class="siraj-select-trigger" style="width:100%"><span class="siraj-select-value">'+(window.__studyTask?esc(window.__studyTask):'— یک کار از امروز (اختیاری) —')+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel" style="width:100%;min-width:100%">'+aTasks.map(function(x){
            return '<div class="siraj-select-item" data-value="'+esc(x.title)+'" data-id="'+esc(x.id)+'" data-day="'+esc(x.dayKey)+'"><span>'+esc(x.title)+'</span></div>';
          }).join('')+'</div></div>'
        : '<div class="study-empty-box">📝 کاری برای امروز نداری</div>';

      var el=document.createElement('div');
      el.id='studyOverlay';el.className='study-overlay';
      el.innerHTML=
        '<div id="studySetup" class="study-setup">'
        +'<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>'
        +'<div class="study-title">حالت مطالعه</div>'
        +tf
        +'<div class="stp-wrap" id="studyTimePicker"><div class="stp-hint">↑ بکش بالا / ↓ پایین</div><span class="stp-num" id="studyTimeNum">۰۰:۲۵</span></div>'
        +'<div class="study-music-section"><div class="study-music-title"><span>🎵 صدای محیطی</span></div>'
        +'<div class="study-sound-grid">'
        +'<button class="study-sound-btn" data-sound="nature"><span class="ss-icon">🌊</span><span>موج دریا</span></button>'
        +'<button class="study-sound-btn" data-sound="forest"><span class="ss-icon">🌳</span><span>جنگل</span></button>'
        +'<button class="study-sound-btn" data-sound="hall"><span class="ss-icon">🌙</span><span>سکوت گرم</span></button>'
        +'<button class="study-sound-btn" data-sound="rain"><span class="ss-icon">☔</span><span>بارش</span></button>'
        +'<button class="study-sound-btn off-btn on" data-sound=""><span class="ss-icon">🔇</span><span>خاموش</span></button>'
        +'</div>'
        +'<div class="study-volume-row"><input type="range" min="0" max="100" value="40" id="studyVolume" style="--vp:40%"></div>'
        +'</div>'
        +'<div class="study-actions">'
        +'<button class="study-btn" id="studyStartBtn">شروع مطالعه</button>'
        +'<button class="study-btn secondary" id="studyCancelBtn">لغو</button>'
        +'</div></div>'
        +'<div id="studyRunning" class="study-setup" style="display:none">'
        +'<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>'
        +'<div class="study-mode-badge">🎯 در حال تمرکز</div>'
        +'<div class="study-timer" id="studyTimer"><span class="study-digit" data-k="m1">۰</span><span class="study-digit" data-k="m2">۰</span><span class="study-colon">:</span><span class="study-digit" data-k="s1">۰</span><span class="study-digit" data-k="s2">۰</span></div>'
        +'<div class="study-task" id="studyTaskName">—</div>'
        +'<div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی 💪</div>'
        +'<div class="study-actions">'
        +'<div class="study-actions-row top">'
        +'<button class="study-btn" id="studyToolsBtn">🛠️ دستیار</button>'
        +'<button class="study-btn" id="studyChatBtn">🤖 هوش مصنوعی سراج</button>'
        +'</div>'
        +'<div class="study-actions-row bottom">'
        +'<button class="study-btn pause-mode" id="studyPauseBtn"><span id="studyPauseLabel">توقف</span></button>'
        +'<button class="study-btn finish-mode" id="studyFinishBtn">پایان و ثبت</button>'
        +'</div>'
        +'</div></div>';
      document.body.appendChild(el);

      var picker=el.querySelector('#studyTimePicker');
      var numEl=el.querySelector('#studyTimeNum');
      var pv=25,dSY=0,dSV=25,dg=false;
      try{if(typeof settings!=='undefined' && settings.studyDefaultMinutes){pv = parseInt(settings.studyDefaultMinutes) || 25;}}catch(e){}
      function setPV(v){pv=Math.max(1,Math.min(180,Math.round(v)));numEl.textContent=formatTimer(pv);}
      setPV(pv);
      function pd(e){dg=true;dSY=(e.touches?e.touches[0].clientY:e.clientY);dSV=pv;picker.classList.add('dragging');e.preventDefault();}
      function pm(e){if(!dg) return;var y=(e.touches?e.touches[0].clientY:e.clientY);setPV(dSV+Math.round((dSY-y)/6));}
      function pu(){if(!dg) return;dg=false;picker.classList.remove('dragging');}
      picker.addEventListener('mousedown',pd);
      picker.addEventListener('touchstart',pd,{passive:false});
      document.addEventListener('mousemove',pm);
      document.addEventListener('mouseup',pu);
      document.addEventListener('touchmove',pm,{passive:false});
      document.addEventListener('touchend',pu);
      _studyDragHandlers={move:pm,up:pu};
      window.__studyMinutesGetter=function(){return pv;};

      el.querySelectorAll('.study-sound-btn').forEach(function(b){
        b.onclick=function(){
          var s=b.getAttribute('data-sound');
          el.querySelectorAll('.study-sound-btn').forEach(function(x){x.classList.remove('on');});
          if(!s){stopAudio();b.classList.add('on');return;}
          b.classList.add('on');playSound(s);
        };
      });
      var vol=el.querySelector('#studyVolume');
      if(vol){vol.oninput=function(){var pct=this.value;this.style.setProperty('--vp',pct+'%');setMasterVolume(pct/100);};}
      var tSel=el.querySelector('#studyTaskSelect');
      if(tSel){
        var tr=tSel.querySelector('.siraj-select-trigger');
        tr.onclick=function(e){
          e.stopPropagation();
          var w=tSel.classList.contains('open');
          document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
          if(!w) tSel.classList.add('open');
        };
        tSel.querySelectorAll('.siraj-select-item').forEach(function(it){
          it.onclick=function(e){
            e.stopPropagation();
            var v=it.getAttribute('data-value'),id=it.getAttribute('data-id'),dk=it.getAttribute('data-day');
            window.__studyTask=v;window.__studyTaskSourceId=id||null;window.__studyTaskSourceDay=dk||null;
            tSel.querySelector('.siraj-select-value').textContent=v;
            tSel.classList.remove('open');
          };
        });
      }
      el.querySelector('#studyStartBtn').onclick=startStudy;
      el.querySelector('#studyCancelBtn').onclick=function(){stopAudio();closeStudy();};
      el.querySelector('#studyChatBtn').onclick=toggleStudyChat;
      el.querySelector('#studyToolsBtn').onclick=toggleStudyTools;
      el.querySelector('#studyPauseBtn').onclick=toggleStudyPause;
      el.querySelector('#studyFinishBtn').onclick=finishAndRecord;
    }

    function startStudy(){
      var o=document.getElementById('studyOverlay');if(!o) return;
      var t=window.__studyTask||'';
      var m=window.__studyMinutesGetter?window.__studyMinutesGetter():25;
      if(!m||m<1) m=25;
      if(m>180) m=180;
      studySeconds=m*60;studyTotalMinutes=m;
      studyRunning=true;studyPaused=false;

      var setup=o.querySelector('#studySetup');
      var running=o.querySelector('#studyRunning');

      setup.style.transition='opacity .28s ease, transform .32s ease';
      setup.style.opacity='0';
      setup.style.transform='scale(.94)';

      setTimeout(function(){
        setup.style.display='none';
        setup.style.opacity='';
        setup.style.transform='';
        setup.style.transition='';

        running.style.display='flex';
        running.style.opacity='0';
        running.style.transform='translateY(20px) scale(.94)';
        running.style.transition='none';
        void running.offsetWidth;
        running.style.transition='opacity .5s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.34,1.4,.64,1)';
        running.style.opacity='1';
        running.style.transform='translateY(0) scale(1)';

        setTimeout(function(){
          running.style.transition='';
          running.style.opacity='';
          running.style.transform='';
        },600);
      }, 300);

      o.querySelector('#studyTaskName').textContent=t||'مطالعه آزاد';
      o.classList.remove('paused');
      updateStudyTimer(true);
      startStudyTimer();
      lockSite();
    }
    function elapsedMinutes(){return Math.max(1,studyTotalMinutes-Math.floor(studySeconds/60));}
    function markSourceTaskDone(){
      if(!window.__studyTaskSourceId||!window.__studyTaskSourceDay) return;
      var pl=window.loadPlannerNew();
      var dd=window.getDayData(pl,window.__studyTaskSourceDay);
      var idx=(dd.tasks||[]).findIndex(function(x){return x.id===window.__studyTaskSourceId;});
      if(idx>=0){dd.tasks[idx].done=true;dd.tasks[idx].studiedMinutes=elapsedMinutes();window.savePlanner(pl);}
    }
    function startStudyTimer(){
      if(studyTimer) clearInterval(studyTimer);
      studyTimer=setInterval(function(){
        if(studyPaused) return;
        studySeconds--;
        updateStudyTimer(false);
        if(studySeconds<=0){
          clearInterval(studyTimer);studyTimer=null;studyRunning=false;
          stopAudio();
          try{
            var ac=new (window.AudioContext||window.webkitAudioContext)();
            var o=ac.createOscillator(),g=ac.createGain();
            o.type='sine';o.frequency.value=880;
            g.gain.setValueAtTime(0,ac.currentTime);
            g.gain.linearRampToValueAtTime(0.2,ac.currentTime+0.05);
            g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.8);
            o.connect(g);g.connect(ac.destination);
            o.start();o.stop(ac.currentTime+0.85);
            setTimeout(function(){try{ac.close();}catch(e){}},1200);
          }catch(e){}
          showPopup('🎉','عالی بود!','زمان مطالعه تموم شد.');
        }
      },1000);
    }
    function toggleStudyPause(){
      var o=document.getElementById('studyOverlay');if(!o) return;
      var b=o.querySelector('#studyPauseBtn');
      var l=o.querySelector('#studyPauseLabel');
      var s=o.querySelector('#studyRunningSub');
      if(b) b.classList.add('switching');
      setTimeout(function(){
        studyPaused=!studyPaused;
        if(studyPaused){
          o.classList.add('paused');
          if(b){b.classList.remove('pause-mode');b.classList.add('resume-mode');}
          if(l) l.textContent='ادامه';
          if(currentAudio) currentAudio.volume=0;
          if(s) s.textContent='⏸️ متوقف شده';
        } else {
          o.classList.remove('paused');
          if(b){b.classList.remove('resume-mode');b.classList.add('pause-mode');}
          if(l) l.textContent='توقف';
          var vol=o.querySelector('#studyVolume');
          var v=vol?(parseInt(vol.value)/100):0.4;
          if(currentAudio) currentAudio.volume=v;
          if(s) s.textContent='تا اتمام تایمر 💪';
        }
        setTimeout(function(){if(b) b.classList.remove('switching');},240);
      },140);
    }
    function setDigit(k,v,a){
      var el=document.querySelector('.study-digit[data-k="'+k+'"]');if(!el) return;
      var f=toFa(v);if(el.textContent===f) return;
      if(a){el.classList.remove('roll');void el.offsetWidth;el.classList.add('roll');}
      el.textContent=f;
    }
    function updateStudyTimer(i){
      if(studySeconds<0) studySeconds=0;
      var m=Math.floor(studySeconds/60),s=studySeconds%60;
      var mS=(m<10?'0':'')+m;var sS=(s<10?'0':'')+s;
      var a=!i;
      setDigit('m1',mS[0],a);setDigit('m2',mS[1],a);
      setDigit('s1',sS[0],a);setDigit('s2',sS[1],a);
    }
    function finishAndRecord(){
      var strictMode = true;
      try{ if(typeof settings!=='undefined' && settings.studyStrictMode===false) strictMode=false; }catch(e){}
      if(strictMode && studyRunning && studySeconds>10){showEarlyExitPopup();return;}
      doFinishRecord();
    }
    function doFinishRecord(){
      var m=elapsedMinutes();
      var sd=window.__studyTaskSourceDay;
      var st=window.__studyTask;
      markSourceTaskDone();
      if(st) showPopup('🏆','جلسه تموم شد!','«'+st+'» با '+formatMinutes(m)+' ثبت شد.');
      else showPopup('✨','خوب بود!',formatMinutes(m)+' ثبت شد.');
      if(studyTimer) clearInterval(studyTimer);
      studyTimer=null;studyRunning=false;
      window.__studyTask='';window.__studyTaskSourceId=null;window.__studyTaskSourceDay=null;
      clearStudyChat();stopAudio();unlockSite();closeStudy();
      if(sd) setTimeout(function(){maybeCelebrate(sd);},500);
    }
    function showEarlyExitPopup(){
      var old=document.getElementById('earlyExitPopup');if(old) old.remove();
      var el=document.createElement('div');el.id='earlyExitPopup';el.className='siraj-popup-overlay';
      el.innerHTML='<div class="siraj-popup">'
        +'<span class="siraj-popup-emoji">⚠️</span>'
        +'<div class="siraj-popup-title">هنوز تایمر تموم نشده!</div>'
        +'<div class="siraj-popup-text">مطمئنی می‌خوای الان خارج شی؟ هنوز '+formatMinutes(Math.floor(studySeconds/60))+' مونده 💪</div>'
        +'<div class="siraj-popup-actions">'
        +'<button class="siraj-popup-btn secondary" id="earlyStay">✋ نه، ادامه می‌دم</button>'
        +'<button class="siraj-popup-btn" id="earlyLeave" style="background:linear-gradient(135deg,#EF4444,#DC2626)">بله، خارج می‌شم</button>'
        +'</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
      el.querySelector('#earlyStay').onclick=function(){close();if(window.toast) window.toast('ادامه بده! 💪','success');};
      el.querySelector('#earlyLeave').onclick=function(){close();showExitReasonPopup();};
    }
    function showExitReasonPopup(){
      var old=document.getElementById('exitReasonPopup');if(old) old.remove();
      var el=document.createElement('div');el.id='exitReasonPopup';el.className='exit-reason-overlay';
      el.innerHTML='<div class="exit-reason-box">'
        +'<span class="exit-reason-emoji">🔒</span>'
        +'<div class="exit-reason-title">دلیل خروجت رو بنویس</div>'
        +'<div class="exit-reason-text">اگه دلیلت واقعی باشه می‌تونی خارج شی. ولی بدون...</div>'
        +'<div class="exit-reason-warning"><span class="erw-emoji">😏</span><span>حواست باشه دلیل الکی نیاری — من از لحن پیامت می‌فهمم!</span></div>'
        +'<textarea class="exit-reason-input" id="exitReasonText" placeholder=""></textarea>'
        +'<div class="exit-reason-error" id="exitReasonError"></div>'
        +'<div class="exit-reason-actions">'
        +'<button class="btn-continue" id="exitReasonCancel">✋ ادامه می‌دم</button>'
        +'<button class="btn-exit" id="exitReasonSubmit">بررسی دلیل</button>'
        +'</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ el.classList.add('open'); });
      });
      setTimeout(function(){var t=document.getElementById('exitReasonText');if(t) t.focus();},300);
      var errEl=el.querySelector('#exitReasonError');
      el.querySelector('#exitReasonCancel').onclick=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
      el.querySelector('#exitReasonSubmit').onclick=async function(){
        var reason=(document.getElementById('exitReasonText')||{}).value||'';
        reason=reason.trim();
        if(!reason){errEl.textContent='دلیل خروج رو بنویس';return;}
        if(reason.length<8){errEl.textContent='دلیل خروج خیلی کوتاهه — واضح‌تر بنویس';return;}
        var box=el.querySelector('.exit-reason-box');
        box.innerHTML='<div class="exit-reason-checking"><div class="spinner"></div><span>دارم بررسی می‌کنم...</span></div>';
        var result=await checkReasonWithAI(reason);
        if(result.valid){
          box.innerHTML='<span class="exit-reason-emoji">✅</span>'
            +'<div class="exit-reason-title">دلیلت موجه بود</div>'
            +'<div class="exit-reason-text">باشه، می‌تونی خارج شی. موفق باشی 🌱</div>'
            +'<div class="exit-reason-actions"><button class="btn-continue" id="finalExitBtn">خروج</button></div>';
          box.querySelector('#finalExitBtn').onclick=function(){el.remove();doFinishRecord();};
        } else {
          box.innerHTML='<span class="exit-reason-emoji">❌</span>'
            +'<div class="exit-reason-title">دلیلت موجه نیست</div>'
            +'<div class="exit-reason-text">اگه واقعاً مجبوری بری، یه راه دیگه هست...</div>'
            +'<div class="punishment-box">'
            +'<span class="pb-title">🎯 تنبیه خروج زودهنگام</span>'
            +'فردا باید <b>دو برابر</b> امروز مطالعه کنی!'
            +'</div>'
            +'<div class="exit-reason-actions">'
            +'<button class="btn-continue secondary" id="stayBtn">✋ نه، ادامه می‌دم</button>'
            +'<button class="btn-exit" id="acceptPunish">قبول می‌کنم و خارج می‌شم</button>'
            +'</div>';
          box.querySelector('#stayBtn').onclick=function(){el.classList.remove('open');setTimeout(function(){el.remove();},380);};
          box.querySelector('#acceptPunish').onclick=function(){
            try{
              var baseDate = window.plannerDate || new Date();
              var tomorrow = new Date(baseDate);
              tomorrow.setHours(12,0,0,0);
              tomorrow.setDate(tomorrow.getDate()+1);
              var tk = window.dateKey(tomorrow);
              var pl=window.loadPlannerNew();
              var dd=window.getDayData(pl,tk);
              if(!dd.tasks) dd.tasks=[];
              dd.tasks.push({
                id:'punish_'+Date.now(),
                title:'مطالعه دو برابر (به خاطر خروج زودهنگام از حالت مطالعه)',
                time:'', priority:'high', done:false, isPunishment:true, createdAt:Date.now()
              });
              window.savePlanner(pl);
              if(window.toast) window.toast('یادآور برای فردا ثبت شد ⚖️','info');
            }catch(e){}
            el.remove();doFinishRecord();
          };
        }
      };
    }
    async function checkReasonWithAI(reason){
      try{
        var prompt = 'دلیل کاربر برای قطع جلسه مطالعه قبل از پایان تایمر:\n\n"'+reason+'"\n\n'
          +'آیا این دلیل واقعی و موجهه برای قطع جلسه؟ '
          +'دلایل موجه: بیماری ناگهانی، حادثه، وضعیت اورژانسی، کار بسیار ضروری، حال روحی خیلی بد، مشکل جسمی جدی، کار اداری/خانوادگی فوری.\n'
          +'دلایل غیرموجه: بی‌حوصلگی، خستگی معمولی، حواس‌پرتی، وسوسه شبکه اجتماعی، بی‌انگیزگی، حوصله نداشتن، کار غیرضروری، دلایل ساختگی و کلیشه‌ای.\n\n'
          +'فقط با یک کلمه جواب بده: "بله" (موجه) یا "خیر" (غیرموجه).';
        var res = await fetch(getBaseURL(),{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            model:getModel(),
            messages:[
              {role:'system',content:'تو یه ارزیاب دقیق و سخت‌گیر هستی. فقط با «بله» یا «خیر» جواب بده.'},
              {role:'user',content:prompt}
            ],
            temperature:0.15, stream:false, max_tokens:10
          })
        });
        if(!res.ok){return { valid: reason.length >= 25 };}
        var data = await res.json();
        var ans = '';
        if(data.choices && data.choices[0]){
          if(data.choices[0].message && data.choices[0].message.content){ans = data.choices[0].message.content;}
          else if(data.choices[0].delta && data.choices[0].delta.content){ans = data.choices[0].delta.content;}
          else if(data.choices[0].text){ans = data.choices[0].text;}
        }
        ans = String(ans||'').trim();
        var lower = ans.toLowerCase();
        var hasNo = (ans.indexOf('خیر') > -1) || (ans.indexOf('نه ') > -1) || (ans === 'نه') || (lower.indexOf('no') > -1 && lower.indexOf('not') !== 0);
        var hasYes = (ans.indexOf('بله') > -1) || (ans.indexOf('آری') > -1) || (lower.indexOf('yes') > -1) || (lower.indexOf('true') > -1);
        if(hasNo && !hasYes) return { valid: false };
        if(hasYes && !hasNo) return { valid: true };
        if(reason.length < 15) return { valid: false };
        var vagueWords = ['حوصله','بی‌حوصله','خسته','حوصل','حالم نیست','دوست ندارم','نمی‌خوام','بسه','کافیه'];
        for(var i=0;i<vagueWords.length;i++){
          if(reason.indexOf(vagueWords[i]) > -1 && reason.length < 40){return { valid: false };}
        }
        return { valid: reason.length >= 30 };
      }catch(e){return { valid: reason.length >= 25 };}
    }
    function closeStudy(){
      try{stopAudio();}catch(e){}
      var o=document.getElementById('studyOverlay');
      var chat=document.getElementById('studyChatPanel');
      var tools=document.getElementById('studyToolsPanel');
      if(chat) chat.remove();
      if(tools) tools.remove();
      if(_studyDragHandlers){
        try{
          document.removeEventListener('mousemove',_studyDragHandlers.move);
          document.removeEventListener('mouseup',_studyDragHandlers.up);
          document.removeEventListener('touchmove',_studyDragHandlers.move);
          document.removeEventListener('touchend',_studyDragHandlers.up);
        }catch(e){}
        _studyDragHandlers=null;
      }
      if(!o) return;
      if(o.dataset.closing==='1') return;
      o.dataset.closing='1';
      o.classList.remove('open');
      setTimeout(function(){if(o.parentNode)o.remove();},700);
      setTimeout(function(){
        if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
        refreshBody('left');
      },400);
    }
    function blockKey(e){
      if(!studyRunning) return;
      var k=e.key||'';var c=e.ctrlKey||e.metaKey;
      if(k==='F5'||k==='F11'||k==='Escape'||(c&&['r','R','w','W','n','N','t','T','p','P'].indexOf(k)>=0)){
        e.preventDefault();e.stopPropagation();return false;
      }
    }
    function blockContext(e){if(studyRunning) e.preventDefault();}
    function blockUnload(e){if(!studyRunning) return;e.preventDefault();e.returnValue='در حال مطالعه';return e.returnValue;}
    function lockSite(){
      document.addEventListener('keydown',blockKey,true);
      document.addEventListener('contextmenu',blockContext,true);
      window.addEventListener('beforeunload',blockUnload);
    }
    function unlockSite(){
      document.removeEventListener('keydown',blockKey,true);
      document.removeEventListener('contextmenu',blockContext,true);
      window.removeEventListener('beforeunload',blockUnload);
    }
    window.__openStudy=function(customTitle){
      if(customTitle) window.__studyTask=customTitle;
      buildStudyOverlay();
      var o=document.getElementById('studyOverlay');
      if(!o) return;
      o.style.opacity='0';o.style.transform='scale(.92)';o.style.transition='none';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          o.style.transition='opacity .4s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.34,1.4,.64,1), visibility .4s';
          o.classList.add('open');
          o.style.opacity='';
          o.style.transform='';
        });
      });
    };

    function renderStudyChat(){
      var box=document.getElementById('studyChatMessages');if(!box) return;
      var p=getProfile();
      var name = (p.name||'').trim() || 'دوست من';
      var greetingText = 'سلام '+name+' 👋<br>من سراجم — الان توی حالت تمرکزیم 📚<br>حواست به درس باشه، من هم اینجام اگه سؤالی داشتی بپرس ✨';
      var html='<div class="sc-msg sc-bot">'+greetingText+'</div>';
      studyChatHistory.forEach(function(m){
        if(m.role==='user') html+='<div class="sc-msg sc-user">'+esc(m.content)+'</div>';
        else if(m.role==='assistant') html+='<div class="sc-msg sc-bot">'+esc(m.content)+'</div>';
      });
      box.innerHTML=html;
      box.scrollTop=box.scrollHeight;
    }
    function toggleStudyChat(){
      var ex=document.getElementById('studyChatPanel');
      if(ex){ex.classList.remove('open');setTimeout(function(){ex.remove();},320);return;}
      var p=document.createElement('div');
      p.id='studyChatPanel';p.className='study-chat-panel';
      p.innerHTML='<div class="study-chat-header"><div class="study-chat-header-title">🤖 سراج — دستیار مطالعه</div><button class="study-chat-close" id="studyChatCloseBtn">✕</button></div>'
        +'<div class="study-chat-messages" id="studyChatMessages"></div>'
        +'<div class="study-chat-input-row">'
        +'<input type="text" class="study-chat-input" id="studyChatInput" placeholder="سؤالت رو بپرس..." onkeydown="if(event.key===\'Enter\')window.__studyChatSend()">'
        +'<button class="study-chat-send" onclick="window.__studyChatSend()">➤</button>'
        +'</div>';
      document.body.appendChild(p);
      p.querySelector('#studyChatCloseBtn').onclick=function(){p.classList.remove('open');setTimeout(function(){p.remove();},320);};
      renderStudyChat();
      requestAnimationFrame(function(){p.classList.add('open');});
      setTimeout(function(){var i=document.getElementById('studyChatInput');if(i) i.focus();},350);
    }
    function toggleStudyTools(){
      var ex=document.getElementById('studyToolsPanel');
      if(ex){ex.classList.remove('open');setTimeout(function(){ex.remove();},320);return;}
      var p=document.createElement('div');
      p.id='studyToolsPanel';p.className='study-tools-panel';
      p.innerHTML='<div class="study-chat-header"><div class="study-chat-header-title">🛠️ دستیارهای مطالعه</div><button class="study-chat-close" id="studyToolsCloseBtn">✕</button></div>'
        +'<div class="study-tools-grid">'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'اعراب\')"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><div class="stc-title">اعراب</div><div class="stc-desc">تجزیه و ترکیب</div></div>'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'تحلیل بیت\')"><svg viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/></svg><div class="stc-title">تحلیل بیت</div><div class="stc-desc">ادبی و بلاغی</div></div>'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'قواعد\')"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg><div class="stc-title">قواعد</div><div class="stc-desc">نکات دستوری</div></div>'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'ترجمه\')"><svg viewBox="0 0 24 24"><path d="m5 8 6 6m-7 0 6-6 2-3M2 5h12"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M21 5v14"/></svg><div class="stc-title">ترجمه</div><div class="stc-desc">عربی به فارسی</div></div>'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'تمرین\')"><svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg><div class="stc-title">تمرین ساز</div><div class="stc-desc">آزمون شخصی</div></div>'
        +'<div class="study-tool-card" onclick="window.__studyTool(\'واژه\')"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><div class="stc-title">واژه جدید</div><div class="stc-desc">کلمه یاد بگیر</div></div>'
        +'</div>';
      document.body.appendChild(p);
      p.querySelector('#studyToolsCloseBtn').onclick=function(){p.classList.remove('open');setTimeout(function(){p.remove();},320);};
      requestAnimationFrame(function(){p.classList.add('open');});
    }
    window.__studyTool=function(type){
      var tp=document.getElementById('studyToolsPanel');
      if(tp){tp.classList.remove('open');setTimeout(function(){if(tp.parentNode)tp.remove();},320);}
      setTimeout(function(){
        var chat=document.getElementById('studyChatPanel');
        if(!chat) toggleStudyChat();
        setTimeout(function(){
          var inp=document.getElementById('studyChatInput');
          if(inp){inp.value='می‌خوام یه '+type+' بهم یاد بدی و تمرین کنی.';inp.focus();}
        },420);
      },260);
    };

    window.__studyChatSend=async function(){
      var inp=document.getElementById('studyChatInput');
      var box=document.getElementById('studyChatMessages');
      if(!inp||!box) return;
      var q=inp.value.trim();if(!q) return;
      box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-user">'+esc(q)+'</div>');
      inp.value='';
      box.scrollTop=box.scrollHeight;
      studyChatHistory.push({role:'user',content:q});
      saveStudyChat();
      var tid='sct_'+Date.now();
      box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-bot" id="'+tid+'">💭 ...</div>');
      box.scrollTop=box.scrollHeight;
      var sysPrompt='تو «سراج» هستی.\n\n'+profilePrompt();
      try{
        var res=await fetch(getBaseURL(),{
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
          body:JSON.stringify({
            model:getModel(),
            messages:[{role:'system',content:sysPrompt}].concat(studyChatHistory.slice(-10)),
            temperature:0.7,stream:true
          })
        });
        var te=document.getElementById(tid);
        if(!res.ok){if(te) te.textContent='خطا ('+res.status+')';return;}
        if(te) te.remove();
        var botId='scb_'+Date.now();
        box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-bot" id="'+botId+'"></div>');
        var botEl=document.getElementById(botId);
        var reader=res.body.getReader(),dec=new TextDecoder(),buf='',full='';
        while(true){
          var r=await reader.read();if(r.done) break;
          buf+=dec.decode(r.value,{stream:true});
          var lines=buf.split('\n');buf=lines.pop();
          for(var i=0;i<lines.length;i++){
            var tr=lines[i].trim();if(!tr.startsWith('data:')) continue;
            var dd=tr.slice(5).trim();if(!dd||dd==='[DONE]') continue;
            try{
              var j=JSON.parse(dd);
              var delta=j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content;
              if(delta){full+=delta;botEl.textContent=full;box.scrollTop=box.scrollHeight;}
            }catch(e){}
          }
        }
        studyChatHistory.push({role:'assistant',content:full});
        saveStudyChat();
      }catch(err){
        var t2=document.getElementById(tid);if(t2) t2.textContent='خطا: '+err.message;
      }
    };

    /* ═══════════════════════════════════════════════════════════════
       LINKIFY CONTACTS
       ═══════════════════════════════════════════════════════════════ */
    function linkifyContacts(){
      document.querySelectorAll('.contact-row').forEach(function(row){
        if(row.tagName==='A'||row.dataset.linkified==='1') return;
        row.dataset.linkified='1';
        row.querySelectorAll('.contact-copy, [data-copy], .copy-btn').forEach(function(b){b.remove();});
        var link = row.getAttribute('data-link');
        if(!link){
          var le=row.querySelector('.contact-label');
          var ve=row.querySelector('.contact-value');
          var l=(le?le.textContent:'').trim();
          var v=(ve?ve.textContent:'').trim();
          var vv=v.replace(/^[@\s]+/,'').trim();
          if(/تلگرام|telegram/i.test(l)) link='https://t.me/'+vv;
          else if(/ایمیل|email/i.test(l)) link='mailto:'+v;
          else if(/اینستاگرام|instagram/i.test(l)) link='https://instagram.com/'+vv;
          else if(/^X$|توییتر|twitter/i.test(l)) link='https://x.com/'+vv;
        }
        if(link){
          row.style.cursor='pointer';
          row.setAttribute('role','link');
          row.setAttribute('tabindex','0');
          var o=function(e){
            if(e.target.closest('a')) return;
            e.preventDefault();
            if(link.indexOf('mailto:')===0){window.location.href=link;}
            else{window.open(link,'_blank','noopener');}
          };
          row.addEventListener('click',o);
          row.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ') o(e);});
        }
      });
    }
    new MutationObserver(linkifyContacts).observe(document.body,{childList:true,subtree:true});
    setTimeout(linkifyContacts,800);
    setTimeout(linkifyContacts,1800);

    /* ═══════════════════════════════════════════════════════════════
       HEADER ACTIONS
       ═══════════════════════════════════════════════════════════════ */
    function injectMainTopActions(){
      if(_injectingHeaderActions) return;
      _injectingHeaderActions=true;
      try{
        var p=getProfile();
        var src=p.avatar||USER_AVATAR_URL;
        var name=p.name?p.name:'مشخصات من';

        document.querySelectorAll('#sirajHeaderActions, .header-left-actions').forEach(function(el){el.remove();});
        document.querySelectorAll('#headerLockBtn').forEach(function(el){el.style.display='none';});

        document.querySelectorAll('.chat-header, .planner-hero, .page-title-bar').forEach(function(h){
          var w=document.createElement('div');
          w.id='sirajHeaderActions';
          w.className='header-left-actions';

          w.innerHTML =
            '<div class="main-top-avatar" title="'+esc(name)+'"><img src="'+src+'" alt="" draggable="false"></div>'
            +'<button type="button" class="main-top-icon-btn notif-bell" id="notifBtn" title="اعلان‌ها">'
            +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            +'<path d="M18 8.5a6 6 0 1 0-12 0c0 4.5-2 6-2 6h16s-2-1.5-2-6z"/>'
            +'<path d="M10.5 17a1.5 1.5 0 0 0 3 0"/>'
            +'</svg></button>'
            +'<button type="button" class="main-top-icon-btn" id="lockHeaderBtn" title="قفل کردن سایت">'
            +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
            +'<rect x="5" y="10" width="14" height="10" rx="2.5"/>'
            +'<path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
            +'<circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/>'
            +'</svg></button>';

          h.appendChild(w);

          w.querySelector('.main-top-avatar').onclick=function(){
            if(typeof window.openSettings==='function') window.openSettings();
            setTimeout(function(){
              var b=document.querySelector('.settings-tab-btn[data-cat="profile"]');
              if(b) b.click();
            }, 350);
          };
          w.querySelector('#notifBtn').onclick=function(e){
            e.stopPropagation();
            if(typeof window.__toggleNotifPanel==='function') window.__toggleNotifPanel();
          };
          w.querySelector('#lockHeaderBtn').onclick=function(){
            if(typeof window.lockNow==='function') window.lockNow();
          };
          setTimeout(updateNotifBadge, 100);
        });
      }finally{_injectingHeaderActions=false;}
    }
    setTimeout(injectMainTopActions,500);
    setTimeout(injectMainTopActions,1500);
    setTimeout(injectMainTopActions,3000);
    setInterval(function(){
      var needFix=false;
      document.querySelectorAll('.chat-header, .planner-hero, .page-title-bar').forEach(function(h){
        var wraps=h.querySelectorAll('#sirajHeaderActions, .header-left-actions');
        var avs=h.querySelectorAll('.main-top-avatar');
        var lks=h.querySelectorAll('#lockHeaderBtn');
        var ntf=h.querySelectorAll('#notifBtn');
        if(wraps.length!==1||avs.length!==1||lks.length!==1||ntf.length!==1) needFix=true;
      });
      var stray=document.querySelectorAll('body > .main-top-avatar, body > .main-top-icon-btn, body > .header-left-actions');
      if(stray.length) needFix=true;
      if(needFix) injectMainTopActions();
    },2000);

    function updateMainTopAvatar(){
      var p=getProfile();
      var s=p.avatar||USER_AVATAR_URL;
      document.querySelectorAll('.main-top-avatar').forEach(function(a){
        a.title=p.name?p.name:'مشخصات من';
        a.innerHTML='<img src="'+s+'" alt="" draggable="false">';
      });
    }

    if(typeof window.openSettings==='function'){
      var origOS=window.openSettings;
      window.openSettings=function(){
        try{origOS.apply(this,arguments);}catch(e){}
        setTimeout(injectProfileTab,250);
      };
    }
    function injectProfileTab(){
      var tw=document.getElementById('settingsTabs');if(!tw) return;
      if(tw.querySelector('[data-cat="profile"]')) return;
      var btn=document.createElement('button');
      btn.className='settings-tab-btn';
      btn.setAttribute('data-cat','profile');
      btn.setAttribute('onclick',"switchSettingsCat('profile')");
      btn.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>مشخصات من';
      var aboutBtn=tw.querySelector('[data-cat="about"]');
      tw.insertBefore(btn,aboutBtn||null);

      var cw=document.getElementById('settingsContentWrap');
      if(cw&&!cw.querySelector('[data-cat="profile"]')){
        var p=document.createElement('div');
        p.className='settings-content';
        p.setAttribute('data-cat','profile');
        cw.appendChild(p);
      }
      renderProfilePane();
    }
    function renderProfilePane(){
      var pane=document.querySelector('.settings-content[data-cat="profile"]');if(!pane) return;
      var p=getProfile();
      var src=p.avatar||USER_AVATAR_URL;
      var lvl=getUserLevel();
      var dv=getDefaultView();
      var lo=['beginner','intermediate','advanced'];
      var lh=lo.map(function(k){return '<button class="level-opt'+(k===lvl?' active':'')+'" data-level="'+k+'">'+LEVEL_LABELS[k]+'</button>';}).join('');
      var vo=['chat','planner','blog','videos','tools'];
      var vh=vo.map(function(k){return '<button class="default-view-opt'+(k===dv?' active':'')+'" data-view="'+k+'">'+VIEW_LABELS[k]+'</button>';}).join('');
      pane.innerHTML=
        '<div class="setting-group profile-section">'
        +'<label style="font-size:13px;font-weight:800;color:var(--accent)">👤 مشخصات شخصی</label>'
        +'<div class="about-avatar" style="margin:14px auto"><img src="'+src+'" alt=""></div>'
        +'<div class="profile-access-note">ℹ️ دستیار هوشمند سراج به این اطلاعات و سطح انتخابی دسترسی داره.</div>'
        +'<input type="text" id="profileName" placeholder="اسمت چیه؟" value="'+(p.name?esc(p.name):'')+'" style="width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;margin-bottom:8px;margin-top:8px">'
        +'<textarea id="profileBio" placeholder="یه توضیح کوتاه..." style="width:100%;min-height:90px;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;resize:vertical;line-height:1.8;margin-bottom:8px">'+(p.bio?esc(p.bio):'')+'</textarea>'
        +'<button class="btn-primary" id="profileSaveBtn" style="width:100%;justify-content:center;margin-top:6px">💾 ذخیره</button>'
        +'</div>'
        +'<div class="level-selector"><div class="level-selector-title">🎯 سطح زبان عربیت</div>'
        +'<div class="level-options">'+lh+'</div>'
        +'<button class="level-determine-btn" id="determineLevelBtn">سطحمو نمی‌دونم، با هوش مصنوعی تعیین کن</button></div>'
        +'<div class="default-view-selector"><div class="default-view-title">📌 تب دیفالت هنگام ورود</div>'
        +'<div class="default-view-options">'+vh+'</div></div>';
      pane.querySelectorAll('.level-opt').forEach(function(b){
        b.onclick=function(){
          var l=b.getAttribute('data-level');
          setUserLevel(l);
          pane.querySelectorAll('.level-opt').forEach(function(x){x.classList.remove('active');});
          b.classList.add('active');
          if(window.toast) window.toast('سطح '+LEVEL_LABELS[l]+' انتخاب شد ✓','success');
        };
      });
      pane.querySelectorAll('.default-view-opt').forEach(function(b){
        b.onclick=function(){
          var v=b.getAttribute('data-view');
          setDefaultView(v);
          pane.querySelectorAll('.default-view-opt').forEach(function(x){x.classList.remove('active');});
          b.classList.add('active');
          if(window.toast) window.toast('تب دیفالت: '+VIEW_LABELS[v],'success');
        };
      });
      var d=pane.querySelector('#determineLevelBtn');
      if(d){
        d.onclick=function(){
          var m=document.getElementById('settingsModal');
          if(m) m.classList.remove('open');
          if(typeof window.switchView==='function') window.switchView('chat');
          setTimeout(function(){
            var q=document.getElementById('q');
            if(q){q.value='میخوام سطح عربیم رو تعیین کنی. چند سوال از آسون به سخت ازم بپرس و آخرش سطحم رو مشخص کن.';if(typeof window.handleInput==='function') window.handleInput();q.focus();}
          },500);
        };
      }
      var s=pane.querySelector('#profileSaveBtn');
      if(s){
        s.onclick=function(){
          var p2=getProfile();
          p2.name=(pane.querySelector('#profileName')||{}).value||'';
          p2.bio=(pane.querySelector('#profileBio')||{}).value||'';
          saveProfile(p2);
          if(window.toast) window.toast('ذخیره شد ✓','success');
          if(typeof window.renderPanelForPlanner==='function') window.renderPanelForPlanner();
          updateMainTopAvatar();
        };
      }
    }

        /* ═══════════════════════════════════════════════════════════════
       NAV SLIDER
       ═══════════════════════════════════════════════════════════════ */
        (function(){
      var nav=null, slider=null, fill=null;
      var cur=null;
      var lastBtn=null;
      var fromBtn=null, rel=null;
      var t0=0, animating=false;
      var raf=0, settleUntil=0;
      var DUR=480;

      function imp(el,prop,val){ el.style.setProperty(prop,val,'important'); }
      /* منحنی نرم: شروع ملایم، بدون جهش، فرود آرام (cubic-bezier .3,.5,.2,1) */
      var ease=(function(x1,y1,x2,y2){
        function A(a,b){return 1-3*b+3*a} function B(a,b){return 3*b-6*a} function C(a){return 3*a}
        function calc(t,a,b){return ((A(a,b)*t+B(a,b))*t+C(a))*t}
        function slope(t,a,b){return 3*A(a,b)*t*t+2*B(a,b)*t+C(a)}
        return function(x){
          if(x<=0) return 0; if(x>=1) return 1;
          var t=x;
          for(var i=0;i<8;i++){ var s=slope(t,x1,x2); if(Math.abs(s)<1e-6) break; t-=(calc(t,x1,x2)-x)/s; }
          return calc(t,y1,y2);
        };
      })(.3,.5,.2,1);
      function copy(o){ return {l:o.l,r:o.r,t:o.t,b:o.b}; }

      function box(btn){
        var l=btn.offsetLeft, t=btn.offsetTop;
        return {l:l, r:l+btn.offsetWidth, t:t, b:t+btn.offsetHeight};
      }
      function padY(){
        var pos=document.documentElement.getAttribute('data-nav-position')||'bottom';
        return (pos==='left'||pos==='right')?2:4;
      }
      function target(btn){
        var bx=box(btn), py=padY();
        return { l:bx.l, r:bx.r, t:bx.t-py, b:bx.b+py, chat:btn.classList.contains('nav-btn-chat') };
      }
      /* اگه لحظه‌ای دو دکمه active بودن، جدیدترین رو بردار (جلوگیری از لرزش) */
      function activeBtn(){
        var list=nav.querySelectorAll('.bottom-nav-btn.active');
        if(!list.length) return null;
        if(list.length===1) return list[0];
        for(var i=0;i<list.length;i++){ if(list[i]!==lastBtn) return list[i]; }
        return list[0];
      }

      function frame(now){
        raf=0;
        if(!nav||!slider) return;
        var btn=activeBtn();
        if(!btn){ imp(slider,'opacity','0'); return; }
        var tg=target(btn);

        if(!cur){
          cur=copy(tg); lastBtn=btn;
        }else{
          if(btn!==lastBtn){
            var ob=box(lastBtn);
            rel={ l:cur.l-ob.l, r:cur.r-ob.r, t:cur.t-ob.t, b:cur.b-ob.b };
            fromBtn=lastBtn; lastBtn=btn; t0=now; animating=true;
          }
          if(animating){
            var p=Math.min(1,(now-t0)/DUR), e=ease(p);
            var fb=box(fromBtn);
            var fl=fb.l+rel.l, fr=fb.r+rel.r, ft=fb.t+rel.t, fbt=fb.b+rel.b;
            cur.l=fl+(tg.l-fl)*e;
            cur.r=fr+(tg.r-fr)*e;
            cur.t=ft+(tg.t-ft)*e;
            cur.b=fbt+(tg.b-fbt)*e;
            if(p>=1) animating=false;
          }else{
            cur=copy(tg);
          }
        }

        slider.style.width=Math.max(0,cur.r-cur.l)+'px';
        slider.style.height=Math.max(0,cur.b-cur.t)+'px';
        imp(slider,'transform','translate3d('+cur.l+'px,'+cur.t+'px,0)');
        /* روی دکمه‌ی هوش مصنوعی: اول کامل می‌رسه، بعد محو می‌شه */
        imp(slider,'opacity',(tg.chat&&!animating)?'0':'1');

        if(animating||now<settleUntil){ raf=requestAnimationFrame(frame); }
      }

      function kick(snap){
        if(snap){ cur=null; animating=false; lastBtn=null; fromBtn=null; rel=null; }
        settleUntil=performance.now()+900;
        if(!raf) raf=requestAnimationFrame(frame);
      }
      window.__moveNavSlider=function(){ kick(false); };

      function initNavSlider(){
        nav=document.getElementById('bottomNav'); if(!nav) return false;
        var old=document.getElementById('navSlider'); if(old) old.remove();
        slider=document.createElement('div');
        slider.id='navSlider';
        slider.className='nav-slider';
        fill=document.createElement('div');
        fill.className='nav-slider-fill';
        slider.appendChild(fill);
        imp(slider,'transition','opacity .25s ease');
        imp(slider,'opacity','0');
        nav.insertBefore(slider,nav.firstChild);

        nav.addEventListener('click',function(e){
          var btn=e.target.closest('.bottom-nav-btn[data-view]');
          if(!btn) return;
          nav.querySelectorAll('.bottom-nav-btn').forEach(function(b){b.classList.remove('active');});
          btn.classList.add('active');
          kick(false);
        },true);

        new MutationObserver(function(){kick(false);}).observe(nav,{attributes:true,attributeFilter:['class'],subtree:true});
        var row=document.getElementById('navRow');
        if(row) new MutationObserver(function(){kick(false);}).observe(row,{attributes:true,attributeFilter:['class']});
        new MutationObserver(function(){kick(true);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-nav-position','data-nav-style']});
        window.addEventListener('resize',function(){kick(true);});
        if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){kick(true);});
        setTimeout(function(){kick(true);},150);
        return true;
      }

      if(!initNavSlider()){
        var t=setInterval(function(){ if(initNavSlider()) clearInterval(t); },200);
        setTimeout(function(){ clearInterval(t); },8000);
      }
    })();

    /* ★ انیمیشن سوییچ view */
    (function(){
      function hook(){
        if(typeof window.switchView!=='function') return false;
        if(window.switchView.__hooked) return true;
        var orig=window.switchView;
        window.switchView=function(view){
          var currentActive=document.querySelector('.view.active');
          var currentName=currentActive?currentActive.id.replace('view-',''):'';
          if(currentName===view){
            if(typeof window.__moveNavSlider==='function') window.__moveNavSlider();
            return;
          }
          var oldName=_currentMainView;
          if(oldName===view){_currentMainView=view;return;}
          var oldEl=document.getElementById('view-'+oldName);
          var newEl=document.getElementById('view-'+view);
          var oldIdx=VIEW_ORDER.indexOf(oldName);
          var newIdx=VIEW_ORDER.indexOf(view);
          if(!oldEl||!newEl||oldIdx===-1||newIdx===-1){
            orig.apply(this,arguments);
            _currentMainView=view;
            if(typeof window.__moveNavSlider==='function') setTimeout(window.__moveNavSlider,60);
            return;
          }
          if(window.switchView.__t1) clearTimeout(window.switchView.__t1);
          if(window.switchView.__t2) clearTimeout(window.switchView.__t2);
          document.querySelectorAll('.view').forEach(function(v){
            v.classList.remove('leaving','view-out-left','view-out-right','view-in-from-left','view-in-from-right');
            v.style.pointerEvents='';
          });
          var goingLeft=newIdx>oldIdx;
          var outClass=goingLeft?'view-out-right':'view-out-left';
          var inClass=goingLeft?'view-in-from-left':'view-in-from-right';
          var origArgs=arguments;
          oldEl.classList.add('leaving',outClass);
          oldEl.style.pointerEvents='none';
          window.switchView.__t1=setTimeout(function(){
            orig.apply(window,origArgs);
            _currentMainView=view;
            newEl.classList.add(inClass);
            setTimeout(injectMainTopActions,10);
            if(typeof window.__moveNavSlider==='function') setTimeout(window.__moveNavSlider,60);
            window.switchView.__t2=setTimeout(function(){
              oldEl.classList.remove('leaving',outClass);
              oldEl.style.pointerEvents='';
              newEl.classList.remove(inClass);
            },240);
          },170);
        };
        window.switchView.__hooked=true;
        return true;
      }
      if(!hook()){
        var t=setInterval(function(){if(hook()) clearInterval(t);},300);
        setTimeout(function(){clearInterval(t);},8000);
      }
      setTimeout(function(){
        var a=document.querySelector('.view.active');
        if(a){var n=a.id.replace('view-','');if(VIEW_ORDER.indexOf(n)!==-1) _currentMainView=n;}
      },1000);
    })();

    function applyPinRotation(){
      var row=document.getElementById('navRow');
      var svg=document.querySelector('.nav-collapse-tab svg');
      if(!row||!svg) return;
      var pos=document.documentElement.getAttribute('data-nav-position')||'bottom';
      var isPinned=row.classList.contains('pinned');
      var isCollapsed=row.classList.contains('collapsed');
      var deg=0;
      if(pos==='bottom'){deg = isPinned ? 0 : (isCollapsed ? 180 : 0);}
      else if(pos==='top'){deg = isPinned ? 180 : (isCollapsed ? 0 : 180);}
      else if(pos==='right'){deg = isPinned ? -90 : (isCollapsed ? 0 : -90);}
      else if(pos==='left'){deg = isPinned ? 90 : (isCollapsed ? 0 : 90);}
      svg.style.transition='transform .55s cubic-bezier(.34,1.4,.64,1)';
      svg.style.transform='rotate('+deg+'deg)';
      svg.style.setProperty('transform','rotate('+deg+'deg)','important');
    }

    if(typeof window.toggleNavCollapse==='function'){
      var origToggle=window.toggleNavCollapse;
      window.toggleNavCollapse=function(){
        try{origToggle.apply(this,arguments);}catch(e){}
        setTimeout(applyPinRotation,50);
        setTimeout(function(){
          if(typeof window.__moveNavSlider==='function') window.__moveNavSlider();
        },520);
      };
    }

    setInterval(function(){
      var row=document.getElementById('navRow');
      var svg=document.querySelector('.nav-collapse-tab svg');
      if(!row||!svg) return;
      var pos=document.documentElement.getAttribute('data-nav-position')||'bottom';
      var isPinned=row.classList.contains('pinned');
      var isCollapsed=row.classList.contains('collapsed');
      var deg=0;
      if(pos==='bottom'){deg = isPinned ? 0 : (isCollapsed ? 180 : 0);}
      else if(pos==='top'){deg = isPinned ? 180 : (isCollapsed ? 0 : 180);}
      else if(pos==='right'){deg = isPinned ? -90 : (isCollapsed ? 0 : -90);}
      else if(pos==='left'){deg = isPinned ? 90 : (isCollapsed ? 0 : 90);}
      var target='rotate('+deg+'deg)';
      var current=svg.style.transform||'';
      if(current!==target){
        svg.style.transition='transform .45s cubic-bezier(.34,1.4,.64,1)';
        svg.style.transform=target;
      }
    },800);

        function updateNavHiddenState(){
      var row=document.getElementById('navRow');
      if(!row) return;
      var collapsed=row.classList.contains('collapsed');
      var nav=document.getElementById('bottomNav');
      if(!nav) return;
      if(collapsed) nav.classList.add('nav-collapsed');
      else nav.classList.remove('nav-collapsed');
    }
    var _navObserver = new MutationObserver(function(){updateNavHiddenState();});
    setTimeout(function(){
      var row=document.getElementById('navRow');
      if(row) _navObserver.observe(row, { attributes:true, attributeFilter:['class'] });
      updateNavHiddenState();
    }, 800);

    setTimeout(function(){
      try{
        var dv=getDefaultView();
        if(dv&&dv!=='chat'&&typeof window.switchView==='function') window.switchView(dv);
      }catch(e){}
    },50);

    setTimeout(injectMainTopActions, 100);
    setTimeout(injectMainTopActions, 800);
    setTimeout(injectMainTopActions, 2000);

    setTimeout(function () {
      try {
        var vp = document.getElementById('view-planner');
        if (vp) {
          if (typeof window.renderPlanner === 'function') window.renderPlanner();
        }
      } catch (e) { console.warn('[Planner re-render]', e); }
    }, 100);

    console.log('[Siraj v2.5] planner loaded ✓');
  }
})();
