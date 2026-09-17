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
    function pDate(d){ try{ return d.toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return ''; } }
    function pMonthYear(d){ try{ return d.toLocaleDateString('fa-IR',{month:'long',year:'numeric'}); }catch(e){ return ''; } }
    function pWeekday(d){ try{ return d.toLocaleDateString('fa-IR',{weekday:'long'}); }catch(e){ return ''; } }
    function weekOfMonth(){
      var d = window.plannerDate || new Date();
      var day = parseInt(d.toLocaleDateString('en-US',{day:'numeric'}));
      return Math.ceil(day/7);
    }
    var ORD = ['اول','دوم','سوم','چهارم','پنجم','ششم'];
    function weekOrd(n){ n=Math.max(1,Math.min(6,n)); return ORD[n-1]; }

    /* Select */
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

    /* Popup */
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

    /* Nav */
    window.__navDay = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
      slideHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    window.__navWeek = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(d.getDate() + dir * 7);
      window.plannerDate = d;
      window.renderPlannerPane();
      slideHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    window.__navMonth = function(dir){
      var d = new Date(window.plannerDate || new Date());
      d.setDate(1);
      d.setMonth(d.getMonth() + dir);
      window.plannerDate = d;
      window.renderPlannerPane();
      slideHero(dir > 0 ? 'slide-left' : 'slide-right');
    };
    function slideHero(cls){
      setTimeout(function(){
        var c = document.querySelector('.phc-center');
        if (!c) return;
        c.classList.add(cls);
        setTimeout(function(){ c.classList.remove(cls); }, 450);
      }, 15);
    }

    /* Tabs */
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

    /* Clean tabs (remove "کارها") */
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
            '<div class="phc-day">' + esc(pWeekday(d)) + (isToday ? ' <span class="phc-today">امروز</span>' : '') + '</div>' +
            '<div class="phc-date">' + esc(pDate(d)) + '</div>' +
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
      var days = window.getWeekDays();
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
          var hourTasks = (dd.tasks||[]).filter(function(tk){ return tk.time && tk.time.indexOf(h+':00') === 0; });
          var val = (dd.hours && dd.hours[hk]) || '';
          var isToday = day.key === todayKey;
          var tasksHTML = hourTasks.length
            ? '<div class="week-cell-tasks">' + hourTasks.map(function(tk){
                return '<div class="week-cell-task' + (tk.done?' done':'') + '">' +
                  '<div class="wt-actions">' +
                    '<button class="wt-btn cross" onclick="event.stopPropagation();window.__wCrossTask(\'' + day.key + '\',\'' + tk.id + '\')" title="انجام نشد">' +
                      '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
                    '<button class="wt-btn tick' + (tk.done?' on':'') + '" onclick="event.stopPropagation();window.__wTickTask(\'' + day.key + '\',\'' + tk.id + '\')" title="انجام شد">' +
                      '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></button>' +
                  '</div>' +
                  '<span class="wt-title">' + esc(tk.title.substring(0,20)) + '</span></div>';
              }).join('') + '</div>' : '';
          return '<td class="task-cell' + (isToday?' today':'') + '">' + tasksHTML +
            '<input type="text" class="cell-input" value="' + esc(val) + '" placeholder="—" oninput="saveHour(\'' + day.key + '\',\'' + hk + '\',this.value)"></td>';
        }).join('');
        return '<tr><td class="hour-cell">' + hk + ':۰۰</td>' + cells + '</tr>';
      }).join('');

      return '<div class="planner-hero-card">' +
          '<button class="phc-nav-btn" onclick="window.__navWeek(-1)" title="هفته قبل"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '<div class="phc-center">' +
            '<div class="phc-day">' + esc(pMonthYear(d)) + '</div>' +
            '<div class="phc-date">هفته ' + weekOrd(weekOfMonth()) + ' ماه — از ' + esc(days[0].date) + ' تا ' + esc(days[6].date) + '</div>' +
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
      var goalsHTML = goals.length === 0
        ? '<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:10px 0">هنوز هدفی ثبت نشده</div>'
        : goals.map(function(g,i){
            return '<div class="month-goal' + (g.done?' done':'') + '">' +
              '<input type="checkbox" ' + (g.done?'checked':'') + ' onchange="toggleMonthGoal(\'' + monthKey + '\',' + i + ')">' +
              '<span class="mg-text">' + esc(g.text) + '</span>' +
              '<button class="mg-del" onclick="deleteMonthGoal(\'' + monthKey + '\',' + i + ')"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
          }).join('');
      var doneGoals = goals.filter(function(g){return g.done;}).length;

      return '<div class="planner-hero-card">' +
          '<button class="phc-nav-btn" onclick="window.__navMonth(-1)" title="ماه قبل"><svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg></button>' +
          '<div class="phc-center">' +
            '<div class="phc-day">' + esc(pMonthYear(d)) + '</div>' +
            '<div class="phc-date">' + doneGoals + ' از ' + goals.length + ' هدف این ماه انجام شده</div>' +
          '</div>' +
          '<button class="phc-nav-btn" onclick="window.__navMonth(1)" title="ماه بعد"><svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg></button>' +
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

    /* ============ پنل راست — فقط دکمه مطالعه ============ */
    window.renderPanelForPlanner = function(){
      document.getElementById('panelTitleText').textContent = 'برنامه‌ریزی';
      document.getElementById('panelSubText').textContent = 'خوش آمدی 🌟';
      document.getElementById('panelContent').innerHTML =
        '<button onclick="window.__openStudy()" style="display:flex;align-items:center;gap:12px;width:100%;padding:18px 20px;border-radius:16px;border:none;background:linear-gradient(135deg,var(--accent-light),var(--accent-dark));color:#fff;font-family:var(--font-text);font-size:14px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px -10px var(--accent);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform=\'translateY(-3px)\'" onmouseout="this.style.transform=\'translateY(0)\'">' +
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
            '💬 اگه سؤال درسی داشتی، «چت با سراج» رو بزن' +
          '</div>' +
        '</div>';
    };

    /* ============ حالت مطالعه v2.0 ============ */
    var studyTimer = null, studySeconds = 0, studyRunning = false, studyTask = '';
    var studyPrevDigits = {m1:'',m2:'',s1:'',s2:''};

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

      var taskOptionsHTML = allTasks.length
        ? '<option value="">— یک کار انتخاب کن (اختیاری) —</option>' + allTasks.map(function(tn){
            return '<option value="' + esc(tn) + '">' + esc(tn) + '</option>';
          }).join('')
        : '';
      var noTasksHTML = allTasks.length
        ? '<select class="study-select" id="studyTaskSel">' + taskOptionsHTML + '</select>'
        : '<div class="study-empty-box">' +
            '📝 هنوز هیچ کار فعالی نداری<br>اول یه کار اضافه کن، بعد برگرد مطالعه' +
          '</div>' +
          '<button class="study-btn" id="studyGoPlanBtn">' +
            '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>برو به برنامه‌ریزی' +
          '</button>';

      var el = document.createElement('div');
      el.id = 'studyOverlay';
      el.className = 'study-overlay';
      el.innerHTML =
        '<div id="studySetup" class="study-setup">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-title">حالت مطالعه</div>' +
          '<div class="study-sub">یک کار انتخاب کن و مدت زمان مطالعه رو تعیین کن</div>' +
          noTasksHTML +
          '<div class="study-time-row">' +
            '<input type="number" class="study-time-input" id="studyMinutes" value="25" min="1" max="180">' +
            '<span class="study-time-unit">دقیقه</span>' +
          '</div>' +
          '<div class="study-chips" id="studyChips">' +
            '<div class="study-chip" data-min="10">۱۰</div>' +
            '<div class="study-chip" data-min="15">۱۵</div>' +
            '<div class="study-chip on" data-min="25">۲۵</div>' +
            '<div class="study-chip" data-min="45">۴۵</div>' +
            '<div class="study-chip" data-min="60">۶۰</div>' +
            '<div class="study-chip" data-min="90">۹۰</div>' +
          '</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyStartBtn"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>شروع مطالعه</button>' +
            '<button class="study-btn secondary" id="studyCancelBtn">لغو</button>' +
          '</div>' +
        '</div>' +
        '<div id="studyRunning" class="study-setup" style="display:none">' +
          '<div class="study-icon"><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.3A7 7 0 0 0 12 2z"/><path d="M9 22h6"/></svg></div>' +
          '<div class="study-mode-badge">🎯 در حال تمرکز — سایت قفله</div>' +
          '<div class="study-timer" id="studyTimer"><span class="study-digit" data-k="m1">0</span><span class="study-digit" data-k="m2">0</span><span class="study-colon">:</span><span class="study-digit" data-k="s1">0</span><span class="study-digit" data-k="s2">0</span></div>' +
          '<div class="study-task" id="studyTaskName">—</div>' +
          '<div class="study-sub">تا اتمام تایمر نمیتونی خارج شی. موفق باشی! 💪</div>' +
          '<div class="study-actions">' +
            '<button class="study-btn" id="studyChatBtn"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>مطالعه با سراج</button>' +
            '<button class="study-btn secondary" id="studyExitBtn">خروج اضطراری</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);

      // Time chips
      var minInp = el.querySelector('#studyMinutes');
      if (minInp){
        el.querySelectorAll('.study-chip').forEach(function(ch){
          ch.onclick = function(){
            el.querySelectorAll('.study-chip').forEach(function(x){x.classList.remove('on');});
            ch.classList.add('on');
            minInp.value = ch.getAttribute('data-min');
          };
        });
        minInp.oninput = function(){
          el.querySelectorAll('.study-chip').forEach(function(x){x.classList.remove('on');});
        };
      }
      var goPlanBtn = el.querySelector('#studyGoPlanBtn');
      if (goPlanBtn) goPlanBtn.onclick = function(){ closeStudy(); };
      el.querySelector('#studyStartBtn').onclick = startStudy;
      el.querySelector('#studyCancelBtn').onclick = closeStudy;
      el.querySelector('#studyExitBtn').onclick = exitStudyConfirm;
      el.querySelector('#studyChatBtn').onclick = toggleStudyChat;
    }

    function startStudy(){
      var overlay = document.getElementById('studyOverlay');
      if (!overlay) return;
      var sel = overlay.querySelector('#studyTaskSel');
      var minInp = overlay.querySelector('#studyMinutes');
      studyTask = sel ? sel.value : '';
      var mins = parseInt(minInp ? minInp.value : 25);
      if (!mins || mins < 1) mins = 25;
      if (mins > 180) mins = 180;
      studySeconds = mins * 60;
      studyRunning = true;

      overlay.querySelector('#studySetup').style.display = 'none';
      overlay.querySelector('#studyRunning').style.display = 'flex';
      overlay.querySelector('#studyTaskName').textContent = studyTask || 'مطالعه آزاد';

      studyPrevDigits = {m1:'',m2:'',s1:'',s2:''};
      updateStudyTimer(true);

      studyTimer = setInterval(function(){
        studySeconds--;
        updateStudyTimer(false);
        if (studySeconds <= 0){
          clearInterval(studyTimer); studyTimer = null; studyRunning = false;
          unlockSite();
          showPopup('🎉', 'عالی بود!', 'زمان مطالعه تموم شد. حالا یه استراحت کوتاه به خودت بده ☕');
          closeStudy();
        }
      }, 1000);

      lockSite();
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
      if (!confirm('مطمئنی می‌خوای از حالت مطالعه خارج شی؟ معمولاً بهتره تا آخر بمونی!')) return;
      if (studyTimer) clearInterval(studyTimer);
      studyTimer = null; studyRunning = false;
      unlockSite();
      closeStudy();
    }
    function closeStudy(){
      var overlay = document.getElementById('studyOverlay');
      var chat = document.getElementById('studyChatPanel');
      if (chat) chat.remove();
      var chatBtn = document.getElementById('studyChatToggle');
      if (chatBtn) chatBtn.remove();
      if (!overlay) return;
      overlay.classList.remove('open');
      setTimeout(function(){ overlay.remove(); }, 500);
    }

    /* قفل سایت */
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
      e.preventDefault();
      e.returnValue = 'در حال مطالعه‌ای!';
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
      inp.value = '';
      box.scrollTop = box.scrollHeight;
      studyChatHistory.push({role:'user', content:q});

      var tid = 'sct_' + Date.now();
      box.insertAdjacentHTML('beforeend', '<div class="sc-msg sc-bot" id="' + tid + '">💭 ...</div>');
      box.scrollTop = box.scrollHeight;

      var sysPrompt = 'تو «سراج» هستی و الان در «حالت مطالعه» کاربر قرار داری. کاربر روی درسش تمرکز کرده. قوانین:\n۱. جواب‌ها کوتاه، مستقیم و مفید باشن.\n۲. اگه کاربر سؤال غیردرسی پرسید (چت، سرگرمی، بازی، جوک و ...)، با مهربونی و صمیمیت بهش بگو: «الان تو حالت مطالعه‌ای، بهتره تمرکزت رو روی درس نگه داری. بعد از تایمر با هم گپ می‌زنیم 😊».\n۳. از ستاره (*) برای پررنگ کردن استفاده نکن.\n۴. ایموجی‌های ملایم و کم.';

      try {
        var url = (window.APP_CONFIG && window.APP_CONFIG.baseURL) ? window.APP_CONFIG.baseURL : '/api/chat';
        var res = await fetch(url, {
          method:'POST',
          headers:{'Content-Type':'application/json','Accept':'text/event-stream'},
          body: JSON.stringify({
            model: (window.settings && window.settings.model) ? window.settings.model : 'gemini-2.0-flash',
            messages: [{role:'system', content: sysPrompt}].concat(studyChatHistory.slice(-6)),
            temperature: 0.7,
            stream: true
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

    /* ============ مقالات → به‌زودی ============ */
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

        // نسخه در تنظیمات
    setTimeout(function(){
      var privacyContent = document.querySelector('.settings-content[data-cat="about"]');
      if (privacyContent && !privacyContent.querySelector('.siraj-version-badge')){
        var badge = document.createElement('div');
        badge.className = 'siraj-version-badge';
        badge.style.cssText = 'text-align:center;padding:12px;margin-top:10px;border-radius:12px;background:var(--accent-soft);border:1px solid var(--border);font-size:12px;color:var(--text-muted);font-weight:700';
        badge.innerHTML = '✨ نسخه‌ی فعلی سراج: <span style="color:var(--accent);font-weight:900">v2.0</span>';
        privacyContent.appendChild(badge);
      }
    }, 2000);

    console.log('[Siraj v2.0] planner loaded ✓');
  }
})();
