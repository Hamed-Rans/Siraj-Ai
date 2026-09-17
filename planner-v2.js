/* ============================================================
   planner-v2.js — v3.0 (کامل)
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

    /* ================= کمکی‌ها ================= */
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
    function pDate(d){ try{ return d.toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return ''; } }
    function pMonthYear(d){ try{ return d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'}); }catch(e){ return ''; } }
    function pWeekday(d){ try{ return d.toLocaleDateString('fa-IR',{weekday:'long'}); }catch(e){ return ''; } }

    function weekOfMonth(){
      var d = window.plannerDate || new Date();
      var day = parseInt(d.toLocaleDateString('en-US',{day:'numeric'}));
      return Math.ceil(day / 7);
    }
    var ORDINALS = ['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrdinal(n){
      n = Math.max(1, Math.min(6, n));
      return ORDINALS[n-1];
    }

    /* ================= Select سفارشی ================= */
    function makeSelect(id, value, options){
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
            if (handlers && handlers[sel.id]) handlers[sel.id](val, item);
          };
        });
      });
    }
    document.addEventListener('click', function(){
      document.querySelectorAll('.siraj-select.open').forEach(function(s){s.classList.remove('open');});
    });

    /* ================= Popup ================= */
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
        '<button class="siraj-popup-btn" onclick="document.getElementById(\'sirajPopup\').classList.remove(\'open\');setTimeout(function(){var p=document.getElementById(\'sirajPopup\');if(p)p.remove();},320)">متوجه شدم</button>' +
      '</div>';
      document.body.appendChild(el);
      requestAnimationFrame(function(){ el.classList.add('open'); });
    }
    window.__sirajPopup = showPopup;

    /* ================= ناوبری روز/هفته/ماه ================= */
    window.__navDay = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
      animateHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    window.__navWeek = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir * 7);
      window.plannerDate = d;
      window.renderPlannerPane();
      animateHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    window.__navMonth = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(1);
      d.setMonth(d.getMonth() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
      animateHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    function animateHero(cls){
      setTimeout(function(){
        var c = document.querySelector('.phc-center');
        if (!c) return;
        c.classList.add(cls);
        setTimeout(function(){ c.classList.remove(cls); }, 450);
      }, 15);
    }

    /* ================= تب‌ها ================= */
    window.switchPlannerTab = function(tab){
      document.querySelectorAll('.planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2}[tab];
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
          }
        });
      }
    }

    /* ================= حذف تب کارها ================= */
    function ensureTabsClean(){
      var tabsEl = document.querySelector('.planner-tabs');
      if (!tabsEl) return;
      tabsEl.querySelectorAll('.planner-tab').forEach(function(b){
        var txt = b.textContent || '';
        if (txt.indexOf('کارها') >= 0 || b.getAttribute('data-ptab') === 'tasks'){
          b.remove();
        }
      });
    }

    /* ================= نمای روزانه ================= */
    function viewDaily(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var isToday = key === window.dateKey(new Date());
      var monthKey = d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
      if (!pl.months[monthKey]) pl.months[monthKey] = {goals:[]};
      var goals = pl.months[monthKey].goals || [];
      var currentGoal = goals.length ? (goals.find(function(g){return !g.done;}) || goals[0]) : null;

      var dd = window.getDayData(pl, key);
      var tasks = (dd.tasks || []).slice();

      var tasksHTML = tasks.length === 0
        ? '<div class="tasks-empty"><span class="emoji">📝</span>هنوز کاری برای این روز ثبت نکردی<br>از کادر بالا کار جدید اضافه کن</div>'
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
          '<button class="phc-nav-btn" onclick="window.__navDay(-1)" title="روز قبل">' +
            '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>' +
          '</button>' +
          '<div class="phc-center">' +
            '<div class="phc-day">' + esc(pWeekday(d)) + (isToday ? ' <span class="phc-today">امروز</span>' : '') + '</div>' +
            '<div class="phc-date">' + esc(pDate(d)) + '</div>' +
            (currentGoal
              ? '<div class="phc-goal"><span class="phc-goal-icon">🎯</span><span>هدف ماه: ' + esc(currentGoal.text) + '</span></div>'
              : '<div class="phc-goal empty">🎯 هنوز هدف ماهانه‌ای ثبت نکردی</div>') +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navDay(1)" title="روز بعد">' +
            '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
          '</button>' +
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
      var d = new Date(window.plannerDate || new Date());
      var key = window.dateKey(d);
      var dd = window.getDayData(pl, key);
      dd.tasks.push({
        id: 'tk_'+Date.now()+'_'+Math.random().toString(36).slice(2,6),
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
        var praises = [
          ['🎉','آفرین!','یکی دیگه انجام شد. داری عالی پیش می‌ری!'],
          ['🌟','درخشیدی!','همینطور ادامه بده!'],
          ['🚀','ایول!','داری می‌ترکونی!'],
          ['💪','قوی!','یه قدم دیگه به هدفت نزدیک شدی!']
        ];
        var p = praises[Math.floor(Math.random()*praises.length)];
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

    /* ================= نمای هفتگی ================= */
    function viewWeekly(){
      var pl = window.loadPlannerNew();
      var days = window.getWeekDays();
      var todayKey = window.dateKey(new Date());
      var d = new Date(window.plannerDate || new Date());

      var headerRow = '<tr><th class="hour-col">ساعت</th>' +
        days.map(function(day){
          var isToday = day.key === todayKey;
          return '<th' + (isToday ? ' style="background:var(--accent-soft);color:var(--accent)"' : '') + '>' +
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
                return '<div class="week-cell-task' + (tk.done?' done':'') + '">' +
                  '<div class="wt-actions">' +
                    '<button class="wt-btn cross" onclick="event.stopPropagation();window.__wCrossTask(\'' + day.key + '\',\'' + tk.id + '\')" title="انجام نشد">' +
                      '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
                    '</button>' +
                    '<button class="wt-btn tick' + (tk.done?' on':'') + '" onclick="event.stopPropagation();window.__wTickTask(\'' + day.key + '\',\'' + tk.id + '\')" title="انجام شد">' +
                      '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' +
                    '</button>' +
                  '</div>' +
                  '<span class="wt-title">' + esc(tk.title.substring(0,20)) + '</span>' +
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
          '<button class="phc-nav-btn" onclick="window.__navWeek(-1)" title="هفته قبل">' +
            '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>' +
          '</button>' +
          '<div class="phc-center">' +
            '<div class="phc-day">' + esc(pMonthYear(d)) + '</div>' +
            '<div class="phc-date">هفته ' + weekOrdinal(wk) + ' ماه — از ' + esc(days[0].date) + ' تا ' + esc(days[6].date) + '</div>' +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navWeek(1)" title="هفته بعد">' +
            '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
          '</button>' +
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
      var praises = [
        ['🎉','آفرین!','کار انجام شد!'],
        ['🌟','درخشیدی!','یکی دیگه فتح شد!'],
        ['🚀','عالی!','ادامه بده!'],
        ['💪','قوی!','همینطور پیش برو!']
      ];
      var p = praises[Math.floor(Math.random()*praises.length)];
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
      var messages = [
        ['😐','یادت نره!','هنوز انجام نشده. یه بار دیگه تلاش کن!'],
        ['🤔','چرا؟','وقت داری هنوز، می‌تونی انجامش بدی!'],
        ['💭','فکر کن!','اینجا موندی، یعنی وقت بیشتری می‌خوای. عیبی نداره!'],
        ['⏰','یادت باشه!','این کار منتظرته. برو انجامش بده!']
      ];
      var m = messages[Math.floor(Math.random()*messages.length)];
      showPopup(m[0], m[1], m[2]);
      window.renderPlannerPane();
    };

    /* ================= نمای ماهانه ================= */
    function viewMonthly(){
      var pl = window.loadPlannerNew();
      var d = new Date(window.plannerDate || new Date());
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
          '<button class="phc-nav-btn" onclick="window.__navMonth(-1)" title="ماه قبل">' +
            '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>' +
          '</button>' +
          '<div class="phc-center">' +
            '<div class="phc-day">' + esc(pMonthYear(d)) + '</div>' +
            '<div class="phc-date">' + doneGoals + ' از ' + goals.length + ' هدف این ماه انجام شده</div>' +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navMonth(1)" title="ماه بعد">' +
            '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>' +
          '</button>' +
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

    /* ================= پنل راست ================= */
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
      var doneGoals = monthGoals.filter(function(g){return g.done;}).length;

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
              '<div style="font-size:10px;color:var(--text-muted);text-align:center;margin-top:6px">' + doneGoals + ' از ' + monthGoals.length + ' هدف انجام شد</div>' +
            '</div>'
          : '') +

        '<div class="panel-card">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><path d="M3 3v18h18"/></svg><span>این هفته</span></div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:6px 0">' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--accent)">' + weekTotal + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">کل کارها</div></div>' +
            '<div style="text-align:center"><div style="font-size:22px;font-weight:900;color:var(--accent)">' + weekPct + '%</div><div style="font-size:10px;color:var(--text-muted);margin-top:3px">پیشرفت</div></div>' +
          '</div>' +
        '</div>' +

        '<button class="row-btn active" onclick="window.__openStudy()" style="flex-direction:row;min-height:52px;background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:#fff;border-color:var(--accent);gap:10px">' +
          '<svg class="rb-icon" viewBox="0 0 24 24" style="color:#fff;width:22px;height:22px"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '<span class="rb-label" style="font-size:12.5px">ورود به حالت مطالعه 🎯</span>' +
        '</button>' +

        '<div class="panel-card">' +
          '<div class="card-title"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg><span>دسترسی سریع</span></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'daily\')"><div class="li-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div class="li-body"><div class="li-title">برنامه امروز</div></div></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'weekly\')"><div class="li-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/></svg></div><div class="li-body"><div class="li-title">برنامه هفتگی</div></div></div>' +
          '<div class="list-item" onclick="switchPlannerTab(\'monthly\')"><div class="li-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg></div><div class="li-body"><div class="li-title">اهداف ماهانه</div></div></div>' +
        '</div>';
    };

    /* ================= حالت مطالعه (Pomodoro) ================= */
    var studyTimer = null;
    var studySeconds = 0;
    var studyRunning = false;
    var studyPrevBeforeUnload = null;

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
      var taskOptions = allTasks.length
        ? '<option value="">— یک کار انتخاب کن —</option>' + allTasks.map(function(tn){
            return '<option value="' + esc(tn) + '">' + esc(tn) + '</option>';
          }).join('')
        : '<option value="">— کاری برای مطالعه نداری —</option>';

      var el = document.createElement('div');
      el.id = 'studyOverlay';
      el.className = 'study-overlay';
      el.innerHTML =
        // Setup screen
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '</div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          '<div class="study-sub">یک کار انتخاب کن و مدت زمان مطالعه رو تعیین کن</div>' +
          '<select class="study-select" id="studyTaskSel">' + taskOptions + '</select>' +
          '<div class="study-durations" id="studyDurations">' +
            '<div class="study-duration" data-min="15">۱۵ دقیقه</div>' +
            '<div class="study-duration active" data-min="25">۲۵ دقیقه</div>' +
            '<div class="study-duration" data-min="45">۴۵ دقیقه</div>' +
            '<div class="study-duration" data-min="60">۶۰ دقیقه</div>' +
          '</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyStartBtn">شروع مطالعه</button>' +
            '<button class="study-btn secondary" id="studyCancelBtn">لغو</button>' +
          '</div>' +
        '</div>' +
        // Running screen
        '<div id="studyRunning" class="study-setup" style="display:none">' +
          '<div class="study-icon">' +
            '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg>' +
          '</div>' +
          '<div class="study-mode-badge">🎯 در حال تمرکز — سایت قفله</div>' +
          '<div class="study-timer" id="studyTimer">25:00</div>' +
          '<div class="study-task" id="studyTaskName">—</div>' +
          '<div class="study-sub">تا اتمام تایمر، نمیتونی از این صفحه خارج شی. موفق باشی! 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج اضطراری</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      // Bind duration buttons
      el.querySelectorAll('.study-duration').forEach(function(b){
        b.onclick = function(){
          el.querySelectorAll('.study-duration').forEach(function(x){x.classList.remove('active');});
          b.classList.add('active');
        };
      });
      el.querySelector('#studyStartBtn').onclick = startStudy;
      el.querySelector('#studyCancelBtn').onclick = closeStudy;
      el.querySelector('#studyExitBtn').onclick = exitStudyConfirm;
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      var sel = overlay.querySelector('#studyTaskSel');
      var task = sel ? sel.value : '';
      var duration = 25;
      var active = overlay.querySelector('.study-duration.active');
      if (active) duration = parseInt(active.getAttribute('data-min'));
      studySeconds = duration * 60;
      studyRunning = true;

      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      overlay.querySelector('#studyTaskName').textContent = task || 'مطالعه آزاد';

      updateStudyTimer();
      studyTimer = setInterval(function(){
        studySeconds--;
        updateStudyTimer();
        if (studySeconds <= 0){
          clearInterval(studyTimer);
          studyTimer = null;
          studyRunning = false;
          unlockSite();
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد. حالا یه استراحت کوتاه به خودت بده ☕');
          closeStudy();
        }
      }, 1000);

      lockSite();
    }

    function updateStudyTimer(){
      var el = document.getElementById('studyTimer');
      if (!el) return;
      var m = Math.floor(studySeconds / 60);
      var s = studySeconds % 60;
      el.textContent = (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
    }

    function exitStudyConfirm(){
      var ok = confirm('مطمئنی می‌خوای از حالت مطالعه خارج شی؟ معمولاً بهتره تا آخر بمونی!');
      if (!ok) return;
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

    /* ---------- قفل کردن سایت ---------- */
    function blockKey(e){
      if (!studyRunning) return;
      var k = e.key || '';
      var ctrl = e.ctrlKey || e.metaKey;
      // بلاک کردن کلیدهای خطرناک
      if (k === 'F5' || k === 'F11' || k === 'Escape' ||
          (ctrl && ['r','R','w','W','n','N','t','T','p','P'].indexOf(k) >= 0) ||
          (ctrl && e.shiftKey && ['r','R','n','N','w','W'].indexOf(k) >= 0)){
        e.preventDefault();
        e.stopPropagation();
        showPopup('🔒','سایت قفله!','تا اتمام تایمر نمیتونی از حالت مطالعه خارج شی. تمرکز کن! 🎯');
        return false;
      }
    }
    function blockContext(e){
      if (!studyRunning) return;
      e.preventDefault();
    }
    function blockBeforeUnload(e){
      if (!studyRunning) return;
      e.preventDefault();
      e.returnValue = 'در حال مطالعه‌ای! مطمئنی می‌خوای خارج شی؟';
      return e.returnValue;
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

    /* ================= مقالات → به‌زودی ================= */
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

    /* ================= Hook ها ================= */
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
        setTimeout(function(){
          ensureTabsClean();
          renderPane(getTab());
        }, 50);
      }
    };

    /* ================= لیبل دکمه‌های نوار پایین ================= */
    setTimeout(function(){
      var labels = {
        planner: 'برنامه‌ریز سراج',
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

    console.log('[planner-v2] v3.0 ready ✓');
  }
})();
