/* Siraj v2.0 — planner-v2.js (v14 Final) */
(function(){
  'use strict';
  var boot = setInterval(function(){
    if (typeof window.renderPlanner === 'function' && typeof window.loadPlannerNew === 'function') {
      clearInterval(boot);
      try { init(); } catch(e){ console.error('[Planner]', e); }
    }
  }, 100);
  var bc = 0;
  var bg = setInterval(function(){ if (++bc > 60) clearInterval(bg); }, 100);

  function init(){
    var PROFILE_KEY = 'siraj-profile';
    var REMINDER_KEY = 'siraj-reminders';
    var STUDY_CHAT_KEY = 'siraj-study-chat-session';
    var studyChatHistory = [];

    /* ★ آواتار هاردکد — بعداً عکس خودت رو اینجا بذار ★ */
    var USER_AVATAR_URL = 'siraj-logo.png';

    function toFa(n){
      var fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
      return String(n).replace(/\d/g, function(d){ return fa[+d]; });
    }
    /* ★ تبدیل دقیقه به فرمت انسانی ★ */
    function formatMinutes(mins){
      mins = Math.max(0, Math.round(mins));
      if (mins < 60) return toFa(mins) + ' دقیقه';
      var h = Math.floor(mins/60);
      var m = mins % 60;
      if (m === 0) return toFa(h) + ' ساعت';
      return toFa(h) + ' ساعت و ' + toFa(m) + ' دقیقه';
    }
    function esc(s){
      return String(s||'').replace(/[&<>"']/g,function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      });
    }
    function getBaseURL(){
      try{ if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG && APP_CONFIG.baseURL) return APP_CONFIG.baseURL; }catch(e){}
      try{ if (window.APP_CONFIG && window.APP_CONFIG.baseURL) return window.APP_CONFIG.baseURL; }catch(e){}
      return '/api/chat';
    }
    function getModel(){
      try{ if (typeof settings !== 'undefined' && settings && settings.model) return settings.model; }catch(e){}
      try{ if (window.settings && window.settings.model) return window.settings.model; }catch(e){}
      return 'gemini-2.5-flash';
    }
    function getProfile(){ try{ return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }catch(e){ return {}; } }
    function saveProfile(p){ try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }catch(e){} }
    function profilePrompt(){
      var p = getProfile();
      if (!p.name && !p.bio) return '';
      var out = '\n\n👤 اطلاعات کاربر:\n';
      if (p.name) out += '• اسمش: ' + p.name + '\n';
      if (p.bio) out += '• درباره‌ی خودش: ' + p.bio + '\n';
      return out;
    }
    function loadReminders(){ try{ return JSON.parse(localStorage.getItem(REMINDER_KEY) || '{}'); }catch(e){ return {}; } }
    function saveReminders(r){ try{ localStorage.setItem(REMINDER_KEY, JSON.stringify(r)); }catch(e){} }
    function getDayReminders(key){ return loadReminders()[key] || []; }
    function setDayReminders(key, list){
      var r = loadReminders();
      if (list.length) r[key] = list; else delete r[key];
      saveReminders(r);
    }

    var IRAN_EVENTS = {
      '01-01':'نوروز — آغاز سال نو','01-02':'عید نوروز','01-03':'عید نوروز','01-04':'عید نوروز',
      '01-06':'روز امید و شادی','01-12':'روز جمهوری اسلامی','01-13':'سیزده‌بدر',
      '01-19':'شهادت حضرت علی (ع)','01-21':'شهادت امام علی (ع)','01-22':'شب قدر','01-23':'شب قدر',
      '01-25':'روز بزرگداشت عطار','02-01':'عید فطر','02-02':'تعطیل عید فطر','02-10':'روز ملی خلیج فارس',
      '02-12':'روز معلم','02-25':'روز بزرگداشت فردوسی','03-01':'روز بهره‌وری',
      '03-06':'سالگرد آزادسازی خرمشهر','03-14':'رحلت امام خمینی','03-15':'قیام ۱۵ خرداد',
      '04-01':'روز اصناف','04-07':'روز قوه قضائیه','04-10':'روز صنعت و معدن','04-14':'روز قلم',
      '04-25':'روز بهزیستی','05-05':'روز کارمند','05-08':'روز بزرگداشت سهروردی','05-14':'روز بزرگداشت خیام',
      '06-05':'روز بزرگداشت رازی','06-27':'روز شعر و ادب فارسی','06-31':'آغاز هفته دفاع مقدس',
      '07-13':'روز نیروی انتظامی','07-20':'روز بزرگداشت حافظ','08-08':'روز نوجوان','08-13':'روز دانش‌آموز',
      '08-24':'روز کتاب و کتابخوانی','09-16':'روز دانشجو','10-05':'روز خانواده','10-19':'روز بزرگداشت مولوی',
      '11-12':'پیروزی انقلاب اسلامی','11-22':'روز بزرگداشت خواجه نصیر',
      '12-05':'روز بزرگداشت خواجه نصیرالدین طوسی','12-20':'روز بزرگداشت نظامی گنجوی','12-29':'روز ملی شدن صنعت نفت'
    };
    function getIranianEvent(dayKey){
      try{
        var parts = dayKey.split('-');
        var gDate = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
        var faMonth = new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(gDate);
        var faDay = new Intl.DateTimeFormat('en-US-u-ca-persian',{day:'numeric'}).format(gDate);
        var key = String(faMonth).padStart(2,'0') + '-' + String(faDay).padStart(2,'0');
        return IRAN_EVENTS[key] || '';
      }catch(e){ return ''; }
    }

    function getTab(){
      var btn = document.querySelector('.panel-planner-tab.active');
      if (!btn) return 'daily';
      var m = (btn.getAttribute('onclick')||'').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);
      return m ? m[1] : 'daily';
    }
    function dateParts(d){
      try{
        return {
          weekday: d.toLocaleDateString('fa-IR',{weekday:'long'}),
          dayNum: d.toLocaleDateString('fa-IR',{day:'numeric'}),
          monthName: d.toLocaleDateString('fa-IR',{month:'long'}),
          yearNum: d.toLocaleDateString('fa-IR',{year:'numeric'})
        };
      }catch(e){ return {weekday:'',dayNum:'',monthName:'',yearNum:''}; }
    }
    function weekOfMonth(){
      var d = window.plannerDate || new Date();
      return Math.ceil(parseInt(d.toLocaleDateString('en-US',{day:'numeric'}))/7);
    }
    var ORD = ['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){ n=Math.max(1,Math.min(6,n)); return ORD[n-1]; }
    function weekStart(d){
      var x = new Date(d); x.setHours(0,0,0,0);
      var diff = (x.getDay()+1)%7;
      x.setDate(x.getDate() - diff);
      return x;
    }
    function myWeekDays(){
      var d = weekStart(window.plannerDate || new Date());
      var days = [];
      for (var i=0;i<7;i++){
        var dt = new Date(d); dt.setDate(d.getDate() + i);
        days.push({
          key: window.dateKey(dt), name: window.getDayName(dt),
          date: dt.toLocaleDateString('fa-IR',{month:'short',day:'numeric'}), dateObj: dt
        });
      }
      return days;
    }

    function showPopup(emoji, title, text){
      var old = document.getElementById('sirajPopup'); if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajPopup'; el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><button class="siraj-popup-btn" id="sirajPopupOk">متوجه شدم</button></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      el.querySelector('#sirajPopupOk').onclick = function(){ el.classList.remove('open'); setTimeout(function(){ el.remove(); }, 320); };
    }
    function showConfirm(emoji, title, text, onYes, yesText, noText){
      var old = document.getElementById('sirajConfirmPopup'); if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajConfirmPopup'; el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions"><button class="siraj-popup-btn secondary" id="sirajConfirmNo">'+(noText||'نه')+'</button><button class="siraj-popup-btn" id="sirajConfirmYes">'+(yesText||'بله')+'</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ el.remove(); }, 320); };
      el.querySelector('#sirajConfirmYes').onclick = function(){ close(); if (onYes) onYes(); };
      el.querySelector('#sirajConfirmNo').onclick = close;
    }
    function showTriple(emoji, title, text, opt1, opt2, opt3){
      var old = document.getElementById('sirajTriplePopup'); if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajTriplePopup'; el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup"><span class="siraj-popup-emoji">'+emoji+'</span><div class="siraj-popup-title">'+title+'</div><div class="siraj-popup-text">'+text+'</div><div class="siraj-popup-actions-3"><button class="siraj-popup-btn secondary" id="sirajTriple1">'+opt1.text+'</button><button class="siraj-popup-btn secondary" id="sirajTriple2">'+opt2.text+'</button><button class="siraj-popup-btn" id="sirajTriple3">'+opt3.text+'</button></div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ el.remove(); }, 320); };
      el.querySelector('#sirajTriple1').onclick = function(){ close(); if (opt1.onClick) opt1.onClick(); };
      el.querySelector('#sirajTriple2').onclick = function(){ close(); if (opt2.onClick) opt2.onClick(); };
      el.querySelector('#sirajTriple3').onclick = function(){ close(); if (opt3.onClick) opt3.onClick(); };
    }

    function makeSelect(id, value, options, label){
      var cur = options.find(function(o){return o.value === value;}) || options[0];
      var items = options.map(function(o){
        return '<div class="siraj-select-item '+(o.value===value?'active':'')+'" data-value="'+o.value+'">'+(o.dot?'<span class="dot '+o.dot+'"></span>':'')+'<span>'+esc(o.label)+'</span></div>';
      }).join('');
      return '<div class="siraj-select" id="'+id+'">'+(label?'<div class="siraj-select-label">'+esc(label)+'</div>':'')+'<div class="siraj-select-trigger"><span class="siraj-select-value">'+(cur.dot?'<span class="dot '+cur.dot+'"></span>':'')+esc(cur.label)+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel">'+items+'</div></div>';
    }
    function bindSelects(root, handlers){
      if (!root) return;
      root.querySelectorAll('.siraj-select').forEach(function(sel){
        var trig = sel.querySelector('.siraj-select-trigger'); if (!trig) return;
        trig.onclick = function(e){
          e.stopPropagation();
          var was = sel.classList.contains('open');
          document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
          if (!was) sel.classList.add('open');
        };
        sel.querySelectorAll('.siraj-select-item').forEach(function(item){
          item.onclick = function(e){
            e.stopPropagation();
            var val = item.getAttribute('data-value');
            sel.classList.remove('open');
            if (handlers && handlers[sel.id]) handlers[sel.id](val, item);
          };
        });
      });
    }
    document.addEventListener('click', function(){
      document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
    });

    function smartUpdateHero(tab, direction){
      var c = document.querySelector('.phc-center'); if (!c) return;
      var d = new Date(window.plannerDate || new Date());
      var map = {};
      if (tab === 'daily'){
        var p = dateParts(d);
        map.weekday = p.weekday; map.dayNum = p.dayNum; map.monthName = p.monthName; map.yearNum = p.yearNum;
      } else if (tab === 'weekly'){
        var days = myWeekDays(); var p2 = dateParts(d);
        map.monthName2 = p2.monthName; map.yearNum2 = p2.yearNum;
        map.weekOrdinal = 'هفته ' + weekOrd(weekOfMonth()) + ' ماه';
        map.weekRange = 'از ' + days[0].date + ' تا ' + days[6].date;
      } else if (tab === 'monthly'){
        var p3 = dateParts(d); map.monthName3 = p3.monthName; map.yearNum3 = p3.yearNum;
      } else if (tab === 'yearly'){
        map.yearNum4 = d.toLocaleDateString('fa-IR',{year:'numeric'});
      }
      var cls = direction === 'right' ? 'heroRollRight' : 'heroRollLeft';
      c.querySelectorAll('[data-anim-key]').forEach(function(el){
        var k = el.getAttribute('data-anim-key');
        if (map[k] === undefined) return;
        var nv = map[k];
        if (el.textContent.trim() === nv) return;
        el.classList.remove('heroRollRight','heroRollLeft');
        void el.offsetWidth;
        el.textContent = nv;
        el.classList.add(cls);
      });
    }

    function moveDate(dir, unit){
      var d = new Date(window.plannerDate || new Date());
      if (unit === 'day') d.setDate(d.getDate() + dir);
      else if (unit === 'week') d.setDate(d.getDate() + dir * 7);
      else if (unit === 'month'){ d.setDate(1); d.setMonth(d.getMonth() + dir); }
      else if (unit === 'year') d.setFullYear(d.getFullYear() + dir);
      window.plannerDate = d;
      refreshBody(dir > 0 ? 'left' : 'right');
    }
    window.__navDay = function(d){ moveDate(d, 'day'); };
    window.__navWeek = function(d){ moveDate(d, 'week'); };
    window.__navMonth = function(d){ moveDate(d, 'month'); };
    window.__navYear = function(d){ moveDate(d, 'year'); };
    window.__goToday = function(){ window.plannerDate = new Date(); refreshBody('left'); };
    window.__goThisWeek = window.__goToday;
    window.__goThisMonth = window.__goToday;
    window.__goThisYear = window.__goToday;

    function refreshBody(direction){
      var tab = getTab();
      var pane = document.getElementById('plannerPane'); if (!pane) return;
      var hero = pane.querySelector('.planner-hero-card');
      var body = pane.querySelector('.planner-body-content');
      if (!hero || !body){ renderPane(tab); return; }
      smartUpdateHero(tab, direction || 'left');
      body.style.transition = 'opacity .15s ease';
      body.style.opacity = '0';
      setTimeout(function(){
        var html = '';
        if (tab === 'daily') html = dailyContentHTML();
        else if (tab === 'weekly') html = weeklyContentHTML();
        else if (tab === 'monthly') html = monthlyContentHTML();
        else if (tab === 'yearly') html = yearlyContentHTML();
        body.innerHTML = html;
        bindPaneEvents(tab);
        body.style.transition = 'opacity .3s ease';
        body.style.opacity = '1';
      }, 150);
    }
    window.__refreshCurrentTab = refreshBody;

    window.switchPlannerTab = function(tab){
      document.querySelectorAll('.panel-planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2, yearly:3}[tab];
      var btns = document.querySelectorAll('.panel-planner-tab');
      if (btns[idx]) btns[idx].classList.add('active');
      renderPane(tab);
      window.renderPanelForPlanner();
    };
    function renderPane(tab){
      var pane = document.getElementById('plannerPane'); if (!pane) return;
      pane.innerHTML = ''; void pane.offsetWidth;
      if (tab === 'daily') pane.innerHTML = viewDaily();
      else if (tab === 'weekly') pane.innerHTML = viewWeekly();
      else if (tab === 'monthly') pane.innerHTML = viewMonthly();
      else if (tab === 'yearly') pane.innerHTML = viewYearly();
      bindPaneEvents(tab);
    }
    window.renderPlannerPane = function(){ renderPane(getTab()); };
    function bindPaneEvents(tab){
      var pane = document.getElementById('plannerPane'); if (!pane) return;
      if (tab === 'daily'){
        bindSelects(pane, {
          pNewTime: function(val, item){
            var el = pane.querySelector('#pNewTime .siraj-select-value');
            if (el) el.textContent = item.textContent.trim();
            window.__pendingTime = val;
          },
          pNewPri: function(val, item){
            var el = pane.querySelector('#pNewPri .siraj-select-value');
            if (el) el.innerHTML = item.innerHTML;
            window.__pendingPri = val;
          }
        });
      }
    }

    /* ========== HEROES ========== */
    function heroDaily(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var isToday = key === window.dateKey(new Date());
      var monthKey = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var goal = goals.length ? (goals.find(function(g){return !g.done;}) || goals[0]) : null;
      var p = dateParts(d);
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navDay(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="weekday">'+esc(p.weekday)+'</span>'+(isToday?' <span class="phc-today">امروز</span>':'')+'</div>' +
          '<div class="phc-date"><span data-anim-key="dayNum">'+esc(p.dayNum)+'</span> <span data-anim-key="monthName">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum">'+esc(p.yearNum)+'</span></div>' +
          (goal?'<div class="phc-goal"><span>🎯</span><span>هدف ماه: '+esc(goal.text)+'</span></div>':'<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>') +
          (!isToday?'<button class="phc-back-btn" onclick="window.__goToday()">↩ برگرد به امروز</button>':'') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navDay(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }
    function heroWeekly(){
      var d = new Date(window.plannerDate || new Date());
      var days = myWeekDays(); var p = dateParts(d);
      var isCurrentWeek = days[0].key === window.dateKey(weekStart(new Date()));
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navWeek(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="monthName2">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum2">'+esc(p.yearNum)+'</span></div>' +
          '<div class="phc-date"><span data-anim-key="weekOrdinal">هفته '+weekOrd(weekOfMonth())+' ماه</span> — <span data-anim-key="weekRange">از '+esc(days[0].date)+' تا '+esc(days[6].date)+'</span></div>' +
          (!isCurrentWeek?'<button class="phc-back-btn" onclick="window.__goThisWeek()">↩ برگرد به این هفته</button>':'') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navWeek(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }
    function heroMonthly(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var p = dateParts(d);
      var monthKey = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var doneGoals = goals.filter(function(g){return g.done;}).length;
      var now = new Date();
      var isCurrentMonth = (d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth());
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navMonth(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="monthName3">'+esc(p.monthName)+'</span> <span data-anim-key="yearNum3">'+esc(p.yearNum)+'</span></div>' +
          '<div class="phc-date">'+toFa(doneGoals)+' از '+toFa(goals.length)+' هدف این ماه انجام شده</div>' +
          (!isCurrentMonth?'<button class="phc-back-btn" onclick="window.__goThisMonth()">↩ برگرد به این ماه</button>':'') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navMonth(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }
    function heroYearly(){
      var d = new Date(window.plannerDate || new Date());
      var y = d.getFullYear();
      var pl = window.loadPlannerNew();
      if (!pl.years) pl.years = {};
      if (!pl.years[y]) pl.years[y] = {goals:[]};
      var goals = pl.years[y].goals || [];
      var done = goals.filter(function(g){return g.done;}).length;
      var isCurrentYear = y === new Date().getFullYear();
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navYear(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="yearNum4">'+esc(d.toLocaleDateString('fa-IR',{year:'numeric'}))+'</span></div>' +
          '<div class="phc-date">'+toFa(done)+' از '+toFa(goals.length)+' هدف سالانه انجام شده</div>' +
          (!isCurrentYear?'<button class="phc-back-btn" onclick="window.__goThisYear()">↩ برگرد به امسال</button>':'') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navYear(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }

    function weekStatsHTML(){
      var pl = window.loadPlannerNew();
      var days = myWeekDays();
      var studiedMin=0, doneWithTime=0, doneWithout=0;
      days.forEach(function(day){
        var dd = window.getDayData(pl, day.key);
        (dd.tasks||[]).forEach(function(tk){
          if (tk.done){
            if (tk.studiedMinutes){ studiedMin+=tk.studiedMinutes; doneWithTime++; }
            else doneWithout++;
          }
        });
      });
      if (!studiedMin && !doneWithTime && !doneWithout) return '';
      return '<div class="week-stats-bar">' +
        '<div class="wsb-item"><span>⏱️</span><b>'+formatMinutes(studiedMin)+'</b> مطالعه</div>' +
        '<div class="wsb-item"><span>✅</span>'+toFa(doneWithTime)+' با زمان</div>' +
        (doneWithout>0?'<div class="wsb-item warn"><span>⚪</span>'+toFa(doneWithout)+' بدون زمان</div>':'') +
      '</div>';
    }
    function getStreakDays(){
      var pl = window.loadPlannerNew();
      var d = new Date(); d.setHours(0,0,0,0);
      var streak = 0; var isToday = true;
      for (var i=0;i<365;i++){
        var key = window.dateKey(d);
        var dd = window.getDayData(pl, key);
        var hasDone = (dd.tasks||[]).some(function(tk){ return tk.done; });
        if (hasDone) streak++;
        else if (!isToday) break;
        isToday = false;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    }
    function streakHTML(){
      var s = getStreakDays();
      if (s < 2) return '';
      var msg = s>=30?'فوق‌العاده‌ای! 🏆':s>=14?'عالی پیش می‌ری! ✨':s>=7?'ادامه بده! 💪':'خوب شروع کردی! 🌱';
      return '<div class="daily-streak"><span class="ds-fire">🔥</span><span class="ds-num">'+toFa(s)+'</span><span class="ds-text">روز پشت‌سرهم فعالی — '+msg+'</span></div>';
    }

    var DAILY_ARTICLES = [
      {type:'بیت', text:'وَمَا نَيْلُ الْمَطَالِبِ بِالتَّمَنِّي ۞ وَلَكِنْ تُؤْخَذُ الدُّنْيَا غِلَابَا', by:'أحمد شوقي'},
      {type:'نکته', text:'«إنَّ» و «أنَّ» هر دو حرف مشبهه بالفعل هستن؛ اسم رو منصوب و خبر رو مرفوع می‌کنن.'},
      {type:'واژه', text:'«صَبْر» یعنی شکیبایی. ریشه: ص-ب-ر. جمع: صُبور.'},
      {type:'بیت', text:'وَمَنْ يَتَصَبَّرْ يَجِدْ خَيْراً بِصَبْرِهِ ۞ وَمَنْ يَتَعَجَّلْ يَجْنِ غَيْرَ مَا يَشْتَهي', by:'متنبی'},
      {type:'نکته', text:'فعل مضارع با «سـ» یعنی آینده‌ی نزدیک، با «سوف» یعنی آینده‌ی دور.'},
      {type:'واژه', text:'«عِلْم» یعنی دانش. ریشه: ع-ل-م. جمع: عُلوم.'},
      {type:'بیت', text:'وَمَا الْحُرُّ مَنْ يَحْيَا بِغَيْرِ حُرِّيَّةٍ ۞ فَكَيْفَ يَعِيشُ الْحُرُّ وَهْوَ أَسِيرُ', by:'أبو القاسم الشابي'},
      {type:'نکته', text:'«كان» و اخواتش اسم رو مرفوع و خبر رو منصوب می‌کنن.'},
      {type:'واژه', text:'«أَدَب» یعنی ادب. ریشه: أ-د-ب. جمع: آداب.'},
      {type:'بیت', text:'تَعَلَّمْ فَلَيْسَ الْمَرْءُ يُولَدُ عَالِماً ۞ وَلَيْسَ أَخُو عِلْمٍ كَمَنْ هُوَ جَاهِلُ', by:'متنبی'},
      {type:'نکته', text:'اسم فاعل بر وزن «فاعل» میاد و اسم مفعول بر وزن «مفعول».'},
      {type:'واژه', text:'«نُور» یعنی روشنایی. ریشه: ن-و-ر. جمع: أنوار.'},
      {type:'بیت', text:'إِذَا الشَّعْبُ أَرَادَ الْحَيَاةَ فَلَا بُدَّ أَنْ يَسْتَجِيبَ الْقَدَرُ', by:'أبو القاسم الشابي'},
      {type:'نکته', text:'«مُبْتَدَأ» و «خبر» هر دو مرفوع هستن.'},
      {type:'واژه', text:'«قَلْب» یعنی دل. ریشه: ق-ل-ب. جمع: قلوب.'},
      {type:'بیت', text:'دَعِ الْأَيَّامَ تَفْعَلُ مَا تَشَاءُ ۞ وَطِبْ نَفْساً إِذَا حَكَمَ الْقَضَاءُ', by:'الإمام الشافعي'},
      {type:'نکته', text:'«فَعَلَ» ماضی ساده است و «كانَ يَفْعَلُ» ماضی استمراری.'},
      {type:'واژه', text:'«كِتاب» یعنی کتاب. ریشه: ك-ت-ب. جمع: كُتُب.'},
      {type:'نکته', text:'«مِن» و «إلى» و «عَن» و «عَلَى» و «في» از حروف جر هستن.'},
      {type:'واژه', text:'«قَمَر» یعنی ماه. ریشه: ق-م-ر. جمع: أقمار.'},
      {type:'نکته', text:'فعل امر از ثلاثی مجرد همیشه بر وزن «اُفْعُلْ» یا «اِفْعِلْ» میاد.'},
      {type:'واژه', text:'«حَياة» یعنی زندگی. ریشه: ح-ي-ي. جمع: حَيات.'}
    ];
    function getDailyArticle(){
      var now = new Date();
      var start = new Date(now.getFullYear(), 0, 0);
      var day = Math.floor((now - start) / 86400000);
      return DAILY_ARTICLES[day % DAILY_ARTICLES.length];
    }
    function dailyArticleHTML(){
      var a = getDailyArticle(); if (!a) return '';
      return '<div class="daily-article"><div class="da-head"><span class="da-badge">📖 '+esc(a.type)+' امروز</span></div><div class="da-text">'+esc(a.text)+'</div>'+(a.by?'<div class="da-by">— '+esc(a.by)+'</div>':'')+'</div>';
    }

    function showConfetti(){
      var old = document.getElementById('sirajConfetti'); if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajConfetti'; el.className = 'confetti-wrap';
      var colors = ['#F59E0B','#10B981','#3B82F6','#EF4444','#A855F7','#EC4899','#FBBF24','#06B6D4'];
      var html = '';
      for (var i=0;i<80;i++){
        var left = Math.random()*100, delay = Math.random()*0.6, dur = 2.2+Math.random()*1.6;
        var color = colors[Math.floor(Math.random()*colors.length)];
        var size = 6+Math.random()*8, rot = Math.random()*360;
        html += '<span class="confetti-piece" style="left:'+left+'%;background:'+color+';width:'+size+'px;height:'+size+'px;animation-delay:'+delay+'s;animation-duration:'+dur+'s;transform:rotate('+rot+'deg)"></span>';
      }
      el.innerHTML = html;
      document.body.appendChild(el);
      setTimeout(function(){ if (el.parentNode) el.remove(); }, 4200);
    }
    function maybeCelebrate(dayKey){
      dayKey = dayKey || window.dateKey(window.plannerDate || new Date());
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var tasks = (dd.tasks||[]);
      if (tasks.length === 0) return;
      if (tasks.every(function(t){ return t.done; })) {
        showConfetti();
        setTimeout(function(){ showPopup('🎉', 'آفرین!', 'همه‌ی کارهای امروز رو انجام دادی! 🏆'); }, 400);
      }
    }

    function dailyContentHTML(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var dd = window.getDayData(pl, key);
      var allTasks = (dd.tasks || []);
      var active = allTasks.filter(function(tk){ return !tk.done; });
      var done = allTasks.filter(function(tk){ return tk.done; });

      var activeHTML = active.length === 0
        ? '<div class="tasks-empty"><span class="emoji">📝</span>کاری در جریان نداری<br>از کادر بالا کار جدید اضافه کن</div>'
        : '<div class="tasks-list">'+active.map(function(tk){
            var idx = allTasks.indexOf(tk);
            var pm = {high:'بالا',med:'متوسط',low:'پایین'};
            return '<div class="task-item pri-'+(tk.priority||'med')+'" onclick="window.__taskClick(event, \''+key+'\', '+idx+')">' +
              '<button class="task-check" onclick="event.stopPropagation();window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
              '<div class="task-info"><div class="task-title">'+esc(tk.title)+'</div><div class="task-meta">' +
                (tk.time?'<span>🕐 '+esc(tk.time)+'</span>':'') +
                '<span class="task-badge pri-'+(tk.priority||'med')+'">'+(pm[tk.priority]||'متوسط')+'</span>' +
              '</div></div>' +
              '<button class="task-del" onclick="event.stopPropagation();window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
          }).join('')+'</div>';

      var doneHTML = done.length === 0
        ? '<div class="tasks-done-empty">هنوز کاری انجام ندادی</div>'
        : '<div class="tasks-list tasks-done-list">'+done.map(function(tk){
            var idx = allTasks.indexOf(tk);
            var timeBadge = tk.studiedMinutes
              ? '<span class="studied-badge">⏱️ '+formatMinutes(tk.studiedMinutes)+'</span>'
              : '<span class="no-time-badge">⚪ بدون زمان</span>';
            return '<div class="task-item done pri-'+(tk.priority||'med')+'">' +
              '<button class="task-check checked" onclick="window.__dToggleTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
              '<div class="task-info"><div class="task-title">'+esc(tk.title)+'</div><div class="task-meta">'+timeBadge+'</div></div>' +
              '<button class="task-del" onclick="window.__dDeleteTask('+idx+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
          }).join('')+'</div>';

      var hourOpt = [{value:'',label:'ساعت (اختیاری)'}].concat([6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(function(h){
        return {value:h+':00 تا '+(h+1)+':00', label:'ساعت '+h+' تا '+(h+1)};
      }));
      var priOpt = [
        {value:'high',label:'بالا',dot:'red'},
        {value:'med',label:'متوسط',dot:'yellow'},
        {value:'low',label:'پایین',dot:'green'}
      ];
      window.__pendingTime = '';
      window.__pendingPri = 'med';

      return streakHTML() + dailyArticleHTML() + weekStatsHTML() +
        '<div class="task-add-form">' +
          '<input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()">' +
          '<div class="task-form-selects">'+makeSelect('pNewTime','',hourOpt)+makeSelect('pNewPri','med',priOpt,'اولویت‌بندی')+'</div>' +
          '<button class="task-add-btn" onclick="window.__dAddTask()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن</button>' +
        '</div>' +
        '<div class="tasks-list-title">🎯 در جریان:</div>'+activeHTML +
        '<div class="tasks-list-title done-title">✅ انجام شده ('+toFa(done.length)+'):</div>'+doneHTML;
    }
    function viewDaily(){ return heroDaily()+'<div class="planner-body-content">'+dailyContentHTML()+'</div>'; }

    window.__taskClick = function(e, dayKey, idx){
      e.stopPropagation();
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var task = dd.tasks[idx];
      if (!task || task.done) return;
      showConfirm('🎯', 'ورود به اتاق مطالعه', 'کار «'+task.title+'» رو شروع کنی؟', function(){
        window.__studyTask = task.title;
        window.__studyTaskSourceId = task.id;
        window.__studyTaskSourceDay = dayKey;
        window.__openStudy();
      }, 'بریم', 'نه');
    };

    window.__dToggleTask = function(i, forceMode){
      var pl = window.loadPlannerNew();
      var key = window.dateKey(window.plannerDate || new Date());
      var dd = window.getDayData(pl, key);
      if (!dd.tasks[i]) return;
      var task = dd.tasks[i];
      if (task.done || forceMode === 'silent'){
        var wasDone = task.done;
        task.done = !task.done;
        if (!task.done){ delete task.studiedMinutes; }
        window.savePlanner(pl);
        if (task.done && !wasDone) maybeCelebrate(key);
        refreshBody('left');
        return;
      }
      showTriple('✅', 'کار انجام شد!', 'زمانش ثبت نشد ⏱️ چطور ثبت کنیم؟',
        {text:'همینطور ثبت', onClick: function(){ task.done = true; window.savePlanner(pl); maybeCelebrate(key); refreshBody('left'); }},
        {text:'دقیقه بزنم', onClick: function(){
          var mins = prompt('چند دقیقه؟', '25');
          if (mins === null){ refreshBody('left'); return; }
          mins = parseInt(mins); if (isNaN(mins) || mins < 1) mins = 25;
          task.done = true; task.studiedMinutes = mins;
          window.savePlanner(pl); maybeCelebrate(key); refreshBody('left');
        }},
        {text:'بریم مطالعه 🎯', onClick: function(){
          window.__studyTask = task.title;
          window.__studyTaskSourceId = task.id;
          window.__studyTaskSourceDay = key;
          window.__openStudy();
        }}
      );
    };

    window.__dAddTask = function(){
      var inp = document.getElementById('pNewTitle'); if (!inp) return;
      var title = inp.value.trim(); if (!title) return;
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var dd = window.getDayData(pl, window.dateKey(d));
      dd.tasks.push({
        id: 'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        title: title, time: window.__pendingTime || '',
        priority: window.__pendingPri || 'med', done: false, createdAt: Date.now()
      });
      window.savePlanner(pl);
      inp.value = ''; window.__pendingTime = ''; window.__pendingPri = 'med';
      refreshBody('left');
    };
    window.__dDeleteTask = function(i){
      var pl = window.loadPlannerNew();
      var key = window.dateKey(window.plannerDate || new Date());
      var dd = window.getDayData(pl, key);
      if (!dd.tasks[i]) return;
      dd.tasks.splice(i,1);
      window.savePlanner(pl);
      refreshBody('left');
    };

    function buildWeekCell(day, hk, pl){
      var dd = window.getDayData(pl, day.key);
      var hourTasks = (dd.tasks||[]).filter(function(tk){ return tk.time && tk.time.indexOf(hk+':00') === 0; });
      var firstTask = hourTasks[0];
      if (firstTask){
        var isDone = firstTask.done;
        return '<div class="week-cell-task'+(isDone?' done':'')+'">' +
          '<span class="wt-title">'+esc(firstTask.title)+'</span>' +
          '<div class="wt-actions">' +
            '<button type="button" class="wt-btn edit" onclick="event.stopPropagation();window.__wEditTask(\''+day.key+'\',\''+firstTask.id+'\')"><svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
            '<button type="button" class="wt-btn tick'+(isDone?' on':'')+'" onclick="event.stopPropagation();window.__wTickTask(\''+day.key+'\',\''+firstTask.id+'\')"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
            '<button type="button" class="wt-btn del" onclick="event.stopPropagation();window.__wDeleteTask(\''+day.key+'\',\''+firstTask.id+'\')"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
          '</div></div>';
      }
      return '<div class="week-cell-edit" data-day="'+day.key+'" data-hour="'+hk+'">' +
        '<input type="text" class="wc-input" placeholder="+ افزودن..." onkeydown="if(event.key===\'Enter\'){event.preventDefault();window.__wQuickSave(this)}" oninput="window.__wInputChange(this)">' +
        '<div class="wc-btns" style="display:none">' +
          '<button type="button" class="wc-btn save" onclick="event.preventDefault();event.stopPropagation();window.__wQuickSave(this.closest(\'.week-cell-edit\').querySelector(\'.wc-input\'))">✓ ثبت</button>' +
          '<button type="button" class="wc-btn cancel" onclick="event.preventDefault();event.stopPropagation();window.__wQuickCancel(this)">✕ لغو</button>' +
        '</div></div>';
    }

    function weeklyContentHTML(){
      var pl = window.loadPlannerNew();
      var days = myWeekDays();
      var todayKey = window.dateKey(new Date());
      var headerRow = '<tr><th class="hour-col">ساعت</th>'+days.map(function(day){
        var isToday = day.key === todayKey;
        return '<th'+(isToday?' style="background:var(--accent-soft);color:var(--accent)"':'')+'>'+esc(day.name)+'<div style="font-size:9.5px;opacity:.7;margin-top:2px">'+esc(day.date)+'</div></th>';
      }).join('')+'</tr>';
      var HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var bodyRows = HOURS.map(function(h){
        var hk = String(h).padStart(2,'0');
        var cells = days.map(function(day){
          var isToday = day.key === todayKey;
          var dd = window.getDayData(pl, day.key);
          var hasTask = (dd.tasks||[]).some(function(tk){ return tk.time && tk.time.indexOf(hk+':00') === 0; });
          return '<td class="task-cell'+(isToday?' today':'')+(hasTask?' has-task':'')+'">'+buildWeekCell(day, hk, pl)+'</td>';
        }).join('');
        return '<tr><td class="hour-cell">'+toFa(hk)+':۰۰</td>'+cells+'</tr>';
      }).join('');
      var totalTasks = 0, doneCount = 0;
      days.forEach(function(day){
        var dd = window.getDayData(pl, day.key);
        (dd.tasks||[]).forEach(function(tk){ totalTasks++; if (tk.done) doneCount++; });
      });
      var pct = totalTasks ? Math.round((doneCount/totalTasks)*100) : 0;
      var summaryHTML = '<div class="week-summary">' +
        '<div class="ws-box"><div class="ws-num">'+toFa(totalTasks)+'</div><div class="ws-lbl">کل کارها</div></div>' +
        '<div class="ws-box"><div class="ws-num">'+toFa(doneCount)+'</div><div class="ws-lbl">انجام شده</div></div>' +
        '<div class="ws-box"><div class="ws-num">'+toFa(pct)+'%</div><div class="ws-lbl">پیشرفت</div></div>' +
      '</div>';
      return '<div class="week-grid-wrap"><table class="week-table"><thead>'+headerRow+'</thead><tbody>'+bodyRows+'</tbody></table></div>'+summaryHTML;
    }
    function viewWeekly(){ return heroWeekly()+'<div class="planner-body-content">'+weeklyContentHTML()+'</div>'; }

    window.__wInputChange = function(inp){
      var wrap = inp.closest('.week-cell-edit'); if (!wrap) return;
      var btns = wrap.querySelector('.wc-btns'); if (!btns) return;
      btns.style.display = (inp.value.trim().length > 0) ? 'flex' : 'none';
    };
    window.__wQuickCancel = function(btn){
      var wrap = btn.closest('.week-cell-edit'); if (!wrap) return;
      var inp = wrap.querySelector('.wc-input');
      if (inp){ inp.value = ''; inp.blur(); }
      var btns = wrap.querySelector('.wc-btns'); if (btns) btns.style.display = 'none';
    };
    window.__wQuickSave = function(inp){
      if (!inp) return;
      var val = (inp.value || '').trim(); if (!val) return;
      var wrap = inp.closest('.week-cell-edit'); if (!wrap) return;
      var dayKey = wrap.getAttribute('data-day');
      var hourKey = wrap.getAttribute('data-hour');
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      if (!dd.tasks) dd.tasks = [];
      dd.tasks.push({
        id: 'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        title: val, time: hourKey+':00 تا '+(parseInt(hourKey)+1)+':00',
        priority: 'med', done: false, createdAt: Date.now()
      });
      window.savePlanner(pl);
      var td = wrap.closest('td');
      if (td){
        var days = myWeekDays();
        var day = days.find(function(x){ return x.key === dayKey; });
        if (day){ td.classList.add('has-task'); td.innerHTML = buildWeekCell(day, hourKey, pl); }
      }
      updateWeekStats();
    };
    function updateWeekStats(){
      var statsWrap = document.querySelector('.week-summary'); if (!statsWrap) return;
      var pl = window.loadPlannerNew(); var days = myWeekDays();
      var totalTasks = 0, doneCount = 0;
      days.forEach(function(day){
        var dd = window.getDayData(pl, day.key);
        (dd.tasks||[]).forEach(function(tk){ totalTasks++; if (tk.done) doneCount++; });
      });
      var pct = totalTasks ? Math.round((doneCount/totalTasks)*100) : 0;
      var nums = statsWrap.querySelectorAll('.ws-num');
      if (nums.length >= 3){
        nums[0].textContent = toFa(totalTasks);
        nums[1].textContent = toFa(doneCount);
        nums[2].textContent = toFa(pct) + '%';
      }
    }

    window.__wTickTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      var task = dd.tasks[idx];
      if (task.done){ task.done = false; delete task.studiedMinutes; window.savePlanner(pl); refreshBody('left'); return; }
      showTriple('✅', 'کار انجام شد!', 'چطور ثبت کنیم؟',
        {text:'همینطور ثبت', onClick: function(){ task.done = true; window.savePlanner(pl); maybeCelebrate(dayKey); refreshBody('left'); }},
        {text:'دقیقه بزنم', onClick: function(){
          var mins = prompt('چند دقیقه؟', '25');
          if (mins === null){ refreshBody('left'); return; }
          mins = parseInt(mins); if (isNaN(mins) || mins < 1) mins = 25;
          task.done = true; task.studiedMinutes = mins;
          window.savePlanner(pl); maybeCelebrate(dayKey); refreshBody('left');
        }},
        {text:'بریم مطالعه 🎯', onClick: function(){
          window.__studyTask = task.title;
          window.__studyTaskSourceId = task.id;
          window.__studyTaskSourceDay = dayKey;
          window.__openStudy();
        }}
      );
    };
    window.__wDeleteTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      dd.tasks.splice(idx,1); window.savePlanner(pl); refreshBody('left');
    };
    window.__wEditTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      var cur = dd.tasks[idx];
      var newTitle = prompt('عنوان جدید:', cur.title);
      if (newTitle === null) return;
      newTitle = newTitle.trim(); if (!newTitle) return;
      dd.tasks[idx].title = newTitle;
      window.savePlanner(pl); refreshBody('left');
    };

    function monthlyContentHTML(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var year = d.getFullYear(), month = d.getMonth();
      var monthKey = year+'-'+String(month+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var firstOfMonth = new Date(year,month,1);
      var daysInMonth = new Date(year,month+1,0).getDate();
      var startOffset = (firstOfMonth.getDay()+1)%7;
      var todayKey = window.dateKey(new Date());
      var selectedKey = window.dateKey(d);
      var weekdays = ['ش','ی','د','س','چ','پ','ج'];
      var cells = [];
      for (var i=0;i<startOffset;i++) cells.push('<div class="cal-day empty"></div>');
      for (var dd=1; dd<=daysInMonth; dd++){
        var dt = new Date(year,month,dd);
        var k = window.dateKey(dt);
        var isToday = k===todayKey, isSel = k===selectedKey, isFri = dt.getDay()===5;
        var dayData = window.getDayData(pl,k);
        var doneC = (dayData.tasks||[]).filter(function(x){return x.done;}).length;
        var total = (dayData.tasks||[]).length;
        var rems = getDayReminders(k);
        var evt = getIranianEvent(k);
        var dayClass = '';
        if (total > 0){
          var ratio = doneC / total;
          if (ratio >= 1) dayClass = 'day-done';
          else if (ratio > 0) dayClass = 'day-partial';
          else dayClass = 'day-pending';
        }
        if (isFri) dayClass += ' friday';
        var icons = '';
        if (rems.length) icons += '<span class="cal-day-icon icon-evt"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>'+(rems.length>1?'<b>'+toFa(rems.length)+'</b>':'')+'</span>';
        if (evt) icons += '<span class="cal-day-icon icon-occ"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>';
        var statusIcon = '';
        if (total > 0){
          if (doneC === total) statusIcon = '<span class="cal-day-status st-done"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>';
          else if (doneC > 0) statusIcon = '<span class="cal-day-status st-partial"><svg viewBox="0 0 24 24"><path d="M12 6v6l4 2"/></svg></span>';
          else statusIcon = '<span class="cal-day-status st-pending"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span>';
        }
        cells.push('<div class="cal-day'+(isToday?' today':'')+(isSel?' selected':'')+(dayClass?' '+dayClass:'')+'" title="'+(evt||'')+'" onclick="window.__calDayClick('+dd+')"><span class="cal-day-num">'+toFa(dd)+'</span>'+statusIcon+(icons?'<div class="cal-day-icons-row">'+icons+'</div>':'')+'</div>');
      }
      var goalsHTML = '';
      if (goals.length === 0){ goalsHTML = '<div class="mg-empty-compact">🎯 هنوز هدفی نداری</div>'; }
      else {
        goalsHTML = '<div class="month-goals-list">'+goals.map(function(g,i){
          return '<div class="month-goal'+(g.done?' done':'')+'" data-goal-i="'+i+'">' +
            '<label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleMonthGoalLocal(\''+monthKey+'\','+i+',this)"><span class="mg-check"></span></label>' +
            '<span class="mg-text">'+esc(g.text)+'</span>' +
            '<button class="mg-del" onclick="window.__deleteMonthGoalLocal(\''+monthKey+'\','+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
        }).join('')+'</div>';
      }
      var doneGoals = goals.filter(function(g){return g.done;}).length;
      return '<div class="monthly-layout">' +
          '<div class="monthly-side">' +
            '<div class="month-goals compact">' +
              '<div class="month-goals-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg><span>اهداف این ماه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(doneGoals)+'/'+toFa(goals.length)+'</span>':'')+'</div>' +
              goalsHTML +
              '<div class="month-goal-add compact"><input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\''+monthKey+'\')"><button onclick="addMonthGoal(\''+monthKey+'\')">+</button></div>' +
            '</div>' +
          '</div>' +
          '<div class="monthly-main">' +
            '<div class="cal-legend">' +
              '<span class="cl-item done"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>کامل</span>' +
              '<span class="cl-item partial"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3.5 2"/></svg>نیمه</span>' +
              '<span class="cl-item pending"><svg class="cl-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>انجام نشده</span>' +
              '<span class="cl-item occ"><svg class="cl-icon-svg" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>مناسبت</span>' +
              '<span class="cl-item evt"><svg class="cl-icon-svg" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>رویداد</span>' +
            '</div>' +
            '<div class="month-calendar">' +
              '<div class="cal-weekdays">'+weekdays.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('')+'</div>' +
              '<div class="cal-grid">'+cells.join('')+'</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    function viewMonthly(){ return heroMonthly()+'<div class="planner-body-content">'+monthlyContentHTML()+'</div>'; }

    window.__calDayClick = function(day){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var k = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
      var dd = window.getDayData(pl,k);
      var tasks = dd.tasks||[];
      var doneC = tasks.filter(function(t){return t.done;}).length;
      var rems = getDayReminders(k);
      var nationalEvt = getIranianEvent(k);
      var tasksList = tasks.length ? tasks.map(function(t){
        return '<div class="cal-popup-task'+(t.done?' done':'')+'">'+(t.done?'✓':'○')+' '+esc(t.title)+'</div>';
      }).join('') : '';
      var remsList = rems.length ? rems.map(function(r,i){
        return '<div class="cal-rem-item'+(r.done?' done':'')+'">' +
          '<label class="mg-check-wrap" style="width:18px;height:18px;min-width:18px"><input type="checkbox" '+(r.done?'checked':'')+' onchange="window.__toggleReminder(\''+k+'\','+i+',this)"><span class="mg-check" style="width:18px;height:18px;min-width:18px"></span></label>' +
          '<span class="cal-rem-text">'+esc(r.text)+(r.time?' <span class="cal-rem-time">🕐 '+esc(r.time)+'</span>':'')+'</span>' +
          '<button class="cal-rem-del" onclick="window.__delReminder(\''+k+'\','+i+')">✕</button></div>';
      }).join('') : '';
      var old = document.getElementById('calDayPopup'); if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'calDayPopup'; el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup cal-popup-wide">' +
        '<div class="siraj-popup-title">📅 '+toFa(day)+' '+d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'})+'</div>' +
        (nationalEvt?'<div class="cal-national-badge">🇮🇷 '+esc(nationalEvt)+'</div>':'') +
        '<div class="cal-popup-section"><div class="cal-popup-label">🎯 کارها</div>'+(tasks.length===0?'<div class="cal-popup-empty">کاری ثبت نشده</div>':'<div class="cal-popup-text">'+toFa(doneC)+' از '+toFa(tasks.length)+' انجام شده</div>'+tasksList)+'</div>' +
        '<div class="cal-popup-section"><div class="cal-popup-label">🔔 یادآورها</div><div class="cal-rem-list">'+(remsList||'<div class="cal-popup-empty">یادآوری نداری</div>')+'</div>' +
          '<div class="cal-rem-add"><input type="text" id="newRemText" placeholder="یادآور جدید..." onkeydown="if(event.key===\'Enter\')window.__addReminder(\''+k+'\')"><input type="text" id="newRemTime" placeholder="ساعت" maxlength="5" onkeydown="if(event.key===\'Enter\')window.__addReminder(\''+k+'\')"><button onclick="window.__addReminder(\''+k+'\')">افزودن</button></div></div>' +
        '<div class="siraj-popup-actions"><button class="siraj-popup-btn secondary" id="calPopupClose">بستن</button><button class="siraj-popup-btn" id="calPopupGo">برو به این روز</button></div>' +
      '</div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ el.remove(); }, 320); };
      el.querySelector('#calPopupClose').onclick = close;
      el.querySelector('#calPopupGo').onclick = function(){ close(); selectMonthDay(day); };
    };

    function selectMonthDay(day){
      window.plannerDate = new Date(window.plannerDate.getFullYear(), window.plannerDate.getMonth(), day);
      window.switchPlannerTab('daily');
    }

    window.__addReminder = function(key){
      var inp = document.getElementById('newRemText');
      var tInp = document.getElementById('newRemTime');
      if (!inp) return;
      var v = inp.value.trim(); if (!v) return;
      var list = getDayReminders(key);
      list.push({ text: v, time: (tInp ? tInp.value.trim() : ''), done: false });
      setDayReminders(key, list);
      window.__calDayClick(parseInt(key.split('-')[2],10));
    };
    window.__toggleReminder = function(key, i, checkbox){
      var list = getDayReminders(key);
      if (!list[i]) return;
      list[i].done = !!checkbox.checked;
      setDayReminders(key, list);
    };
    window.__delReminder = function(key, i){
      var list = getDayReminders(key);
      list.splice(i,1);
      setDayReminders(key, list);
      window.__calDayClick(parseInt(key.split('-')[2],10));
    };

    function yearlyContentHTML(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var y = d.getFullYear();
      if (!pl.years) pl.years = {};
      if (!pl.years[y]) pl.years[y] = {goals:[]};
      var goals = pl.years[y].goals || [];
      var goalsHTML = '';
      if (goals.length === 0){ goalsHTML = '<div class="mg-empty-compact">🏆 هنوز هدفی نداری</div>'; }
      else {
        goalsHTML = '<div class="month-goals-list">'+goals.map(function(g,i){
          return '<div class="month-goal'+(g.done?' done':'')+'" data-ygoal-i="'+i+'">' +
            '<label class="mg-check-wrap"><input type="checkbox" '+(g.done?'checked':'')+' onchange="window.__toggleYearGoalLocal('+y+','+i+',this)"><span class="mg-check"></span></label>' +
            '<span class="mg-text">'+esc(g.text)+'</span>' +
            '<button class="mg-del" onclick="window.__deleteYearGoalLocal('+y+','+i+')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
        }).join('')+'</div>';
      }
      var doneGoals = goals.filter(function(g){return g.done;}).length;
      var months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      var currentMonthIdx = -1;
      try{
        var faMonthNum = parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(new Date()));
        if (faMonthNum >= 1 && faMonthNum <= 12) currentMonthIdx = faMonthNum - 1;
      }catch(e){}
      var monthCards = months.map(function(mName, idx){
        var mk = y+'-'+String(idx+1).padStart(2,'0');
        var mg = (pl.months[mk] && pl.months[mk].goals) || [];
        var md = mg.filter(function(g){return g.done;}).length;
        var pct = mg.length ? Math.round((md/mg.length)*100) : 0;
        var isCur = idx === currentMonthIdx;
        return '<div class="year-month-card'+(isCur?' current':'')+'" onclick="window.__goToMonth('+idx+')"><div class="ymc-name">'+mName+'</div><div class="ymc-bar"><div class="ymc-fill" style="width:'+pct+'%"></div></div><div class="ymc-stat">'+toFa(md)+'/'+toFa(mg.length)+'</div></div>';
      }).join('');
      return '<div class="monthly-layout">' +
          '<div class="monthly-side">' +
            '<div class="month-goals year-goals compact">' +
              '<div class="month-goals-title"><span style="font-size:16px">🏅</span><span>اهداف سالانه</span>'+(goals.length>0?'<span class="mg-counter">'+toFa(doneGoals)+'/'+toFa(goals.length)+'</span>':'')+'</div>' +
              goalsHTML +
              '<div class="month-goal-add compact"><input type="text" id="newYearGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addYearGoal('+y+')"><button onclick="addYearGoal('+y+')">+</button></div>' +
            '</div>' +
          '</div>' +
          '<div class="monthly-main"><div class="year-overview"><div class="year-overview-title">📊 نگاه کلی به ماه‌ها</div><div class="year-months-grid">'+monthCards+'</div></div></div>' +
        '</div>';
    }
    function viewYearly(){ return heroYearly()+'<div class="planner-body-content">'+yearlyContentHTML()+'</div>'; }

    window.__goToMonth = function(monthIdx){
      var base = new Date(window.plannerDate || new Date());
      var faYearTarget = parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(base));
      var found = null;
      var ref = new Date(base.getFullYear(), base.getMonth() - 4, 1);
      for (var i=0;i<900;i++){
        var faM = parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{month:'numeric'}).format(ref));
        var faY = parseInt(new Intl.DateTimeFormat('en-US-u-ca-persian',{year:'numeric'}).format(ref));
        if (faM === (monthIdx+1) && faY === faYearTarget){ found = new Date(ref); break; }
        ref.setDate(ref.getDate() + 1);
      }
      if (found){ window.plannerDate = found; window.switchPlannerTab('monthly'); }
    };

    window.__toggleMonthGoalLocal = function(monthKey, i, checkbox){
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey] || !pl.months[monthKey].goals[i]) return;
      pl.months[monthKey].goals[i].done = !!checkbox.checked;
      window.savePlanner(pl);
      var parent = checkbox.closest('.month-goal');
      if (parent) parent.classList.toggle('done', !!checkbox.checked);
      var t = document.querySelector('.month-goals-title .mg-counter');
      if (t){ var gs = pl.months[monthKey].goals; t.textContent = toFa(gs.filter(function(g){return g.done;}).length)+'/'+toFa(gs.length); }
    };
    window.__deleteMonthGoalLocal = function(monthKey, i){
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey] || !pl.months[monthKey].goals) return;
      pl.months[monthKey].goals.splice(i,1); window.savePlanner(pl);
      refreshBody('left');
    };
    window.__toggleYearGoalLocal = function(y, i, checkbox){
      var pl = window.loadPlannerNew();
      if (!pl.years || !pl.years[y] || !pl.years[y].goals[i]) return;
      pl.years[y].goals[i].done = !!checkbox.checked;
      window.savePlanner(pl);
      var p = checkbox.closest('.month-goal');
      if (p) p.classList.toggle('done', !!checkbox.checked);
    };
    window.__deleteYearGoalLocal = function(y, i){
      var pl = window.loadPlannerNew();
      if (!pl.years || !pl.years[y] || !pl.years[y].goals) return;
      pl.years[y].goals.splice(i,1); window.savePlanner(pl);
      refreshBody('left');
    };

    window.addMonthGoal = function(monthKey){
      var inp = document.getElementById('newGoalInput'); if (!inp) return;
      var v = inp.value.trim(); if (!v) return;
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      pl.months[monthKey].goals.push({text:v, done:false});
      window.savePlanner(pl);
      inp.value = '';
      refreshBody('left');
    };
    window.addYearGoal = function(y){
      var inp = document.getElementById('newYearGoalInput'); if (!inp) return;
      var v = inp.value.trim(); if (!v) return;
      var pl = window.loadPlannerNew();
      if (!pl.years) pl.years = {};
      if (!pl.years[y]) pl.years[y] = {goals:[]};
      pl.years[y].goals.push({text:v, done:false});
      window.savePlanner(pl);
      inp.value = '';
      refreshBody('left');
    };

    /* ========== پنل راست ========== */
    window.renderPanelForPlanner = function(){
      var p = getProfile();
      var titleEl = document.getElementById('panelTitleText');
      var subEl = document.getElementById('panelSubText');
      if (titleEl) titleEl.textContent = 'برنامه‌ریزی';
      if (subEl) subEl.textContent = p.name ? ('خوش آمدی ' + p.name + ' 👋') : 'خوش آمدی 👋';
      var tab = getTab();
      var tabs = [
        {id:'daily', label:'روزانه', icon:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'},
        {id:'weekly', label:'هفتگی', icon:'<path d="M3 21h18"/><path d="M5 21v-6M9 21v-10M13 21v-7M17 21v-13M21 21v-4"/>'},
        {id:'monthly', label:'ماهانه', icon:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/>'},
        {id:'yearly', label:'سالانه', icon:'<path d="M3 20h18"/><path d="m7 20 5-14 5 14"/><path d="M9.5 13h5"/>'}
      ];
      var tabsHTML = '<div class="panel-planner-tabs">'+tabs.map(function(t){
        return '<button class="panel-planner-tab'+(t.id===tab?' active':'')+'" onclick="window.switchPlannerTab(\''+t.id+'\')"><svg viewBox="0 0 24 24">'+t.icon+'</svg><span>'+t.label+'</span></button>';
      }).join('')+'</div>';
      var panelContent = document.getElementById('panelContent');
      if (!panelContent) return;
      panelContent.innerHTML = tabsHTML +
        '<button onclick="window.__openStudy()" class="panel-study-btn" style="margin-top:14px">' +
          '<svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.8;flex-shrink:0"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '<div style="text-align:right;flex:1"><div>حالت مطالعه</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">با تایمر و تمرکز</div></div>' +
          '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.2"><path d="m9 18 6-6-6-6"/></svg>' +
        '</button>' +
        '<div class="panel-card guide-card" style="margin-top:14px">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>راهنما</span></div>' +
          '<div class="guide-list">' +
            '<div class="guide-item"><span>✨</span>روی حالت مطالعه بزن</div>' +
            '<div class="guide-item"><span>📚</span>یه کار انتخاب کن</div>' +
            '<div class="guide-item"><span>⏱️</span>زمان تنظیم کن</div>' +
            '<div class="guide-item"><span>🎯</span>تا آخر قفلی</div>' +
            '<div class="guide-item"><span>🔔</span>توی تقویم یادآور بذار</div>' +
          '</div>' +
        '</div>';
    };

    /* ========== Sound — بهبودیافته ★ ========== */
    var audioCtx = null, audioNodes = null, currentSound = null, masterGain = null;

    function stopAudio(){
      if (audioNodes && audioNodes.nodes){
        audioNodes.nodes.forEach(function(n){ try{ if (n.stop) n.stop(); }catch(e){} try{ n.disconnect(); }catch(e){} });
      }
      if (audioNodes && audioNodes.loop) clearInterval(audioNodes.loop);
      if (audioNodes && audioNodes.gain){ try{ audioNodes.gain.disconnect(); }catch(e){} }
      audioNodes = null; currentSound = null;
    }

    /* ★ تولید صدای موج دریا — با LFO روی فیلتر + نویز صورتی ★ */
    function makeOceanSound(masterGain){
      var ctx = audioCtx;
      var nodes = [];
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      gain.gain.value = 0.22;
      filter.connect(gain); gain.connect(masterGain);
      filter.type = 'lowpass'; filter.frequency.value = 500; filter.Q.value = 0.5;

      /* نویز صورتی */
      var bs = ctx.sampleRate * 4;
      var buf = ctx.createBuffer(1, bs, ctx.sampleRate);
      var data = buf.getChannelData(0);
      var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (var i=0;i<bs;i++){
        var white = Math.random()*2-1;
        b0 = 0.99886*b0 + white*0.0555179;
        b1 = 0.99332*b1 + white*0.0750759;
        b2 = 0.96900*b2 + white*0.1538520;
        b3 = 0.86650*b3 + white*0.3104856;
        b4 = 0.55000*b4 + white*0.5329522;
        b5 = -0.7616*b5 - white*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362)*0.11;
        b6 = white*0.115926;
      }
      var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      filter.type='lowpass'; filter.frequency.value=600; filter.Q.value=0.7;

      /* موج‌های آروم (LFO) */
      var lfo1 = ctx.createOscillator(), lfoG1 = ctx.createGain();
      lfo1.frequency.value = 0.07; lfoG1.gain.value = 250;
      lfo1.connect(lfoG1); lfoG1.connect(filter.frequency);

      var lfo2 = ctx.createOscillator(), lfoG2 = ctx.createGain();
      lfo2.frequency.value = 0.05; lfoG2.gain.value = 0.1;
      lfo2.connect(lfoG2); lfoG2.connect(gain.gain);

      src.connect(filter);
      lfo1.start(); lfo2.start(); src.start();
      nodes.push(src, lfo1, lfoG1, lfo2, lfoG2);
      return {nodes:nodes, gain:gain, filter:filter};
    }

    /* ★ تولید صدای جنگل — نویز پایه + چهچهه پرنده ★ */
    function makeForestSound(masterGain){
      var ctx = audioCtx;
      var nodes = [];
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      gain.gain.value = 0.16;
      filter.connect(gain); gain.connect(masterGain);
      filter.type = 'bandpass'; filter.frequency.value = 1200; filter.Q.value = 0.3;

      var bs = ctx.sampleRate * 4;
      var buf = ctx.createBuffer(1, bs, ctx.sampleRate);
      var d = buf.getChannelData(0);
      var last = 0;
      for (var i=0;i<bs;i++){
        var w = Math.random()*2-1;
        d[i] = (last + 0.02*w)/1.02; last = d[i]; d[i] *= 2.2;
      }
      var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      src.connect(filter); src.start();
      nodes.push(src);

      /* ★ چهچهه پرنده — واریاسیون طبیعی ★ */
      function scheduleBird(){
        if (!audioNodes || currentSound !== 'forest') return;
        var t = ctx.currentTime + 0.05 + Math.random()*0.2;
        var noteCount = 2 + Math.floor(Math.random()*4);
        var baseF = 2000 + Math.random()*1800;
        for (var n=0;n<noteCount;n++){
          var osc = ctx.createOscillator(), env = ctx.createGain();
          osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
          var startT = t + n*(0.05 + Math.random()*0.04);
          var dur = 0.05 + Math.random()*0.08;
          var fStart = baseF + (Math.random()-0.5)*400;
          var fEnd = fStart + (Math.random()-0.5)*600;
          osc.frequency.setValueAtTime(fStart, startT);
          osc.frequency.exponentialRampToValueAtTime(Math.max(400, fEnd), startT+dur);
          env.gain.setValueAtTime(0, startT);
          env.gain.linearRampToValueAtTime(0.05 + Math.random()*0.03, startT+0.01);
          env.gain.exponentialRampToValueAtTime(0.001, startT+dur);
          osc.connect(env); env.connect(masterGain);
          osc.start(startT); osc.stop(startT+dur+0.02);
        }
        /* گاهی گروه دوم */
        if (Math.random() > 0.55){
          setTimeout(scheduleBird, 400 + Math.random()*600);
        }
      }
      var birdLoop = setInterval(function(){
        if (!audioNodes || currentSound !== 'forest'){ clearInterval(birdLoop); return; }
        if (Math.random() > 0.35) scheduleBird();
      }, 2200);
      return {nodes:nodes, gain:gain, filter:filter, loop:birdLoop};
    }

    /* ★ صدای سالن سکوت — همهمه ملایم ★ */
    function makeHallSound(masterGain){
      var ctx = audioCtx;
      var nodes = [];
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      gain.gain.value = 0.14;
      filter.connect(gain); gain.connect(masterGain);
      filter.type = 'lowpass'; filter.frequency.value = 300;

      var bs = ctx.sampleRate * 3;
      var buf = ctx.createBuffer(1, bs, ctx.sampleRate);
      var d = buf.getChannelData(0); var lv = 0;
      for (var i=0;i<bs;i++){ var w = Math.random()*2-1; d[i]=(lv+0.008*w)/1.008; lv=d[i]; d[i]*=2.2; }
      var src = ctx.createBufferSource(); src.buffer=buf; src.loop=true;

      var osc = ctx.createOscillator(), oscG = ctx.createGain();
      osc.type='sine'; osc.frequency.value=90; oscG.gain.value=0.035;
      osc.connect(oscG); oscG.connect(gain);

      var osc2 = ctx.createOscillator(), oscG2 = ctx.createGain();
      osc2.type='sine'; osc2.frequency.value=135; oscG2.gain.value=0.02;
      osc2.connect(oscG2); oscG2.connect(gain);

      src.connect(filter); osc.start(); osc2.start(); src.start();
      nodes.push(src, osc, osc2, oscG, oscG2);
      return {nodes:nodes, gain:gain, filter:filter};
    }

    /* ★ صدای بارش — لایه‌ای با رعد ملایم ★ */
    function makeRainSound(masterGain){
      var ctx = audioCtx;
      var nodes = [];
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();
      gain.gain.value = 0.18;
      filter.connect(gain); gain.connect(masterGain);
      filter.type='bandpass'; filter.frequency.value=800; filter.Q.value=0.4;

      var bs = ctx.sampleRate * 2;
      var buf = ctx.createBuffer(1, bs, ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i=0;i<bs;i++) d[i] = (Math.random()*2-1)*0.5;
      var src = ctx.createBufferSource(); src.buffer=buf; src.loop=true;

      /* لایه‌ی دوم — چکه‌ها */
      var bs2 = ctx.sampleRate * 2;
      var buf2 = ctx.createBuffer(1, bs2, ctx.sampleRate);
      var d2 = buf2.getChannelData(0); var last=0;
      for (var j=0;j<bs2;j++){ var w=Math.random()*2-1; d2[j]=(last + 0.03*w)/1.03; last=d2[j]; d2[j]*=2; }
      var src2 = ctx.createBufferSource(); src2.buffer=buf2; src2.loop=true;
      var filter2 = ctx.createBiquadFilter();
      filter2.type='highpass'; filter2.frequency.value=1200;

      src.connect(filter); src2.connect(filter2); filter2.connect(gain);
      src.start(); src2.start();
      nodes.push(src, src2, filter2);

      /* رعد ملایم گاهی */
      var thunderLoop = setInterval(function(){
        if (!audioNodes || currentSound !== 'rain'){ clearInterval(thunderLoop); return; }
        if (Math.random() > 0.7){
          var t = ctx.currentTime;
          var tOsc = ctx.createOscillator(), tGain = ctx.createGain();
          tOsc.type='sine';
          tOsc.frequency.setValueAtTime(80, t);
          tOsc.frequency.exponentialRampToValueAtTime(35, t+0.8);
          tGain.gain.setValueAtTime(0, t);
          tGain.gain.linearRampToValueAtTime(0.08, t+0.05);
          tGain.gain.exponentialRampToValueAtTime(0.001, t+0.9);
          tOsc.connect(tGain); tGain.connect(masterGain);
          tOsc.start(t); tOsc.stop(t+1);
        }
      }, 8000);

      return {nodes:nodes, gain:gain, filter:filter, loop:thunderLoop};
    }

    function makeNoise(type){
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (!masterGain){ masterGain = audioCtx.createGain(); masterGain.gain.value = 0.4; masterGain.connect(audioCtx.destination); }
      stopAudio();
      var res;
      if (type === 'nature') res = makeOceanSound(masterGain);
      else if (type === 'forest') res = makeForestSound(masterGain);
      else if (type === 'hall') res = makeHallSound(masterGain);
      else if (type === 'rain') res = makeRainSound(masterGain);
      if (res){
        audioNodes = res;
        currentSound = type;
      }
    }
    function setMasterVolume(v){ if (masterGain) masterGain.gain.value = v; }

    /* ========== Study ========== */
    function loadStudyChat(){ try{ return JSON.parse(sessionStorage.getItem(STUDY_CHAT_KEY) || '[]'); }catch(e){ return []; } }
    function saveStudyChat(){ try{ sessionStorage.setItem(STUDY_CHAT_KEY, JSON.stringify(studyChatHistory)); }catch(e){} }
    function clearStudyChat(){ studyChatHistory = []; try{ sessionStorage.removeItem(STUDY_CHAT_KEY); }catch(e){} }
    studyChatHistory = loadStudyChat();

    var studyTimer = null, studySeconds = 0, studyRunning = false, studyPaused = false, studyTotalMinutes = 0;

    function buildStudyOverlay(){
      var old = document.getElementById('studyOverlay'); if (old) old.remove();
      var pl = window.loadPlannerNew();
      var todayKey = window.dateKey(new Date());
      var ddToday = window.getDayData(pl, todayKey);
      var allTasks = (ddToday.tasks||[]).filter(function(tk){ return !tk.done; }).map(function(tk){
        return { id: tk.id, title: tk.title, dayKey: todayKey };
      });
      var hasTasks = allTasks.length > 0;
      var taskFieldHTML = hasTasks
        ? '<div class="siraj-select" id="studyTaskSelect" style="width:100%"><div class="siraj-select-trigger" style="width:100%"><span class="siraj-select-value">'+(window.__studyTask?esc(window.__studyTask):'— یک کار از امروز (اختیاری) —')+'</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div><div class="siraj-select-panel" style="width:100%;min-width:100%">'+allTasks.map(function(tk){ return '<div class="siraj-select-item'+(window.__studyTask===tk.title?' active':'')+'" data-value="'+esc(tk.title)+'" data-id="'+esc(tk.id)+'" data-day="'+esc(tk.dayKey)+'"><span>'+esc(tk.title)+'</span></div>'; }).join('')+'</div></div>'
        : '<div class="study-empty-box">📝 کاری برای امروز نداری</div>';
      var el = document.createElement('div');
      el.id = 'studyOverlay'; el.className = 'study-overlay';
      el.innerHTML =
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          taskFieldHTML +
          '<div class="stp-wrap" id="studyTimePicker"><div class="stp-hint">↑ بکش بالا / ↓ پایین</div><span class="stp-num" id="studyTimeNum">'+toFa(25)+'</span></div>' +
          '<div class="study-music-section"><div class="study-music-title"><span>🎵 صدای محیطی</span></div>' +
            '<div class="study-sound-grid">' +
              '<button class="study-sound-btn" data-sound="nature"><span class="ss-icon">🌊</span><span>موج دریا</span></button>' +
              '<button class="study-sound-btn" data-sound="forest"><span class="ss-icon">🌳</span><span>جنگل</span></button>' +
              '<button class="study-sound-btn" data-sound="hall"><span class="ss-icon">🌙</span><span>سکوت گرم</span></button>' +
              '<button class="study-sound-btn" data-sound="rain"><span class="ss-icon">☔</span><span>بارش</span></button>' +
              '<button class="study-sound-btn off-btn on" data-sound=""><span class="ss-icon">🔇</span><span>خاموش</span></button>' +
            '</div>' +
            '<div class="study-volume-row"><input type="range" min="0" max="100" value="40" id="studyVolume" style="--vp:40%"></div>' +
          '</div>' +
          '<div class="study-actions"><button class="study-btn" id="studyStartBtn">شروع مطالعه</button><button class="study-btn secondary" id="studyCancelBtn">لغو</button></div>' +
        '</div>' +
        '<div id="studyRunning" class="study-setup" style="display:none">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-mode-badge">🎯 در حال تمرکز</div>' +
          '<div class="study-timer" id="studyTimer">' +
            '<span class="study-digit" data-k="m1">۰</span><span class="study-digit" data-k="m2">۰</span><span class="study-colon">:</span><span class="study-digit" data-k="s1">۰</span><span class="study-digit" data-k="s2">۰</span>' +
          '</div>' +
          '<div class="study-task" id="studyTaskName">—</div>' +
          '<div id="studyNowPlaying" style="display:none"><span class="study-now-playing">در حال پخش</span></div>' +
          '<div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn pause-mode" id="studyPauseBtn"><span id="studyPauseLabel">توقف</span></button>' +
            '<button class="study-btn" id="studyChatBtn">مطالعه با سراج</button>' +
            '<button class="study-btn finish-mode" id="studyFinishBtn" disabled>پایان و ثبت</button>' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      var picker = el.querySelector('#studyTimePicker');
      var numEl = el.querySelector('#studyTimeNum');
      var pickerVal = 25, dragStartY = 0, dragStartVal = 25, dragging = false;
      function setPV(v){
        pickerVal = Math.max(1, Math.min(180, Math.round(v)));
        numEl.textContent = formatMinutes(pickerVal);
      }
      function pd(e){ dragging = true; dragStartY = (e.touches?e.touches[0].clientY:e.clientY); dragStartVal = pickerVal; picker.classList.add('dragging'); e.preventDefault(); }
      function pm(e){ if (!dragging) return; var y = (e.touches?e.touches[0].clientY:e.clientY); setPV(dragStartVal + Math.round((dragStartY-y)/6)); }
      function pu(){ if (!dragging) return; dragging = false; picker.classList.remove('dragging'); }
      picker.addEventListener('mousedown', pd);
      document.addEventListener('mousemove', pm);
      document.addEventListener('mouseup', pu);
      picker.addEventListener('touchstart', pd, {passive:false});
      document.addEventListener('touchmove', pm, {passive:false});
      document.addEventListener('touchend', pu);
      window.__studyMinutesGetter = function(){ return pickerVal; };

      el.querySelectorAll('.study-sound-btn').forEach(function(btn){
        btn.onclick = function(){
          var snd = btn.getAttribute('data-sound');
          el.querySelectorAll('.study-sound-btn').forEach(function(b){ b.classList.remove('on'); });
          if (!snd){ stopAudio(); btn.classList.add('on'); return; }
          btn.classList.add('on');
          try{ makeNoise(snd); }catch(e){}
        };
      });
      var vol = el.querySelector('#studyVolume');
      if (vol){ vol.oninput = function(){ var pct = this.value; this.style.setProperty('--vp', pct+'%'); setMasterVolume(pct/100); }; }

      var taskSel = el.querySelector('#studyTaskSelect');
      if (taskSel){
        var trig = taskSel.querySelector('.siraj-select-trigger');
        trig.onclick = function(e){
          e.stopPropagation();
          var was = taskSel.classList.contains('open');
          document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
          if (!was) taskSel.classList.add('open');
        };
        taskSel.querySelectorAll('.siraj-select-item').forEach(function(it){
          it.onclick = function(e){
            e.stopPropagation();
            var v = it.getAttribute('data-value');
            var id = it.getAttribute('data-id');
            var dk = it.getAttribute('data-day');
            window.__studyTask = v;
            /* ★ مهم: source ID رو هم ست کن تا بتونیم بعداً تسک رو done کنیم ★ */
            window.__studyTaskSourceId = id || null;
            window.__studyTaskSourceDay = dk || null;
            taskSel.querySelector('.siraj-select-value').textContent = v;
            taskSel.classList.remove('open');
          };
        });
      }

      el.querySelector('#studyStartBtn').onclick = startStudy;
      el.querySelector('#studyCancelBtn').onclick = function(){ stopAudio(); closeStudy(); };
      el.querySelector('#studyExitBtn').onclick = exitStudyConfirm;
      el.querySelector('#studyChatBtn').onclick = toggleStudyChat;
      el.querySelector('#studyPauseBtn').onclick = toggleStudyPause;
      el.querySelector('#studyFinishBtn').onclick = finishAndRecord;
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay'); if (!overlay) return;
      var task = window.__studyTask || '';
      var mins = window.__studyMinutesGetter ? window.__studyMinutesGetter() : 25;
      if (!mins || mins < 1) mins = 25;
      if (mins > 180) mins = 180;
      studySeconds = mins * 60;
      studyTotalMinutes = mins;
      studyRunning = true; studyPaused = false;
      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      overlay.querySelector('#studyTaskName').textContent = task || 'مطالعه آزاد';
      overlay.classList.remove('paused');
      /* ★ دکمه پایان غیرفعال تا تموم شدن ★ */
      var fb = overlay.querySelector('#studyFinishBtn');
      if (fb) fb.disabled = true;
      if (currentSound){
        var np = overlay.querySelector('#studyNowPlaying');
        if (np){
          var names = {nature:'موج دریا 🌊', forest:'جنگل 🌳', hall:'سکوت گرم 🌙', rain:'بارش ملایم ☔'};
          np.querySelector('.study-now-playing').textContent = names[currentSound] || 'در حال پخش';
          np.style.display = 'block';
        }
      }
      updateStudyTimer(true);
      startStudyTimer();
      lockSite();
    }
    function elapsedMinutes(){ return Math.max(1, studyTotalMinutes - Math.floor(studySeconds/60)); }
    function markSourceTaskDone(){
      if (!window.__studyTaskSourceId || !window.__studyTaskSourceDay){
        console.warn('[Study] No source task to mark done');
        return;
      }
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, window.__studyTaskSourceDay);
      var idx = (dd.tasks||[]).findIndex(function(tk){ return tk.id === window.__studyTaskSourceId; });
      if (idx >= 0){
        dd.tasks[idx].done = true;
        dd.tasks[idx].studiedMinutes = elapsedMinutes();
        window.savePlanner(pl);
        console.log('[Study] Task marked done with', elapsedMinutes(), 'min');
      } else {
        console.warn('[Study] Task not found:', window.__studyTaskSourceId);
      }
    }
    function startStudyTimer(){
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = setInterval(function(){
        if (studyPaused) return;
        studySeconds--;
        updateStudyTimer(false);
        if (studySeconds <= 0){
          clearInterval(studyTimer); studyTimer = null; studyRunning = false;
          /* ★ الان دکمه پایان فعاله ★ */
          var fb = document.getElementById('studyFinishBtn');
          if (fb) fb.disabled = false;
          stopAudio();
          /* پخش صدای پایان */
          try{
            if (audioCtx){
              var o = audioCtx.createOscillator(), g = audioCtx.createGain();
              o.type='sine'; o.frequency.value=880;
              g.gain.setValueAtTime(0, audioCtx.currentTime);
              g.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime+0.05);
              g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.8);
              o.connect(g); g.connect(audioCtx.destination);
              o.start(); o.stop(audioCtx.currentTime+0.85);
            }
          }catch(e){}
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد. دکمه‌ی پایان و ثبت رو بزن.');
        }
      }, 1000);
    }
    function toggleStudyPause(){
      var overlay = document.getElementById('studyOverlay'); if (!overlay) return;
      studyPaused = !studyPaused;
      var btn = overlay.querySelector('#studyPauseBtn');
      var lbl = overlay.querySelector('#studyPauseLabel');
      var sub = overlay.querySelector('#studyRunningSub');
      if (studyPaused){
        overlay.classList.add('paused');
        if (btn){ btn.classList.remove('pause-mode'); btn.classList.add('resume-mode'); }
        if (lbl) lbl.textContent = 'ادامه';
        if (masterGain) try{ masterGain.gain.value = 0; }catch(e){}
        if (sub) sub.textContent = '⏸️ متوقف شده';
      } else {
        overlay.classList.remove('paused');
        if (btn){ btn.classList.remove('resume-mode'); btn.classList.add('pause-mode'); }
        if (lbl) lbl.textContent = 'توقف';
        var vol = overlay.querySelector('#studyVolume');
        var v = vol ? (parseInt(vol.value)/100) : 0.4;
        if (masterGain) try{ masterGain.gain.value = v; }catch(e){}
        if (sub) sub.textContent = 'تا اتمام تایمر نمیتونی خارج شی 💪';
      }
    }
    function setDigit(k, val, animate){
      var el = document.querySelector('.study-digit[data-k="'+k+'"]'); if (!el) return;
      var faVal = toFa(val);
      if (el.textContent === faVal) return;
      if (animate){ el.classList.remove('roll'); void el.offsetWidth; el.classList.add('roll'); }
      el.textContent = faVal;
    }
    function updateStudyTimer(initial){
      if (studySeconds < 0) studySeconds = 0;
      var m = Math.floor(studySeconds/60), s = studySeconds%60;
      var mStr = (m<10?'0':'')+m;
      var sStr = (s<10?'0':'')+s;
      var an = !initial;
      setDigit('m1', mStr[0], an); setDigit('m2', mStr[1], an);
      setDigit('s1', sStr[0], an); setDigit('s2', sStr[1], an);
    }
    function finishAndRecord(){
      var mins = elapsedMinutes();
      var srcDay = window.__studyTaskSourceDay;
      var srcTitle = window.__studyTask;
      markSourceTaskDone();
      if (srcTitle){
        showPopup('🏆', 'کار انجام شد!', 'کار «'+srcTitle+'» با '+formatMinutes(mins)+' مطالعه ثبت شد.');
      } else {
        showPopup('✨', 'خوب بود!', formatMinutes(mins)+' مطالعه ثبت شد.');
      }
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null; studyRunning = false;
      window.__studyTask=''; window.__studyTaskSourceId=null; window.__studyTaskSourceDay=null;
      clearStudyChat(); stopAudio(); unlockSite(); closeStudy();
      if (srcDay) setTimeout(function(){ maybeCelebrate(srcDay); }, 500);
    }
    function exitStudyConfirm(){
      if (!confirm('مطمئنی خارج شی؟ (زمانت ثبت نمیشه)')) return;
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null; studyRunning = false;
      window.__studyTask=''; window.__studyTaskSourceId=null; window.__studyTaskSourceDay=null;
      stopAudio(); unlockSite(); closeStudy();
    }
    function closeStudy(){
      try{ stopAudio(); }catch(e){}
      var overlay = document.getElementById('studyOverlay');
      var chat = document.getElementById('studyChatPanel');
      if (chat) chat.remove();
      if (!overlay) return;
      overlay.classList.remove('open');
      setTimeout(function(){ overlay.remove(); }, 500);
      setTimeout(function(){
        if (typeof window.renderPanelForPlanner === 'function') window.renderPanelForPlanner();
        refreshBody('left');
      }, 300);
    }
    function blockKey(e){
      if (!studyRunning) return;
      var k = e.key || '';
      var ctrl = e.ctrlKey || e.metaKey;
      if (k==='F5'||k==='F11'||k==='Escape'||(ctrl&&['r','R','w','W','n','N','t','T','p','P'].indexOf(k)>=0)){
        e.preventDefault(); e.stopPropagation(); return false;
      }
    }
    function blockContext(e){ if (studyRunning) e.preventDefault(); }
    function blockUnload(e){
      if (!studyRunning) return;
      e.preventDefault(); e.returnValue = 'در حال مطالعه‌ای!'; return e.returnValue;
    }
    function lockSite(){
      document.addEventListener('keydown', blockKey, true);
      document.addEventListener('contextmenu', blockContext, true);
      window.addEventListener('beforeunload', blockUnload);
    }
    function unlockSite(){
      document.removeEventListener('keydown', blockKey, true);
      document.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockUnload);
    }

    window.__openStudy = function(){
      buildStudyOverlay();
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      overlay.style.opacity = '0';
      overlay.style.transform = 'scale(.92) translateY(20px)';
      overlay.style.transition = 'none';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          overlay.style.transition = 'opacity .45s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.34,1.4,.64,1), visibility .45s';
          overlay.classList.add('open');
          overlay.style.opacity = '';
          overlay.style.transform = '';
        });
      });
    };

    function renderStudyChat(){
      var box = document.getElementById('studyChatMessages'); if (!box) return;
      var p = getProfile();
      var greeting = p.name ? 'سلام '+esc(p.name)+' 👋' : 'سلام 👋';
      var html = '<div class="sc-msg sc-bot">'+greeting+' من سراجم.</div>';
      studyChatHistory.forEach(function(m){
        if (m.role==='user') html += '<div class="sc-msg sc-user">'+esc(m.content)+'</div>';
        else if (m.role==='assistant') html += '<div class="sc-msg sc-bot">'+esc(m.content)+'</div>';
      });
      box.innerHTML = html;
      box.scrollTop = box.scrollHeight;
    }
    function toggleStudyChat(){
      var existing = document.getElementById('studyChatPanel');
      if (existing){ existing.classList.remove('open'); setTimeout(function(){ existing.remove(); }, 320); return; }
      var panel = document.createElement('div');
      panel.id = 'studyChatPanel'; panel.className = 'study-chat-panel';
      panel.innerHTML =
        '<div class="study-chat-header"><div class="study-chat-header-title">سراج — همیار مطالعه</div><button class="study-chat-close" id="studyChatCloseBtn">✕</button></div>' +
        '<div class="study-chat-messages" id="studyChatMessages"></div>' +
        '<div class="study-chat-input-row"><input type="text" class="study-chat-input" id="studyChatInput" placeholder="سؤالت رو بپرس..." onkeydown="if(event.key===\'Enter\')window.__studyChatSend()"><button class="study-chat-send" onclick="window.__studyChatSend()">➤</button></div>';
      document.body.appendChild(panel);
      panel.querySelector('#studyChatCloseBtn').onclick = function(){ panel.classList.remove('open'); setTimeout(function(){ panel.remove(); }, 320); };
      renderStudyChat();
      requestAnimationFrame(function(){ panel.classList.add('open'); });
      setTimeout(function(){ var i = document.getElementById('studyChatInput'); if (i) i.focus(); }, 350);
    }
    window.__studyChatSend = async function(){
      var inp = document.getElementById('studyChatInput');
      var box = document.getElementById('studyChatMessages');
      if (!inp || !box) return;
      var q = inp.value.trim(); if (!q) return;
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-user">'+esc(q)+'</div>');
      inp.value=''; box.scrollTop = box.scrollHeight;
      studyChatHistory.push({role:'user', content:q}); saveStudyChat();
      var tid = 'sct_' + Date.now();
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="'+tid+'">💭 ...</div>');
      box.scrollTop = box.scrollHeight;
      var sysPrompt = 'تو «سراج» هستی.\n\n'+profilePrompt();
      try{
        var res = await fetch(getBaseURL(), {
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
          body: JSON.stringify({ model:getModel(), messages:[{role:'system',content:sysPrompt}].concat(studyChatHistory.slice(-10)), temperature:0.7, stream:true })
        });
        var te = document.getElementById(tid);
        if (!res.ok){ if (te) te.textContent = 'خطا ('+res.status+')'; return; }
        if (te) te.remove();
        var botId = 'scb_' + Date.now();
        box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="'+botId+'"></div>');
        var botEl = document.getElementById(botId);
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '', full = '';
        while(true){
          var r = await reader.read(); if (r.done) break;
          buf += dec.decode(r.value, {stream:true});
          var lines = buf.split('\n'); buf = lines.pop();
          for (var i=0;i<lines.length;i++){
            var tr = lines[i].trim();
            if (!tr.startsWith('data:')) continue;
            var dd = tr.slice(5).trim();
            if (!dd || dd === '[DONE]') continue;
            try{
              var j = JSON.parse(dd);
              var delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
              if (delta){ full += delta; botEl.textContent = full; box.scrollTop = box.scrollHeight; }
            }catch(e){}
          }
        }
        studyChatHistory.push({role:'assistant', content: full}); saveStudyChat();
      }catch(err){ var t2 = document.getElementById(tid); if (t2) t2.textContent = 'خطا: ' + err.message; }
    };

    /* ========== Community + Blog ========== */
    function blogHTML(){
      return '<div class="page-title-bar"><div class="page-title-text">مقالات سراج</div></div>' +
        '<div class="community-hero">' +
          '<div class="community-icon"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg></div>' +
          '<div class="community-title">مقالات سراج</div>' +
          '<div class="community-desc">اینجا قراره مطالب آموزشی، تحلیل‌های ادبی، نکات دستوری و یادداشت‌های کوتاه درباره‌ی زبان و ادبیات عربی منتشر بشه. اگه دنبال یادگیری عمیق‌تر و مطالب بیشتر هستی، این بخش رو از دست نده.</div>' +
          '<div class="community-badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>به‌زودی راه‌اندازی می‌شه</div>' +
        '</div>';
    }
    function communityHTML(){
      return '<div class="page-title-bar"><div class="page-title-text">انجمن سراج</div></div>' +
        '<div class="community-hero">' +
          '<div class="community-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>' +
          '<div class="community-title">انجمن گفتگوی سراج</div>' +
          '<div class="community-desc">یه فضای صمیمی که کاربرا، مدرسین و من بتونیم با هم درباره‌ی عربی، ادبیات، برنامه‌ریزی درسی و یادگیری حرف بزنیم. اینجا جای کامنت و پرسش و گفتگوست، نه چت خصوصی.</div>' +
          '<div class="community-badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>به‌زودی راه‌اندازی می‌شه</div>' +
        '</div>';
    }

    function fillViews(){
      var blog = document.getElementById('view-blog');
      if (blog && blog.classList.contains('active') && !blog.querySelector('.community-hero')){
        blog.innerHTML = blogHTML();
      }
      var comm = document.getElementById('view-videos');
      if (comm && comm.classList.contains('active')){
        var hero = comm.querySelector('.community-hero');
        if (!hero){
          comm.innerHTML = communityHTML();
        } else {
          var desc = hero.querySelector('.community-desc');
          if (desc && desc.textContent.length < 40){
            comm.innerHTML = communityHTML();
          }
        }
      }
    }
    new MutationObserver(fillViews).observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class']});
    setTimeout(fillViews, 1500);
    setTimeout(fillViews, 2500);

    /* ★ راه‌های ارتباطی: کلیک‌پذیر + حذف دکمه کپی ★ */
    function linkifyContacts(){
      document.querySelectorAll('.contact-row-v2, .contact-row').forEach(function(row){
        if (row.tagName === 'A' || row.dataset.linkified === '1') return;
        row.dataset.linkified = '1';
        row.querySelectorAll('.contact-copy, [data-copy], .copy-btn').forEach(function(b){ b.remove(); });
        var labelEl = row.querySelector('.contact-label');
        var valueEl = row.querySelector('.contact-value');
        var label = (labelEl ? labelEl.textContent : '').trim();
        var value = (valueEl ? valueEl.textContent : '').trim();
        var v = value.replace(/^[@\s]+/,'').trim();
        var href = '';
        if (/تلگرام|telegram/i.test(label)) href = 'https://t.me/' + v;
        else if (/ایمیل|email|mail/i.test(label)) href = 'mailto:' + value;
        else if (/اینستاگرام|instagram|insta/i.test(label)) href = 'https://instagram.com/' + v;
        else if (/^X$|توییتر|twitter/i.test(label)) href = 'https://x.com/' + v;
        else if (/سایت|وب|website|site/i.test(label)) href = /^https?:/.test(value) ? value : ('https://' + value);
        if (href){
          row.style.cursor = 'pointer';
          row.setAttribute('role', 'link');
          row.setAttribute('tabindex', '0');
          var open = function(e){
            if (e.target.closest('a')) return;
            e.preventDefault();
            window.open(href, '_blank', 'noopener');
          };
          row.addEventListener('click', open);
          row.addEventListener('keydown', function(e){
            if (e.key === 'Enter' || e.key === ' ') open(e);
          });
        }
      });
    }
    new MutationObserver(linkifyContacts).observe(document.body, {childList:true, subtree:true});
    setTimeout(linkifyContacts, 800);
    setTimeout(linkifyContacts, 1800);
    setTimeout(linkifyContacts, 3000);

    /* ★ اقدامات هدر — فقط آواتار (قفل رو HTML داره) ★ */
    function injectMainTopActions(){
      var mainChat = document.querySelector('.main-chat');
      if (!mainChat) return;
      if (getComputedStyle(mainChat).position === 'static'){
        mainChat.style.position = 'relative';
      }
      var bar = mainChat.querySelector('#mainTopActions');
      if (!bar){
        bar = document.createElement('div');
        bar.id = 'mainTopActions';
        bar.className = 'main-top-actions';
        mainChat.insertBefore(bar, mainChat.firstChild);
      }
      var p = getProfile();
      var av = bar.querySelector('#mainProfileAvatar');
      if (!av){
        av = document.createElement('div');
        av.id = 'mainProfileAvatar';
        av.className = 'main-top-avatar';
        av.onclick = function(){
          if (typeof window.openSettings === 'function') window.openSettings();
        };
        bar.appendChild(av);
      }
      av.title = p.name ? p.name : 'مشخصات من';
      var avatarSrc = p.avatar || USER_AVATAR_URL;
      av.innerHTML = '<img src="'+avatarSrc+'" alt="">';

      var lk = bar.querySelector('#mainLockBtn');
      if (!lk){
        lk = document.createElement('button');
        lk.id = 'mainLockBtn';
        lk.className = 'main-top-icon-btn';
        lk.title = 'قفل کردن سایت';
        lk.innerHTML = '<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
        lk.onclick = function(){ if (typeof window.lockNow === 'function') window.lockNow(); };
        bar.appendChild(lk);
      }
    }
    setTimeout(injectMainTopActions, 500);
    setTimeout(injectMainTopActions, 1500);
    setTimeout(injectMainTopActions, 3000);

    function updateMainTopAvatar(){
      var av = document.getElementById('mainProfileAvatar'); if (!av) return;
      var p = getProfile();
      av.title = p.name ? p.name : 'مشخصات من';
      var avatarSrc = p.avatar || USER_AVATAR_URL;
      av.innerHTML = '<img src="'+avatarSrc+'" alt="">';
    }

    /* اسلایدر نوار */
    (function(){
      function ensureSlider(){
        var nav = document.getElementById('bottomNav'); if (!nav) return null;
        var slider = document.getElementById('navSlider');
        if (!slider){
          slider = document.createElement('div');
          slider.id = 'navSlider';
          slider.className = 'nav-slider';
          nav.insertBefore(slider, nav.firstChild);
        }
        return slider;
      }
      function moveSlider(animate){
        var nav = document.getElementById('bottomNav');
        var slider = ensureSlider();
        if (!nav || !slider) return;
        var active = document.querySelector('.bottom-nav-btn.active');
        if (!active){ slider.style.opacity = '0'; return; }
        if (active.classList.contains('nav-btn-chat')){ slider.style.opacity = '0'; return; }
        var navRect = nav.getBoundingClientRect();
        var btnRect = active.getBoundingClientRect();
        var pos = document.documentElement.getAttribute('data-nav-position') || 'bottom';
        var isVert = pos === 'left' || pos === 'right';
        var newLeft, newTop, newW, newH, newRadius;
        if (isVert){
          newLeft = 4; newW = navRect.width - 8;
          newTop = btnRect.top - navRect.top; newH = btnRect.height;
          newRadius = 16;
        } else {
          newLeft = btnRect.left - navRect.left; newTop = btnRect.top - navRect.top;
          newW = btnRect.width; newH = btnRect.height; newRadius = 19;
        }
        if (animate === false) slider.style.transition = 'none';
        slider.style.left = newLeft + 'px';
        slider.style.top = newTop + 'px';
        slider.style.width = newW + 'px';
        slider.style.height = newH + 'px';
        slider.style.borderRadius = newRadius + 'px';
        slider.style.opacity = '1';
        if (animate === false){ void slider.offsetWidth; slider.style.transition = ''; }
      }
      var timer = null;
      function schedule(animate, delay){
        if (timer) clearTimeout(timer);
        timer = setTimeout(function(){ moveSlider(animate); timer = null; }, delay == null ? 480 : delay);
      }
      window.__moveNavSlider = moveSlider;
      var navEl = document.getElementById('bottomNav');
      if (navEl){
        new MutationObserver(function(){ schedule(true, 480); }).observe(navEl, {attributes:true, attributeFilter:['class'], subtree:true});
      }
      new MutationObserver(function(){
        schedule(false, 100);
        schedule(true, 400);
      }).observe(document.documentElement, {attributes:true, attributeFilter:['data-nav-position']});
      window.addEventListener('resize', function(){ moveSlider(false); });
      setTimeout(function(){ moveSlider(false); }, 700);
      setTimeout(function(){ moveSlider(true); }, 1100);
    })();

    /* رنگ ساعت */
    setTimeout(function(){
      function colorizeHours(){
        var list = document.querySelector('.hours-list'); if (!list) return;
        list.querySelectorAll('.hour-row').forEach(function(row){
          var hLabel = row.querySelector('.hour-label span:last-child'); if (!hLabel) return;
          var hh = parseInt(hLabel.textContent,10); if (isNaN(hh)) return;
          row.classList.remove('time-morning','time-noon','time-afternoon','time-evening','time-night');
          if (hh >= 6 && hh < 12) row.classList.add('time-morning');
          else if (hh >= 12 && hh < 15) row.classList.add('time-noon');
          else if (hh >= 15 && hh < 18) row.classList.add('time-afternoon');
          else if (hh >= 18 && hh < 21) row.classList.add('time-evening');
          else row.classList.add('time-night');
        });
      }
      new MutationObserver(colorizeHours).observe(document.body, {childList:true, subtree:true});
      setTimeout(colorizeHours, 500);
    }, 200);

    console.log('[Siraj v2.0] planner loaded ✓ (v14)');
  }
})();
