/* Siraj v2.0 — planner-v2.js (Full v3) */
(function(){
  'use strict';
  var tries = 0;
  var boot = setInterval(function(){
    tries++;
    if (typeof window.renderPlanner === 'function' && typeof window.loadPlannerNew === 'function') {
      clearInterval(boot); init();
    }
    if (tries > 60) clearInterval(boot);
  }, 100);

  function init(){
    var STUDY_CHAT_KEY = 'siraj-study-chat-session';
    var PROFILE_KEY = 'siraj-profile';
    var studyChatHistory = [];

    /* ============ helpers ============ */
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
    function getProfile(){
      try{ return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}'); }catch(e){ return {}; }
    }
    function saveProfile(p){ try{ localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }catch(e){} }
    function profilePrompt(){
      var p = getProfile();
      if (!p.name && !p.bio) return '';
      var out = '\n\n👤 اطلاعات کاربر:\n';
      if (p.name) out += '• اسمش: ' + p.name + '\n';
      if (p.bio) out += '• درباره‌ی خودش گفته: ' + p.bio + '\n';
      out += 'می‌تونی تو جواب‌هات اسمش رو صدا بزنی و بهش اشاره کنی.';
      return out;
    }

    function getTab(){
      var btn = document.querySelector('.planner-tab.active');
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
      var day = parseInt(d.toLocaleDateString('en-US',{day:'numeric'}));
      return Math.ceil(day/7);
    }
    var ORD = ['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){ n=Math.max(1,Math.min(6,n)); return ORD[n-1]; }
    function myWeekDays(){
      var d = new Date(window.plannerDate || new Date());
      d.setHours(0,0,0,0);
      var day = d.getDay();
      var diff = (day+1)%7;
      d.setDate(d.getDate() - diff);
      var days = [];
      for (var i=0;i<7;i++){
        var dt = new Date(d);
        dt.setDate(d.getDate() + i);
        days.push({
          key: window.dateKey(dt),
          name: window.getDayName(dt),
          date: dt.toLocaleDateString('fa-IR',{month:'short',day:'numeric'}),
          dateObj: dt
        });
      }
      return days;
    }

    /* ============ Popup ============ */
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
        '<button class="siraj-popup-btn" id="sirajPopupOk">متوجه شدم</button></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      el.querySelector('#sirajPopupOk').onclick = function(){
        el.classList.remove('open');
        setTimeout(function(){ if (el.parentNode) el.remove(); }, 320);
      };
    }
    function showConfirm(emoji, title, text, onYes, yesText, noText){
      var old = document.getElementById('sirajConfirmPopup');
      if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajConfirmPopup';
      el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup">' +
        '<span class="siraj-popup-emoji">' + emoji + '</span>' +
        '<div class="siraj-popup-title">' + title + '</div>' +
        '<div class="siraj-popup-text">' + text + '</div>' +
        '<div class="siraj-popup-actions">' +
          '<button class="siraj-popup-btn secondary" id="sirajConfirmNo">' + (noText||'نه') + '</button>' +
          '<button class="siraj-popup-btn" id="sirajConfirmYes">' + (yesText||'بله') + '</button>' +
        '</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ if (el.parentNode) el.remove(); }, 320); };
      el.querySelector('#sirajConfirmYes').onclick = function(){ close(); if (onYes) onYes(); };
      el.querySelector('#sirajConfirmNo').onclick = close;
    }
    function showTriple(emoji, title, text, opt1, opt2, opt3){
      var old = document.getElementById('sirajTriplePopup');
      if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'sirajTriplePopup';
      el.className = 'siraj-popup-overlay';
      el.innerHTML = '<div class="siraj-popup">' +
        '<span class="siraj-popup-emoji">' + emoji + '</span>' +
        '<div class="siraj-popup-title">' + title + '</div>' +
        '<div class="siraj-popup-text">' + text + '</div>' +
        '<div class="siraj-popup-actions-3">' +
          '<button class="siraj-popup-btn secondary" id="sirajTriple1">' + opt1.text + '</button>' +
          '<button class="siraj-popup-btn secondary" id="sirajTriple2">' + opt2.text + '</button>' +
          '<button class="siraj-popup-btn" id="sirajTriple3">' + opt3.text + '</button>' +
        '</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ if (el.parentNode) el.remove(); }, 320); };
      el.querySelector('#sirajTriple1').onclick = function(){ close(); if (opt1.onClick) opt1.onClick(); };
      el.querySelector('#sirajTriple2').onclick = function(){ close(); if (opt2.onClick) opt2.onClick(); };
      el.querySelector('#sirajTriple3').onclick = function(){ close(); if (opt3.onClick) opt3.onClick(); };
    }

    /* ============ Select سفارشی ============ */
    function makeSelect(id, value, options, label){
      var cur = options.find(function(o){return o.value === value;}) || options[0];
      var items = options.map(function(o){
        return '<div class="siraj-select-item ' + (o.value === value ? 'active' : '') + '" data-value="' + o.value + '">' +
          (o.dot ? '<span class="dot ' + o.dot + '"></span>' : '') + '<span>' + esc(o.label) + '</span></div>';
      }).join('');
      return '<div class="siraj-select" id="' + id + '">' +
        (label ? '<div class="siraj-select-label">' + esc(label) + '</div>' : '') +
        '<div class="siraj-select-trigger"><span class="siraj-select-value">' +
        (cur.dot ? '<span class="dot ' + cur.dot + '"></span>' : '') + esc(cur.label) +
        '</span><svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></div>' +
        '<div class="siraj-select-panel">' + items + '</div></div>';
    }
    function bindSelects(root, handlers){
      if (!root) return;
      root.querySelectorAll('.siraj-select').forEach(function(sel){
        var trig = sel.querySelector('.siraj-select-trigger');
        if (!trig) return;
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

    /* ============ انیمیشن هوشمند ============ */
    function smartUpdateHero(tab, direction){
      var c = document.querySelector('.phc-center');
      if (!c) return;
      var d = new Date(window.plannerDate || new Date());
      var map = {};
      if (tab === 'daily'){
        var p = dateParts(d);
        map.weekday = p.weekday; map.dayNum = p.dayNum;
        map.monthName = p.monthName; map.yearNum = p.yearNum;
      } else if (tab === 'weekly'){
        var days = myWeekDays();
        var p2 = dateParts(d);
        map.monthName2 = p2.monthName; map.yearNum2 = p2.yearNum;
        map.weekOrdinal = 'هفته ' + weekOrd(weekOfMonth()) + ' ماه';
        map.weekRange = 'از ' + days[0].date + ' تا ' + days[6].date;
      } else if (tab === 'monthly'){
        var p3 = dateParts(d);
        map.monthName3 = p3.monthName; map.yearNum3 = p3.yearNum;
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

    /* ============ ناوبری ============ */
    function moveDate(dir, unit){
      var d = new Date(window.plannerDate || new Date());
      if (unit === 'day') d.setDate(d.getDate() + dir);
      else if (unit === 'week') d.setDate(d.getDate() + dir * 7);
      else if (unit === 'month'){ d.setDate(1); d.setMonth(d.getMonth() + dir); }
      else if (unit === 'year') d.setFullYear(d.getFullYear() + dir);
      window.plannerDate = d;
      refreshBody(dir > 0 ? 'left' : 'right');
    }
    window.__navDay = function(dir){ moveDate(dir, 'day'); };
    window.__navWeek = function(dir){ moveDate(dir, 'week'); };
    window.__navMonth = function(dir){ moveDate(dir, 'month'); };
    window.__navYear = function(dir){ moveDate(dir, 'year'); };
    window.__goToday = function(){ window.plannerDate = new Date(); refreshBody('left'); };
    window.__goThisWeek = function(){ window.plannerDate = new Date(); refreshBody('left'); };
    window.__goThisMonth = function(){ window.plannerDate = new Date(); refreshBody('left'); };
    window.__goThisYear = function(){ window.plannerDate = new Date(); refreshBody('left'); };

    function refreshBody(direction){
      var tab = getTab();
      var pane = document.getElementById('plannerPane');
      if (!pane) return;
      var hero = pane.querySelector('.planner-hero-card');
      var body = pane.querySelector('.planner-body-content');
      if (!hero || !body){ renderPane(tab); return; }
      smartUpdateHero(tab, direction || 'left');
      body.style.transition = 'opacity .18s ease';
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
      }, 180);
    }
    window.__refreshCurrentTab = refreshBody;

    /* ============ تب‌ها ============ */
    window.switchPlannerTab = function(tab){
      document.querySelectorAll('.planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2, yearly:3}[tab];
      var btns = document.querySelectorAll('.planner-tab');
      if (btns[idx]) btns[idx].classList.add('active');
      renderPane(tab);
    };
    function renderPane(tab){
      var pane = document.getElementById('plannerPane');
      if (!pane) return;
      pane.innerHTML = '';
      void pane.offsetWidth;
      if (tab === 'daily') pane.innerHTML = viewDaily();
      else if (tab === 'weekly') pane.innerHTML = viewWeekly();
      else if (tab === 'monthly') pane.innerHTML = viewMonthly();
      else if (tab === 'yearly') pane.innerHTML = viewYearly();
      bindPaneEvents(tab);
    }
    window.renderPlannerPane = function(){ renderPane(getTab()); };
    function bindPaneEvents(tab){
      var pane = document.getElementById('plannerPane');
      if (!pane) return;
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
            var hint = document.getElementById('priorityHint');
            if (hint){
              var msgs = {high:'⚡ این کار مهمه! بهتره زودتر انجامش بدی.',med:'🟡 کار متوسط — عجله‌ای نیست.',low:'🟢 کار کم‌اهمیت — هر وقت شد.'};
              hint.textContent = msgs[val] || '';
              hint.style.display = 'block';
            }
          }
        });
      }
    }
    function ensureTabsClean(){
      var tabsEl = document.querySelector('.planner-tabs');
      if (!tabsEl) return;
      tabsEl.querySelectorAll('.planner-tab').forEach(function(b){
        var txt = b.textContent || '';
        if (txt.indexOf('کارها') >= 0 || b.getAttribute('data-ptab') === 'tasks') b.remove();
      });
      if (!tabsEl.querySelector('[data-ptab="yearly"]')){
        var yb = document.createElement('button');
        yb.className = 'planner-tab';
        yb.setAttribute('data-ptab','yearly');
        yb.setAttribute('onclick',"switchPlannerTab('yearly')");
        yb.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>سالانه</span>';
        tabsEl.appendChild(yb);
      }
    }

    /* ============ هیروها با دکمه بازگشت ============ */
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
          '<div class="phc-day"><span data-anim-key="weekday">' + esc(p.weekday) + '</span>' + (isToday ? ' <span class="phc-today">امروز</span>' : '') + '</div>' +
          '<div class="phc-date">' +
            '<span data-anim-key="dayNum">' + esc(p.dayNum) + '</span> ' +
            '<span data-anim-key="monthName">' + esc(p.monthName) + '</span> ' +
            '<span data-anim-key="yearNum">' + esc(p.yearNum) + '</span>' +
          '</div>' +
          (goal ? '<div class="phc-goal"><span>🎯</span><span>هدف ماه: ' + esc(goal.text) + '</span></div>' : '<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>') +
          (!isToday ? '<button class="phc-back-btn" onclick="window.__goToday()">↩ برو به امروز</button>' : '') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navDay(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }
    function heroWeekly(){
      var d = new Date(window.plannerDate || new Date());
      var days = myWeekDays();
      var p = dateParts(d);
      var now = new Date();
      var nowWeekStart = new Date(now); nowWeekStart.setHours(0,0,0,0);
      var dow = nowWeekStart.getDay(); var diff = (dow+1)%7;
      nowWeekStart.setDate(nowWeekStart.getDate() - diff);
      var isCurrentWeek = days[0].key === window.dateKey(nowWeekStart);
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navWeek(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="monthName2">' + esc(p.monthName) + '</span> <span data-anim-key="yearNum2">' + esc(p.yearNum) + '</span></div>' +
          '<div class="phc-date"><span data-anim-key="weekOrdinal">هفته ' + weekOrd(weekOfMonth()) + ' ماه</span> — <span data-anim-key="weekRange">از ' + esc(days[0].date) + ' تا ' + esc(days[6].date) + '</span></div>' +
          (!isCurrentWeek ? '<button class="phc-back-btn" onclick="window.__goThisWeek()">↩ برو به این هفته</button>' : '') +
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
      var isCurrentMonth = (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth());
      return '<div class="planner-hero-card">' +
        '<button class="phc-nav-btn" onclick="window.__navMonth(-1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '<div class="phc-center">' +
          '<div class="phc-day"><span data-anim-key="monthName3">' + esc(p.monthName) + '</span> <span data-anim-key="yearNum3">' + esc(p.yearNum) + '</span></div>' +
          '<div class="phc-date">' + doneGoals + ' از ' + goals.length + ' هدف این ماه انجام شده</div>' +
          (!isCurrentMonth ? '<button class="phc-back-btn" onclick="window.__goThisMonth()">↩ برو به این ماه</button>' : '') +
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
          '<div class="phc-day"><span data-anim-key="yearNum4">' + esc(d.toLocaleDateString('fa-IR',{year:'numeric'})) + '</span></div>' +
          '<div class="phc-date">' + done + ' از ' + goals.length + ' هدف سالانه انجام شده</div>' +
          (!isCurrentYear ? '<button class="phc-back-btn" onclick="window.__goThisYear()">↩ برو به امسال</button>' : '') +
        '</div>' +
        '<button class="phc-nav-btn" onclick="window.__navYear(1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '</div>';
    }

    /* ============ آمار هفته ============ */
    function weekStatsHTML(){
      var pl = window.loadPlannerNew();
      var days = myWeekDays();
      var studiedMin = 0, doneWithTime = 0, doneWithout = 0;
      days.forEach(function(day){
        var dd = window.getDayData(pl, day.key);
        (dd.tasks||[]).forEach(function(tk){
          if (tk.done){
            if (tk.studiedMinutes){ studiedMin += tk.studiedMinutes; doneWithTime++; }
            else doneWithout++;
          }
        });
      });
      if (!studiedMin && !doneWithTime && !doneWithout) return '';
      var h = Math.floor(studiedMin/60), m = studiedMin%60;
      var timeStr = h > 0 ? (h + ' س و ' + m + ' د') : (m + ' دقیقه');
      return '<div class="week-stats-bar">' +
        '<div class="wsb-item"><span>⏱️</span><b>' + timeStr + '</b> مطالعه این هفته</div>' +
        '<div class="wsb-item"><span>✅</span>' + doneWithTime + ' با زمان</div>' +
        (doneWithout > 0 ? '<div class="wsb-item warn"><span>⚪</span>' + doneWithout + ' بدون زمان</div>' : '') +
      '</div>';
    }

    /* ============ بدنه روزانه ============ */
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
        : '<div class="tasks-list">' + active.map(function(tk){
            var idx = allTasks.indexOf(tk);
            var pm = {high:'بالا',med:'متوسط',low:'پایین'};
            return '<div class="task-item pri-' + (tk.priority||'med') + '" onclick="window.__taskClick(event, \'' + key + '\', ' + idx + ')">' +
              '<button class="task-check" onclick="event.stopPropagation();window.__dToggleTask(' + idx + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
              '<div class="task-info"><div class="task-title">' + esc(tk.title) + '</div>' +
                '<div class="task-meta">' +
                  (tk.time ? '<span>🕐 ' + esc(tk.time) + '</span>' : '') +
                  '<span class="task-badge pri-' + (tk.priority||'med') + '">' + (pm[tk.priority]||'متوسط') + '</span>' +
                '</div></div>' +
              '<button class="task-del" onclick="event.stopPropagation();window.__dDeleteTask(' + idx + ')" title="حذف">' +
                '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
          }).join('') + '</div>';

      var doneHTML = done.length === 0
        ? '<div class="tasks-done-empty">هنوز کاری انجام ندادی</div>'
        : '<div class="tasks-list tasks-done-list">' + done.map(function(tk){
            var idx = allTasks.indexOf(tk);
            var timeBadge = tk.studiedMinutes
              ? '<span class="studied-badge">⏱️ ' + tk.studiedMinutes + ' د</span>'
              : '<span class="no-time-badge">⚪ بدون زمان</span>';
            return '<div class="task-item done pri-' + (tk.priority||'med') + '">' +
              '<button class="task-check checked" onclick="window.__dToggleTask(' + idx + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
              '<div class="task-info"><div class="task-title">' + esc(tk.title) + '</div>' +
                '<div class="task-meta">' + timeBadge + '</div></div>' +
              '<button class="task-del" onclick="window.__dDeleteTask(' + idx + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
          }).join('') + '</div>';

      var hourOpt = [{value:'',label:'ساعت (اختیاری)'}].concat(
        [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(function(h){
          return {value:h+':00 تا '+(h+1)+':00', label:'ساعت ' + h + ' تا ' + (h+1)};
        })
      );
      var priOpt = [
        {value:'high',label:'بالا',dot:'red'},
        {value:'med',label:'متوسط',dot:'yellow'},
        {value:'low',label:'پایین',dot:'green'}
      ];
      window.__pendingTime = '';
      window.__pendingPri = 'med';

      return weekStatsHTML() +
        '<div class="task-add-form">' +
          '<input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()">' +
          makeSelect('pNewTime', '', hourOpt) +
          makeSelect('pNewPri', 'med', priOpt, 'اولویت‌بندی') +
          '<button class="task-add-btn" onclick="window.__dAddTask()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن</button>' +
        '</div>' +
        '<div id="priorityHint" class="priority-hint" style="display:none;margin:0 20px"></div>' +
        '<div class="tasks-list-title">🎯 در جریان:</div>' + activeHTML +
        '<div class="tasks-list-title done-title">✅ انجام شده (' + done.length + '):</div>' + doneHTML;
    }
    function viewDaily(){ return heroDaily() + '<div class="planner-body-content">' + dailyContentHTML() + '</div>'; }

    window.__taskClick = function(e, dayKey, idx){
      e.stopPropagation();
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var task = dd.tasks[idx];
      if (!task || task.done) return;
      showConfirm('🎯', 'ورود به اتاق مطالعه', 'می‌خوای کار «' + task.title + '» رو توی حالت مطالعه شروع کنی؟', function(){
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
        task.done = !task.done;
        if (!task.done){ delete task.studiedMinutes; }
        window.savePlanner(pl);
        refreshBody('left');
        return;
      }
      showTriple('✅', 'کار انجام شد!', 'ولی زمانش ثبت نشد ⏱️ چطور ثبت کنیم؟',
        {text:'همینطور ثبت', onClick: function(){
          task.done = true;
          window.savePlanner(pl);
          refreshBody('left');
        }},
        {text:'دقیقه بزنم', onClick: function(){
          var mins = prompt('چند دقیقه وقت گذاشتی؟', '25');
          if (mins === null){ refreshBody('left'); return; }
          mins = parseInt(mins);
          if (isNaN(mins) || mins < 1) mins = 25;
          task.done = true;
          task.studiedMinutes = mins;
          window.savePlanner(pl);
          refreshBody('left');
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
      var inp = document.getElementById('pNewTitle');
      if (!inp) return;
      var title = inp.value.trim();
      if (!title) return;
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var dd = window.getDayData(pl, key);
      dd.tasks.push({
        id: 'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
        title: title, time: window.__pendingTime || '',
        priority: window.__pendingPri || 'med', done: false, createdAt: Date.now()
      });
      window.savePlanner(pl);
      inp.value = '';
      window.__pendingTime = '';
      window.__pendingPri = 'med';
      var h = document.getElementById('priorityHint');
      if (h) h.style.display = 'none';
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

    /* ============ بدنه هفتگی — input فقط با Enter ============ */
    function weeklyContentHTML(){
      var pl = window.loadPlannerNew();
      var days = myWeekDays();
      var todayKey = window.dateKey(new Date());

      var headerRow = '<tr><th class="hour-col">ساعت</th>' + days.map(function(day){
        var isToday = day.key === todayKey;
        return '<th' + (isToday ? ' style="background:var(--accent-soft);color:var(--accent)"' : '') + '>' +
          esc(day.name) + '<div style="font-size:9.5px;opacity:.7;font-weight:600;margin-top:2px">' + esc(day.date) + '</div></th>';
      }).join('') + '</tr>';

      var HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var bodyRows = HOURS.map(function(h){
        var hk = String(h).padStart(2,'0');
        var cells = days.map(function(day){
          var dd = window.getDayData(pl, day.key);
          var hourTasks = (dd.tasks||[]).filter(function(tk){
            return tk.time && tk.time.indexOf(h+':00') === 0;
          });
          var isToday = day.key === todayKey;
          var firstTask = hourTasks[0];
          var cellContent;
          if (firstTask){
            var isDone = firstTask.done;
            cellContent =
              '<div class="week-cell-task' + (isDone?' done':'') + '">' +
                '<span class="wt-title">' + esc(firstTask.title) + '</span>' +
                '<div class="wt-actions">' +
                  '<button class="wt-btn edit" onclick="event.stopPropagation();window.__wEditTask(\'' + day.key + '\',\'' + firstTask.id + '\')" title="ویرایش">' +
                    '<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>' +
                  '<button class="wt-btn tick' + (isDone?' on':'') + '" onclick="event.stopPropagation();window.__wTickTask(\'' + day.key + '\',\'' + firstTask.id + '\')" title="انجام شد">' +
                    '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
                  '<button class="wt-btn del" onclick="event.stopPropagation();window.__wDeleteTask(\'' + day.key + '\',\'' + firstTask.id + '\')" title="حذف">' +
                    '<svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
                '</div>' +
              '</div>';
          } else {
            cellContent =
              '<div class="week-cell-edit" data-day="' + day.key + '" data-hour="' + hk + '">' +
                '<input type="text" class="wc-input" placeholder="+ افزودن..." ' +
                  'onkeydown="if(event.key===\'Enter\'){event.preventDefault();window.__wQuickSave(this)}else if(event.key===\'Escape\'){this.value=\'\';this.blur()}" ' +
                  'onblur="window.__wQuickBlur(this)">' +
              '</div>';
          }
          return '<td class="task-cell' + (isToday?' today':'') + (firstTask?' has-task':'') + '">' + cellContent + '</td>';
        }).join('');
        return '<tr><td class="hour-cell">' + hk + ':۰۰</td>' + cells + '</tr>';
      }).join('');

      var totalTasks = 0, doneCount = 0;
      days.forEach(function(day){
        var dd = window.getDayData(pl, day.key);
        (dd.tasks||[]).forEach(function(tk){
          totalTasks++;
          if (tk.done) doneCount++;
        });
      });
      var pct = totalTasks ? Math.round((doneCount/totalTasks)*100) : 0;
      var summaryHTML = '<div class="week-summary">' +
        '<div class="ws-box"><div class="ws-num">' + totalTasks + '</div><div class="ws-lbl">کل کارها</div></div>' +
        '<div class="ws-box"><div class="ws-num">' + doneCount + '</div><div class="ws-lbl">انجام شده</div></div>' +
        '<div class="ws-box"><div class="ws-num">' + pct + '%</div><div class="ws-lbl">پیشرفت</div></div>' +
      '</div>';

      return '<div class="week-grid-wrap"><table class="week-table"><thead>' + headerRow + '</thead><tbody>' + bodyRows + '</tbody></table></div>' + summaryHTML;
    }
    function viewWeekly(){ return heroWeekly() + '<div class="planner-body-content">' + weeklyContentHTML() + '</div>'; }

    window.__wTickTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      var task = dd.tasks[idx];
      if (task.done){
        task.done = false;
        delete task.studiedMinutes;
        window.savePlanner(pl);
        refreshBody('left');
        return;
      }
      showTriple('✅', 'کار انجام شد!', 'چطور ثبت کنیم؟',
        {text:'همینطور ثبت', onClick: function(){
          task.done = true;
          window.savePlanner(pl);
          refreshBody('left');
        }},
        {text:'دقیقه بزنم', onClick: function(){
          var mins = prompt('چند دقیقه؟', '25');
          if (mins === null){ refreshBody('left'); return; }
          mins = parseInt(mins);
          if (isNaN(mins) || mins < 1) mins = 25;
          task.done = true;
          task.studiedMinutes = mins;
          window.savePlanner(pl);
          refreshBody('left');
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
      dd.tasks.splice(idx,1);
      window.savePlanner(pl);
      refreshBody('left');
    };
    window.__wEditTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      var cur = dd.tasks[idx];
      var newTitle = prompt('عنوان جدید:', cur.title);
      if (newTitle === null) return;
      newTitle = newTitle.trim();
      if (!newTitle) return;
      dd.tasks[idx].title = newTitle;
      window.savePlanner(pl);
      refreshBody('left');
    };
    window.__wQuickSave = function(inp){
      if (!inp) return;
      var val = (inp.value || '').trim();
      if (!val) return;
      var wrap = inp.closest('.week-cell-edit');
      if (!wrap) return;
      var dayKey = wrap.getAttribute('data-day');
      var hourKey = wrap.getAttribute('data-hour');
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      if (!dd.tasks) dd.tasks = [];
      dd.tasks.push({
        id: 'tk_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
        title: val,
        time: hourKey + ':00 تا ' + (parseInt(hourKey)+1) + ':00',
        priority: 'med', done: false, createdAt: Date.now()
      });
      window.savePlanner(pl);
      refreshBody('left');
    };
    window.__wQuickBlur = function(inp){
      setTimeout(function(){
        if (!inp) return;
        var val = (inp.value || '').trim();
        if (val){
          window.__wQuickSave(inp);
        }
      }, 150);
    };

    /* ============ بدنه ماهانه — با رنگ‌بندی ============ */
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
        var dayClass = '';
        var dayTitle = '';
        if (total > 0){
          var ratio = doneC / total;
          if (ratio >= 1){ dayClass = 'day-done'; dayTitle = 'همه انجام شده ✓'; }
          else if (ratio > 0){ dayClass = 'day-partial'; dayTitle = doneC + ' از ' + total + ' انجام شده'; }
          else { dayClass = 'day-pending'; dayTitle = total + ' کار در انتظار'; }
        }
        cells.push('<div class="cal-day' + (isToday?' today':'') + (isSel?' selected':'') + (isFri?' friday':'') + (dayClass?' '+dayClass:'') + '" title="' + dayTitle + '" onclick="window.__calDayClick(' + dd + ')">' +
          '<span class="cal-day-num">' + dd + '</span>' +
          (total > 0 ? '<span class="cal-day-count">' + doneC + '/' + total + '</span>' : '') +
          '</div>');
      }

      var goalsHTML = '';
      if (goals.length === 0){
        goalsHTML = '<div class="mg-empty-compact">🎯 هنوز هدفی نداری</div>';
      } else {
        goalsHTML = '<div class="month-goals-list">' + goals.map(function(g,i){
          return '<div class="month-goal' + (g.done?' done':'') + '" data-goal-i="' + i + '">' +
            '<label class="mg-check-wrap">' +
              '<input type="checkbox" ' + (g.done?'checked':'') + ' onchange="window.__toggleMonthGoalLocal(\'' + monthKey + '\',' + i + ',this)">' +
              '<span class="mg-check"></span>' +
            '</label>' +
            '<span class="mg-text">' + esc(g.text) + '</span>' +
            '<button class="mg-del" onclick="window.__deleteMonthGoalLocal(\'' + monthKey + '\',' + i + ')">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button></div>';
        }).join('') + '</div>';
      }
      var doneGoals = goals.filter(function(g){return g.done;}).length;

      return '<div class="cal-legend">' +
          '<span class="cl-item"><span class="cl-dot day-done-bg"></span>همه انجام شده</span>' +
          '<span class="cl-item"><span class="cl-dot day-partial-bg"></span>نیمه‌کاره</span>' +
          '<span class="cl-item"><span class="cl-dot day-pending-bg"></span>انجام نشده</span>' +
        '</div>' +
        '<div class="month-goals compact">' +
          '<div class="month-goals-title">' +
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>' +
            '<span>اهداف این ماه</span>' +
            (goals.length > 0 ? '<span class="mg-counter">' + doneGoals + '/' + goals.length + '</span>' : '') +
          '</div>' +
          goalsHTML +
          '<div class="month-goal-add compact">' +
            '<input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\'' + monthKey + '\')">' +
            '<button onclick="addMonthGoal(\'' + monthKey + '\')">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="month-calendar">' +
          '<div class="cal-weekdays">' + weekdays.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('') + '</div>' +
          '<div class="cal-grid">' + cells.join('') + '</div>' +
        '</div>';
    }
    function viewMonthly(){ return heroMonthly() + '<div class="planner-body-content">' + monthlyContentHTML() + '</div>'; }

    window.__calDayClick = function(day){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var k = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(day).padStart(2,'0');
      var dd = window.getDayData(pl,k);
      var tasks = dd.tasks||[];
      var doneC = tasks.filter(function(t){return t.done;}).length;
      var txt = tasks.length === 0 ? 'این روز کاری ثبت نشده.' : (doneC + ' از ' + tasks.length + ' کار انجام شده.');
      /* نشون بده خلاصه + اجازه رفتن به روز */
      var old = document.getElementById('calDayPopup');
      if (old) old.remove();
      var el = document.createElement('div');
      el.id = 'calDayPopup';
      el.className = 'siraj-popup-overlay';
      var tasksList = tasks.length ? tasks.map(function(t){
        return '<div class="cal-popup-task' + (t.done?' done':'') + '">' + (t.done?'✓':'○') + ' ' + esc(t.title) + '</div>';
      }).join('') : '';
      el.innerHTML = '<div class="siraj-popup">' +
        '<div class="siraj-popup-title">📅 روز ' + day + '</div>' +
        '<div class="siraj-popup-text">' + txt + '</div>' +
        (tasksList ? '<div class="cal-popup-tasks">' + tasksList + '</div>' : '') +
        '<div class="siraj-popup-actions">' +
          '<button class="siraj-popup-btn secondary" id="calPopupClose">بستن</button>' +
          '<button class="siraj-popup-btn" id="calPopupGo">برو به این روز</button>' +
        '</div></div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
      var close = function(){ el.classList.remove('open'); setTimeout(function(){ if (el.parentNode) el.remove(); }, 320); };
      el.querySelector('#calPopupClose').onclick = close;
      el.querySelector('#calPopupGo').onclick = function(){
        close();
        selectMonthDay(day);
      };
    };

    /* ============ بدنه سالانه ============ */
    function yearlyContentHTML(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var y = d.getFullYear();
      if (!pl.years) pl.years = {};
      if (!pl.years[y]) pl.years[y] = {goals:[]};
      var goals = pl.years[y].goals || [];

      var goalsHTML = '';
      if (goals.length === 0){
        goalsHTML = '<div class="mg-empty"><span class="mg-empty-icon">🏆</span><div class="mg-empty-text">هنوز هدف بلندمدتی برای این سال ثبت نکردی</div></div>';
      } else {
        goalsHTML = '<div class="month-goals-list">' + goals.map(function(g,i){
          return '<div class="month-goal' + (g.done?' done':'') + '" data-ygoal-i="' + i + '">' +
            '<label class="mg-check-wrap">' +
              '<input type="checkbox" ' + (g.done?'checked':'') + ' onchange="window.__toggleYearGoalLocal(' + y + ',' + i + ',this)">' +
              '<span class="mg-check"></span>' +
            '</label>' +
            '<span class="mg-text">' + esc(g.text) + '</span>' +
            '<button class="mg-del" onclick="window.__deleteYearGoalLocal(' + y + ',' + i + ')">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button></div>';
        }).join('') + '</div>';
      }
      var doneGoals = goals.filter(function(g){return g.done;}).length;

      var months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
      var currentMonthIdx = -1;
      try{
        var faDate = new Date().toLocaleDateString('fa-IR',{month:'numeric'});
        var faMonthNum = parseInt(faDate.split('/')[1],10);
        if (faMonthNum >= 1 && faMonthNum <= 12) currentMonthIdx = faMonthNum - 1;
      }catch(e){}

      var monthCards = months.map(function(mName, idx){
        var mk = y + '-' + String(idx+1).padStart(2,'0');
        var mg = (pl.months[mk] && pl.months[mk].goals) || [];
        var md = mg.filter(function(g){return g.done;}).length;
        var pct = mg.length ? Math.round((md/mg.length)*100) : 0;
        var isCur = idx === currentMonthIdx;
        return '<div class="year-month-card' + (isCur ? ' current' : '') + '" onclick="window.__goToMonth(' + idx + ')">' +
          '<div class="ymc-name">' + mName + '</div>' +
          '<div class="ymc-bar"><div class="ymc-fill" style="width:' + pct + '%"></div></div>' +
          '<div class="ymc-stat">' + md + '/' + mg.length + '</div>' +
        '</div>';
      }).join('');

      return '<div class="month-goals year-goals">' +
          '<div class="month-goals-title">' +
            '<span style="font-size:16px">🏅</span>' +
            '<span>اهداف سالانه</span>' +
            (goals.length > 0 ? '<span class="mg-counter">' + doneGoals + '/' + goals.length + '</span>' : '') +
          '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;line-height:1.9">اهداف بلندمدتت رو اینجا بنویس 💫</div>' +
          goalsHTML +
          '<div class="month-goal-add">' +
            '<input type="text" id="newYearGoalInput" placeholder="هدف بلندمدت جدید..." onkeydown="if(event.key===\'Enter\')addYearGoal(' + y + ')">' +
            '<button onclick="addYearGoal(' + y + ')">+ افزودن</button>' +
          '</div>' +
        '</div>' +
        '<div class="year-overview">' +
          '<div class="year-overview-title">📊 نگاه کلی به ماه‌ها <span style="font-size:10px;color:var(--text-muted);font-weight:600;margin-right:auto">روی هر ماه بزن تا بری</span></div>' +
          '<div class="year-months-grid">' + monthCards + '</div>' +
        '</div>';
    }
    function viewYearly(){ return heroYearly() + '<div class="planner-body-content">' + yearlyContentHTML() + '</div>'; }

    window.__goToMonth = function(monthIdx){
      var d = new Date(window.plannerDate || new Date());
      d.setMonth(monthIdx);
      d.setDate(1);
      window.plannerDate = d;
      window.switchPlannerTab('monthly');
    };

    /* ============ Toggle محلی (بدون رفرش) ============ */
    window.__toggleMonthGoalLocal = function(monthKey, i, checkbox){
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey] || !pl.months[monthKey].goals[i]) return;
      pl.months[monthKey].goals[i].done = !!checkbox.checked;
      window.savePlanner(pl);
      var parent = checkbox.closest('.month-goal');
      if (parent){
        parent.classList.toggle('done', !!checkbox.checked);
        parent.classList.remove('just-toggled');
        void parent.offsetWidth;
        parent.classList.add('just-toggled');
      }
      /* آپدیت شمارنده */
      var titleEl = document.querySelector('.month-goals-title .mg-counter');
      if (titleEl){
        var goals = pl.months[monthKey].goals;
        var doneN = goals.filter(function(g){return g.done;}).length;
        titleEl.textContent = doneN + '/' + goals.length;
      }
    };
    window.__deleteMonthGoalLocal = function(monthKey, i){
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey] || !pl.months[monthKey].goals) return;
      pl.months[monthKey].goals.splice(i,1);
      window.savePlanner(pl);
      var parent = document.querySelector('[data-goal-i="' + i + '"]');
      if (parent){
        parent.style.transition = 'all .3s';
        parent.style.opacity = '0';
        parent.style.transform = 'translateX(20px)';
        setTimeout(function(){ refreshBody('left'); }, 300);
      } else {
        refreshBody('left');
      }
    };
    window.__toggleYearGoalLocal = function(y, i, checkbox){
      var pl = window.loadPlannerNew();
      if (!pl.years || !pl.years[y] || !pl.years[y].goals[i]) return;
      pl.years[y].goals[i].done = !!checkbox.checked;
      window.savePlanner(pl);
      var parent = checkbox.closest('.month-goal');
      if (parent){
        parent.classList.toggle('done', !!checkbox.checked);
        parent.classList.remove('just-toggled');
        void parent.offsetWidth;
        parent.classList.add('just-toggled');
      }
    };
    window.__deleteYearGoalLocal = function(y, i){
      var pl = window.loadPlannerNew();
      if (!pl.years || !pl.years[y] || !pl.years[y].goals) return;
      pl.years[y].goals.splice(i,1);
      window.savePlanner(pl);
      var parent = document.querySelector('[data-ygoal-i="' + i + '"]');
      if (parent){
        parent.style.transition = 'all .3s';
        parent.style.opacity = '0';
        parent.style.transform = 'translateX(20px)';
        setTimeout(function(){ refreshBody('left'); }, 300);
      } else {
        refreshBody('left');
      }
    };

    /* ============ پنل راست ============ */
    window.renderPanelForPlanner = function(){
      var p = getProfile();
      document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
      document.getElementById('panelSubText').textContent = p.name ? ('سلام ' + p.name + ' 🌟') : 'خوش آمدی 🌟';
      document.getElementById('panelContent').innerHTML =
        '<button onclick="window.__openStudy()" class="panel-study-btn">' +
          '<svg viewBox="0 0 24 24" style="width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:1.8;flex-shrink:0"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '<div style="text-align:right;flex:1"><div>حالت مطالعه</div><div style="font-size:11px;opacity:.85;font-weight:600;margin-top:3px">با تایمر و تمرکز کامل</div></div>' +
          '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.2"><path d="m9 18 6-6-6-6"/></svg>' +
        '</button>' +
        '<div class="panel-card" style="margin-top:14px">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>راهنما</span></div>' +
          '<div style="font-size:11.5px;color:var(--text-muted);line-height:2;text-align:right">' +
            '✨ روی دکمه بالا بزن<br>' +
            '📚 یه کار انتخاب کن<br>' +
            '⏱️ زمان تنظیم کن<br>' +
            '🎯 تا آخر تایمر سایت قفل میشه' +
          '</div>' +
        '</div>';
    };

    /* ============ صدای محیطی ============ */
    var audioCtx = null, audioNodes = null, currentSound = null, masterGain = null;
    function stopAudio(){
      if (audioNodes && audioNodes.nodes){
        audioNodes.nodes.forEach(function(n){
          try{ if (n.stop) n.stop(); }catch(e){}
          try{ n.disconnect(); }catch(e){}
        });
      }
      if (audioNodes && audioNodes.gain){ try{ audioNodes.gain.disconnect(); }catch(e){} }
      audioNodes = null; currentSound = null;
    }
    function makeNoise(type){
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      if (!masterGain){
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.4;
        masterGain.connect(audioCtx.destination);
      }
      var nodes = [];
      var filter = audioCtx.createBiquadFilter();
      var gain = audioCtx.createGain();
      gain.gain.value = 0.22;
      filter.connect(gain); gain.connect(masterGain);

      if (type === 'nature'){
        /* موج دریا */
        var bs = audioCtx.sampleRate * 4;
        var buf = audioCtx.createBuffer(1, bs, audioCtx.sampleRate);
        var da = buf.getChannelData(0);
        var last = 0;
        for (var i=0;i<bs;i++){
          var w = Math.random()*2 - 1;
          da[i] = (last + 0.015*w)/1.015;
          last = da[i]; da[i] *= 3.2;
        }
        var src = audioCtx.createBufferSource();
        src.buffer = buf; src.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 550; filter.Q.value = 0.7;
        var lfo = audioCtx.createOscillator(), lfoG = audioCtx.createGain();
        lfo.frequency.value = 0.08; lfoG.gain.value = 150;
        lfo.connect(lfoG); lfoG.connect(filter.frequency);
        src.connect(filter); lfo.start(); src.start();
        nodes.push(src, lfo, lfoG);
      } else if (type === 'forest'){
        /* صدای جنگل: نویز براون + سوت پرنده گاه‌به‌گاه */
        var bsF = audioCtx.sampleRate * 4;
        var bufF = audioCtx.createBuffer(1, bsF, audioCtx.sampleRate);
        var dF = bufF.getChannelData(0);
        var lvF = 0;
        for (var jf=0;jf<bsF;jf++){
          var wF = Math.random()*2 - 1;
          dF[jf] = (lvF + 0.012*wF)/1.012;
          lvF = dF[jf]; dF[jf] *= 2.8;
        }
        var srcF = audioCtx.createBufferSource();
        srcF.buffer = bufF; srcF.loop = true;
        var filtF = audioCtx.createBiquadFilter();
        filtF.type = 'lowpass'; filtF.frequency.value = 800; filtF.Q.value = 0.6;
        srcF.connect(filtF); filtF.connect(gain);
        srcF.start();
        nodes.push(srcF, filtF);
        /* پرنده گاه‌به‌گاه: یه اسیلاتور با پاکت‌های تند */
        function scheduleBird(startTime){
          var osc = audioCtx.createOscillator();
          var env = audioCtx.createGain();
          osc.type = 'sine';
          var baseF = 1800 + Math.random() * 1400;
          osc.frequency.setValueAtTime(baseF, startTime);
          osc.frequency.linearRampToValueAtTime(baseF + 400, startTime + 0.05);
          osc.frequency.linearRampToValueAtTime(baseF - 200, startTime + 0.12);
          env.gain.setValueAtTime(0, startTime);
          env.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
          env.gain.linearRampToValueAtTime(0, startTime + 0.15);
          osc.connect(env); env.connect(masterGain);
          osc.start(startTime);
          osc.stop(startTime + 0.2);
        }
        var birdLoop = setInterval(function(){
          if (!audioNodes || currentSound !== 'forest'){ clearInterval(birdLoop); return; }
          var t = audioCtx.currentTime + 0.1;
          if (Math.random() > 0.4) scheduleBird(t);
          if (Math.random() > 0.7) scheduleBird(t + 0.25);
        }, 4500);
        audioNodes = {nodes:nodes, gain:gain, filter:filter, loop:birdLoop};
        currentSound = 'forest';
        return;
      } else if (type === 'hall'){
        var bs2 = audioCtx.sampleRate * 3;
        var buf2 = audioCtx.createBuffer(1, bs2, audioCtx.sampleRate);
        var d2 = buf2.getChannelData(0);
        var lv = 0;
        for (var j=0;j<bs2;j++){
          var w2 = Math.random()*2 - 1;
          d2[j] = (lv + 0.008*w2)/1.008;
          lv = d2[j]; d2[j] *= 2.5;
        }
        var src2 = audioCtx.createBufferSource();
        src2.buffer = buf2; src2.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 280;
        var osc = audioCtx.createOscillator(), oscG = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = 110; oscG.gain.value = 0.03;
        osc.connect(oscG); oscG.connect(gain);
        src2.connect(filter); osc.start(); src2.start();
        nodes.push(src2, osc, oscG);
      } else if (type === 'rain'){
        var bs3 = audioCtx.sampleRate * 2;
        var buf3 = audioCtx.createBuffer(1, bs3, audioCtx.sampleRate);
        var d3 = buf3.getChannelData(0);
        for (var k=0;k<bs3;k++) d3[k] = (Math.random()*2 - 1)*0.6;
        var src3 = audioCtx.createBufferSource();
        src3.buffer = buf3; src3.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 700; filter.Q.value = 1.2;
        src3.connect(filter); src3.start();
        nodes.push(src3);
      }
      audioNodes = {nodes:nodes, gain:gain, filter:filter};
      currentSound = type;
    }
    function setMasterVolume(v){ if (masterGain) masterGain.gain.value = v; }

    /* ============ Study Chat Storage ============ */
    function loadStudyChat(){
      try{ return JSON.parse(sessionStorage.getItem(STUDY_CHAT_KEY) || '[]'); }catch(e){ return []; }
    }
    function saveStudyChat(){
      try{ sessionStorage.setItem(STUDY_CHAT_KEY, JSON.stringify(studyChatHistory)); }catch(e){}
    }
    function clearStudyChat(){
      studyChatHistory = [];
      try{ sessionStorage.removeItem(STUDY_CHAT_KEY); }catch(e){}
    }
    studyChatHistory = loadStudyChat();

    function getStudyContext(){
      try{
        var pl = window.loadPlannerNew();
        var todayKey = window.dateKey(new Date());
        var dd = window.getDayData(pl, todayKey);
        var active = (dd.tasks || []).filter(function(t){ return !t.done; });
        var nowHour = new Date().getHours();
        var nowKey = String(nowHour).padStart(2,'0') + ':00';
        var current = active.filter(function(t){ return t.time && t.time.indexOf(nowKey) === 0; });
        return {
          today: active.length ? active.map(function(t){ return '- ' + t.title + (t.time ? ' (' + t.time + ')' : ''); }).join('\n') : 'هیچ کاری برای امروز نداری',
          current: current.length ? current.map(function(t){ return '- ' + t.title; }).join('\n') : 'برای این ساعت کاری نداری',
          time: nowHour + ':00',
          studying: window.__studyTask || 'مطالعه آزاد'
        };
      }catch(e){ return {today:'—', current:'—', time:'—', studying:'مطالعه آزاد'}; }
    }

    /* ============ حالت مطالعه ============ */
    var studyTimer = null, studySeconds = 0, studyRunning = false, studyPaused = false;
    var studyTotalMinutes = 0;

    function buildStudyOverlay(){
      var old = document.getElementById('studyOverlay');
      if (old) old.remove();
      /* فقط تسک‌های امروز رو نشون بده */
      var pl = window.loadPlannerNew();
      var todayKey = window.dateKey(new Date());
      var ddToday = window.getDayData(pl, todayKey);
      var allTasks = (ddToday.tasks || []).filter(function(tk){ return !tk.done; }).map(function(tk){ return tk.title; });
      var hasTasks = allTasks.length > 0;
      var taskFieldHTML = hasTasks
        ? '<div class="siraj-select" id="studyTaskSelect" style="width:100%">' +
            '<div class="siraj-select-trigger" style="width:100%">' +
              '<span class="siraj-select-value">' + (window.__studyTask ? esc(window.__studyTask) : '— یک کار از امروز (اختیاری) —') + '</span>' +
              '<svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>' +
            '</div>' +
            '<div class="siraj-select-panel" style="width:100%;min-width:100%">' +
              allTasks.map(function(tn){
                return '<div class="siraj-select-item' + (window.__studyTask === tn ? ' active' : '') + '" data-value="' + esc(tn) + '"><span>' + esc(tn) + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>'
        : '<div class="study-empty-box">📝 کاری برای امروز نداری<br>برو یه کار اضافه کن، بعد برگرد</div>' +
          '<button class="study-btn" id="studyGoPlanBtn" style="width:100%">برو به برنامه‌ریزی</button>';

      var el = document.createElement('div');
      el.id = 'studyOverlay';
      el.className = 'study-overlay';
      el.innerHTML =
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          '<div class="study-sub">کاری که می‌خوای روش تمرکز کنی رو انتخاب کن</div>' +
          taskFieldHTML +
          '<div class="stp-wrap" id="studyTimePicker">' +
            '<div class="stp-hint">↑ بکش بالا / ↓ پایین</div>' +
            '<span class="stp-unit">دقیقه</span>' +
            '<span class="stp-num" id="studyTimeNum">25</span>' +
          '</div>' +
          '<div class="study-music-section">' +
            '<div class="study-music-title"><span>🎵 صدای محیطی</span></div>' +
            '<div class="study-sound-grid">' +
              '<button class="study-sound-btn" data-sound="nature"><span class="ss-icon">🌊</span><span>موج دریا</span></button>' +
              '<button class="study-sound-btn" data-sound="forest"><span class="ss-icon">🌳</span><span>جنگل</span></button>' +
              '<button class="study-sound-btn" data-sound="hall"><span class="ss-icon">🌙</span><span>سکوت گرم</span></button>' +
              '<button class="study-sound-btn" data-sound="rain"><span class="ss-icon">☔</span><span>بارش ملایم</span></button>' +
              '<button class="study-sound-btn off-btn on" data-sound=""><span class="ss-icon">🔇</span><span>خاموش</span></button>' +
            '</div>' +
            '<div class="study-volume-row"><input type="range" min="0" max="100" value="40" id="studyVolume" style="--vp:40%"></div>' +
          '</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyStartBtn">شروع مطالعه</button>' +
            '<button class="study-btn secondary" id="studyCancelBtn">لغو</button>' +
          '</div>' +
        '</div>' +
        '<div id="studyRunning" class="study-setup" style="display:none">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-mode-badge">🎯 در حال تمرکز</div>' +
          '<div class="study-timer" id="studyTimer">' +
            '<span class="study-digit" data-k="m1">0</span>' +
            '<span class="study-digit" data-k="m2">0</span>' +
            '<span class="study-colon">:</span>' +
            '<span class="study-digit" data-k="s1">0</span>' +
            '<span class="study-digit" data-k="s2">0</span>' +
          '</div>' +
          '<div class="study-task" id="studyTaskName">—</div>' +
          '<div id="studyNowPlaying" style="display:none"><span class="study-now-playing">در حال پخش</span></div>' +
          '<div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn pause-mode" id="studyPauseBtn"><span id="studyPauseLabel">توقف</span></button>' +
            '<button class="study-btn" id="studyChatBtn">مطالعه با سراج</button>' +
            '<button class="study-btn finish-mode" id="studyFinishBtn">پایان و ثبت</button>' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      var picker = el.querySelector('#studyTimePicker');
      var numEl = el.querySelector('#studyTimeNum');
      var pickerVal = 25, dragStartY = 0, dragStartVal = 25, dragging = false;
      function setPV(v){ pickerVal = Math.max(1, Math.min(180, Math.round(v))); numEl.textContent = pickerVal; }
      function pd(e){
        dragging = true;
        dragStartY = (e.touches ? e.touches[0].clientY : e.clientY);
        dragStartVal = pickerVal;
        picker.classList.add('dragging'); e.preventDefault();
      }
      function pm(e){
        if (!dragging) return;
        var y = (e.touches ? e.touches[0].clientY : e.clientY);
        setPV(dragStartVal + Math.round((dragStartY - y)/6));
      }
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
          btn.classList.add('on'); stopAudio();
          try{ makeNoise(snd); }catch(e){}
        };
      });
      var vol = el.querySelector('#studyVolume');
      if (vol){
        vol.oninput = function(){
          var pct = this.value;
          this.style.setProperty('--vp', pct + '%');
          setMasterVolume(pct / 100);
        };
      }

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
            window.__studyTask = v;
            window.__studyTaskSourceId = null;
            window.__studyTaskSourceDay = null;
            taskSel.querySelector('.siraj-select-value').textContent = v;
            taskSel.classList.remove('open');
          };
        });
      }

      var goBtn = el.querySelector('#studyGoPlanBtn');
      if (goBtn) goBtn.onclick = function(){ stopAudio(); closeStudy(); };
      el.querySelector('#studyStartBtn').onclick = startStudy;
      el.querySelector('#studyCancelBtn').onclick = function(){ stopAudio(); closeStudy(); };
      el.querySelector('#studyExitBtn').onclick = exitStudyConfirm;
      el.querySelector('#studyChatBtn').onclick = toggleStudyChat;
      el.querySelector('#studyPauseBtn').onclick = toggleStudyPause;
      el.querySelector('#studyFinishBtn').onclick = finishAndRecord;
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      var task = window.__studyTask || '';
      var mins = window.__studyMinutesGetter ? window.__studyMinutesGetter() : 25;
      if (!mins || mins < 1) mins = 25;
      if (mins > 180) mins = 180;
      studySeconds = mins * 60;
      studyTotalMinutes = mins;
      studyRunning = true;
      studyPaused = false;
      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      overlay.querySelector('#studyTaskName').textContent = task || 'مطالعه آزاد';
      overlay.classList.remove('paused');
      if (currentSound){
        var np = overlay.querySelector('#studyNowPlaying');
        if (np){
          var names = {nature:'موج دریا 🌊', forest:'جنگل 🌳', hall:'سکوت گرم 🌙', rain:'بارش ملایم ☔'};
          np.querySelector('.study-now-playing').textContent = names[currentSound] || 'در حال پخش';
          np.style.display = 'block';
        }
      }
      var pb = overlay.querySelector('#studyPauseBtn');
      if (pb){
        pb.classList.remove('resume-mode');
        pb.classList.add('pause-mode');
        var lbl = pb.querySelector('#studyPauseLabel');
        if (lbl) lbl.textContent = 'توقف';
      }
      updateStudyTimer(true);
      startStudyTimer();
      lockSite();
    }

    function elapsedMinutes(){
      return Math.max(1, studyTotalMinutes - Math.floor(studySeconds / 60));
    }

    function markSourceTaskDone(){
      if (!window.__studyTaskSourceId || !window.__studyTaskSourceDay) return;
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, window.__studyTaskSourceDay);
      var idx = (dd.tasks||[]).findIndex(function(tk){ return tk.id === window.__studyTaskSourceId; });
      if (idx >= 0){
        dd.tasks[idx].done = true;
        dd.tasks[idx].studiedMinutes = elapsedMinutes();
        window.savePlanner(pl);
      }
    }

    function startStudyTimer(){
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = setInterval(function(){
        if (studyPaused) return;
        studySeconds--;
        updateStudyTimer(false);
        if (studySeconds <= 0){
          clearInterval(studyTimer);
          studyTimer = null;
          studyRunning = false;
          stopAudio();
          unlockSite();
          markSourceTaskDone();
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد. یه استراحت کوتاه به خودت بده ☕');
          window.__studyTask = '';
          window.__studyTaskSourceId = null;
          window.__studyTaskSourceDay = null;
          clearStudyChat();
          closeStudy();
        }
      }, 1000);
    }

    function toggleStudyPause(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
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
      var an = !initial;
      setDigit('m1', mStr[0], an);
      setDigit('m2', mStr[1], an);
      setDigit('s1', sStr[0], an);
      setDigit('s2', sStr[1], an);
    }

    function finishAndRecord(){
      var mins = elapsedMinutes();
      markSourceTaskDone();
      if (window.__studyTask){
        showPopup('🏆', 'کار انجام شد!', 'کار «' + window.__studyTask + '» با ' + mins + ' دقیقه ثبت شد. آفرین! 🎉');
      } else {
        showPopup('✨', 'خوب بود!', mins + ' دقیقه مطالعه ثبت شد.');
      }
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null;
      studyRunning = false;
      window.__studyTask = '';
      window.__studyTaskSourceId = null;
      window.__studyTaskSourceDay = null;
      clearStudyChat();
      stopAudio();
      unlockSite();
      closeStudy();
    }

    function exitStudyConfirm(){
      if (!confirm('مطمئنی خارج شی؟ با «پایان و ثبت» می‌تونی به‌عنوان انجام‌شده ثبت کنی.')) return;
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null;
      studyRunning = false;
      window.__studyTask = '';
      window.__studyTaskSourceId = null;
      window.__studyTaskSourceDay = null;
      stopAudio();
      unlockSite();
      closeStudy();
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
      if (k === 'F5' || k === 'F11' || k === 'Escape' ||
          (ctrl && ['r','R','w','W','n','N','t','T','p','P'].indexOf(k) >= 0)){
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    function blockContext(e){ if (studyRunning) e.preventDefault(); }
    function blockUnload(e){
      if (!studyRunning) return;
      e.preventDefault();
      e.returnValue = 'در حال مطالعه‌ای!';
      return e.returnValue;
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
      requestAnimationFrame(function(){ overlay.classList.add('open'); });
    };

    /* ============ چت مطالعه ============ */
    function renderStudyChat(){
      var box = document.getElementById('studyChatMessages');
      if (!box) return;
      var p = getProfile();
      var greeting = p.name ? 'سلام ' + esc(p.name) + ' 👋' : 'سلام 👋';
      var html = '<div class="sc-msg sc-bot">' + greeting + ' من سراجم. توی حالت مطالعه هر سؤال درسی داشتی بپرس.</div>';
      studyChatHistory.forEach(function(m){
        if (m.role === 'user') html += '<div class="sc-msg sc-user">' + esc(m.content) + '</div>';
        else if (m.role === 'assistant') html += '<div class="sc-msg sc-bot">' + esc(m.content) + '</div>';
      });
      box.innerHTML = html;
      box.scrollTop = box.scrollHeight;
    }

    function toggleStudyChat(){
      var existing = document.getElementById('studyChatPanel');
      if (existing){
        existing.classList.remove('open');
        setTimeout(function(){ existing.remove(); }, 320);
        return;
      }
      var panel = document.createElement('div');
      panel.id = 'studyChatPanel';
      panel.className = 'study-chat-panel';
      panel.innerHTML =
        '<div class="study-chat-header">' +
          '<div class="study-chat-header-title">سراج — همیار مطالعه</div>' +
          '<button class="study-chat-close" id="studyChatCloseBtn">✕</button>' +
        '</div>' +
        '<div class="study-chat-messages" id="studyChatMessages"></div>' +
        '<div class="study-chat-input-row">' +
          '<input type="text" class="study-chat-input" id="studyChatInput" placeholder="سؤالت رو بپرس..." onkeydown="if(event.key===\'Enter\')window.__studyChatSend()">' +
          '<button class="study-chat-send" onclick="window.__studyChatSend()">➤</button>' +
        '</div>';
      document.body.appendChild(panel);
      panel.querySelector('#studyChatCloseBtn').onclick = function(){
        panel.classList.remove('open');
        setTimeout(function(){ panel.remove(); }, 320);
      };
      renderStudyChat();
      requestAnimationFrame(function(){ panel.classList.add('open'); });
      setTimeout(function(){ var i = document.getElementById('studyChatInput'); if (i) i.focus(); }, 350);
    }

    window.__studyChatSend = async function(){
      var inp = document.getElementById('studyChatInput');
      var box = document.getElementById('studyChatMessages');
      if (!inp || !box) return;
      var q = inp.value.trim();
      if (!q) return;
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-user">' + esc(q) + '</div>');
      inp.value = '';
      box.scrollTop = box.scrollHeight;
      studyChatHistory.push({role:'user', content:q});
      saveStudyChat();
      var tid = 'sct_' + Date.now();
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="' + tid + '">💭 ...</div>');
      box.scrollTop = box.scrollHeight;
      var ctx = getStudyContext();
      var sysPrompt = 'تو «سراج» هستی و الان در «حالت مطالعه» کاربر قرار داری.\n\n' +
        '📋 برنامه امروز کاربر:\n' + ctx.today + '\n\n' +
        '🕐 برنامه همین ساعت (' + ctx.time + '):\n' + ctx.current + '\n\n' +
        '📚 کاربر داره روی این کار تمرکز می‌کنه: «' + ctx.studying + '»\n' +
        profilePrompt() + '\n\n' +
        'قوانین:\n' +
        '۱. جواب‌ها کوتاه و مفید.\n' +
        '۲. اگه پرسید «چی دارم؟» → از برنامه بالا جواب بده.\n' +
        '۳. اگه پرسید «چی می‌خونم؟» → بگو روی «' + ctx.studying + '» کار می‌کنه.\n' +
        '۴. اگه غیردرسی پرسید، مهربون یادآوری کن.\n' +
        '۵. ستاره (*) نزن، ایموجی ملایم.';
      try{
        var url = getBaseURL();
        var res = await fetch(url, {
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
          body: JSON.stringify({
            model: getModel(),
            messages: [{role:'system', content: sysPrompt}].concat(studyChatHistory.slice(-10)),
            temperature: 0.7, stream: true
          })
        });
        var te = document.getElementById(tid);
        if (!res.ok){ if (te) te.textContent = 'خطا (' + res.status + ')'; return; }
        if (te) te.remove();
        var botId = 'scb_' + Date.now();
        box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="' + botId + '"></div>');
        var botEl = document.getElementById(botId);
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '', full = '';
        while(true){
          var r = await reader.read();
          if (r.done) break;
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
        studyChatHistory.push({role:'assistant', content: full});
        saveStudyChat();
      }catch(err){
        var te2 = document.getElementById(tid);
        if (te2) te2.textContent = 'خطا: ' + err.message;
      }
    };

    /* ============ اهداف ============ */
    window.addMonthGoal = function(monthKey){
      var inp = document.getElementById('newGoalInput');
      if (!inp) return;
      var v = inp.value.trim();
      if (!v) return;
      var pl = window.loadPlannerNew();
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      pl.months[monthKey].goals.push({text:v, done:false});
      window.savePlanner(pl);
      inp.value = '';
      refreshBody('left');
    };
    window.addYearGoal = function(y){
      var inp = document.getElementById('newYearGoalInput');
      if (!inp) return;
      var v = inp.value.trim();
      if (!v) return;
      var pl = window.loadPlannerNew();
      if (!pl.years) pl.years = {};
      if (!pl.years[y]) pl.years[y] = {goals:[]};
      pl.years[y].goals.push({text:v, done:false});
      window.savePlanner(pl);
      inp.value = '';
      refreshBody('left');
    };

    /* ============ مقالات ============ */
    window.renderBlog = function(){
      var v = document.getElementById('view-blog');
      if (!v) return;
      v.innerHTML = '<div class="page-title-bar"><div class="page-title-text">مقالات سراج</div></div>' +
        '<div class="community-hero"><div class="community-icon">' +
          '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>' +
        '</div><div class="community-title">مقالات و یادداشت‌های سراج</div>' +
        '<div class="community-desc">به‌زودی ✍️</div>' +
        '<div class="community-badge">به‌زودی راه‌اندازی می‌شه</div></div>';
    };

    /* ============ هوک‌ها ============ */
    var origRenderPlanner = window.renderPlanner;
    window.renderPlanner = function(){
      origRenderPlanner.apply(this, arguments);
      ensureTabsClean();
      setTimeout(function(){ renderPane(getTab()); }, 30);
    };
    var origSwitchView = window.switchView;
    window.switchView = function(v){
      origSwitchView.apply(this, arguments);
      if (v === 'planner'){ setTimeout(function(){ ensureTabsClean(); renderPane(getTab()); }, 50); }
    };

    /* لیبل نوار پایین */
    setTimeout(function(){
      var labels = {planner:'برنامه‌ریز',chat:'گفتگو',tools:'دستیار',videos:'انجمن',blog:'مقالات'};
      document.querySelectorAll('.bottom-nav-btn[data-view]').forEach(function(btn){
        var v = btn.getAttribute('data-view');
        if (!v) return;
        btn.setAttribute('data-label','');
        if (!btn.querySelector('.nav-btn-label')){
          var span = document.createElement('span');
          span.className = 'nav-btn-label';
          span.textContent = labels[v] || '';
          btn.appendChild(span);
        }
      });
    }, 900);

    /* ============ درباره ما با پروفایل ============ */
    var origOpenSettings = window.openSettings;
    window.openSettings = function(){
      origOpenSettings.apply(this, arguments);
      setTimeout(function(){
        var aboutContent = document.querySelector('.settings-content[data-cat="about"]');
        if (!aboutContent) return;
        var p = getProfile();
        aboutContent.innerHTML =
          '<div class="about-hero">' +
            '<div class="about-avatar">' +
              (p.avatar ? '<img src="' + p.avatar + '" alt="">' : '<span style="font-size:44px">' + (p.name ? p.name.substring(0,2) : 'من') + '</span>') +
            '</div>' +
            '<div class="about-name">' + (p.name ? esc(p.name) : 'بدون نام') + '</div>' +
            '<div class="about-role">' + (p.bio ? esc(p.bio.substring(0,40)) : 'پروفایلت رو کامل کن') + '</div>' +
          '</div>' +

          '<div class="setting-group profile-section">' +
            '<label>✏️ پروفایل شخصی</label>' +
            '<div style="font-size:11px;color:var(--text-muted);line-height:1.9;padding:2px 0 8px">' +
              'سراج اسم و بیوگرافی تو رو می‌خونه و توی جواب‌هاش استفاده می‌کنه.' +
            '</div>' +
            '<input type="text" id="profileName" placeholder="اسمت چیه؟" value="' + (p.name ? esc(p.name) : '') + '" style="width:100%;padding:10px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;margin-bottom:8px">' +
            '<textarea id="profileBio" placeholder="یه توضیح کوتاه از خودت..." style="width:100%;min-height:80px;padding:10px 14px;border-radius:12px;border:1px solid var(--border);background:var(--primary);color:var(--text-main);font-family:var(--font-text);font-size:12.5px;outline:none;resize:vertical;line-height:1.8;margin-bottom:8px">' + (p.bio ? esc(p.bio) : '') + '</textarea>' +
            '<label class="btn-secondary" style="cursor:pointer;width:100%;justify-content:center">' +
              '<input type="file" accept="image/*" id="profileAvatarInput" style="display:none">' +
              '📷 انتخاب عکس پروفایل' +
            '</label>' +
            (p.avatar ? '<button class="btn-secondary" id="profileAvatarClear" style="width:100%;margin-top:6px">حذف عکس</button>' : '') +
            '<button class="btn-primary" id="profileSaveBtn" style="width:100%;justify-content:center;margin-top:8px">💾 ذخیره پروفایل</button>' +
          '</div>' +

          '<div class="about-section-title" style="margin-top:20px"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 12 0v2"/></svg>درباره سازنده سراج</div>' +
          '<div class="about-bio-card" style="line-height:2;white-space:pre-line;text-align:right">' +
            'سلام 👋\n' +
            'من حامد هستم — ۲۰ سالمه و عاشق میهن. الان دانشجوی زبان و ادبیات عربی دانشگاه قمم و کنار درس، به هوش مصنوعی، برنامه‌نویسی و تاریخ هم علاقه‌ی زیادی دارم.\n\n' +
            'ایده سراج یهویی وقتی مثل همیشه تو فکر بودم به ذهنم اومد. اینکه بتونم به یادگیری بچه‌های کشورم کمک کنم و بتونیم آینده‌ای خوش برای سرزمینمون رقم بزنیم.\n' +
            'کلی چیز برای کشف کردن هست 🌱\n' +
            'منتظر بروزرسانی‌های جدید باشید ☝️💕' +
          '</div>' +
          '<div class="about-section-title">راه‌های ارتباطی</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px">' +
            '<a class="contact-row-v2" href="mailto:ranshamed.fr@gmail.com">' +
              '<div class="contact-icon ci-email"><svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg></div>' +
              '<div class="contact-info"><div class="contact-label">ایمیل</div><div class="contact-value">ranshamed.fr@gmail.com</div></div>' +
              '<svg class="contact-arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
            '</a>' +
            '<a class="contact-row-v2" href="https://t.me/Ra_Nsss" target="_blank" rel="noopener">' +
              '<div class="contact-icon ci-telegram"><svg viewBox="0 0 24 24"><path d="M21 3 3 10l6 3 3 6 9-16z"/><path d="M9 13 21 3"/></svg></div>' +
              '<div class="contact-info"><div class="contact-label">تلگرام</div><div class="contact-value">@Ra_Nsss</div></div>' +
              '<svg class="contact-arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
            '</a>' +
            '<a class="contact-row-v2" href="https://instagram.com/Hamed_Rans" target="_blank" rel="noopener">' +
              '<div class="contact-icon ci-instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></div>' +
              '<div class="contact-info"><div class="contact-label">اینستاگرام</div><div class="contact-value">Hamed_Rans</div></div>' +
              '<svg class="contact-arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
            '</a>' +
            '<a class="contact-row-v2" href="https://x.com/Hamed_Rans" target="_blank" rel="noopener">' +
              '<div class="contact-icon ci-x"><svg viewBox="0 0 24 24" style="stroke:none;fill:#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>' +
              '<div class="contact-info"><div class="contact-label">ایکس</div><div class="contact-value">Hamed_Rans</div></div>' +
              '<svg class="contact-arrow" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
            '</a>' +
          '</div>' +
          '<div class="siraj-version-badge">✨ نسخه‌ی فعلی: <span>v2.0</span></div>';

        /* Bind profile */
        var saveBtn = document.getElementById('profileSaveBtn');
        if (saveBtn){
          saveBtn.onclick = function(){
            var p2 = getProfile();
            p2.name = (document.getElementById('profileName')||{}).value || '';
            p2.bio = (document.getElementById('profileBio')||{}).value || '';
            saveProfile(p2);
            window.toast && window.toast('پروفایل ذخیره شد ✓','success');
            /* رفرش پنل */
            if (typeof window.renderPanelForPlanner === 'function') window.renderPanelForPlanner();
          };
        }
        var avatarInp = document.getElementById('profileAvatarInput');
        if (avatarInp){
          avatarInp.onchange = function(e){
            var f = e.target.files[0];
            if (!f) return;
            if (f.size > 800*1024){ window.toast && window.toast('حجم عکس حداکثر ۸۰۰ کیلوبایت','error'); return; }
            var r = new FileReader();
            r.onload = function(ev){
              var p3 = getProfile();
              p3.avatar = ev.target.result;
              saveProfile(p3);
              window.toast && window.toast('عکس ذخیره شد ✓','success');
              /* رفرش تنظیمات */
              document.querySelector('[data-cat="about"]').innerHTML = '';
              window.openSettings();
              document.querySelector('.modal-overlay').classList.add('open');
              document.querySelector('.settings-tab-btn[data-cat="about"]').click();
            };
            r.readAsDataURL(f);
          };
        }
        var clrBtn = document.getElementById('profileAvatarClear');
        if (clrBtn){
          clrBtn.onclick = function(){
            var p4 = getProfile();
            delete p4.avatar;
            saveProfile(p4);
            window.toast && window.toast('عکس حذف شد','info');
            document.querySelector('[data-cat="about"]').innerHTML = '';
            window.openSettings();
            document.querySelector('.modal-overlay').classList.add('open');
            document.querySelector('.settings-tab-btn[data-cat="about"]').click();
          };
        }
      }, 250);
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
              if (h[window.currentChatId].messages[j].role === 'assistant') h[window.currentChatId].messages.splice(j, 1);
              else break;
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

    /* ساعت — رنگ بر اساس زمان */
    setTimeout(function(){
      function colorizeHours(){
        var list = document.querySelector('.hours-list');
        if (!list) return;
        var now = new Date().getHours();
        list.querySelectorAll('.hour-row').forEach(function(row){
          var hLabel = row.querySelector('.hour-label span:last-child');
          if (!hLabel) return;
          var hh = parseInt(hLabel.textContent,10);
          if (isNaN(hh)) return;
          row.classList.remove('time-morning','time-noon','time-afternoon','time-evening','time-night');
          if (hh >= 6 && hh < 12) row.classList.add('time-morning');
          else if (hh >= 12 && hh < 15) row.classList.add('time-noon');
          else if (hh >= 15 && hh < 18) row.classList.add('time-afternoon');
          else if (hh >= 18 && hh < 21) row.classList.add('time-evening');
          else row.classList.add('time-night');
        });
      }
      var obs2 = new MutationObserver(colorizeHours);
      obs2.observe(document.body, {childList:true, subtree:true});
      setTimeout(colorizeHours, 500);
    }, 200);

    console.log('[Siraj v2.0] planner loaded ✓');
  }
})();
