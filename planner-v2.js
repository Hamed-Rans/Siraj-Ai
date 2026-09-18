/* Siraj v2.0 — planner-v2.js (v28 Final) */
(function(){
  'use strict';
  var boot=setInterval(function(){
    if(typeof window.renderPlanner==='function'&&typeof window.loadPlannerNew==='function'){
      clearInterval(boot);
      try{init();}catch(e){console.error('[Planner]',e);}
    }
  },100);

  function init(){
    var PROFILE_KEY='siraj-profile';
    var REMINDER_KEY='siraj-reminders';
    var STUDY_CHAT_KEY='siraj-study-chat-session';
    var LEVEL_KEY='siraj-user-level';
    var DEFAULT_VIEW_KEY='siraj-default-view';
    var USER_AVATAR_URL='siraj-logo.png';
    var VIEW_ORDER=['planner','blog','chat','tools','videos'];
    var _currentMainView='chat';
    var _currentWord=null;
    var _lastTab='daily';
    var SOUND_FILES={nature:'sounds/ocean.mp3',forest:'sounds/forest.mp3',hall:'sounds/hall.mp3',rain:'sounds/rain.mp3'};

    var WORDS_BY_LEVEL={
      beginner:[
        {type:'واژه',text:'«کِتاب» یعنی کتاب. ریشه: ک-ت-ب. جمع: کُتُب.'},
        {type:'واژه',text:'«قَلَم» یعنی قلم. ریشه: ق-ل-م. جمع: أقلام.'},
        {type:'واژه',text:'«باب» یعنی در. ریشه: ب-و-ب. جمع: أبواب.'},
        {type:'واژه',text:'«ماء» یعنی آب. جمع: میاه.'},
        {type:'واژه',text:'«یَوم» یعنی روز. جمع: أیام.'},
        {type:'واژه',text:'«شَمس» یعنی خورشید. جمع: شُموس.'},
        {type:'واژه',text:'«قَمَر» یعنی ماه. ریشه: ق-م-ر. جمع: أقمار.'},
        {type:'نکته',text:'«مُبْتَدَأ» و «خبر» هر دو مرفوع هستن.'},
        {type:'واژه',text:'«بَیت» یعنی خانه. جمع: بیوت.'},
        {type:'واژه',text:'«طالِب» یعنی دانش‌آموز. جمع: طُلّاب.'},
        {type:'واژه',text:'«مَدْرَسَة» یعنی مدرسه. جمع: مدارس.'},
        {type:'نکته',text:'فعل ماضی برای گذشته و مضارع برای حال.'}
      ],
      intermediate:[
        {type:'بیت',text:'وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ۞ وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا',by:'أحمد شوقي'},
        {type:'بیت',text:'وَمَنْ يَتَصَبَّرْ يَجِدْ خَيْراً بِصَبْرِهِ ۞ وَمَنْ يَتَعَجَّلْ يَجْنِ غَيْرَ مَا يَشْتَهي',by:'متنبی'},
        {type:'نکته',text:'«إنَّ» و «أنَّ» اسم رو منصوب و خبر رو مرفوع می‌کنن.'},
        {type:'نکته',text:'فعل مضارع با «سـ» یعنی آینده‌ی نزدیک، با «سوف» آینده‌ی دور.'},
        {type:'بیت',text:'تَعَلَّمْ فَلَيْسَ الْمَرْءُ يُولَدُ عَالِم',by:'متنبی'},
        {type:'نکته',text:'«كان» و اخواتش اسم رو مرفوع و خبر رو منصوب می‌کنن.'},
        {type:'واژه',text:'«صَبْر» یعنی شکیبایی. ریشه: ص-ب-ر.'},
        {type:'نکته',text:'اسم فاعل بر وزن «فاعل» و اسم مفعول بر وزن «مفعول».'},
        {type:'واژه',text:'«عِلْم» یعنی دانش. ریشه: ع-ل-م.'},
        {type:'واژه',text:'«أَدَب» یعنی ادب. ریشه: أ-د-ب.'},
        {type:'نکته',text:'«مِن، إلى، عَن، عَلى، في» از حروف جر هستن.'}
      ],
      advanced:[
        {type:'بیت',text:'وَمَا الْحُرُّ مَنْ يَحْيَا بِغَيْرِ حُرِّيَّةٍ',by:'أبو القاسم الشابي'},
        {type:'بیت',text:'إِذَا الشَّعْبُ أَرَادَ الْحَيَاةَ فَلَا بُدَّ أَنْ يَسْتَجِيبَ الْقَدَرُ',by:'أبو القاسم الشابي'},
        {type:'بیت',text:'دَعِ الْأَيَّامَ تَفْعَلُ مَا تَشَاءُ',by:'الإمام الشافعي'},
        {type:'نکته',text:'تمییز، حال، و مفعول‌به همه از منصوبات هستن.'},
        {type:'نکته',text:'لای نفی جنس: اسمش منصوب و خبرش مرفوع.'},
        {type:'نکته',text:'اسلوب شرط: «إن» شرطیه دو فعل مضارع رو مجزوم می‌کنه.'},
        {type:'نکته',text:'«مفعول مطلق» مصدر منصوبیه که برای تأکید فعل میاد.'},
        {type:'نکته',text:'اسم تفضیل بر وزن «أفعَل» و اسم مبالغه بر وزن «فَعّال».'},
        {type:'بیت',text:'وَمَا أَنَا بِالَّذِي يَرْضَى بِذُلٍّ',by:'عنتره'}
      ]
    };
    var LEVEL_LABELS={beginner:'مبتدی',intermediate:'متوسط',advanced:'پیشرفته'};
    var VIEW_LABELS={chat:'گفتگو',planner:'برنامه‌ریز',blog:'مقالات',videos:'انجمن',tools:'دستیار'};

    function toFa(n){var fa=['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];return String(n).replace(/\d/g,function(d){return fa[+d];});}
    function formatMinutes(mins){mins=Math.max(0,Math.round(mins));if(mins<60)return toFa(mins)+' دقیقه';var h=Math.floor(mins/60),m=mins%60;if(m===0)return toFa(h)+' ساعت';return toFa(h)+' ساعت و '+toFa(m)+' دقیقه';}
    function formatTimer(mins){mins=Math.max(0,Math.round(mins));var h=Math.floor(mins/60),m=mins%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');}
    function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function getUserLevel(){try{return localStorage.getItem(LEVEL_KEY)||'beginner';}catch(e){return 'beginner';}}
    function setUserLevel(l){try{localStorage.setItem(LEVEL_KEY,l);}catch(e){}}
    function getDefaultView(){try{return localStorage.getItem(DEFAULT_VIEW_KEY)||'chat';}catch(e){return 'chat';}}
    function setDefaultView(v){try{localStorage.setItem(DEFAULT_VIEW_KEY,v);}catch(e){}}
    function pickNewWord(){var pool=WORDS_BY_LEVEL[getUserLevel()]||WORDS_BY_LEVEL.beginner;_currentWord=pool[Math.floor(Math.random()*pool.length)];}
    function getBaseURL(){try{if(typeof APP_CONFIG!=='undefined'&&APP_CONFIG&&APP_CONFIG.baseURL)return APP_CONFIG.baseURL;}catch(e){}try{if(window.APP_CONFIG&&window.APP_CONFIG.baseURL)return window.APP_CONFIG.baseURL;}catch(e){}return '/api/chat';}
    function getModel(){try{if(typeof settings!=='undefined'&&settings&&settings.model)return settings.model;}catch(e){}try{if(window.settings&&window.settings.model)return window.settings.model;}catch(e){}return 'gemini-2.5-flash';}
    function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');}catch(e){return {};}}
    function saveProfile(p){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));}catch(e){}}
    function profilePrompt(){var p=getProfile();if(!p.name&&!p.bio)return '';var out='\n\n👤 اطلاعات کاربر:\n';if(p.name)out+='• اسمش: '+p.name+'\n';if(p.bio)out+='• درباره‌ی خودش: '+p.bio+'\n';out+='• سطح عربیش: '+LEVEL_LABELS[getUserLevel()]+'\n';return out;}
    function loadReminders(){try{return JSON.parse(localStorage.getItem(REMINDER_KEY)||'{}');}catch(e){return {};}}
    function saveReminders(r){try{localStorage.setItem(REMINDER_KEY,JSON.stringify(r));}catch(e){}}
    function getDayReminders(k){return loadReminders()[k]||[];}
    function setDayReminders(k,list){var r=loadReminders();if(list.length)r[k]=list;else delete r[k];saveReminders(r);}

    var IRAN_EVENTS={'01-01':'نوروز','01-02':'عید نوروز','01-03':'عید نوروز','01-04':'عید نوروز','01-06':'روز امید','01-12':'روز جمهوری اسلامی','01-13':'سیزده‌بدر','01-19':'شهادت حضرت علی (ع)','01-21':'شهادت امام علی (ع)','01-22':'شب قدر','01-23':'شب قدر','01-25':'روز بزرگداشت عطار','02-01':'عید فطر','02-02':'تعطیل عید فطر','02-10':'روز ملی خلیج فارس','02-12':'روز معلم','02-25':'روز بزرگداشت فردوسی','03-01':'روز بهره‌وری','03-06':'سالگرد آزادسازی خرمشهر','03-14':'رحلت امام خمینی','03-15':'قیام ۱۵ خرداد','04-01':'روز اصناف','04-07':'روز قوه قضائیه','04-10':'روز صنعت و معدن','04-14':'روز قلم','04-25':'روز بهزیستی','05-05':'روز کارمند','05-08':'روز بزرگداشت سهروردی','05-14':'روز بزرگداشت خیام','06-05':'روز بزرگداشت رازی','06-27':'روز شعر و ادب فارسی','06-31':'آغاز هفته دفاع مقدس','07-13':'روز نیروی انتظامی','07-20':'روز بزرگداشت حافظ','08-08':'روز نوجوان','08-13':'روز دانش‌آموز','08-24':'روز کتاب و کتابخوانی','09-16':'روز دانشجو','10-05':'روز خانواده','10-19':'روز بزرگداشت مولوی','11-12':'پیروزی انقلاب اسلامی','11-22':'روز بزرگداشت خواجه نصیر','12-05':'روز بزرگداشت خواجه نصیرالدین طوسی','12-20':'روز بزرگداشت نظامی گنجوی','12-29':'روز ملی شدن صنعت نفت'};
    function getIranianEvent(dayKey){try{var parts=dayKey.split('-');var gDate=new Date(parseInt(parts[0]),parseInt(parts[1])-1,parseInt(parts[2]));var faMonth=new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(gDate);var faDay=new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric'}).format(gDate);var key=String(faMonth).padStart(2,'0')+'-'+String(faDay).padStart(2,'0');return IRAN_EVENTS[key]||'';}catch(e){return '';}}

    function getTab(){var btn=document.querySelector('.panel-planner-tab.active');if(!btn)return 'daily';var m=(btn.getAttribute('onclick')||'').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);return m?m[1]:'daily';}
    function dateParts(d){try{return{weekday:d.toLocaleDateString('fa-IR',{weekday:'long'}),dayNum:d.toLocaleDateString('fa-IR',{day:'numeric'}),monthName:d.toLocaleDateString('fa-IR',{month:'long'}),yearNum:d.toLocaleDateString('fa-IR',{year:'numeric'})};}catch(e){return{weekday:'',dayNum:'',monthName:'',yearNum:''};}}
    function weekOfMonth(){var d=window.plannerDate||new Date();return Math.ceil(parseInt(d.toLocaleDateString('en-US',{day:'numeric'}))/7);}
    var ORD=['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){n=Math.max(1,Math.min(6,n));return ORD[n-1];}
    function weekStart(d){var x=new Date(d);x.setHours(0,0,0,0);var diff=(x.getDay()+1)%7;x.setDate(x.getDate()-diff);return x;}
    function myWeekDays(){var d=weekStart(window.plannerDate||new Date());var days=[];for(var i=0;i<7;i++){var dt=new Date(d);dt.setDate(d.getDate()+i);days.push({key:window.dateKey(dt),name:window.getDayName(dt),date:dt.toLocaleDateString('fa-IR',{month:'short',day:'numeric'}),dateObj:dt});}return days;}

    function showPopup(emoji,title,text){var old=document.getElementById('sirajPopup');if(old)old.remove();var el=document.createElement('div');el.id='sirajPopup';el.className='siraj-popup-overlay';el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><button class="siraj-popup-btn" id="sirajPopupOk">متوجه شدم</button></div>';document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('open');});el.querySelector('#sirajPopupOk').onclick=function(){el.classList.remove('open');setTimeout(function(){el.remove();},320);};}
    function showConfirm(emoji,title,text,onYes,yesText,noText){var old=document.getElementById('sirajConfirmPopup');if(old)old.remove();var el=document.createElement('div');el.id='sirajConfirmPopup';el.className='siraj-popup-overlay';el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions"><button class="siraj-popup-btn secondary" id="sirajConfirmNo">'+(noText||'نه')+'</button><button class="siraj-popup-btn" id="sirajConfirmYes">'+(yesText||'بله')+'</button></div></div>';document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('open');});var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},320);};el.querySelector('#sirajConfirmYes').onclick=function(){close();if(onYes)onYes();};el.querySelector('#sirajConfirmNo').onclick=close;}
    function showTriple(emoji,title,text,opt1,opt2,opt3){var old=document.getElementById('sirajTriplePopup');if(old)old.remove();var el=document.createElement('div');el.id='sirajTriplePopup';el.className='siraj-popup-overlay';el.innerHTML='<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions-3"><button class="siraj-popup-btn secondary" id="sirajTriple1">'+opt1.text+'</button><button class="siraj-popup-btn secondary" id="sirajTriple2">'+opt2.text+'</button><button class="siraj-popup-btn" id="sirajTriple3">'+opt3.text+'</button></div></div>';document.body.appendChild(el);requestAnimationFrame(function(){el.classList.add('open');});var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},320);};el.querySelector('#sirajTriple1').onclick=function(){close();if(opt1.onClick)opt1.onClick();};el.querySelector('#sirajTriple2').onclick=function(){close();if(opt2.onClick)opt2.onClick();};el.querySelector('#sirajTriple3').onclick=function(){close();if(opt3.onClick)opt3.onClick();};}

    function makeSelect(id,value,options,label){var cur=options.find(function(o){return o.value===value;})||options[0];var items=options.map(function(o){return '<div class="siraj-select-item '+(o.value===value?'active':'')+'" data-value="'+o.value+'">'+(o.dot?'<span class="dot '+o.dot+'"></span>':'')+'<span>'+esc(o.label)+'</span></div>';}).join('');return '<div class="siraj-select" id="'+id+'">'+(label?'<div class="siraj-select-label">'+esc(label)+'</div>':'')+'<div class="siraj-select-trigger"><span class="siraj-select-value">'+(cur.dot?'<span class="dot '+cur.dot+'"></span>':'')+esc(cur.label)+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel">'+items+'</div></div>';}
    function bindSelects(root,handlers){if(!root)return;root.querySelectorAll('.siraj-select').forEach(function(sel){var trig=sel.querySelector('.siraj-select-trigger');if(!trig)return;trig.onclick=function(e){e.stopPropagation();var was=sel.classList.contains('open');document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});if(!was)sel.classList.add('open');};sel.querySelectorAll('.siraj-select-item').forEach(function(item){item.onclick=function(e){e.stopPropagation();var val=item.getAttribute('data-value');sel.classList.remove('open');if(handlers&&handlers[sel.id])handlers[sel.id](val,item);};});});}
    document.addEventListener('click',function(){document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});});

    function smartUpdateHero(tab,direction){
      var c=document.querySelector('.phc-center');if(!c)return;
      var d=new Date(window.plannerDate||new Date());
      var map={};
      if(tab==='daily'){var p=dateParts(d);map.weekday=p.weekday;map.dayNum=p.dayNum;map.monthName=p.monthName;map.yearNum=p.yearNum;}
      else if(tab==='weekly'){var days=myWeekDays();var p2=dateParts(d);map.monthName2=p2.monthName;map.yearNum2=p2.yearNum;map.weekOrdinal='هفته '+weekOrd(weekOfMonth())+' ماه';map.weekRange='از '+days[0].date+' تا '+days[6].date;}
      else if(tab==='monthly'){var p3=dateParts(d);map.monthName3=p3.monthName;map.yearNum3=p3.yearNum;}
      else if(tab==='yearly'){map.yearNum4=d.toLocaleDateString('fa-IR',{year:'numeric'});}
      var isNext=direction!=='right';
      c.querySelectorAll('[data-anim-key]').forEach(function(el){
        var k=el.getAttribute('data-anim-key');
        if(map[k]===undefined)return;
        var nv=map[k];
        if(el.textContent.trim()===nv)return;
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
      var todayBadge=c.querySelector('.phc-today');
      if(todayBadge){todayBadge.style.display=window.dateKey(d)===window.dateKey(new Date())?'':'none';}
      var shouldShow=false,btnLabel='',btnAction='';
      if(tab==='daily'){shouldShow=window.dateKey(d)!==window.dateKey(new Date());btnLabel='↩ برگرد به امروز';btnAction='window.__goToday()';}
      else if(tab==='weekly'){shouldShow=window.dateKey(weekStart(d))!==window.dateKey(weekStart(new Date()));btnLabel='↩ برگرد به این هفته';btnAction='window.__goThisWeek()';}
      else if(tab==='monthly'){var now=new Date();shouldShow=!(d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth());btnLabel='↩ برگرد به این ماه';btnAction='window.__goThisMonth()';}
      else if(tab==='yearly'){shouldShow=d.getFullYear()!==new Date().getFullYear();btnLabel='↩ برگرد به امسال';btnAction='window.__goThisYear()';}
      var existing=c.querySelector('.phc-back-btn');
      if(shouldShow&&!existing){var nb=document.createElement('button');nb.className='phc-back-btn';nb.setAttribute('onclick',btnAction);nb.textContent=btnLabel;c.appendChild(nb);}
      else if(!shouldShow&&existing){existing.remove();}
    }

    function moveDate(dir,unit){
      var d=new Date(window.plannerDate||new Date());
      if(unit==='day')d.setDate(d.getDate()+dir);
      else if(unit==='week')d.setDate(d.getDate()+dir*7);
      else if(unit==='month'){d.setDate(1);d.setMonth(d.getMonth()+dir);}
      else if(unit==='year')d.setFullYear(d.getFullYear()+dir);
      window.plannerDate=d;
      refreshBody(dir>0?'left':'right');
    }
    window.__navDay=function(d){moveDate(d,'day');};
    window.__navWeek=function(d){moveDate(d,'week');};
    window.__navMonth=function(d){moveDate(d,'month');};
    window.__navYear=function(d){moveDate(d,'year');};
    window.__goToday=function(){window.plannerDate=new Date();refreshBody('left');};
    window.__goThisWeek=window.__goToday;
    window.__goThisMonth=window.__goToday;
    window.__goThisYear=window.__goToday;

    function refreshBody(direction){
      var pane=document.getElementById('plannerPane');if(!pane)return;
      if(pane.dataset.animating==='1')return;
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
            var inC=dir==='left'?'cal-in-from-left':'cal-in-from-right';
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
        if(tab==='daily')html=dailyContentHTML();
        else if(tab==='weekly')html=weeklyContentHTML();
        else if(tab==='yearly')html=yearlyContentHTML();
        body.innerHTML=html;
        bindPaneEvents(tab);
        if(tab==='weekly')setTimeout(setupWeekSummaryClicks,50);
        body.style.animation='none';
        void body.offsetWidth;
        body.style.animation='bodyFadeIn .3s ease';
        return;
      }
      pane.dataset.animating='1';
      pane.style.pointerEvents='none';
      var html='';
      if(tab==='daily')html=viewDaily();
      else if(tab==='weekly')html=viewWeekly();
      else if(tab==='monthly')html=viewMonthly();
      else if(tab==='yearly')html=viewYearly();
      pane.innerHTML=html;
      bindPaneEvents(tab);
      if(tab==='weekly')setTimeout(setupWeekSummaryClicks,50);
      setTimeout(function(){pane.style.pointerEvents='';delete pane.dataset.animating;},50);
    }
    window.__refreshCurrentTab=refreshBody;

    window.switchPlannerTab=function(tab){
      if(tab==='daily'&&_lastTab!=='daily')pickNewWord();
      _lastTab=tab;
      document.querySelectorAll('.panel-planner-tab').forEach(function(b){b.classList.remove('active');});
      var idx={daily:0,weekly:1,monthly:2,yearly:3}[tab];
      var btns=document.querySelectorAll('.panel-planner-tab');
      if(btns[idx])btns[idx].classList.add('active');
      var pane=document.getElementById('plannerPane');
      if(pane)pane.dataset.lastTab='';
      refreshBody('left');
      window.renderPanelForPlanner();
    };
    function renderPane(tab){
      var pane=document.getElementById('plannerPane');if(!pane)return;
      pane.innerHTML='';void pane.offsetWidth;
      if(tab==='daily')pane.innerHTML=viewDaily();
      else if(tab==='weekly')pane.innerHTML=viewWeekly();
      else if(tab==='monthly')pane.innerHTML=viewMonthly();
      else if(tab==='yearly')pane.innerHTML=viewYearly();
      bindPaneEvents(tab);
      if(tab==='weekly')setTimeout(setupWeekSummaryClicks,50);
      pane.dataset.lastTab=tab;
    }
    window.renderPlannerPane=function(){renderPane(getTab());};
    function bindPaneEvents(tab){
      var pane=document.getElementById('plannerPane');if(!pane)return;
      if(tab==='daily'){
        bindSelects(pane,{
          pNewTime:function(val,item){var el=pane.querySelector('#pNewTime .siraj-select-value');if(el)el.textContent=item.textContent.trim();window.__pendingTime=val;},
          pNewPri:function(val,item){var el=pane.querySelector('#pNewPri .siraj-select-value');if(el)el.innerHTML=item.innerHTML;window.__pendingPri=val;}
        });
      }
    }

    function heroDaily(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var key=window.dateKey(d);
      var isToday=key===window.dateKey(new Date());
      var monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if(!pl.months[monthKey])pl.months[monthKey]={goals:[]};
      var goals=pl.months[monthKey].goals||[];
      var goal=goals.length?(goals.find(function(g){return !g.done;})||goals[0]):null;
      var p=dateParts(d);
      return '<div class="planner-hero-card"><button class="phc-nav-btn" onclick="window.__navDay(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="phc-center"><div class="phc-day"><span data-anim-key="weekday">'+esc(p.weekday)+'</span> <span class="phc-today" style="'+(isToday?'':'display:none')+'">امروز</span></div><div class="phc-date"><span data-anim-key="dayNum">'+esc(p.dayNum)+'</span> <span data-anim-key="monthName">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum">'+esc(p.yearNum)+'</span></div>'+(goal?'<div class="phc-goal"><span>🎯</span><span>هدف ماه: '+esc(goal.text)+'</span></div>':'<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>')+(!isToday?'<button class="phc-back-btn" onclick="window.__goToday()">↩ برگرد به امروز</button>':'')+'</div><button class="phc-nav-btn" onclick="window.__navDay(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button></div>';
    }
    function heroWeekly(){
      var d=new Date(window.plannerDate||new Date());
      var days=myWeekDays();var p=dateParts(d);
      var isCurrentWeek=days[0].key===window.dateKey(weekStart(new Date()));
      return '<div class="planner-hero-card"><button class="phc-nav-btn" onclick="window.__navWeek(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="phc-center"><div class="phc-day"><span data-anim-key="monthName2">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum2">'+esc(p.yearNum)+'</span></div><div class="phc-date"><span data-anim-key="weekOrdinal">هفته '+weekOrd(weekOfMonth())+' ماه</span> — <span data-anim-key="weekRange">از '+esc(days[0].date)+' تا '+esc(days[6].date)+'</span></div>'+(!isCurrentWeek?'<button class="phc-back-btn" onclick="window.__goThisWeek()">↩ برگرد به این هفته</button>':'')+'</div><button class="phc-nav-btn" onclick="window.__navWeek(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button></div>';
    }
    function heroMonthly(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var p=dateParts(d);
      var monthKey=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if(!pl.months[monthKey])pl.months[monthKey]={goals:[]};
      var goals=pl.months[monthKey].goals||[];
      var doneGoals=goals.filter(function(g){return g.done;}).length;
      var now=new Date();
      var isCurrentMonth=(d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth());
      return '<div class="planner-hero-card"><button class="phc-nav-btn" onclick="window.__navMonth(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="phc-center"><div class="phc-day"><span data-anim-key="monthName3">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum3">'+esc(p.yearNum)+'</span></div><div class="phc-date">'+toFa(doneGoals)+' از '+toFa(goals.length)+' هدف این ماه انجام شده</div>'+(!isCurrentMonth?'<button class="phc-back-btn" onclick="window.__goThisMonth()">↩ برگرد به این ماه</button>':'')+'</div><button class="phc-nav-btn" onclick="window.__navMonth(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button></div>';
    }
    function heroYearly(){
      var d=new Date(window.plannerDate||new Date());
      var y=d.getFullYear();
      var pl=window.loadPlannerNew();
      if(!pl.years)pl.years={};
      if(!pl.years[y])pl.years[y]={goals:[]};
      var goals=pl.years[y].goals||[];
      var done=goals.filter(function(g){return g.done;}).length;
      var isCurrentYear=y===new Date().getFullYear();
      return '<div class="planner-hero-card"><button class="phc-nav-btn" onclick="window.__navYear(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button><div class="phc-center"><div class="phc-day"><span data-anim-key="yearNum4">'+esc(d.toLocaleDateString('fa-IR',{year:'numeric'}))+'</span></div><div class="phc-date">'+toFa(done)+' از '+toFa(goals.length)+' هدف سالانه انجام شده</div>'+(!isCurrentYear?'<button class="phc-back-btn" onclick="window.__goThisYear()">↩ برگرد به امسال</button>':'')+'</div><button class="phc-nav-btn" onclick="window.__navYear(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button></div>';
    }

    function weekStatsHTML(){
      var pl=window.loadPlannerNew();var days=myWeekDays();
      var sm=0,dw=0,dwo=0;
      days.forEach(function(day){var dd=window.getDayData(pl,day.key);(dd.tasks||[]).forEach(function(tk){if(tk.done){if(tk.studiedMinutes){sm+=tk.studiedMinutes;dw++;}else dwo++;}});});
      if(!sm&&!dw&&!dwo)return '';
      return '<div class="week-stats-bar"><div class="wsb-item"><span>⏱️</span><b>'+formatMinutes(sm)+'</b> مطالعه</div><div class="wsb-item"><span>✅</span>'+toFa(dw)+' با زمان</div>'+(dwo>0?'<div class="wsb-item warn"><span>⚪</span>'+toFa(dwo)+' بدون زمان</div>':'')+'</div>';
    }
    function getStreakDays(){var pl=window.loadPlannerNew();var d=new Date();d.setHours(0,0,0,0);var streak=0,isToday=true;for(var i=0;i<365;i++){var key=window.dateKey(d);var dd=window.getDayData(pl,key);var hasDone=(dd.tasks||[]).some(function(tk){return tk.done;});if(hasDone)streak++;else if(!isToday)break;isToday=false;d.setDate(d.getDate()-1);}return streak;}
    function streakHTML(){var s=getStreakDays();if(s<2)return '';var msg=s>=30?'فوق‌العاده‌ای! 🏆':s>=14?'عالی پیش می‌ری! ✨':s>=7?'ادامه بده! 💪':'خوب شروع کردی! 🌱';return '<div class="daily-streak"><span class="ds-fire">🔥</span><span class="ds-num">'+toFa(s)+'</span><span class="ds-text">روز پشت‌سرهم فعالی — '+msg+'</span></div>';}
    function dailyWordHTML(){if(!_currentWord)pickNewWord();var w=_currentWord;return '<div class="daily-article"><div class="da-head"><span class="da-badge">📖 '+esc(w.type)+' امروز</span></div><div class="da-text">'+esc(w.text)+'</div>'+(w.by?'<div class="da-by">— '+esc(w.by)+'</div>':'')+'</div>';}

    function showConfetti(){var old=document.getElementById('sirajConfetti');if(old)old.remove();var el=document.createElement('div');el.id='sirajConfetti';el.className='confetti-wrap';var colors=['#F59E0B','#10B981','#3B82F6','#EF4444','#A855F7','#EC4899','#FBBF24','#06B6D4'];var html='';for(var i=0;i<80;i++){var l=Math.random()*100,de=Math.random()*0.6,du=2.2+Math.random()*1.6;var c=colors[Math.floor(Math.random()*colors.length)];var sz=6+Math.random()*8;html+='<span class="confetti-piece" style="left:'+l+'%;background:'+c+';width:'+sz+'px;height:'+sz+'px;animation-delay:'+de+'s;animation-duration:'+du+'s"></span>';}el.innerHTML=html;document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove();},4200);}
    function maybeCelebrate(dayKey){dayKey=dayKey||window.dateKey(window.plannerDate||new Date());var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dayKey);var tasks=(dd.tasks||[]);if(tasks.length===0)return;if(tasks.every(function(t){return t.done;})){showConfetti();setTimeout(function(){showPopup('🎉','آفرین!','همه‌ی کارهای امروز رو انجام دادی! 🏆');},400);}}

    function dailyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var key=window.dateKey(d);
      var dd=window.getDayData(pl,key);
      var allTasks=(dd.tasks||[]);
      var active=allTasks.filter(function(tk){return !tk.done;});
      var done=allTasks.filter(function(tk){return tk.done;});
      var activeHTML=active.length===0?'<div class="tasks-empty"><span class="emoji">📝</span>کاری در جریان نداری<br>از کادر بالا کار جدید اضافه کن</div>':'<div class="tasks-list">'+active.map(function(tk){var idx=allTasks.indexOf(tk);var pm={high:'بالا',med:'متوسط',low:'پایین'};return '<div class="task-item pri-'+(tk.priority||'med')+'" onclick="window.__taskClick(event, \''+key+'\', '+idx+')"><button class="task-check" onclick="event.stopPropagation();window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button><div class="task-info"><div class="task-title">'+esc(tk.title)+'</div><div class="task-meta">'+(tk.time?'<span>🕐 '+esc(tk.time)+'</span>':'')+'<span class="task-badge pri-'+(tk.priority||'med')+'">'+(pm[tk.priority]||'متوسط')+'</span></div></div><button class="task-del" onclick="event.stopPropagation();window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';}).join('')+'</div>';
      var doneHTML=done.length===0?'<div class="tasks-done-empty">هنوز کاری انجام ندادی</div>':'<div class="tasks-list tasks-done-list">'+done.map(function(tk){var idx=allTasks.indexOf(tk);var tb=tk.studiedMinutes?'<span class="studied-badge">⏱️ '+formatMinutes(tk.studiedMinutes)+'</span>':'<span class="no-time-badge">⚪ بدون زمان</span>';return '<div class="task-item done pri-'+(tk.priority||'med')+'"><button class="task-check checked" onclick="window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button><div class="task-info"><div class="task-title">'+esc(tk.title)+'</div><div class="task-meta">'+tb+'</div></div><button class="task-del" onclick="window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';}).join('')+'</div>';
      var ho=[{value:'',label:'ساعت (اختیاری)'}].concat([6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(function(h){return{value:h+':00 تا '+(h+1)+':00',label:'ساعت '+h+' تا '+(h+1)};}));
      var po=[{value:'high',label:'بالا',dot:'red'},{value:'med',label:'متوسط',dot:'yellow'},{value:'low',label:'پایین',dot:'green'}];
      window.__pendingTime='';window.__pendingPri='med';
      return streakHTML()+dailyWordHTML()+weekStatsHTML()+'<div class="task-add-form"><input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()"><div class="task-form-selects">'+makeSelect('pNewTime','',ho)+makeSelect('pNewPri','med',po,'اولویت‌بندی')+'</div><button class="task-add-btn" onclick="window.__dAddTask()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن</button></div><div class="tasks-list-title">🎯 در جریان:</div>'+activeHTML+'<div class="tasks-list-title done-title">✅ انجام شده ('+toFa(done.length)+'):</div>'+doneHTML;
    }
    function viewDaily(){return heroDaily()+'<div class="planner-body-content">'+dailyContentHTML()+'</div>';}

    window.__taskClick=function(e,dayKey,idx){e.stopPropagation();var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dayKey);var task=dd.tasks[idx];if(!task||task.done)return;showConfirm('🎯','ورود به اتاق مطالعه','کار «'+task.title+'» رو شروع کنی؟',function(){window.__studyTask=task.title;window.__studyTaskSourceId=task.id;window.__studyTaskSourceDay=dayKey;window.__openStudy();},'بریم','نه');};
    window.__dToggleTask=function(i,forceMode){var pl=window.loadPlannerNew();var key=window.dateKey(window.plannerDate||new Date());var dd=window.getDayData(pl,key);if(!dd.tasks[i])return;var task=dd.tasks[i];if(task.done||forceMode==='silent'){var wd=task.done;task.done=!task.done;if(!task.done){delete task.studiedMinutes;}window.savePlanner(pl);if(task.done&&!wd)maybeCelebrate(key);refreshBody('left');return;}showTriple('✅','کار انجام شد!','زمانش ثبت نشد ⏱️ چطور ثبت کنیم؟',{text:'همینطور ثبت',onClick:function(){task.done=true;window.savePlanner(pl);maybeCelebrate(key);refreshBody('left');}},{text:'دقیقه بزنم',onClick:function(){var m=prompt('چند دقیقه؟','25');if(m===null){refreshBody('left');return;}m=parseInt(m);if(isNaN(m)||m<1)m=25;task.done=true;task.studiedMinutes=m;window.savePlanner(pl);maybeCelebrate(key);refreshBody('left');}},{text:'بریم مطالعه 🎯',onClick:function(){window.__studyTask=task.title;window.__studyTaskSourceId=task.id;window.__studyTaskSourceDay=key;window.__openStudy();}});};
    window.__dAddTask=function(){var inp=document.getElementById('pNewTitle');if(!inp)return;var t=inp.value.trim();if(!t)return;var pl=window.loadPlannerNew();var d=new Date(window.plannerDate||new Date());var dd=window.getDayData(pl,window.dateKey(d));dd.tasks.push({id:'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),title:t,time:window.__pendingTime||'',priority:window.__pendingPri||'med',done:false,createdAt:Date.now()});window.savePlanner(pl);inp.value='';window.__pendingTime='';window.__pendingPri='med';refreshBody('left');};
    window.__dDeleteTask=function(i){var pl=window.loadPlannerNew();var key=window.dateKey(window.plannerDate||new Date());var dd=window.getDayData(pl,key);if(!dd.tasks[i])return;dd.tasks.splice(i,1);window.savePlanner(pl);refreshBody('left');};

    function buildWeekCell(day,hk,pl){
      var dd=window.getDayData(pl,day.key);
      var ht=(dd.tasks||[]).filter(function(tk){return tk.time&&tk.time.indexOf(hk+':00')===0;});
      var ft=ht[0];
      if(ft){var isDone=ft.done;return '<div class="week-cell-task'+(isDone?' done':'')+'"><span class="wt-title">'+esc(ft.title)+'</span><div class="wt-actions"><button type="button" class="wt-btn edit" onclick="event.stopPropagation();window.__wEditTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button type="button" class="wt-btn tick'+(isDone?' on':'')+'" onclick="event.stopPropagation();window.__wTickTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button><button type="button" class="wt-btn del" onclick="event.stopPropagation();window.__wDeleteTask(\''+day.key+'\',\''+ft.id+'\')"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button></div></div>';}
      return '<div class="week-cell-edit" data-day="'+day.key+'" data-hour="'+hk+'"><input type="text" class="wc-input" placeholder="+ افزودن..." onkeydown="if(event.key===\'Enter\'){event.preventDefault();window.__wQuickSave(this)}" oninput="window.__wInputChange(this)"><div class="wc-btns"><button type="button" class="wc-btn save" onclick="event.preventDefault();event.stopPropagation();window.__wQuickSave(this.closest(\'.week-cell-edit\').querySelector(\'.wc-input\'))">✓ ثبت</button><button type="button" class="wc-btn cancel" onclick="event.preventDefault();event.stopPropagation();window.__wQuickCancel(this)">✕ لغو</button></div></div>';
    }
    function weeklyContentHTML(){
      var pl=window.loadPlannerNew();
      var days=myWeekDays();
      var tk=window.dateKey(new Date());
      var hr='<tr><th class="hour-col">ساعت</th>'+days.map(function(day){var isT=day.key===tk;return '<th'+(isT?' style="background:var(--accent-soft);color:var(--accent)"':'')+'>'+esc(day.name)+'<div style="font-size:9.5px;opacity:.7;margin-top:2px">'+esc(day.date)+'</div></th>';}).join('')+'</tr>';
      var HOURS=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var br=HOURS.map(function(h){var hk=String(h).padStart(2,'0');var cells=days.map(function(day){var isT=day.key===tk;var dd=window.getDayData(pl,day.key);var hasT=(dd.tasks||[]).some(function(x){return x.time&&x.time.indexOf(hk+':00')===0;});return '<td class="task-cell'+(isT?' today':'')+(hasT?' has-task':'')+'">'+buildWeekCell(day,hk,pl)+'</td>';}).join('');return '<tr><td class="hour-cell">'+toFa(hk)+':۰۰</td>'+cells+'</tr>';}).join('');
      var tt=0,dc=0;days.forEach(function(day){var dd=window.getDayData(pl,day.key);(dd.tasks||[]).forEach(function(x){tt++;if(x.done)dc++;});});
      var pct=tt?Math.round((dc/tt)*100):0;
      var sh='<div class="week-summary"><div class="ws-box" data-stat="total"><div class="ws-num">'+toFa(tt)+'</div><div class="ws-lbl">کل کارها</div></div><div class="ws-box" data-stat="done"><div class="ws-num">'+toFa(dc)+'</div><div class="ws-lbl">انجام شده</div></div><div class="ws-box" data-stat="progress"><div class="ws-num">'+toFa(pct)+'%</div><div class="ws-lbl">پیشرفت</div></div></div>';
      return '<div class="week-grid-wrap"><table class="week-table"><thead>'+hr+'</thead><tbody>'+br+'</tbody></table></div>'+sh;
    }
    function viewWeekly(){return heroWeekly()+'<div class="planner-body-content">'+weeklyContentHTML()+'</div>';}

    window.__wInputChange=function(inp){var w=inp.closest('.week-cell-edit');if(!w)return;var b=w.querySelector('.wc-btns');if(!b)return;if(inp.value.trim().length>0)b.classList.add('visible');else b.classList.remove('visible');};
    window.__wQuickCancel=function(btn){var w=btn.closest('.week-cell-edit');if(!w)return;var i=w.querySelector('.wc-input');if(i){i.value='';i.blur();}var b=w.querySelector('.wc-btns');if(b)b.classList.remove('visible');};
    window.__wQuickSave=function(inp){if(!inp)return;var v=(inp.value||'').trim();if(!v)return;var w=inp.closest('.week-cell-edit');if(!w)return;var dk=w.getAttribute('data-day');var hk=w.getAttribute('data-hour');var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dk);if(!dd.tasks)dd.tasks=[];dd.tasks.push({id:'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),title:v,time:hk+':00 تا '+(parseInt(hk)+1)+':00',priority:'med',done:false,createdAt:Date.now()});window.savePlanner(pl);var td=w.closest('td');if(td){var days=myWeekDays();var day=days.find(function(x){return x.key===dk;});if(day){td.classList.add('has-task');td.innerHTML=buildWeekCell(day,hk,pl);}}updateWeekStats();};
    function updateWeekStats(){var sw=document.querySelector('.week-summary');if(!sw)return;var pl=window.loadPlannerNew();var days=myWeekDays();var tt=0,dc=0;days.forEach(function(day){var dd=window.getDayData(pl,day.key);(dd.tasks||[]).forEach(function(x){tt++;if(x.done)dc++;});});var pct=tt?Math.round((dc/tt)*100):0;var nums=sw.querySelectorAll('.ws-num');if(nums.length>=3){nums[0].textContent=toFa(tt);nums[1].textContent=toFa(dc);nums[2].textContent=toFa(pct)+'%';}}
    function setupWeekSummaryClicks(){document.querySelectorAll('.week-summary .ws-box').forEach(function(box){box.onclick=function(){var s=box.getAttribute('data-stat');var cells;if(s==='total')cells=document.querySelectorAll('.week-cell-task');else if(s==='done')cells=document.querySelectorAll('.week-cell-task.done');else cells=document.querySelectorAll('.week-cell-task:not(.done)');if(!cells.length){if(window.toast)window.toast('چیزی برای نمایش نیست','info');return;}cells.forEach(function(c){c.classList.remove('highlight');void c.offsetWidth;c.classList.add('highlight');setTimeout(function(){c.classList.remove('highlight');},1700);});var first=cells[0];if(first&&first.scrollIntoView){first.scrollIntoView({behavior:'smooth',block:'center'});}};});}
    window.__wTickTask=function(dk,ti){var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dk);var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});if(idx<0)return;var t=dd.tasks[idx];if(t.done){t.done=false;delete t.studiedMinutes;window.savePlanner(pl);refreshBody('left');return;}showTriple('✅','کار انجام شد!','چطور ثبت کنیم؟',{text:'همینطور ثبت',onClick:function(){t.done=true;window.savePlanner(pl);maybeCelebrate(dk);refreshBody('left');}},{text:'دقیقه بزنم',onClick:function(){var m=prompt('چند دقیقه؟','25');if(m===null){refreshBody('left');return;}m=parseInt(m);if(isNaN(m)||m<1)m=25;t.done=true;t.studiedMinutes=m;window.savePlanner(pl);maybeCelebrate(dk);refreshBody('left');}},{text:'بریم مطالعه 🎯',onClick:function(){window.__studyTask=t.title;window.__studyTaskSourceId=t.id;window.__studyTaskSourceDay=dk;window.__openStudy();}});};
    window.__wDeleteTask=function(dk,ti){var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dk);var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});if(idx<0)return;dd.tasks.splice(idx,1);window.savePlanner(pl);refreshBody('left');};
    window.__wEditTask=function(dk,ti){var pl=window.loadPlannerNew();var dd=window.getDayData(pl,dk);var idx=(dd.tasks||[]).findIndex(function(x){return x.id===ti;});if(idx<0)return;var c=dd.tasks[idx];var nt=prompt('عنوان جدید:',c.title);if(nt===null)return;nt=nt.trim();if(!nt)return;dd.tasks[idx].title=nt;window.savePlanner(pl);refreshBody('left');};

    function monthlyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var year=d.getFullYear(),month=d.getMonth();
      var mk=year+'-'+String(month+1).padStart(2,'0');
      if(!pl.months[mk])pl.months[mk]={goals:[]};
      var goals=pl.months[mk].goals||[];
      var fom=new Date(year,month,1);
      var dim=new Date(year,month+1,0).getDate();
      var so=(fom.getDay()+1)%7;
      var tk=window.dateKey(new Date());
      var sk=window.dateKey(d);
      var wd=['ش','ی','د','س','چ','پ','ج'];
      var cells=[];
      for(var i=0;i<so;i++)cells.push('<div class="cal-day empty"></div>');
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
        if(total>0){var r=dC/total;if(r>=1)dc='day-done';else if(r>0)dc='day-partial';else dc='day-pending';}
        if(isF)dc+=' friday';
        var ic='';
        if(rems.length)ic+='<span class="cal-day-icon icon-evt"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>'+(rems.length>1?'<b>'+toFa(rems.length)+'</b>':'')+'</span>';
        if(evt)ic+='<span class="cal-day-icon icon-occ"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>';
        var si='';
        if(total>0){if(dC===total)si='<span class="cal-day-status st-done"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>';else if(dC>0)si='<span class="cal-day-status st-partial"><svg viewBox="0 0 24 24"><path d="M12 6v6l4 2"/></svg></span>';else si='<span class="cal-day-status st-pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span>';}
        cells.push('<div class="cal-day'+(isT?' today':'')+(isS?' selected':'')+(dc?' '+dc:'')+'" title="'+(evt||'')+'" onclick="window.__calDayClick('+dd+')"><span class="cal-day-num">'+toFa(dd)+'</span>'+si+(ic?'<div class="cal-day-icons-row">'+ic+'</div>':'')+'</div>');
      }
      var gh='';
      if(goals.length===0)gh='<div class="mg-empty-compact">🎯 هنوز هدفی نداری</div>';
      else gh='<div class="month-goals-list">'+goals.map(function(g,i){return '<div class="month-goal'+(g.done?' done':'')+'"><label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleMonthGoalLocal(\''+mk+'\','+i+',this)"><span class="mg-check"></span></label><span class="mg-text">'+esc(g.text)+'</span><button class="mg-del" onclick="window.__deleteMonthGoalLocal(\''+mk+'\','+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';}).join('')+'</div>';
      var dg=goals.filter(function(g){return g.done;}).length;
      return '<div class="monthly-layout"><div class="monthly-side"><div class="month-goals compact"><div class="month-goals-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg><span>اهداف این ماه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(dg)+'/'+toFa(goals.length)+'</span>':'')+'</div>'+gh+'<div class="month-goal-add compact"><input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\''+mk+'\')"><button onclick="addMonthGoal(\''+mk+'\')">+</button></div></div></div><div class="monthly-main"><div class="cal-legend"><span class="cl-item done"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>کامل</span><span class="cl-item partial"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3.5 2"/></svg>نیمه</span><span class="cl-item pending"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>انجام نشده</span><span class="cl-item occ"><svg class="cl-icon-svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>مناسبت</span></div><div class="month-calendar"><div class="cal-weekdays">'+wd.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('')+'</div><div class="cal-grid">'+cells.join('')+'</div></div></div></div>';
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
      var tl=tasks.length?tasks.map(function(t){return '<div class="cal-popup-task'+(t.done?' done':'')+'">'+(t.done?'✓':'○')+' '+esc(t.title)+'</div>';}).join(''):'';
      var rl=rems.length?rems.map(function(r,i){return '<div class="cal-rem-item'+(r.done?' done':'')+'"><label class="mg-check-wrap" style="width:18px;height:18px;min-width:18px"><input type="checkbox" '+(r.done?'checked':'')+' onchange="window.__toggleReminder(\''+k+'\','+i+',this)"><span class="mg-check" style="width:18px;height:18px;min-width:18px"></span></label><span class="cal-rem-text">'+esc(r.text)+(r.time?' <span class="cal-rem-time">🕐 '+esc(r.time)+'</span>':'')+'</span><button class="cal-rem-del" onclick="window.__delReminder(\''+k+'\','+i+')">✕</button></div>';}).join(''):'';
      var old=document.getElementById('calDayPopup');if(old)old.remove();
      var el=document.createElement('div');el.id='calDayPopup';el.className='siraj-popup-overlay';
      el.innerHTML='<div class="siraj-popup cal-popup-wide"><div class="siraj-popup-title">📅 '+toFa(day)+' '+d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'})+'</div>'+(ne?'<div class="cal-national-badge">🇮🇷 '+esc(ne)+'</div>':'')+'<div class="cal-popup-section"><div class="cal-popup-label">🎯 کارها</div>'+(tasks.length===0?'<div class="cal-popup-empty">کاری ثبت نشده</div>':'<div class="cal-popup-text">'+toFa(dC)+' از '+toFa(tasks.length)+' انجام شده</div>'+tl)+'</div><div class="cal-popup-section"><div class="cal-popup-label">🔔 یادآورها</div><div class="cal-rem-list">'+(rl||'<div class="cal-popup-empty">یادآوری نداری</div>')+'</div><div class="cal-rem-add"><input type="text" id="newRemText" placeholder="یادآور جدید..." onkeydown="if(event.key===\'Enter\')window.__addReminder(\''+k+'\')"><input type="text" id="newRemTime" placeholder="ساعت" maxlength="5"><button onclick="window.__addReminder(\''+k+'\')">افزودن</button></div></div><div class="siraj-popup-actions"><button class="siraj-popup-btn secondary" id="calPopupClose">بستن</button><button class="siraj-popup-btn" id="calPopupGo">برو به این روز</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){el.classList.add('open');});
      var close=function(){el.classList.remove('open');setTimeout(function(){el.remove();},320);};
      el.querySelector('#calPopupClose').onclick=close;
      el.querySelector('#calPopupGo').onclick=function(){close();selectMonthDay(day);};
    };
    function selectMonthDay(day){window.plannerDate=new Date(window.plannerDate.getFullYear(),window.plannerDate.getMonth(),day);window.switchPlannerTab('daily');}
    window.__addReminder=function(key){var inp=document.getElementById('newRemText');var tInp=document.getElementById('newRemTime');if(!inp)return;var v=inp.value.trim();if(!v)return;var list=getDayReminders(key);list.push({text:v,time:(tInp?tInp.value.trim():''),done:false});setDayReminders(key,list);window.__calDayClick(parseInt(key.split('-')[2],10));};
    window.__toggleReminder=function(key,i,checkbox){var list=getDayReminders(key);if(!list[i])return;list[i].done=!!checkbox.checked;setDayReminders(key,list);};
    window.__delReminder=function(key,i){var list=getDayReminders(key);list.splice(i,1);setDayReminders(key,list);window.__calDayClick(parseInt(key.split('-')[2],10));};

    function yearlyContentHTML(){
      var pl=window.loadPlannerNew();
      var d=new Date(window.plannerDate||new Date());
      var y=d.getFullYear();
      if(!pl.years)pl.years={};
      if(!pl.years[y])pl.years[y]={goals:[]};
      var goals=pl.years[y].goals||[];
      var gh='';
      if(goals.length===0)gh='<div class="mg-empty-compact">🏆 هنوز هدفی نداری</div>';
      else gh='<div class="month-goals-list">'+goals.map(function(g,i){return '<div class="month-goal'+(g.done?' done':'')+'"><label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleYearGoalLocal('+y+','+i+',this)"><span class="mg-check"></span></label><span class="mg-text">'+esc(g.text)+'</span><button class="mg-del" onclick="window.__deleteYearGoalLocal('+y+','+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';}).join('')+'</div>';
      var dg=goals.filter(function(g){return g.done;}).length;
      var months=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      var cmi=-1;
      try{var fm=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(new Date()));if(fm>=1&&fm<=12)cmi=fm-1;}catch(e){}
      var mc=months.map(function(mName,idx){var mk=y+'-'+String(idx+1).padStart(2,'0');var mg=(pl.months[mk]&&pl.months[mk].goals)||[];var md=mg.filter(function(g){return g.done;}).length;var pct=mg.length?Math.round((md/mg.length)*100):0;var isC=idx===cmi;return '<div class="year-month-card'+(isC?' current':'')+'" onclick="window.__goToMonth('+idx+')"><div class="ymc-name">'+mName+'</div><div class="ymc-bar"><div class="ymc-fill" style="width:'+pct+'%"></div></div><div class="ymc-stat">'+toFa(md)+'/'+toFa(mg.length)+'</div></div>';}).join('');
      return '<div class="monthly-layout"><div class="monthly-side"><div class="month-goals year-goals compact"><div class="month-goals-title"><span style="font-size:16px">🏅</span><span>اهداف سالانه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(dg)+'/'+toFa(goals.length)+'</span>':'')+'</div>'+gh+'<div class="month-goal-add compact"><input type="text" id="newYearGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addYearGoal('+y+')"><button onclick="addYearGoal('+y+')">+</button></div></div></div><div class="monthly-main"><div class="year-overview"><div class="year-overview-title">📊 نگاه کلی به ماه‌ها</div><div class="year-months-grid">'+mc+'</div></div></div></div>';
    }
    function viewYearly(){return heroYearly()+'<div class="planner-body-content">'+yearlyContentHTML()+'</div>';}

    window.__goToMonth=function(mi){var base=new Date(window.plannerDate||new Date());var fyt=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(base));var found=null;var ref=new Date(base.getFullYear(),base.getMonth()-4,1);for(var i=0;i<900;i++){var fM=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(ref));var fY=parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(ref));if(fM===(mi+1)&&fY===fyt){found=new Date(ref);break;}ref.setDate(ref.getDate()+1);}if(found){window.plannerDate=found;window.switchPlannerTab('monthly');}};
    window.__toggleMonthGoalLocal=function(mk,i,cb){var pl=window.loadPlannerNew();if(!pl.months[mk]||!pl.months[mk].goals[i])return;pl.months[mk].goals[i].done=!!cb.checked;window.savePlanner(pl);var p=cb.closest('.month-goal');if(p)p.classList.toggle('done',!!cb.checked);var t=document.querySelector('.month-goals-title .mg-counter');if(t){var gs=pl.months[mk].goals;t.textContent=toFa(gs.filter(function(g){return g.done;}).length)+'/'+toFa(gs.length);}};
    window.__deleteMonthGoalLocal=function(mk,i){var pl=window.loadPlannerNew();if(!pl.months[mk]||!pl.months[mk].goals)return;pl.months[mk].goals.splice(i,1);window.savePlanner(pl);refreshBody('left');};
    window.__toggleYearGoalLocal=function(y,i,cb){var pl=window.loadPlannerNew();if(!pl.years||!pl.years[y]||!pl.years[y].goals[i])return;pl.years[y].goals[i].done=!!cb.checked;window.savePlanner(pl);var p=cb.closest('.month-goal');if(p)p.classList.toggle('done',!!cb.checked);};
    window.__deleteYearGoalLocal=function(y,i){var pl=window.loadPlannerNew();if(!pl.years||!pl.years[y]||!pl.years[y].goals)return;pl.years[y].goals.splice(i,1);window.savePlanner(pl);refreshBody('left');};
    window.addMonthGoal=function(mk){var inp=document.getElementById('newGoalInput');if(!inp)return;var v=inp.value.trim();if(!v)return;var pl=window.loadPlannerNew();if(!pl.months[mk])pl.months[mk]={goals:[]};pl.months[mk].goals.push({text:v,done:false});window.savePlanner(pl);inp.value='';refreshBody('left');};
    window.addYearGoal=function(y){var inp=document.getElementById('newYearGoalInput');if(!inp)return;var v=inp.value.trim();if(!v)return;var pl=window.loadPlannerNew();if(!pl.years)pl.years={};if(!pl.years[y])pl.years[y]={goals:[]};pl.years[y].goals.push({text:v,done:false});window.savePlanner(pl);inp.value='';refreshBody('left');};

    window.renderPanelForPlanner=function(){
      var p=getProfile();
      var te=document.getElementById('panelTitleText');
      var se=document.getElementById('panelSubText');
      if(te)te.textContent='برنامه‌ریزی';
      if(se)se.textContent=p.name?('سلام '+p.name+'، خوشومدی 👋'):'سلام، خوشومدی 👋';
      var tab=getTab();
      var tabs=[
        {id:'daily',label:'روزانه',icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'},
        {id:'weekly',label:'هفتگی',icon:'<path d="M3 21h18"/><path d="M5 21v-6M9 21v-10M13 21v-7M17 21v-13M21 21v-4"/>'},
        {id:'monthly',label:'ماهانه',icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'},
        {id:'yearly',label:'سالانه',icon:'<path d="M3 20h18"/><path d="m7 20 5-14 5 14"/>'}
      ];
      var th='<div class="panel-planner-tabs">'+tabs.map(function(t){return '<button class="panel-planner-tab'+(t.id===tab?' active':'')+'" onclick="window.switchPlannerTab(\''+t.id+'\')"><svg viewBox="0 0 24 24">'+t.icon+'</svg><span>'+t.label+'</span></button>';}).join('')+'</div>';
      var pc=document.getElementById('panelContent');
      if(!pc)return;
      pc.innerHTML=th+'<button onclick="window.__openStudy()" class="panel-study-btn" style="margin-top:14px"><svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.8;flex-shrink:0"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg><div style="text-align:right;flex:1"><div>حالت مطالعه</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">با تایمر و تمرکز</div></div></button><div class="panel-card guide-card" style="margin-top:14px"><div class="card-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>راهنما</span></div><div class="guide-list"><div class="guide-item"><span>✨</span>روی حالت مطالعه بزن</div><div class="guide-item"><span>📚</span>یه کار انتخاب کن</div><div class="guide-item"><span>⏱️</span>زمان تنظیم کن</div><div class="guide-item"><span>🎯</span>تا آخر قفل</div><div class="guide-item"><span>🔔</span>توی تقویم یادآور بذار</div></div></div>';
    };

    var currentAudio=null,masterVolume=0.4;
    function stopAudio(){if(currentAudio){try{currentAudio.pause();currentAudio.currentTime=0;}catch(e){}try{currentAudio.src='';}catch(e){}currentAudio=null;}}
    function playSound(t){stopAudio();var u=SOUND_FILES[t];if(!u)return;var a=new Audio(u);a.loop=true;a.volume=masterVolume;a.preload='auto';a.play().catch(function(err){console.warn('[Sound]',err.message);});currentAudio=a;}
    function setMasterVolume(v){masterVolume=Math.max(0,Math.min(1,v));if(currentAudio)currentAudio.volume=masterVolume;}

    function loadStudyChat(){try{return JSON.parse(sessionStorage.getItem(STUDY_CHAT_KEY)||'[]');}catch(e){return [];}}
    function saveStudyChat(){try{sessionStorage.setItem(STUDY_CHAT_KEY,JSON.stringify(studyChatHistory));}catch(e){}}
    function clearStudyChat(){studyChatHistory=[];try{sessionStorage.removeItem(STUDY_CHAT_KEY);}catch(e){}}
    var studyChatHistory=loadStudyChat();
    var studyTimer=null,studySeconds=0,studyRunning=false,studyPaused=false,studyTotalMinutes=0;

    function buildStudyOverlay(){
      var old=document.getElementById('studyOverlay');if(old)old.remove();
      var pl=window.loadPlannerNew();
      var tk=window.dateKey(new Date());
      var ddT=window.getDayData(pl,tk);
      var aTasks=(ddT.tasks||[]).filter(function(x){return !x.done;}).map(function(x){return{id:x.id,title:x.title,dayKey:tk};});
      var hT=aTasks.length>0;
      var tf=hT?'<div class="siraj-select" id="studyTaskSelect" style="width:100%"><div class="siraj-select-trigger" style="width:100%"><span class="siraj-select-value">'+(window.__studyTask?esc(window.__studyTask):'— یک کار از امروز (اختیاری) —')+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel" style="width:100%;min-width:100%">'+aTasks.map(function(x){return '<div class="siraj-select-item" data-value="'+esc(x.title)+'" data-id="'+esc(x.id)+'" data-day="'+esc(x.dayKey)+'"><span>'+esc(x.title)+'</span></div>';}).join('')+'</div></div>':'<div class="study-empty-box">📝 کاری برای امروز نداری</div>';
      var el=document.createElement('div');el.id='studyOverlay';el.className='study-overlay';
      el.innerHTML='<div id="studySetup" class="study-setup"><div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div><div class="study-title">حالت مطالعه</div>'+tf+'<div class="stp-wrap" id="studyTimePicker"><div class="stp-hint">↑ بکش بالا / ↓ پایین</div><span class="stp-num" id="studyTimeNum">00:25</span></div><div class="study-music-section"><div class="study-music-title"><span>🎵 صدای محیطی</span></div><div class="study-sound-grid"><button class="study-sound-btn" data-sound="nature"><span class="ss-icon">🌊</span><span>موج دریا</span></button><button class="study-sound-btn" data-sound="forest"><span class="ss-icon">🌳</span><span>جنگل</span></button><button class="study-sound-btn" data-sound="hall"><span class="ss-icon">🌙</span><span>سکوت گرم</span></button><button class="study-sound-btn" data-sound="rain"><span class="ss-icon">☔</span><span>بارش</span></button><button class="study-sound-btn off-btn on" data-sound=""><span class="ss-icon">🔇</span><span>خاموش</span></button></div><div class="study-volume-row"><input type="range" min="0" max="100" value="40" id="studyVolume" style="--vp:40%"></div></div><div class="study-actions"><button class="study-btn" id="studyStartBtn">شروع مطالعه</button><button class="study-btn secondary" id="studyCancelBtn">لغو</button></div></div><div id="studyRunning" class="study-setup" style="display:none"><div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div><div class="study-mode-badge">🎯 در حال تمرکز</div><div class="study-timer" id="studyTimer"><span class="study-digit" data-k="m1">۰</span><span class="study-digit" data-k="m2">۰</span><span class="study-colon">:</span><span class="study-digit" data-k="s1">۰</span><span class="study-digit" data-k="s2">۰</span></div><div class="study-task" id="studyTaskName">—</div><div id="studyNowPlaying" style="display:none"><span class="study-now-playing">در حال پخش</span></div><div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی 💪</div><div class="study-actions"><button class="study-btn pause-mode" id="studyPauseBtn"><span id="studyPauseLabel">توقف</span></button><button class="study-btn" id="studyChatBtn">مطالعه با سراج</button><button class="study-btn finish-mode" id="studyFinishBtn" disabled>پایان و ثبت</button><button class="study-btn secondary" id="studyExitBtn">خروج</button></div></div>';
      document.body.appendChild(el);
      var picker=el.querySelector('#studyTimePicker');
      var numEl=el.querySelector('#studyTimeNum');
      var pv=25,dSY=0,dSV=25,dg=false;
      function setPV(v){pv=Math.max(1,Math.min(180,Math.round(v)));numEl.textContent=formatTimer(pv);}
      setPV(25);
      function pd(e){dg=true;dSY=(e.touches?e.touches[0].clientY:e.clientY);dSV=pv;picker.classList.add('dragging');e.preventDefault();}
      function pm(e){if(!dg)return;var y=(e.touches?e.touches[0].clientY:e.clientY);setPV(dSV+Math.round((dSY-y)/6));}
      function pu(){if(!dg)return;dg=false;picker.classList.remove('dragging');}
      picker.addEventListener('mousedown',pd);document.addEventListener('mousemove',pm);document.addEventListener('mouseup',pu);
      picker.addEventListener('touchstart',pd,{passive:false});document.addEventListener('touchmove',pm,{passive:false});document.addEventListener('touchend',pu);
      window.__studyMinutesGetter=function(){return pv;};
      el.querySelectorAll('.study-sound-btn').forEach(function(b){b.onclick=function(){var s=b.getAttribute('data-sound');el.querySelectorAll('.study-sound-btn').forEach(function(x){x.classList.remove('on');});if(!s){stopAudio();b.classList.add('on');return;}b.classList.add('on');playSound(s);};});
      var vol=el.querySelector('#studyVolume');if(vol){vol.oninput=function(){var pct=this.value;this.style.setProperty('--vp',pct+'%');setMasterVolume(pct/100);};}
      var tSel=el.querySelector('#studyTaskSelect');
      if(tSel){var tr=tSel.querySelector('.siraj-select-trigger');tr.onclick=function(e){e.stopPropagation();var w=tSel.classList.contains('open');document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});if(!w)tSel.classList.add('open');};tSel.querySelectorAll('.siraj-select-item').forEach(function(it){it.onclick=function(e){e.stopPropagation();var v=it.getAttribute('data-value');var id=it.getAttribute('data-id');var dk=it.getAttribute('data-day');window.__studyTask=v;window.__studyTaskSourceId=id||null;window.__studyTaskSourceDay=dk||null;tSel.querySelector('.siraj-select-value').textContent=v;tSel.classList.remove('open');};});}
      el.querySelector('#studyStartBtn').onclick=startStudy;
      el.querySelector('#studyCancelBtn').onclick=function(){stopAudio();closeStudy();};
      el.querySelector('#studyExitBtn').onclick=exitStudyConfirm;
      el.querySelector('#studyChatBtn').onclick=toggleStudyChat;
      el.querySelector('#studyPauseBtn').onclick=toggleStudyPause;
      el.querySelector('#studyFinishBtn').onclick=finishAndRecord;
    }
    function startStudy(){var o=document.getElementById('studyOverlay');if(!o)return;var t=window.__studyTask||'';var m=window.__studyMinutesGetter?window.__studyMinutesGetter():25;if(!m||m<1)m=25;if(m>180)m=180;studySeconds=m*60;studyTotalMinutes=m;studyRunning=true;studyPaused=false;o.querySelector('#studySetup').style.display='none';o.querySelector('#studyRunning').style.display='flex';o.querySelector('#studyTaskName').textContent=t||'مطالعه آزاد';o.classList.remove('paused');var fb=o.querySelector('#studyFinishBtn');if(fb)fb.disabled=true;updateStudyTimer(true);startStudyTimer();lockSite();}
    function elapsedMinutes(){return Math.max(1,studyTotalMinutes-Math.floor(studySeconds/60));}
    function markSourceTaskDone(){if(!window.__studyTaskSourceId||!window.__studyTaskSourceDay)return;var pl=window.loadPlannerNew();var dd=window.getDayData(pl,window.__studyTaskSourceDay);var idx=(dd.tasks||[]).findIndex(function(x){return x.id===window.__studyTaskSourceId;});if(idx>=0){dd.tasks[idx].done=true;dd.tasks[idx].studiedMinutes=elapsedMinutes();window.savePlanner(pl);}}
    function startStudyTimer(){if(studyTimer)clearInterval(studyTimer);studyTimer=setInterval(function(){if(studyPaused)return;studySeconds--;updateStudyTimer(false);if(studySeconds<=0){clearInterval(studyTimer);studyTimer=null;studyRunning=false;var fb=document.getElementById('studyFinishBtn');if(fb)fb.disabled=false;stopAudio();try{var ac=new (window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0,ac.currentTime);g.gain.linearRampToValueAtTime(0.2,ac.currentTime+0.05);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.8);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+0.85);}catch(e){}showPopup('🎉','عالی بود!','زمان مطالعه تموم شد.');}},1000);}
    function toggleStudyPause(){var o=document.getElementById('studyOverlay');if(!o)return;studyPaused=!studyPaused;var b=o.querySelector('#studyPauseBtn');var l=o.querySelector('#studyPauseLabel');var s=o.querySelector('#studyRunningSub');if(studyPaused){o.classList.add('paused');if(b){b.classList.remove('pause-mode');b.classList.add('resume-mode');}if(l)l.textContent='ادامه';if(currentAudio)currentAudio.volume=0;if(s)s.textContent='⏸️ متوقف شده';}else{o.classList.remove('paused');if(b){b.classList.remove('resume-mode');b.classList.add('pause-mode');}if(l)l.textContent='توقف';var vol=o.querySelector('#studyVolume');var v=vol?(parseInt(vol.value)/100):0.4;if(currentAudio)currentAudio.volume=v;if(s)s.textContent='تا اتمام تایمر 💪';}}
    function setDigit(k,v,a){var el=document.querySelector('.study-digit[data-k="'+k+'"]');if(!el)return;var f=toFa(v);if(el.textContent===f)return;if(a){el.classList.remove('roll');void el.offsetWidth;el.classList.add('roll');}el.textContent=f;}
    function updateStudyTimer(i){if(studySeconds<0)studySeconds=0;var m=Math.floor(studySeconds/60),s=studySeconds%60;var mS=(m<10?'0':'')+m;var sS=(s<10?'0':'')+s;var a=!i;setDigit('m1',mS[0],a);setDigit('m2',mS[1],a);setDigit('s1',sS[0],a);setDigit('s2',sS[1],a);}
    function finishAndRecord(){var m=elapsedMinutes();var sd=window.__studyTaskSourceDay;var st=window.__studyTask;markSourceTaskDone();if(st){showPopup('🏆','کار انجام شد!','«'+st+'» با '+formatMinutes(m)+' ثبت شد.');}else{showPopup('✨','خوب بود!',formatMinutes(m)+' ثبت شد.');}if(studyTimer)clearInterval(studyTimer);studyTimer=null;studyRunning=false;window.__studyTask='';window.__studyTaskSourceId=null;window.__studyTaskSourceDay=null;clearStudyChat();stopAudio();unlockSite();closeStudy();if(sd)setTimeout(function(){maybeCelebrate(sd);},500);}
    function exitStudyConfirm(){if(!confirm('مطمئنی خارج شی؟'))return;if(studyTimer)clearInterval(studyTimer);studyTimer=null;studyRunning=false;window.__studyTask='';window.__studyTaskSourceId=null;window.__studyTaskSourceDay=null;stopAudio();unlockSite();closeStudy();}
    function closeStudy(){try{stopAudio();}catch(e){}var o=document.getElementById('studyOverlay');var chat=document.getElementById('studyChatPanel');if(chat)chat.remove();if(!o)return;o.classList.remove('open');setTimeout(function(){o.remove();},500);setTimeout(function(){if(typeof window.renderPanelForPlanner==='function')window.renderPanelForPlanner();refreshBody('left');},300);}
    function blockKey(e){if(!studyRunning)return;var k=e.key||'';var c=e.ctrlKey||e.metaKey;if(k==='F5'||k==='F11'||k==='Escape'||(c&&['r','R','w','W','n','N','t','T','p','P'].indexOf(k)>=0)){e.preventDefault();e.stopPropagation();return false;}}
    function blockContext(e){if(studyRunning)e.preventDefault();}
    function blockUnload(e){if(!studyRunning)return;e.preventDefault();e.returnValue='در حال مطالعه';return e.returnValue;}
    function lockSite(){document.addEventListener('keydown',blockKey,true);document.addEventListener('contextmenu',blockContext,true);window.addEventListener('beforeunload',blockUnload);}
    function unlockSite(){document.removeEventListener('keydown',blockKey,true);document.removeEventListener('contextmenu',blockContext,true);window.removeEventListener('beforeunload',blockUnload);}
    window.__openStudy=function(){buildStudyOverlay();var o=document.getElementById('studyOverlay');if(!o)return;o.style.opacity='0';o.style.transform='scale(.92)';o.style.transition='none';requestAnimationFrame(function(){requestAnimationFrame(function(){o.style.transition='opacity .4s, transform .5s';o.classList.add('open');o.style.opacity='';o.style.transform='';});});};
    function renderStudyChat(){var box=document.getElementById('studyChatMessages');if(!box)return;var p=getProfile();var greeting=p.name?'سلام '+esc(p.name)+' 👋':'سلام 👋';var html='<div class="sc-msg sc-bot">'+greeting+' من سراجم.</div>';studyChatHistory.forEach(function(m){if(m.role==='user')html+='<div class="sc-msg sc-user">'+esc(m.content)+'</div>';else if(m.role==='assistant')html+='<div class="sc-msg sc-bot">'+esc(m.content)+'</div>';});box.innerHTML=html;box.scrollTop=box.scrollHeight;}
    function toggleStudyChat(){var ex=document.getElementById('studyChatPanel');if(ex){ex.classList.remove('open');setTimeout(function(){ex.remove();},320);return;}var p=document.createElement('div');p.id='studyChatPanel';p.className='study-chat-panel';p.innerHTML='<div class="study-chat-header"><div class="study-chat-header-title">سراج — همیار مطالعه</div><button class="study-chat-close" id="studyChatCloseBtn">✕</button></div><div class="study-chat-messages" id="studyChatMessages"></div><div class="study-chat-input-row"><input type="text" class="study-chat-input" id="studyChatInput" placeholder="سؤالت رو بپرس..." onkeydown="if(event.key===\'Enter\')window.__studyChatSend()"><button class="study-chat-send" onclick="window.__studyChatSend()">➤</button></div>';document.body.appendChild(p);p.querySelector('#studyChatCloseBtn').onclick=function(){p.classList.remove('open');setTimeout(function(){p.remove();},320);};renderStudyChat();requestAnimationFrame(function(){p.classList.add('open');});setTimeout(function(){var i=document.getElementById('studyChatInput');if(i)i.focus();},350);}
    window.__studyChatSend=async function(){
      var inp=document.getElementById('studyChatInput');var box=document.getElementById('studyChatMessages');if(!inp||!box)return;
      var q=inp.value.trim();if(!q)return;
      box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-user">'+esc(q)+'</div>');
      inp.value='';box.scrollTop=box.scrollHeight;
      studyChatHistory.push({role:'user',content:q});saveStudyChat();
      var tid='sct_'+Date.now();
      box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-bot" id="'+tid+'">💭 ...</div>');
      box.scrollTop=box.scrollHeight;
      var sysPrompt='تو «سراج» هستی.\n\n'+profilePrompt();
      try{
        var res=await fetch(getBaseURL(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'text/event-stream'},body:JSON.stringify({model:getModel(),messages:[{role:'system',content:sysPrompt}].concat(studyChatHistory.slice(-10)),temperature:0.7,stream:true})});
        var te=document.getElementById(tid);if(!res.ok){if(te)te.textContent='خطا ('+res.status+')';return;}
        if(te)te.remove();
        var botId='scb_'+Date.now();
        box.insertAdjacentHTML('beforeend','<div class="sc-msg sc-bot" id="'+botId+'"></div>');
        var botEl=document.getElementById(botId);
        var reader=res.body.getReader(),dec=new TextDecoder(),buf='',full='';
        while(true){
          var r=await reader.read();if(r.done)break;
          buf+=dec.decode(r.value,{stream:true});
          var lines=buf.split('\n');buf=lines.pop();
          for(var i=0;i<lines.length;i++){
            var tr=lines[i].trim();if(!tr.startsWith('data:'))continue;
            var dd=tr.slice(5).trim();if(!dd||dd==='[DONE]')continue;
            try{var j=JSON.parse(dd);var delta=j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content;if(delta){full+=delta;botEl.textContent=full;box.scrollTop=box.scrollHeight;}}catch(e){}
          }
        }
        studyChatHistory.push({role:'assistant',content:full});saveStudyChat();
      }catch(err){var t2=document.getElementById(tid);if(t2)t2.textContent='خطا: '+err.message;}
    };

    function blogHTML(){return '<div class="page-title-bar"><div class="page-title-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg></div><div class="page-title-text">مقالات سراج</div></div><div class="community-hero"><div class="community-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg></div><div class="community-title">مقالات سراج</div><div class="community-desc">اینجا قراره مطالب آموزشی، تحلیل‌های ادبی، نکات دستوری و یادداشت‌های کوتاه درباره‌ی زبان و ادبیات عربی منتشر بشه.</div><div class="community-badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>به‌زودی راه‌اندازی می‌شه</div></div>';}
    function communityHTML(){return '<div class="page-title-bar"><div class="page-title-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="page-title-text">انجمن سراج</div></div><div class="community-hero"><div class="community-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="community-title">انجمن گفتگوی سراج</div><div class="community-desc">یه فضای صمیمی که کاربرا، مدرسین و من بتونیم با هم درباره‌ی عربی، ادبیات، برنامه‌ریزی درسی و یادگیری حرف بزنیم.</div><div class="community-badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>به‌زودی راه‌اندازی می‌شه</div></div>';}
    function fillViews(){var b=document.getElementById('view-blog');if(b&&b.classList.contains('active')&&!b.querySelector('.community-hero'))b.innerHTML=blogHTML();var c=document.getElementById('view-videos');if(c&&c.classList.contains('active')){var h=c.querySelector('.community-hero');if(!h){c.innerHTML=communityHTML();}else{var d=h.querySelector('.community-desc');if(d&&d.textContent.length<40)c.innerHTML=communityHTML();}}}
    new MutationObserver(fillViews).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    setTimeout(fillViews,1500);setTimeout(fillViews,2500);

    function linkifyContacts(){document.querySelectorAll('.contact-row-v2, .contact-row').forEach(function(row){if(row.tagName==='A'||row.dataset.linkified==='1')return;row.dataset.linkified='1';row.querySelectorAll('.contact-copy, [data-copy], .copy-btn').forEach(function(b){b.remove();});var le=row.querySelector('.contact-label');var ve=row.querySelector('.contact-value');var l=(le?le.textContent:'').trim();var v=(ve?ve.textContent:'').trim();var vv=v.replace(/^[@\s]+/,'').trim();var h='';if(/تلگرام|telegram/i.test(l))h='https://t.me/'+vv;else if(/ایمیل|email/i.test(l))h='mailto:'+v;else if(/اینستاگرام|instagram/i.test(l))h='https://instagram.com/'+vv;else if(/^X$|توییتر|twitter/i.test(l))h='https://x.com/'+vv;else if(/سایت|وب/i.test(l))h=/^https?:/.test(v)?v:('https://'+v);if(h){row.style.cursor='pointer';row.setAttribute('role','link');row.setAttribute('tabindex','0');var o=function(e){if(e.target.closest('a'))return;e.preventDefault();window.open(h,'_blank','noopener');};row.addEventListener('click',o);row.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')o(e);});}});}
    new MutationObserver(linkifyContacts).observe(document.body,{childList:true,subtree:true});
    setTimeout(linkifyContacts,800);setTimeout(linkifyContacts,1800);

    /* پروفایل + قفل */
    function injectMainTopActions(){
      var p=getProfile();
      var src=p.avatar||USER_AVATAR_URL;
      var name=p.name?p.name:'مشخصات من';
      document.querySelectorAll('.main-top-avatar, .main-top-icon-btn, .header-left-actions, #sirajHeaderActions, #mainProfileAvatar, #mainLockBtn, #mainTopActions, .main-top-actions').forEach(function(el){el.remove();});
      document.querySelectorAll('#headerLockBtn').forEach(function(el){el.style.display='none';});
      document.querySelectorAll('.chat-header, .planner-hero, .page-title-bar').forEach(function(h){
        var w=document.createElement('div');
        w.id='sirajHeaderActions';
        w.className='header-left-actions';
        w.innerHTML='<div class="main-top-avatar" title="'+esc(name)+'"><img src="'+src+'" alt="" draggable="false"></div><button type="button" class="main-top-icon-btn" title="قفل کردن سایت"><svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></button>';
        h.appendChild(w);
        w.querySelector('.main-top-avatar').onclick=function(){if(typeof window.openSettings==='function')window.openSettings();setTimeout(function(){var b=document.querySelector('.settings-tab-btn[data-cat="profile"]');if(b)b.click();},400);};
        w.querySelector('.main-top-icon-btn').onclick=function(){if(typeof window.lockNow==='function')window.lockNow();};
      });
    }
    setTimeout(injectMainTopActions,500);
    setTimeout(injectMainTopActions,1500);
    setTimeout(injectMainTopActions,3000);

    setInterval(function(){
          /* ★ نگهبان: فقط وقتی چیزی *گم شده* یا *تکراری* هست، فیکس کن ★ */
    setInterval(function(){
      var needFix = false;
      document.querySelectorAll('.chat-header, .planner-hero, .page-title-bar').forEach(function(h){
        var wraps = h.querySelectorAll('#sirajHeaderActions, .header-left-actions');
        var avs = h.querySelectorAll('.main-top-avatar');
        var lks = h.querySelectorAll('.main-top-icon-btn');
        /* فقط اگه گم شده یا تکراری شده */
        if(wraps.length !== 1 || avs.length !== 1 || lks.length !== 1){
          needFix = true;
        }
      });
      var stray = document.querySelectorAll('body > .main-top-avatar, body > .main-top-icon-btn, body > .header-left-actions');
      if(stray.length) needFix = true;
      if(needFix) injectMainTopActions();
    }, 2000);

    function updateMainTopAvatar(){var p=getProfile();var s=p.avatar||USER_AVATAR_URL;document.querySelectorAll('.main-top-avatar').forEach(function(a){a.title=p.name?p.name:'مشخصات من';a.innerHTML='<img src="'+s+'" alt="" draggable="false">';});}

    if(typeof window.openSettings==='function'){
      var origOS=window.openSettings;
      window.openSettings=function(){try{origOS.apply(this,arguments);}catch(e){}setTimeout(injectProfileTab,250);};
    }
    function injectProfileTab(){var tw=document.getElementById('settingsTabs');if(!tw)return;if(!tw.querySelector('[data-cat="profile"]')){var btn=document.createElement('button');btn.className='settings-tab-btn';btn.setAttribute('data-cat','profile');btn.setAttribute('onclick',"switchSettingsCat('profile')");btn.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>مشخصات من';tw.insertBefore(btn,tw.children[6]||null);}var cw=document.getElementById('settingsContentWrap');if(cw&&!cw.querySelector('[data-cat="profile"]')){var p=document.createElement('div');p.className='settings-content';p.setAttribute('data-cat','profile');cw.appendChild(p);}renderProfilePane();}
    function renderProfilePane(){
      var pane=document.querySelector('.settings-content[data-cat="profile"]');if(!pane)return;
      var p=getProfile();
      var src=p.avatar||USER_AVATAR_URL;
      var lvl=getUserLevel();var dv=getDefaultView();
      var lo=['beginner','intermediate','advanced'];
      var lh=lo.map(function(k){return '<button class="level-opt'+(k===lvl?' active':'')+'" data-level="'+k+'">'+LEVEL_LABELS[k]+'</button>';}).join('');
      var vo=['chat','planner','blog','videos','tools'];
      var vh=vo.map(function(k){return '<button class="default-view-opt'+(k===dv?' active':'')+'" data-view="'+k+'">'+VIEW_LABELS[k]+'</button>';}).join('');
      pane.innerHTML='<div class="setting-group profile-section"><label style="font-size:13px;font-weight:800;color:var(--accent)">👤 مشخصات شخصی</label><div class="about-avatar" style="margin:14px auto"><img src="'+src+'" alt=""></div><div class="profile-access-note"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span>دستیار هوشمند سراج به این اطلاعات و سطح انتخابی دسترسی داره.</span></div><input type="text" id="profileName" placeholder="اسمت چیه؟" value="'+(p.name?esc(p.name):'')+'" style="width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;margin-bottom:8px;margin-top:8px"><textarea id="profileBio" placeholder="یه توضیح کوتاه..." style="width:100%;min-height:90px;padding:11px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;resize:vertical;line-height:1.8;margin-bottom:8px">'+(p.bio?esc(p.bio):'')+'</textarea><button class="btn-primary" id="profileSaveBtn" style="width:100%;justify-content:center;margin-top:6px">💾 ذخیره</button></div><div class="level-selector"><div class="level-selector-title"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M3 20h18M7 20 12 6l5 14M9.5 13h5"/></svg><span>سطح زبان عربیت</span></div><div class="level-options">'+lh+'</div><button class="level-determine-btn" id="determineLevelBtn"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>سطحمو نمی‌دونم، با هوش مصنوعی تعیین کن</button></div><div class="default-view-selector"><div class="default-view-title"><svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2"><path d="M3 12h18M3 6h18M3 18h18"/></svg><span>تب دیفالت هنگام ورود</span></div><div class="default-view-options">'+vh+'</div></div>';
      pane.querySelectorAll('.level-opt').forEach(function(b){b.onclick=function(){var l=b.getAttribute('data-level');setUserLevel(l);pane.querySelectorAll('.level-opt').forEach(function(x){x.classList.remove('active');});b.classList.add('active');pickNewWord();if(window.toast)window.toast('سطح '+LEVEL_LABELS[l]+' انتخاب شد ✓','success');};});
      pane.querySelectorAll('.default-view-opt').forEach(function(b){b.onclick=function(){var v=b.getAttribute('data-view');setDefaultView(v);pane.querySelectorAll('.default-view-opt').forEach(function(x){x.classList.remove('active');});b.classList.add('active');if(window.toast)window.toast('تب دیفالت: '+VIEW_LABELS[v],'success');};});
      var d=pane.querySelector('#determineLevelBtn');if(d){d.onclick=function(){var m=document.getElementById('settingsModal');if(m)m.classList.remove('open');if(typeof window.switchView==='function')window.switchView('chat');setTimeout(function(){var q=document.getElementById('q');if(q){q.value='میخوام سطح عربیم رو تعیین کنی. چند سوال از آسون به سخت ازم بپرس و آخرش سطحم رو مشخص کن.';if(typeof window.handleInput==='function')window.handleInput();q.focus();}},500);};}
      var s=pane.querySelector('#profileSaveBtn');if(s){s.onclick=function(){var p2=getProfile();p2.name=(pane.querySelector('#profileName')||{}).value||'';p2.bio=(pane.querySelector('#profileBio')||{}).value||'';saveProfile(p2);if(window.toast)window.toast('ذخیره شد ✓','success');if(typeof window.renderPanelForPlanner==='function')window.renderPanelForPlanner();updateMainTopAvatar();};}
    }

    /* ═══ اسلایدر نوار ═══ */
    (function(){
      var nav=null,slider=null,ready=false;
      function init(){
        nav=document.getElementById('bottomNav');if(!nav)return false;
        var old=document.getElementById('navSlider');if(old)old.remove();
        slider=document.createElement('div');slider.id='navSlider';slider.className='nav-slider';
        nav.insertBefore(slider,nav.firstChild);ready=true;
        requestAnimationFrame(function(){track(0);slider.classList.add('grow');setTimeout(function(){slider.classList.remove('grow');},560);});
        nav.addEventListener('click',function(e){
          var btn=e.target.closest('.bottom-nav-btn[data-view]');
          if(!btn)return;
          if(btn.classList.contains('nav-btn-chat')){
            if(slider)slider.classList.remove('visible');
            return;
          }
          nav.querySelectorAll('.bottom-nav-btn').forEach(function(b){b.classList.remove('active');});
          btn.classList.add('active');
          track(650);
        },true);
        new MutationObserver(function(){track(0);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-nav-position']});
        window.addEventListener('resize',function(){track(0);});
        setTimeout(function(){track(0);},800);
        return true;
      }
      function track(duration){
        if(!nav||!slider)return;
        var btn=nav.querySelector('.bottom-nav-btn.active:not(.nav-btn-chat)');
        if(!btn){slider.classList.remove('visible');return;}
        var endTime=performance.now()+duration;
        var pos=document.documentElement.getAttribute('data-nav-position')||'bottom';
        var vert=(pos==='left'||pos==='right');
        function tick(){
          if(!btn.isConnected)return;
          var nr=nav.getBoundingClientRect();var br=btn.getBoundingClientRect();
          slider.style.left=(br.left-nr.left)+'px';
          slider.style.top=(br.top-nr.top)+'px';
          slider.style.width=br.width+'px';
          slider.style.height=br.height+'px';
          slider.style.borderRadius=vert?'14px':'21px';
          if(performance.now()<endTime)requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);slider.classList.add('visible');
      }
      window.__moveNavSlider=function(){track(0);};
      var tries=0;var iv=setInterval(function(){if(init()||++tries>100)clearInterval(iv);},100);
    })();

    /* ═══ سوییچ بین تب‌ها ═══ */
    (function(){
                 function hook(){
        if(typeof window.switchView!=='function')return false;
        if(window.switchView.__hooked)return true;
        var orig=window.switchView;

        window.switchView=function(view){
          /* ★ فیکس باگ کلیک روی تب فعلی — از DOM چک کن ★ */
          var currentActive = document.querySelector('.view.active');
          var currentName = currentActive ? currentActive.id.replace('view-','') : '';

          if(currentName === view){
            /* کاربر روی همون تب فعلی کلیک کرده — کاری نکن */
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
            return;
          }

          /* کنسل تایمرهای قبلی */
          if(window.switchView.__t1)clearTimeout(window.switchView.__t1);
          if(window.switchView.__t2)clearTimeout(window.switchView.__t2);

          /* ریست همه viewها */
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

            /* پروفایل سریع بیاد */
            setTimeout(injectMainTopActions,10);

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
      if(!hook()){var t=setInterval(function(){if(hook())clearInterval(t);},300);setTimeout(function(){clearInterval(t);},8000);}
      setTimeout(function(){var a=document.querySelector('.view.active');if(a){var n=a.id.replace('view-','');if(VIEW_ORDER.indexOf(n)!==-1)_currentMainView=n;}},1000);
    })();

    pickNewWord();
    setTimeout(function(){try{var dv=getDefaultView();if(dv&&dv!=='chat'&&typeof window.switchView==='function')window.switchView(dv);}catch(e){}},1200);

    console.log('[Siraj v2.0] planner loaded ✓ (v28)');
  }
})();
