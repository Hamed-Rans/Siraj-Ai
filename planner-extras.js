/* ==========================================================
   planner-extras.js — افزودنی‌های برنامه‌ریز سراج
   - آمار هفتگی و نمودار
   - نوار پیشرفت
   - لیست کارها با اولویت و رنگ
   ========================================================== */
(function(){
  'use strict';

  var tries = 0;
  var t = setInterval(function(){
    tries++;
    if (typeof window.renderPlannerPane === 'function' && typeof window.loadPlannerNew === 'function') {
      clearInterval(t);
      init();
    }
    if (tries > 50) clearInterval(t);
  }, 100);

  function init(){
    var origRenderPlanner = window.renderPlanner;
    var origRenderPlannerPane = window.renderPlannerPane;
    if (!origRenderPlanner || !origRenderPlannerPane) {
      console.warn('[planner-extras] main functions not found');
      return;
    }

    window.renderPlanner = function(){
      origRenderPlanner.apply(this, arguments);
      var tabsEl = document.querySelector('.planner-tabs');
      if (tabsEl && !tabsEl.querySelector('[data-ptab="tasks"]')) {
        var btn = document.createElement('button');
        btn.className = 'planner-tab';
        btn.setAttribute('data-ptab', 'tasks');
        btn.setAttribute('onclick', "switchPlannerTab('tasks')");
        btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span>کارها</span>';
        tabsEl.appendChild(btn);
      }
    };

    function getActiveTab(){
      var btn = document.querySelector('.planner-tab.active');
      if (!btn) return 'daily';
      var m = (btn.getAttribute('onclick')||'').match(/switchPlannerTab\(['"]([^'"]+)['"]\)/);
      return m ? m[1] : 'daily';
    }

    window.renderPlannerPane = function(){
      var tab = getActiveTab();
      if (tab === 'tasks') {
        var pane = document.getElementById('plannerPane');
        if (pane) pane.innerHTML = renderTasksView();
        return;
      }
      origRenderPlannerPane.apply(this, arguments);
      var pane2 = document.getElementById('plannerPane');
      if (pane2 && !pane2.querySelector('.planner-stats-card')) {
        pane2.insertAdjacentHTML('afterbegin', renderStatsCard());
      }
    };

    window.switchPlannerTab = function(tab){
      document.querySelectorAll('.planner-tab').forEach(function(b){ b.classList.remove('active'); });
      var idx = {daily:0, weekly:1, monthly:2, tasks:3}[tab];
      var btns = document.querySelectorAll('.planner-tab');
      if (btns[idx]) btns[idx].classList.add('active');
      window.renderPlannerPane();
    };

    try {
      var vp = document.getElementById('view-planner');
      if (vp && vp.classList.contains('active')) window.renderPlanner();
    } catch(e){}

    console.log('[planner-extras] ready ✓');
  }

  function renderStatsCard(){
    var pl = window.loadPlannerNew();
    var days = window.getWeekDays();
    var todayKey = window.dateKey(new Date());
    var totalTasks = 0;
    var dayCounts = [];
    var maxCount = 1;

    days.forEach(function(d){
      var dd = window.getDayData(pl, d.key);
      var cnt = Object.values(dd.hours || {}).filter(function(v){ return v && v.trim(); }).length;
      dayCounts.push({ name: d.name, count: cnt, isToday: d.key === todayKey });
      totalTasks += cnt;
      if (cnt > maxCount) maxCount = cnt;
    });

    var taskList = pl.taskList || [];
    var doneTasks = taskList.filter(function(x){ return x.done; }).length;
    var totalListTasks = taskList.length;
    var pct = totalListTasks > 0 ? Math.round((doneTasks / totalListTasks) * 100) : (totalTasks > 0 ? 50 : 0);

    var barsHTML = dayCounts.map(function(d){
      var h = Math.max(4, Math.round((d.count / maxCount) * 60));
      return '<div class="planner-chart-col">' +
        '<div class="planner-chart-bar' + (d.isToday ? ' today' : '') + '" style="height:' + h + 'px"></div>' +
        '<div class="planner-chart-label">' + (d.name || '').substring(0, 4) + '</div>' +
      '</div>';
    }).join('');

    return '<div class="planner-stats-card">' +
      '<div class="planner-stats-grid">' +
        '<div class="planner-stat-box"><div class="planner-stat-num">' + totalTasks + '</div><div class="planner-stat-label">کار این هفته</div></div>' +
        '<div class="planner-stat-box"><div class="planner-stat-num">' + doneTasks + '</div><div class="planner-stat-label">انجام شده</div></div>' +
        '<div class="planner-stat-box"><div class="planner-stat-num">' + pct + '%</div><div class="planner-stat-label">پیشرفت</div></div>' +
      '</div>' +
      '<div class="planner-progress"><div class="planner-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="planner-chart">' + barsHTML + '</div>' +
    '</div>';
  }

  var taskFilter = 'all';

  function getTaskList(){
    var pl = window.loadPlannerNew();
    if (!pl.taskList) pl.taskList = [];
    return pl;
  }

  function escapeHTML(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function renderTasksView(){
    var pl = getTaskList();
    var tasks = pl.taskList.slice();
    if (taskFilter === 'done') tasks = tasks.filter(function(t){ return t.done; });
    else if (taskFilter === 'active') tasks = tasks.filter(function(t){ return !t.done; });
    else if (taskFilter === 'high') tasks = tasks.filter(function(t){ return t.priority === 'high'; });

    var priOrder = { high: 0, med: 1, low: 2 };
    tasks.sort(function(a, b){
      if (a.done !== b.done) return a.done ? 1 : -1;
      var pa = priOrder[a.priority] != null ? priOrder[a.priority] : 3;
      var pb = priOrder[b.priority] != null ? priOrder[b.priority] : 3;
      return pa - pb;
    });

    var priLabels = { high: 'بالا', med: 'متوسط', low: 'پایین' };
    var colorLabels = { study: 'درسی', personal: 'شخصی', sport: 'ورزشی', work: 'کاری', rest: 'استراحت', other: 'دیگر' };

    var listHTML = tasks.length === 0
      ? '<div class="tasks-empty"><span class="emoji">📝</span>هنوز کاری نداری<br>اولین کارت رو اضافه کن!</div>'
      : '<div class="tasks-list">' + tasks.map(function(t){
          return '<div class="task-item pri-' + t.priority + (t.done ? ' done' : '') + '">' +
            '<button class="task-check' + (t.done ? ' checked' : '') + '" onclick="window.__toggleTask(\'' + t.id + '\')">' +
              '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>' +
            '</button>' +
            '<div class="task-info">' +
              '<div class="task-title">' + escapeHTML(t.title) + '</div>' +
              '<div class="task-meta">' +
                '<span class="task-badge pri-' + t.priority + '">' + priLabels[t.priority] + '</span>' +
                '<span><span class="task-color-dot task-color-' + (t.color || 'other') + '"></span> ' + colorLabels[t.color || 'other'] + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="task-del" onclick="window.__deleteTask(\'' + t.id + '\')" title="حذف">' +
              '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
            '</button>' +
          '</div>';
        }).join('') + '</div>';

    return renderStatsCard() +
      '<div class="task-add-form">' +
        '<input type="text" id="newTaskTitle" placeholder="کار جدید..." onkeydown="if(event.key===\'Enter\')window.__addTask()">' +
        '<select id="newTaskPriority">' +
          '<option value="high">🔴 اولویت بالا</option>' +
          '<option value="med" selected>🟡 اولویت متوسط</option>' +
          '<option value="low">🟢 اولویت پایین</option>' +
        '</select>' +
        '<select id="newTaskColor">' +
          '<option value="study">📚 درسی</option>' +
          '<option value="personal">🏠 شخصی</option>' +
          '<option value="sport">🏃 ورزشی</option>' +
          '<option value="work">💼 کاری</option>' +
          '<option value="rest">😴 استراحت</option>' +
          '<option value="other" selected>📌 دیگر</option>' +
        '</select>' +
        '<button class="task-add-btn" onclick="window.__addTask()">' +
          '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>افزودن' +
        '</button>' +
      '</div>' +
      '<div class="task-filter">' +
        '<button class="task-filter-btn' + (taskFilter === 'all' ? ' active' : '') + '" onclick="window.__setTaskFilter(\'all\')">همه</button>' +
        '<button class="task-filter-btn' + (taskFilter === 'active' ? ' active' : '') + '" onclick="window.__setTaskFilter(\'active\')">در جریان</button>' +
        '<button class="task-filter-btn' + (taskFilter === 'done' ? ' active' : '') + '" onclick="window.__setTaskFilter(\'done\')">انجام شده</button>' +
        '<button class="task-filter-btn' + (taskFilter === 'high' ? ' active' : '') + '" onclick="window.__setTaskFilter(\'high\')">اولویت بالا</button>' +
      '</div>' +
      listHTML;
  }

  window.__addTask = function(){
    var inp = document.getElementById('newTaskTitle');
    var priSel = document.getElementById('newTaskPriority');
    var colSel = document.getElementById('newTaskColor');
    if (!inp) return;
    var title = inp.value.trim();
    if (!title) return;
    var pl = getTaskList();
    pl.taskList.push({
      id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: title,
      priority: priSel ? priSel.value : 'med',
      color: colSel ? colSel.value : 'other',
      done: false,
      createdAt: Date.now()
    });
    window.savePlanner(pl);
    inp.value = '';
    inp.focus();
    window.renderPlannerPane();
  };

  window.__toggleTask = function(id){
    var pl = getTaskList();
    var task = pl.taskList.find(function(t){ return t.id === id; });
    if (!task) return;
    task.done = !task.done;
    window.savePlanner(pl);
    window.renderPlannerPane();
  };

  window.__deleteTask = function(id){
    var pl = getTaskList();
    var idx = pl.taskList.findIndex(function(t){ return t.id === id; });
    if (idx < 0) return;
    pl.taskList.splice(idx, 1);
    window.savePlanner(pl);
    window.renderPlannerPane();
  };

  window.__setTaskFilter = function(f){
    taskFilter = f;
    window.renderPlannerPane();
  };

})();
