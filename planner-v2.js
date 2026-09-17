/* Siraj v2.0 — planner-v2.js */
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
    /* تاریخ: ماه اول، بعد سال */
    function pDate(d){ try{ return d.toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return ''; } }
    function pMonthYear(d){
      try{
        var m = d.toLocaleDateString('fa-IR',{month:'long'});
        var y = d.toLocaleDateString('fa-IR',{year:'numeric'});
        return m + ' ' + y;
      }catch(e){ return ''; }
    }
    function pWeekday(d){ try{ return d.toLocaleDateString('fa-IR',{weekday:'long'}); }catch(e){ return ''; } }
    function weekOfMonth(){
      var d = window.plannerDate || new Date();
      var day = parseInt(d.toLocaleDateString('en-US',{day:'numeric'}));
      return Math.ceil(day/7);
    }
    var ORD = ['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){ n=Math.max(1,Math.min(6,n)); return ORD[n-1]; }

    /* هفته‌ی خودمون که از window.plannerDate استفاده می‌کنه */
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

    /* ============ Smart Animation ============ */
    var prevHero = {};
    function applySmartAnim(tab){
      setTimeout(function(){
        var c = document.querySelector('.phc-center');
        if (!c) return;
        var cur = {};
        c.querySelectorAll('[data-anim-key]').forEach(function(el){
          var k = el.getAttribute('data-anim-key');
          var v = el.textContent.trim();
          cur[k] = v;
          if (prevHero[k] !== undefined && prevHero[k] !== v){
            el.classList.remove('heroRoll');
            void el.offsetWidth;
            el.classList.add('heroRoll');
          }
        });
        prevHero = cur;
      }, 25);
    }

    function makeSelect(id, value, options){
      var cur = options.find(function(o){return o.value === value;}) || options[0];
      var items = options.map(function(o){
        return '<div class="siraj-select-item ' + (o.value === value ? 'active' : '') + '" data-value="' + o.value + '">' +
          (o.dot ? '<span class="dot ' + o.dot + '"></span>' : '') + '<span>' + esc(o.label) + '</span></div>';
      }).join('');
      return '<div class="siraj-select" id="' + id + '">' +
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
    window.__sirajPopup = showPopup;

    window.__navDay = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
    };
    window.__navWeek = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir * 7);
      window.plannerDate = d;
      window.renderPlannerPane();
    };
    window.__navMonth = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(1);
      d.setMonth(d.getMonth() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
    };

    window.switchPlannerTab = function(tab){
      prevHero = {};
      document.querySelectorAll('.planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2}[tab];
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
      bindPaneEvents(tab);
      applySmartAnim(tab);
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
    }

    /* ============ نمای روزانه ============ */
    function viewDaily(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var isToday = key === window.dateKey(new Date());
      var monthKey = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var goal = goals.length ? (goals.find(function(g){return !g.done;}) || goals[0]) : null;
      var dd = window.getDayData(pl, key);
      var tasks = (dd.tasks || []).slice();

      var tasksHTML = tasks.length === 0
        ? '<div class="tasks-empty"><span class="emoji">📝</span>هنوز کاری برای این روز ثبت نکردی<br>از کادر بالا کار جدید اضافه کن</div>'
        : '<div class="tasks-list">' + tasks.map(function(tk, i){
            var pm = {high:'بالا',med:'متوسط',low:'پایین'};
            return '<div class="task-item pri-' + (tk.priority||'med') + (tk.done?' done':'') + '">' +
              '<button class="task-check' + (tk.done?' checked':'') + '" onclick="window.__dToggleTask(' + i + ')">' +
                '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
              '<div class="task-info"><div class="task-title">' + esc(tk.title) + '</div>' +
                '<div class="task-meta">' +
                  (tk.time ? '<span>🕐 ' + esc(tk.time) + '</span>' : '') +
                  '<span class="task-badge pri-' + (tk.priority||'med') + '">' + (pm[tk.priority]||'متوسط') + '</span>' +
                '</div></div>' +
              '<button class="task-del" onclick="window.__dDeleteTask(' + i + ')">' +
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

      return '<div class="planner-hero-card">' +
          '<button class="phc-nav-btn" onclick="window.__navDay(-1)" title="روز قبل"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '<div class="phc-center">' +
            '<div class="phc-day"><span data-anim-key="dayName">' + esc(pWeekday(d)) + '</span>' + (isToday ? ' <span class="phc-today">امروز</span>' : '') + '</div>' +
            '<div class="phc-date"><span data-anim-key="dateStr">' + esc(pDate(d)) + '</span></div>' +
            (goal
              ? '<div class="phc-goal"><span>🎯</span><span>هدف ماه: ' + esc(goal.text) + '</span></div>'
              : '<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>') +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navDay(1)" title="روز بعد"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '</div>' +
        '<div class="task-add-form">' +
          '<input type="text" id="pNewTitle" placeholder="عنوان کار جدید..." onkeydown="if(event.key===\'Enter\')window.__dAddTask()">' +
          makeSelect('pNewTime', '', hourOpt) +
          makeSelect('pNewPri', 'med', priOpt) +
          '<button class="task-add-btn" onclick="window.__dAddTask()"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن</button>' +
        '</div>' +
        '<div class="tasks-list-title">کارهای این روز:</div>' + tasksHTML;
    }

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
      inp.value = ''; window.__pendingTime = ''; window.__pendingPri = 'med';
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
        var arr = [['🎉','آفرین!','یکی دیگه انجام شد!'],['🌟','درخشیدی!','ادامه بده!'],['🚀','عالی!','داری می‌ترکونی!']];
        var p = arr[Math.floor(Math.random()*arr.length)];
        showPopup(p[0], p[1], p[2]);
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

    /* ============ نمای هفتگی ============ */
    function viewWeekly(){
      var pl = window.loadPlannerNew();
      var days = myWeekDays();
      var todayKey = window.dateKey(new Date());
      var d = new Date(window.plannerDate || new Date());

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
          var val = (dd.hours && dd.hours[hk]) || '';
          var isToday = day.key === todayKey;
          var firstTask = hourTasks[0];
          var tasksHTML = firstTask
            ? '<div class="week-cell-task' + (firstTask.done?' done':'') + '">' +
                '<div class="wt-actions">' +
                  '<button class="wt-btn cross" onclick="event.stopPropagation();window.__wCrossTask(\'' + day.key + '\',\'' + firstTask.id + '\')" title="انجام نشد">' +
                    '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                  '<button class="wt-btn tick' + (firstTask.done?' on':'') + '" onclick="event.stopPropagation();window.__wTickTask(\'' + day.key + '\',\'' + firstTask.id + '\')" title="انجام شد">' +
                    '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
                '</div>' +
                '<span class="wt-title">' + esc(firstTask.title) + '</span>' +
              '</div>' : '';
          return '<td class="task-cell' + (isToday?' today':'') + (firstTask?' has-task':'') + '">' + tasksHTML +
            '<input type="text" class="cell-input" value="' + esc(val) + '" placeholder="—" oninput="saveHour(\'' + day.key + '\',\'' + hk + '\',this.value)"></td>';
        }).join('');
        return '<tr><td class="hour-cell">' + hk + ':۰۰</td>' + cells + '</tr>';
      }).join('');

      var wRange = 'از ' + esc(days[0].date) + ' تا ' + esc(days[6].date);

      return '<div class="planner-hero-card">' +
          '<button class="phc-nav-btn" onclick="window.__navWeek(-1)" title="هفته قبل"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '<div class="phc-center">' +
            '<div class="phc-day"><span data-anim-key="monthYear">' + esc(pMonthYear(d)) + '</span></div>' +
            '<div class="phc-date"><span data-anim-key="weekNum">هفته ' + weekOrd(weekOfMonth()) + ' ماه</span> — <span data-anim-key="weekRange">' + wRange + '</span></div>' +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navWeek(1)" title="هفته بعد"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '</div>' +
        '<div class="week-grid-wrap"><table class="week-table"><thead>' + headerRow + '</thead><tbody>' + bodyRows + '</tbody></table></div>';
    }

    window.__wTickTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      dd.tasks[idx].done = true;
      window.savePlanner(pl);
      var arr = [['🎉','آفرین!','کار انجام شد!'],['🌟','درخشیدی!','یکی دیگه فتح شد!'],['🚀','عالی!','ادامه بده!']];
      var p = arr[Math.floor(Math.random()*arr.length)];
      showPopup(p[0], p[1], p[2]);
      window.renderPlannerPane();
    };
    window.__wCrossTask = function(dayKey, taskId){
      var pl = window.loadPlannerNew();
      var dd = window.getDayData(pl, dayKey);
      var idx = (dd.tasks||[]).findIndex(function(tk){return tk.id === taskId;});
      if (idx < 0) return;
      dd.tasks[idx].done = false;
      window.savePlanner(pl);
      var arr = [['😐','یادت نره!','هنوز انجام نشده!'],['🤔','چرا؟','وقت داری هنوز!'],['⏰','یادت باشه!','این کار منتظرته!']];
      var m = arr[Math.floor(Math.random()*arr.length)];
      showPopup(m[0], m[1], m[2]);
      window.renderPlannerPane();
    };

    /* ============ نمای ماهانه ============ */
    function viewMonthly(){
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
        var dots = '';
        if (total > 0){
          var dc = Math.min(total,3), dhtml = '';
          for (var j=0;j<dc;j++) dhtml += '<span class="cal-day-dot" style="' + (j<doneC?'':'opacity:.3') + '"></span>';
          dots = '<div class="cal-day-dots">' + dhtml + '</div>';
        }
        cells.push('<div class="cal-day' + (isToday?' today':'') + (isSel?' selected':'') + (isFri?' friday':'') + '" onclick="selectMonthDay(' + dd + ')">' +
          '<span class="cal-day-num">' + dd + '</span>' + dots + '</div>');
      }

      /* پنل اهداف بازطراحی شده */
      var goalsHTML = '';
      if (goals.length === 0){
        goalsHTML = '<div class="mg-empty"><span class="mg-empty-icon">🎯</span><div class="mg-empty-text">هنوز هدفی ثبت نشده</div></div>';
      } else {
        goalsHTML = '<div class="month-goals-list">' + goals.map(function(g,i){
          return '<div class="month-goal' + (g.done?' done':'') + '">' +
            '<label class="mg-check-wrap">' +
              '<input type="checkbox" ' + (g.done?'checked':'') + ' onchange="toggleMonthGoal(\'' + monthKey + '\',' + i + ')">' +
              '<span class="mg-check"></span>' +
            '</label>' +
            '<span class="mg-text">' + esc(g.text) + '</span>' +
            '<button class="mg-del" onclick="deleteMonthGoal(\'' + monthKey + '\',' + i + ')" title="حذف">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button></div>';
        }).join('') + '</div>';
      }
      var doneGoals = goals.filter(function(g){return g.done;}).length;

      return '<div class="planner-hero-card">' +
          '<button class="phc-nav-btn" onclick="window.__navMonth(-1)" title="ماه قبل"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '<div class="phc-center">' +
            '<div class="phc-day"><span data-anim-key="monthYear">' + esc(pMonthYear(d)) + '</span></div>' +
            '<div class="phc-date">' + doneGoals + ' از ' + goals.length + ' هدف این ماه انجام شده</div>' +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navMonth(1)" title="ماه بعد"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '</div>' +
        '<div class="month-goals">' +
          '<div class="month-goals-title">' +
            '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' +
            '<span>اهداف این ماه</span>' +
            (goals.length > 0 ? '<span class="mg-counter">' + doneGoals + '/' + goals.length + '</span>' : '') +
          '</div>' +
          goalsHTML +
          '<div class="month-goal-add">' +
            '<input type="text" id="newGoalInput" placeholder="هدف جدید..." onkeydown="if(event.key===\'Enter\')addMonthGoal(\'' + monthKey + '\')">' +
            '<button onclick="addMonthGoal(\'' + monthKey + '\')"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><span>افزودن</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="month-calendar">' +
          '<div class="cal-weekdays">' + weekdays.map(function(w){return '<div class="cal-weekday">'+w+'</div>';}).join('') + '</div>' +
          '<div class="cal-grid">' + cells.join('') + '</div>' +
        '</div>';
    }

    /* ============ پنل راست ============ */
    window.renderPanelForPlanner = function(){
      document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
      document.getElementById('panelSubText').textContent = 'خوش آمدی 🌟';
      document.getElementById('panelContent').innerHTML =
        '<button onclick="window.__openStudy()" style="display:flex;align-items:center;gap:12px;width:100%;padding:18px 20px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--accent-light),var(--accent-dark));color:#fff;font-family:var(--font-text);font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px -10px var(--accent);transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'translateY(0)\'">' +
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
            '🎯 تا آخر تایمر سایت قفل میشه<br>' +
            '💬 اگه سؤال درسی داشتی، «مطالعه با سراج» رو بزن' +
          '</div>' +
        '</div>';
    };

    /* ============ Ambient Sound ============ */
    var audioCtx = null, audioNodes = null, currentSound = null, masterGain = null;

    function stopAudio(){
      if (audioNodes && audioNodes.nodes){
        audioNodes.nodes.forEach(function(n){
          try { if (n.stop) n.stop(); } catch(e){}
          try { n.disconnect(); } catch(e){}
        });
      }
      if (audioNodes && audioNodes.gain){
        try { audioNodes.gain.disconnect(); } catch(e){}
      }
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
        var bufferSize = audioCtx.sampleRate * 4;
        var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        var data = buffer.getChannelData(0);
        var last = 0;
        for (var i=0;i<bufferSize;i++){
          var white = Math.random()*2 - 1;
          data[i] = (last + 0.015 * white) / 1.015;
          last = data[i]; data[i] *= 3.2;
        }
        var src = audioCtx.createBufferSource();
        src.buffer = buffer; src.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 550; filter.Q.value = 0.7;
        var lfo = audioCtx.createOscillator(), lfoGain = audioCtx.createGain();
        lfo.frequency.value = 0.08; lfoGain.gain.value = 150;
        lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
        src.connect(filter); lfo.start(); src.start();
        nodes.push(src, lfo, lfoGain);
      } else if (type === 'hall'){
        var bufSize = audioCtx.sampleRate * 3;
        var buffer2 = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        var d = buffer2.getChannelData(0);
        var lastV = 0;
        for (var j=0;j<bufSize;j++){
          var w = Math.random()*2 - 1;
          d[j] = (lastV + 0.008 * w) / 1.008;
          lastV = d[j]; d[j] *= 2.5;
        }
        var src2 = audioCtx.createBufferSource();
        src2.buffer = buffer2; src2.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 280;
        var osc = audioCtx.createOscillator(), oscGain = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = 110; oscGain.gain.value = 0.03;
        osc.connect(oscGain); oscGain.connect(gain);
        src2.connect(filter); osc.start(); src2.start();
        nodes.push(src2, osc, oscGain);
      } else if (type === 'rain'){
        var bufSize3 = audioCtx.sampleRate * 2;
        var buffer3 = audioCtx.createBuffer(1, bufSize3, audioCtx.sampleRate);
        var d3 = buffer3.getChannelData(0);
        for (var k=0;k<bufSize3;k++) d3[k] = (Math.random()*2 - 1) * 0.6;
        var src3 = audioCtx.createBufferSource();
        src3.buffer = buffer3; src3.loop = true;
        filter.type = 'lowpass'; filter.frequency.value = 700; filter.Q.value = 1.2;
        src3.connect(filter); src3.start();
        nodes.push(src3);
      }
      audioNodes = {nodes:nodes, gain:gain, filter:filter};
      currentSound = type;
    }
    function setMasterVolume(v){ if (masterGain) masterGain.gain.value = v; }

    /* ============ حالت مطالعه ============ */
    var studyTimer = null, studySeconds = 0, studyRunning = false, studyPaused = false;

    function buildStudyOverlay(){
      var old = document.getElementById('studyOverlay');
      if (old) old.remove();
      var pl = window.loadPlannerNew();
      var allTasks = [];
      Object.keys(pl.days || {}).forEach(function(k){
        (pl.days[k].tasks || []).forEach(function(tk){
          if (!tk.done) allTasks.push(tk.title);
        });
      });
      var hasTasks = allTasks.length > 0;

      var taskFieldHTML = hasTasks
        ? '<div class="siraj-select" id="studyTaskSelect" style="width:100%">' +
            '<div class="siraj-select-trigger" style="width:100%">' +
              '<span class="siraj-select-value">— یک کار انتخاب کن (اختیاری) —</span>' +
              '<svg class="siraj-select-arrow" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>' +
            '</div>' +
            '<div class="siraj-select-panel" style="width:100%;min-width:100%">' +
              allTasks.map(function(tn){
                return '<div class="siraj-select-item" data-value="' + esc(tn) + '"><span>' + esc(tn) + '</span></div>';
              }).join('') +
            '</div>' +
          '</div>'
        : '<div class="study-empty-box">📝 هنوز هیچ کار فعالی نداری<br>اول یه کار اضافه کن</div>' +
          '<button class="study-btn" id="studyGoPlanBtn" style="width:100%">' +
            '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>برو به برنامه‌ریزی' +
          '</button>';

      var el = document.createElement('div');
      el.id = 'studyOverlay';
      el.className = 'study-overlay';
      el.innerHTML =
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          '<div class="study-sub">کاری که می‌خوای روش تمرکز کنی رو انتخاب کن و زمان رو تعیین کن</div>' +
          taskFieldHTML +
          '<div class="stp-wrap" id="studyTimePicker">' +
            '<div class="stp-hint">↑ بکش بالا / ↓ پایین</div>' +
            '<span class="stp-unit">دقیقه</span>' +
            '<span class="stp-num" id="studyTimeNum">25</span>' +
          '</div>' +
          '<div class="study-music-section">' +
            '<div class="study-music-title">' +
              '<svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' +
              '<span>صدای محیطی (اختیاری)</span>' +
            '</div>' +
            '<div class="study-sound-grid">' +
              '<button class="study-sound-btn" data-sound="nature"><span class="ss-icon">🌊</span><span>موج دریا</span></button>' +
              '<button class="study-sound-btn" data-sound="hall"><span class="ss-icon">🌙</span><span>سکوت گرم</span></button>' +
              '<button class="study-sound-btn" data-sound="rain"><span class="ss-icon">☔</span><span>بارش ملایم</span></button>' +
              '<button class="study-sound-btn off-btn on" data-sound=""><span class="ss-icon">🔇</span><span>خاموش</span></button>' +
            '</div>' +
            '<div class="study-volume-row">' +
              '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>' +
              '<input type="range" min="0" max="100" value="40" id="studyVolume" style="--vp:40%">' +
            '</div>' +
          '</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyStartBtn"><svg viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>شروع مطالعه</button>' +
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
          '<div class="study-task" id="studyTaskName">—</div>' +
          '<div id="studyNowPlaying" style="display:none"><span class="study-now-playing"><span class="eq"><span></span><span></span><span></span><span></span></span><span id="studyNowPlayingText">در حال پخش</span></span></div>' +
          '<div class="study-sub" id="studyRunningSub">تا اتمام تایمر نمیتونی خارج شی. موفق باشی! 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn pause-mode" id="studyPauseBtn">' +
              '<svg class="pause-icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>' +
              '<svg class="play-icon" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" fill="currentColor"/></svg>' +
              '<span id="studyPauseLabel">توقف</span>' +
            '</button>' +
            '<button class="study-btn" id="studyChatBtn"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>مطالعه با سراج</button>' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      var picker = el.querySelector('#studyTimePicker');
      var numEl = el.querySelector('#studyTimeNum');
      var pickerVal = 25, dragStartY = 0, dragStartVal = 25, dragging = false;

      function setPickerVal(v){
        pickerVal = Math.max(1, Math.min(180, Math.round(v)));
        numEl.textContent = pickerVal;
      }
      setPickerVal(25);

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
        var change = Math.round((dragStartY - y) / 6);
        setPickerVal(dragStartVal + change);
      }
      function pointerUp(){
        if (!dragging) return;
        dragging = false;
        picker.classList.remove('dragging');
      }
      picker.addEventListener('mousedown', pointerDown);
      document.addEventListener('mousemove', pointerMove);
      document.addEventListener('mouseup', pointerUp);
      picker.addEventListener('touchstart', pointerDown, {passive:false});
      document.addEventListener('touchmove', pointerMove, {passive:false});
      document.addEventListener('touchend', pointerUp);
      picker.addEventListener('dblclick', function(){
        var v = prompt('زمان مطالعه (۱ تا ۱۸۰ دقیقه):', pickerVal);
        if (v !== null){ var n = parseInt(v); if (!isNaN(n)) setPickerVal(n); }
      });
      window.__studyMinutesGetter = function(){ return pickerVal; };

      el.querySelectorAll('.study-sound-btn').forEach(function(btn){
        btn.onclick = function(){
          var snd = btn.getAttribute('data-sound');
          el.querySelectorAll('.study-sound-btn').forEach(function(b){ b.classList.remove('on'); });
          if (!snd){ stopAudio(); btn.classList.add('on'); return; }
          btn.classList.add('on');
          stopAudio();
          try { makeNoise(snd); } catch(e){ console.error(e); }
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
      window.__studyTask = '';
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
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      var task = window.__studyTask || '';
      var mins = window.__studyMinutesGetter ? window.__studyMinutesGetter() : 25;
      if (!mins || mins < 1) mins = 25;
      if (mins > 180) mins = 180;
      studySeconds = mins * 60;
      studyRunning = true; studyPaused = false;

      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      overlay.querySelector('#studyTaskName').textContent = task || 'مطالعه آزاد';
      overlay.classList.remove('paused');

      var nowPlaying = overlay.querySelector('#studyNowPlaying');
      if (currentSound && nowPlaying){
        var names = {nature:'موج دریا 🌊', hall:'سکوت گرم 🌙', rain:'بارش ملایم ☔'};
        overlay.querySelector('#studyNowPlayingText').textContent = names[currentSound] || 'در حال پخش';
        nowPlaying.style.display = 'block';
      } else if (nowPlaying){ nowPlaying.style.display = 'none'; }

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

    function startStudyTimer(){
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = setInterval(function(){
        if (studyPaused) return;
        studySeconds--;
        updateStudyTimer(false);
        if (studySeconds <= 0){
          clearInterval(studyTimer); studyTimer = null; studyRunning = false;
          stopAudio(); unlockSite();
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد. حالا یه استراحت کوتاه به خودت بده ☕');
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
        btn.classList.remove('pause-mode');
        btn.classList.add('resume-mode');
        if (lbl) lbl.textContent = 'ادامه';
        if (masterGain) try { masterGain.gain.value = 0; } catch(e){}
        if (sub) sub.textContent = '⏸️ متوقف شده — برای ادامه روی «ادامه» بزن';
      } else {
        overlay.classList.remove('paused');
        btn.classList.remove('resume-mode');
        btn.classList.add('pause-mode');
        if (lbl) lbl.textContent = 'توقف';
        var vol = overlay.querySelector('#studyVolume');
        var v = vol ? (parseInt(vol.value)/100) : 0.4;
        if (masterGain) try { masterGain.gain.value = v; } catch(e){}
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
      var mStr = (m<10?'0':'') + m;
      var sStr = (s<10?'0':'') + s;
      var animate = !initial;
      setDigit('m1', mStr[0], animate);
      setDigit('m2', mStr[1], animate);
      setDigit('s1', sStr[0], animate);
      setDigit('s2', sStr[1], animate);
    }

    function exitStudyConfirm(){
      if (!confirm('مطمئنی می‌خوای از حالت مطالعه خارج شی؟')) return;
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null; studyRunning = false;
      stopAudio(); unlockSite(); closeStudy();
    }
    function closeStudy(){
      try { stopAudio(); } catch(e){}
      var overlay = document.getElementById('studyOverlay');
      var chat = document.getElementById('studyChatPanel');
      if (chat) chat.remove();
      var chatBtn = document.getElementById('studyChatToggle');
      if (chatBtn) chatBtn.remove();
      if (!overlay) return;
      overlay.classList.remove('open');
      setTimeout(function(){ overlay.remove(); }, 500);
    }

    function blockKey(e){
      if (!studyRunning) return;
      var k = e.key || '';
      var ctrl = e.ctrlKey || e.metaKey;
      if (k === 'F5' || k === 'F11' || k === 'Escape' ||
          (ctrl && ['r','R','w','W','n','N','t','T','p','P'].indexOf(k) >= 0) ||
          (ctrl && e.shiftKey && ['r','R','n','N','w','W'].indexOf(k) >= 0)){
        e.preventDefault(); e.stopPropagation();
        showPopup('🔒','سایت قفله!','تا اتمام تایمر نمیتونی خارج شی. تمرکز کن! 🎯');
        return false;
      }
    }
    function blockContext(e){ if (studyRunning) e.preventDefault(); }
    function blockBeforeUnload(e){
      if (!studyRunning) return;
      e.preventDefault(); e.returnValue = 'در حال مطالعه‌ای!'; return e.returnValue;
    }
    function lockSite(){
      document.addEventListener('keydown', blockKey, true);
      document.addEventListener('contextmenu', blockContext, true);
      window.addEventListener('beforeunload', blockBeforeUnload);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    function unlockSite(){
      document.removeEventListener('keydown', blockKey, true);
      document.removeEventListener('contextmenu', blockContext, true);
      window.removeEventListener('beforeunload', blockBeforeUnload);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    window.__openStudy = function(){
      buildStudyOverlay();
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      requestAnimationFrame(function(){ overlay.classList.add('open'); });
    };

    /* ============ چت مطالعه ============ */
    var studyChatHistory = [];
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
          '<div class="study-chat-header-title"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>سراج — همیار مطالعه</div>' +
          '<button class="study-chat-close" onclick="document.getElementById(\'studyChatPanel\').classList.remove(\'open\');setTimeout(function(){var p=document.getElementById(\'studyChatPanel\');if(p)p.remove();},320)">' +
            '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '</div>' +
        '<div class="study-chat-messages" id="studyChatMessages">' +
          '<div class="sc-msg sc-bot">سلام 👋 من سراجم. توی حالت مطالعه هر سؤال درسی داشتی بپرس. یادت باشه ما اینجا برای تمرکزیم!</div>' +
        '</div>' +
        '<div class="study-chat-input-row">' +
          '<input type="text" class="study-chat-input" id="studyChatInput" placeholder="سؤالت رو بپرس..." onkeydown="if(event.key===\'Enter\')window.__studyChatSend()">' +
          '<button class="study-chat-send" onclick="window.__studyChatSend()"><svg viewBox="0 0 24 24"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2Z"/></svg></button>' +
        '</div>';
      document.body.appendChild(panel);
      requestAnimationFrame(function(){ panel.classList.add('open'); });
      setTimeout(function(){ var i = document.getElementById('studyChatInput'); if(i) i.focus(); }, 350);
    }
    window.__studyChatSend = async function(){
      var inp = document.getElementById('studyChatInput');
      var box = document.getElementById('studyChatMessages');
      if (!inp || !box) return;
      var q = inp.value.trim();
      if (!q) return;
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-user">' + esc(q) + '</div>');
      inp.value = ''; box.scrollTop = box.scrollHeight;
      studyChatHistory.push({role:'user', content:q});

      var tid = 'sct_' + Date.now();
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="' + tid + '">💭 ...</div>');
      box.scrollTop = box.scrollHeight;

      var sysPrompt = 'تو «سراج» هستی و الان در «حالت مطالعه» کاربر قرار داری. کاربر روی درسش تمرکز کرده. قوانین:\n۱. جواب‌ها کوتاه، مستقیم و مفید باشن.\n۲. اگه کاربر سؤال غیردرسی پرسید، با مهربونی بگو: «الان تو حالت مطالعه‌ای، بهتره تمرکزت رو روی درس نگه داری. بعد از تایمر با هم گپ می‌زنیم 😊».\n۳. از ستاره (*) برای پررنگ کردن استفاده نکن.\n۴. ایموجی‌های ملایم و کم.';
      try {
        var url = (window.APP_CONFIG && window.APP_CONFIG.baseURL) ? window.APP_CONFIG.baseURL : '/api/chat';
        var res = await fetch(url, {
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
          body: JSON.stringify({
            model: (window.settings && window.settings.model) ? window.settings.model : 'gemini-2.0-flash',
            messages: [{role:'system', content: sysPrompt}].concat(studyChatHistory.slice(-6)),
            temperature: 0.7, stream: true
          })
        });
        var typingEl = document.getElementById(tid);
        if (!res.ok){
          if (typingEl) typingEl.textContent = 'خطا در ارتباط (' + res.status + ')';
          return;
        }
        if (typingEl) typingEl.remove();
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
            try {
              var j = JSON.parse(dd);
              var delta = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content;
              if (delta){ full += delta; botEl.textContent = full; box.scrollTop = box.scrollHeight; }
            } catch(e){}
          }
        }
        studyChatHistory.push({role:'assistant', content: full});
      } catch(err){
        var te = document.getElementById(tid);
        if (te) te.textContent = 'خطا: ' + err.message;
      }
    };

    /* ============ مقالات ============ */
    window.renderBlog = function(){
      var v = document.getElementById('view-blog');
      if (!v) return;
      v.innerHTML = '<div class="page-title-bar"><div class="page-title-text">مقالات سراج</div></div>' +
        '<div class="community-hero"><div class="community-icon">' +
          '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h6"/></svg>' +
        '</div><div class="community-title">مقالات و یادداشت‌های سراج</div>' +
        '<div class="community-desc">یه فضای صمیمی برای نوشتن مقالات درباره‌ی زبان و ادبیات عربی، نکات آموزشی، و تجربه‌های یادگیری. به‌زودی ✍️</div>' +
        '<div class="community-badge"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg>به‌زودی راه‌اندازی می‌شه</div></div>';
    };

    /* ============ Hooks ============ */
    var origRenderPlanner = window.renderPlanner;
    window.renderPlanner = function(){
      origRenderPlanner.apply(this, arguments);
      ensureTabsClean();
      setTimeout(function(){ renderPane(getTab()); }, 30);
    };
    var origSwitchView = window.switchView;
    window.switchView = function(v){
      origSwitchView.apply(this, arguments);
      if (v === 'planner'){
        setTimeout(function(){ ensureTabsClean(); renderPane(getTab()); }, 50);
      }
    };

    /* ============ لیبل دکمه‌های نوار ============ */
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
    }, 900);

    /* ============ بازنویسی درباره ما ============ */
    var origOpenSettings = window.openSettings;
    window.openSettings = function(){
      origOpenSettings.apply(this, arguments);
      setTimeout(function(){
        var aboutContent = document.querySelector('.settings-content[data-cat="about"]');
        if (!aboutContent) return;
        aboutContent.innerHTML =
          '<div class="about-hero">' +
            '<div class="about-avatar"><img src="siraj-logo.png" alt="حامد" style="object-fit:contain;padding:14px"></div>' +
            '<div class="about-name">حامد انصاری‌فر</div>' +
            '<div class="about-role">سازنده سراج</div>' +
          '</div>' +
          '<div class="about-bio-card" style="line-height:2;white-space:pre-line;text-align:right">' +
            'سلام 👋\n' +
            'من حامد هستم — ۲۰ سالمه و عاشق میهن. الان دانشجوی زبان و ادبیات عربی دانشگاه قمم و کنار درس، به هوش مصنوعی، برنامه‌نویسی و تاریخ هم علاقه‌ی زیادی دارم.\n\n' +
            'ایده سراج یهویی وقتی مثل همیشه تو فکر بودم به ذهنم اومد — اینکه به آموزش و تربیت هم علاقه‌مند هستم شاید بی‌تاثیر نبود. اینکه بتونم به یادگیری بچه‌های کشورم کمک کنم و بتونیم آینده‌ای خوش برای سرزمینمون رقم بزنیم.\n' +
            'شاید سراج با یه ایده کوچیک و ساده شروع شده باشه ولی روز به روز در حال گسترش و پیشرفته و قطعاً محدود به رشته ادبیات عربی نخواهد موند.\n' +
            'کلی چیز برای کشف کردن هست 🌱\n' +
            'منتظر بروزرسانی‌های جدید باشید ☝️💕' +
          '</div>' +
          '<div class="about-section-title">' +
            '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
            'راه‌های ارتباطی' +
          '</div>' +
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
      }, 250);
    };

    /* ============ Retry اصلاح‌شده ============ */
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
                h2[window.currentChatId].messages.splice(k, 1); break;
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

    console.log('[Siraj v2.0] planner loaded ✓');
  }
})();
