/* ============================================================
   planner-v2.js — v2.1
   ============================================================ */
(function(){
  'use strict';

  var tries = 0;
  var t = setInterval(function(){
    tries++;
    if (typeof window.renderPlanner === 'function' && typeof window.loadPlannerNew === 'function') {
      clearInterval(t);
      init();
    }
    if (tries > 60) clearInterval(t);
  }, 100);

  function init(){

    function esc(s){
      return String(s||'').replace(/[&<>"']/g,function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      });
    }
    function getTab(){
      var btn = document.querySelector('.planner-tab.active');
      if (!btn) return 'daily';
      var m = (btn.getAttribute('onclick')||'').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);
      return m ? m[1] : 'daily';
    }

    /* ---------- Select سفارشی ---------- */
    function makeSelect(id, value, options, onChange){
      var openCls = '';
      var current = options.find(function(o){return o.value === value;}) || options[0];
      var items = options.map(function(o){
        return '<div class="siraj-select-item ' + (o.value === value ? 'active' : '') + '" data-value="' + o.value + '">' +
          (o.dot ? '<span class="dot ' + o.dot + '"></span>' : '') +
          '<span>' + esc(o.label) + '</span>' +
        '</div>';
      }).join('');
      return '<div class="siraj-select" id="' + id + '">' +
        '<div class="siraj-select-trigger">' +
          '<span class="siraj-select-value">' + (current.dot ? '<span class="dot ' + current.dot + '"></span>' : '') + esc(current.label) + '</span>' +
          '<svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>' +
        '</div>' +
        '<div class="siraj-select-panel">' + items + '</div>' +
      '</div>';
    }

    function bindSelects(root, handlers){
      if (!root) return;
      root.querySelectorAll('.siraj-select').forEach(function(sel){
        var trigger = sel.querySelector('.siraj-select-trigger');
        if (!trigger) return;
        trigger.onclick = function(e){
          e.stopPropagation();
          var wasOpen = sel.classList.contains('open');
          document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
          if (!wasOpen) sel.classList.add('open');
        };
        sel.querySelectorAll('.siraj-select-item').forEach(function(item){
          item.onclick = function(e){
            e.stopPropagation();
            var val = item.getAttribute('data-value');
            sel.classList.remove('open');
            if (handlers && handlers[sel.id]) handlers[sel.id](val);
          };
        });
      });
    }
    document.addEventListener('click', function(){
      document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
    });

    /* ---------- Popup ---------- */
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
        '<button class="siraj-popup-btn" onclick="document.getElementById(\'sirajPopup\').classList.remove(\'open\');setTimeout(function(){document.getElementById(\'sirajPopup\').remove();},320)">متوجه شدم</button>' +
      '</div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
    }
    window.__sirajPopup = showPopup;

    /* ---------- تاریخ‌های شمسی ---------- */
    function persianDate(d){
      try{
        return d.toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'});
      }catch(e){ return d.toString(); }
    }
    function persianMonthYear(d){
      try{
        return d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'});
      }catch(e){ return ''; }
    }
    function persianWeekday(d){
      try{
        return d.toLocaleDateString('fa-IR',{weekday:'long'});
      }catch(e){ return ''; }
    }

    /* ---------- محاسبه هفته‌ی ماه ---------- */
    function weekOfMonth(){
      var d = window.plannerDate || new Date();
      var dayOfMonth = parseInt(d.toLocaleDateString('en-US',{day:'numeric'}));
      // شماره هفته = ceil(روز / 7)
      return Math.ceil(dayOfMonth / 7);
    }

    /* ---------- تب‌ها ---------- */
    window.switchPlannerTab = function(tab){
      document.querySelectorAll('.planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2, tasks:3}[tab];
      var btns = document.querySelectorAll('.planner-tab');
      if (btns[idx]) btns[idx].classList.add('active');
      renderPane(tab);
    };

    function renderPane(tab){
      var pane = document.getElementById('plannerPane');
      if (!pane) return;
      if (tab === 'daily') pane.innerHTML = viewDaily();
      else if (tab === 'weekly') pane.innerHTML = viewWeekly();
      else if (tab === 'monthly') pane.innerHTML = viewMonthly();
      else if (tab === 'tasks') pane.innerHTML = viewTasks();
      bindPaneEvents(tab);
    }
    window.renderPlannerPane = function(){ renderPane(getTab()); };

    function bindPaneEvents(tab){
      var pane = document.getElementById('plannerPane');
      if (!pane) return;

      if (tab === 'daily'){
        var handlers = {
          pNewTime: function(val){
            var el = document.querySelector('#pNewTime .siraj-select-value');
            if (el) el.textContent = val || 'ساعت (اختیاری)';
            window.__pendingTime = val;
          },
          pNewPri: function(val){
            var map = {high:'🔴 بالا',med:'🟡 متوسط',low:'🟢 پایین'};
            var el = document.querySelector('#pNewPri .siraj-select-value');
            if (el) el.innerHTML = '';
            if (el) el.textContent = map[val] || 'متوسط';
            window.__pendingPri = val;
          }
        };
        bindSelects(pane, handlers);
      }
    }

    function injectTabs(){
      var tabsEl = document.querySelector('.planner-tabs');
      if (!tabsEl) return;
      if (!tabsEl.querySelector('[data-ptab="tasks"]')) {
        var btn = document.createElement('button');
        btn.className = 'planner-tab';
        btn.setAttribute('data-ptab','tasks');
        btn.setAttribute('onclick',"switchPlannerTab('tasks')");
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span>کارها</span>';
        tabsEl.appendChild(btn);
      }
    }

    /* ---------- نمای روزانه ---------- */
    function viewDaily(){
      var pl = window.loadPlannerNew();
      var d = window.plannerDate || new Date();
      var key = window.dateKey(d);
      var isToday = key === window.dateKey(new Date());
      var monthKey = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var currentGoal = goals.length ? goals.find(function(g){return !g.done;}) || goals[0] : null;

      var dd = window.getDayData(pl, key);
      var tasks = (dd.tasks || []).slice();

      var tasksHTML = tasks.length === 0
        ? '<div class="tasks-empty"><span class="emoji">📝</span>هنوز کاری برای امروز ثبت نکردی<br>از کادر بالا کار جدید اضافه کن</div>'
        : '<div class="tasks-list">' + tasks.map(function(tk, i){
            var priMap = {high:'بالا',med:'متوسط',low:'پایین'};
            return '<div class="task-item pri-' + (tk.priority||'med') + (tk.done?' done':'') + '">' +
              '<button class="task-check' + (tk.done?' checked':'') + '" onclick="window.__dToggleTask(' + i + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' +
              '</button>' +
              '<div class="task-info">' +
                '<div class="task-title">' + esc(tk.title) + '</div>' +
                '<div class="task-meta">' +
                  (tk.time ? '<span>🕐 ' + esc(tk.time) + '</span>' : '') +
                  '<span class="task-badge pri-' + (tk.priority||'med') + '">' + (priMap[tk.priority]||'متوسط') + '</span>' +
                '</div>' +
              '</div>' +
              '<button class="task-del" onclick="window.__dDeleteTask(' + i + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
              '</button>' +
            '</div>';
          }).join('') + '</div>';

      var hourOptions = [{value:'',label:'ساعت (اختیاری)'}].concat(
        [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(function(h){
          return {value:h+':00 تا '+(h+1)+':00', label:'ساعت ' + h + ' تا ' + (h+1)};
        })
      );
      var priOptions = [
        {value:'high',label:'بالا',dot:'red'},
        {value:'med',label:'متوسط',dot:'yellow'},
        {value:'low',label:'پایین',dot:'green'}
      ];
      window.__pendingTime = '';
      window.__pendingPri = 'med';

      return '' +
        '<div class="planner-hero-card">' +
          '<div class="phc-day">' + esc(persianWeekday(d)) + (isToday ? ' <span class="phc-today">امروز</span>' : '') + '</div>' +
          '<div class="phc-date">' + esc(persianDate(d)) + '</div>' +
          (currentGoal
            ? '<div class="phc-goal"><span class="phc-goal-icon">🎯</span><span>هدف ماه: ' + esc(currentGoal.text) + '</span></div>'
            : '<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>') +
        '</div>' +

        '<div class="planner-nav-bar">' +
          '<button class="planner-nav-btn" onclick="shiftPlannerDay(-1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
          '<div class="planner-nav-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>ساعت‌بندی روز</span></div>' +
          '<button class="planner-nav-btn" onclick="shiftPlannerDay(1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '</div>' +

        '<div class="task-add-form">' +
          '<input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()">' +
          makeSelect('pNewTime', '', hourOptions) +
          makeSelect('pNewPri', 'med', priOptions) +
          '<button class="task-add-btn" onclick="window.__dAddTask()">' +
            '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن' +
          '</button>' +
        '</div>' +

        '<div class="tasks-list-title">کارهای این روز:</div>' +
        tasksHTML;
    }

    window.__dAddTask = function(){
      var inp = document.getElementById('pNewTitle');
      if (!inp) return;
      var title = inp.value.trim();
      if (!title) return;
      var pl = window.loadPlannerNew();
      var d = window.plannerDate || new Date();
      var key = window.dateKey(d);
      var dd = window.getDayData(pl, key);
      dd.tasks.push({
        id: 'tk_'+Date.now(),
        title: title,
        time: window.__pendingTime || '',
        priority: window.__pendingPri || 'med',
        done: false,
        createdAt: Date.now()
      });
      window.savePlanner(pl);
      inp.value = '';
      window.__pendingTime = '';
      window.__pendingPri = 'med';
      window.renderPlannerPane();
    };

    window.__dToggleTask = function(i){
      var pl = window.loadPlannerNew();
      var key = window.dateKey(window.plannerDate || new Date());
      var dd = window.getDayData(pl, key);
      if (!dd.tasks[i]) return;
      dd.tasks[i].done = !dd.tasks[i].done;
      window.savePlanner(pl);
      if (dd.tasks[i].done){
        showPopup('🎉', 'آفرین!', 'یه کار دیگه انجام شد. داری عالی پیش می‌ری!');
      }
      window.renderPlannerPane();
    };

    window.__dDeleteTask = function(i){
      var pl = window.loadPlannerNew();
      var key = window.dateKey(window.plannerDate || new Date());
      var dd = window.getDayData(pl, key);
      if (!dd.tasks[i]) return;
      dd.tasks.splice(i,1);
      window.savePlanner(pl);
      window.renderPlannerPane();
    };

    /* ---------- نمای هفتگی ---------- */
    function viewWeekly(){
      var pl = window.loadPlannerNew();
      var days = window.getWeekDays();
      var todayKey = window.dateKey(new Date());
      var d = window.plannerDate || new Date();

      var headerRow = '<tr><th class="hour-col">ساعت</th>' +
        days.map(function(day){
          var isToday = day.key === todayKey;
          return '<th title="با کلیک روی هر روز، کارهای این روز انجام شده اعلام میشه"' + (isToday ? ' style="background:var(--accent-soft);color:var(--accent)"' : '') + '>' +
            esc(day.name) +
            '<div style="font-size:9.5px;opacity:.7;font-weight:600;margin-top:2px">' + esc(day.date) + '</div>' +
          '</th>';
        }).join('') + '</tr>';

      var HOURS = [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
      var bodyRows = HOURS.map(function(h){
        var hk = String(h).padStart(2,'0');
        var cells = days.map(function(day){
          var dd = window.getDayData(pl, day.key);
          var tasksForHour = (dd.tasks||[]).filter(function(tk){
            return tk.time && tk.time.indexOf(h+':00') === 0;
          });
          var val = (dd.hours && dd.hours[hk]) || '';
          var isToday = day.key === todayKey;
          var tasksHTML = tasksForHour.length
            ? '<div class="week-cell-tasks">' + tasksForHour.map(function(tk){
                return '<div class="week-cell-task ' + (tk.done?'done':'') + '">' +
                  '<span class="wt-title">' + esc(tk.title.substring(0,20)) + '</span>' +
                  '<button class="cell-check' + (tk.done?' done':'') + '" onclick="event.stopPropagation();window.__wToggleTask(\'' + day.key + '\',\'' + tk.id + '\')">' +
                    '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' +
                  '</button>' +
                '</div>';
              }).join('') + '</div>' : '';
          return '<td class="task-cell' + (isToday?' today':'') + '">' +
            tasksHTML +
            '<input type="text" class="cell-input" value="' + esc(val) + '" placeholder="—" oninput="saveHour(\'' + day.key + '\',\'' + hk + '\',this.value)">' +
          '</td>';
        }).join('');
        return '<tr><td class="hour-cell">' + hk + ':۰۰</td>' + cells + '</tr>';
      }).join('');

      var wk = weekOfMonth();
      return '' +
        '<div class="planner-hero-card">' +
          '<div class="phc-day">' + esc(persianMonthYear(d)) + '</div>' +
          '<div class="phc-date">هفته ' + wk + ' ماه — از ' + esc(days[0].date) + ' تا ' + esc(days[6].date) + '</div>' +
        '</div>' +
        '<div class="planner-nav-bar">' +
          '<button class="planner-nav-btn" onclick="shiftPlannerWeek(-1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
          '<div class="planner-nav-title"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>برنامه هفتگی</span></div>' +
          '<button class="planner-nav-btn" onclick="shiftPlannerWeek(1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '</div>' +
        '<div class="week-grid-wrap"><table class="week-table"><thead>' + headerRow + '</thead><tbody>' + bodyRows + '</tbody></table></div>';
    }

    window.__wToggleTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      dd.tasks[idx].done = !dd.tasks[idx].done;
      window.savePlanner(pl);
      if (dd.tasks[idx].done){
        var praises = [
          ['🎉','ایول!','یکی دیگه هم رفت!'],
          ['🌟','آفرین!','داری می‌ترکونی!'],
          ['🚀','عالی!','ادامه بده همینطور!'],
          ['💪','قوی!','این کار رو فتح کردی!']
        ];
        var pick = praises[Math.floor(Math.random()*praises.length)];
        showPopup(pick[0], pick[1], pick[2]);
      } else {
        showPopup('😐', 'مطمئنی؟', 'کار رو برگردوندی به انجام نشده. یه بار دیگه تلاش کن!');
      }
      window.renderPlannerPane();
    };

    /* ---------- نمای ماهانه ---------- */
    function viewMonthly(){
      var pl = window.loadPlannerNew();
      var d = window.plannerDate || new Date();
      var year = d.getFullYear();
      var month = d.getMonth();
      var monthKey = year+'-'+String(month+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];

      var firstOfMonth = new Date(year,month,1);
      var lastOfMonth = new Date(year,month+1,0);
      var daysInMonth = lastOfMonth.getDate();
      var startOffset = (firstOfMonth.getDay()+1)%7;
      var todayKey = window.dateKey(new Date());
      var selectedKey = window.dateKey(d);
      var weekdays = ['ش','ی','د','س','چ','پ','ج'];

      var cells = [];
      for (var i=0;i<startOffset;i++) cells.push('<div class="cal-day empty"></div>');
      for (var dd=1; dd<=daysInMonth; dd++){
        var dt = new Date(year,month,dd);
        var k = window.dateKey(dt);
        var isToday = k===todayKey;
        var isSel = k===selectedKey;
        var isFri = dt.getDay()===5;
        var dayData = window.getDayData(pl,k);
        var doneCount = (dayData.tasks||[]).filter(function(x){return x.done;}).length;
        var total = (dayData.tasks||[]).length;
        var dots = '';
        if (total > 0){
          var dotCount = Math.min(total,3);
          var dotHTML = '';
          for (var j=0;j<dotCount;j++){
            dotHTML += '<span class="cal-day-dot" style="' + (j<doneCount?'':'opacity:.3') + '"></span>';
          }
          dots = '<div class="cal-day-dots">' + dotHTML + '</div>';
        }
        cells.push(
          '<div class="cal-day' + (isToday?' today':'') + (isSel?' selected':'') + (isFri?' friday':'') + '" onclick="selectMonthDay(' + dd + ')">' +
            '<span class="cal-day-num">' + dd + '</span>' + dots +
          '</div>'
        );
      }

      var goalsHTML = goals.length === 0
        ? '<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:10px 0">هنوز هدفی ثبت نشده</div>'
        : goals.map(function(g,i){
            return '<div class="month-goal' + (g.done?' done':'') + '">' +
              '<input type="checkbox" ' + (g.done?'checked':'') + ' onchange="toggleMonthGoal(\'' + monthKey + '\',' + i + ')">' +
              '<span class="mg-text">' + esc(g.text) + '</span>' +
              '<button class="mg-del" onclick="deleteMonthGoal(\'' + monthKey + '\',' + i + ')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
            '</div>';
          }).join('');

      var doneGoals = goals.filter(function(g){return g.done;}).length;

      return '' +
        '<div class="planner-hero-card">' +
          '<div class="phc-day">' + esc(persianMonthYear(d)) + '</div>' +
          '<div class="phc-date">' + doneGoals + ' از ' + goals.length + ' هدف این ماه انجام شده</div>' +
        '</div>' +
        '<div class="planner-nav-bar">' +
          '<button class="planner-nav-btn" onclick="shiftPlannerMonth(-1)"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
          '<div class="planner-nav-title"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>اهداف و تقویم</span></div>' +
          '<button class="planner-nav-btn" onclick="shiftPlannerMonth(1)"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
        '</div>' +
        '<div class="month-goals">' +
          '<div class="month-goals-title"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>اهداف این ماه</span></div>' +
          (goals.length ? '<div class="month-goals-list">' + goalsHTML + '</div>' : goalsHTML) +
          '<div class="month-goal-add">' +
            '<input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\'' + monthKey + '\')">' +
            '<button onclick="addMonthGoal(\'' + monthKey + '\')">افزودن</button>' +
          '</div>' +
        '</div>' +
        '<div class="month-calendar">' +
          '<div class="cal-weekdays">' + weekdays.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('') + '</div>' +
          '<div class="cal-grid">' + cells.join('') + '</div>' +
        '</div>';
    }

    /* ---------- نمای کارها ---------- */
    function viewTasks(){
      var pl = window.loadPlannerNew();
      var allTasks = [];
      var days = Object.keys(pl.days||{});
      days.forEach(function(k){
        var dd = pl.days[k];
        (dd.tasks||[]).forEach(function(tk,i){
          allTasks.push({dayKey:k, idx:i, task:tk});
        });
      });
      allTasks.sort(function(a,b){ return (b.task.createdAt||0) - (a.task.createdAt||0); });

      if (allTasks.length === 0){
        return '<div class="tasks-empty"><span class="emoji">📋</span>هنوز کاری توی هیچ روزی ثبت نکردی<br>از تب «روزانه» شروع کن!</div>';
      }

      return '<div class="tasks-list-title">همه‌ی کارها (' + allTasks.length + ')</div>' +
        '<div class="tasks-list">' + allTasks.map(function(item){
          var tk = item.task;
          var isDone = !!tk.done;
          var priMap = {high:'بالا',med:'متوسط',low:'پایین'};
          var d = new Date(item.dayKey);
          var dateStr = isNaN(d) ? item.dayKey : d.toLocaleDateString('fa-IR',{day:'numeric',month:'short'});
          return '<div class="task-item pri-' + (tk.priority||'med') + (isDone?' done':'') + '">' +
            '<button class="task-check' + (isDone?' checked':'') + '" onclick="window.__allToggle(\'' + item.dayKey + '\',' + item.idx + ')">' +
              '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' +
            '</button>' +
            '<div class="task-info">' +
              '<div class="task-title">' + esc(tk.title) + '</div>' +
              '<div class="task-meta">' +
                '<span>📅 ' + dateStr + '</span>' +
                (tk.time ? '<span>🕐 ' + esc(tk.time) + '</span>' : '') +
                '<span class="task-badge pri-' + (tk.priority||'med') + '">' + (priMap[tk.priority]||'متوسط') + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="task-del" onclick="window.__allDelete(\'' + item.dayKey + '\',' + item.idx + ')">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>';
        }).join('') + '</div>';
    }

    window.__allToggle = function(dayKey, i){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      if (!dd.tasks[i]) return;
      dd.tasks[i].done = !dd.tasks[i].done;
      window.savePlanner(pl);
      if (dd.tasks[i].done) showPopup('🎉','آفرین!','یکی دیگه انجام شد!');
      window.renderPlannerPane();
    };
    window.__allDelete = function(dayKey, i){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      if (!dd.tasks[i]) return;
      dd.tasks.splice(i,1);
      window.savePlanner(pl);
      window.renderPlannerPane();
    };

    /* ---------- پنل راست ---------- */
    window.renderPanelForPlanner = function(){
      document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
      document.getElementById('panelSubText').textContent = 'خلاصه امروز';
      var pl = window.loadPlannerNew();
      var todayKey = window.dateKey(new Date());
      var dd = window.getDayData(pl, todayKey);
      var tasks = dd.tasks || [];
      var done = tasks.filter(function(t){return t.done;}).length;
      var pct = tasks.length ? Math.round((done/tasks.length)*100) : 0;

      var days = window.getWeekDays();
      var weekTotal = 0, weekDone = 0;
      days.forEach(function(d){
        var ddd = window.getDayData(pl, d.key);
        weekTotal += (ddd.tasks||[]).length;
        weekDone += (ddd.tasks||[]).filter(function(t){return t.done;}).length;
      });

      var monthKey = new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0');
      var monthGoals = (pl.months[monthKey] && pl.months[monthKey].goals) || [];
      var goal = monthGoals.find(function(g){return !g.done;}) || monthGoals[0];

      var weekPct = weekTotal ? Math.round((weekDone/weekTotal)*100) : 0;

      document.getElementById('panelContent').innerHTML =
        '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
          '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>امروز</span></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:6px 0">' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--accent)">' + done + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">انجام شده</div></div>' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--text-muted)">' + (tasks.length - done) + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">باقی‌مونده</div></div>' +
          '</div>' +
          '<div class="planner-progress"><div class="planner-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<div style="font-size:10.5px;color:var(--text-muted);text-align:center">' + pct + '% پیشرفت امروز</div>' +
        '</div>' +

        (goal
          ? '<div class="panel-card" style="border-color:var(--accent);background:var(--accent-soft)">' +
              '<div class="card-title" style="border-bottom-color:var(--accent)"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>هدف این ماه</span></div>' +
              '<div style="font-size:12px;line-height:1.9;text-align:center;padding:6px 4px;color:var(--accent)">🎯 ' + esc(goal.text) + '</div>' +
            '</div>'
          : '') +

        '<div class="panel-card">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><path d="M3 3v18h18"/></svg><span>این هفته</span></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:6px 0">' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--accent)">' + weekTotal + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">کل کارها</div></div>' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--accent)">' + weekPct + '%</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">پیشرفت</div></div>' +
          '</div>' +
        '</div>' +

        '<div class="panel-card">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg><span>دسترسی سریع</span></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'daily\')"><div class="li-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="li-body"><div class="li-title">برنامه امروز</div></div></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'tasks\')"><div class="li-icon"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg></div><div class="li-body"><div class="li-title">همه‌ی کارها</div></div></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'weekly\')"><div class="li-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg></div><div class="li-body"><div class="li-title">برنامه هفتگی</div></div></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'monthly\')"><div class="li-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg></div><div class="li-body"><div class="li-title">اهداف ماهانه</div></div></div>' +
        '</div>';
    };

    /* ---------- Hook ها ---------- */
    var origRenderPlanner = window.renderPlanner;
    window.renderPlanner = function(){
      origRenderPlanner.apply(this, arguments);
      injectTabs();
      setTimeout(function(){
        renderPane(getTab());
      }, 30);
    };

    var origSwitchView = window.switchView;
    window.switchView = function(v){
      origSwitchView.apply(this, arguments);
      if (v === 'planner'){
        setTimeout(function(){
          injectTabs();
          renderPane(getTab());
        }, 50);
      }
    };

    /* ---------- دکمه‌های نوار پایین + لیبل ---------- */
    setTimeout(function(){
      var labels = {
        planner: 'برنامه‌ریز',
        chat: 'گفتگو',
        tools: 'دستیار',
        videos: 'انجمن',
        blog: 'مقالات'
      };
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
    }, 800);
    /* ---------- جایگزین کردن محتوای مقالات با «به‌زودی» ---------- */
    window.renderBlog = function(){
      var v = document.getElementById('view-blog');
      if (!v) return;
      v.innerHTML = '' +
        '<div class="page-title-bar"><div class="page-title-text">مقالات سراج</div></div>' +
        '<div class="community-hero">' +
          '<div class="community-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>' +
          '</div>' +
          '<div class="community-title">مقالات و یادداشت‌های سراج</div>' +
          '<div class="community-desc">یه فضای گرم و صمیمی برای نوشتن مقالات درباره‌ی زبان و ادبیات عربی، نکات آموزشی، یادداشت‌های شخصی و تجربه‌های یادگیری. به‌زودی می‌تونی اینجا مقاله بنویسی و با بقیه به اشتراک بذاری ✍️</div>' +
          '<div class="community-badge">' +
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>' +
            'به‌زودی راه‌اندازی می‌شه' +
          '</div>' +
        '</div>';
    };

    console.log('[planner-v2] v2.1 ready ✓');
  }
})();