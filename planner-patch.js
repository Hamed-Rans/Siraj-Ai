/* Siraj v2.0 — planner-patch.js (v1) */
(function(){
  'use strict';
  function log(){ console.log.apply(console, ['[Patch]'].concat([].slice.call(arguments))); }

  /* ═══════════════════════════════════════════════
     ۱) اسلایدر نوار — فوری و درست
     ═══════════════════════════════════════════════ */
  function getSliderPos(){
    var nav = document.getElementById('bottomNav');
    var active = document.querySelector('.bottom-nav-btn.active');
    if (!nav || !active) return null;
    if (active.classList.contains('nav-btn-chat')) return null;

    var navRect = nav.getBoundingClientRect();
    var btnRect = active.getBoundingClientRect();
    var pos = document.documentElement.getAttribute('data-nav-position') || 'bottom';
    var isVert = pos === 'left' || pos === 'right';

    var L, T, W, H, R;
    if (isVert){
      L = 5;
      W = navRect.width - 10;
      T = btnRect.top - navRect.top;
      H = btnRect.height;
      R = 14;
    } else {
      L = btnRect.left - navRect.left;
      T = btnRect.top - navRect.top;
      W = btnRect.width;
      H = btnRect.height;
      R = 21;
    }
    return { L: L, T: T, W: W, H: H, R: R };
  }

  function paintSlider(animate){
    var nav = document.getElementById('bottomNav');
    var slider = document.getElementById('navSlider');
    if (!nav || !slider) return;
    var p = getSliderPos();
    if (!p){
      slider.classList.remove('visible');
      return;
    }
    if (!animate){
      slider.classList.remove('ready');
      slider.style.transition = 'none';
    }
    slider.style.left = p.L + 'px';
    slider.style.top = p.T + 'px';
    slider.style.width = p.W + 'px';
    slider.style.height = p.H + 'px';
    slider.style.borderRadius = p.R + 'px';
    if (!animate){
      void slider.offsetWidth;
      slider.style.transition = '';
      slider.classList.add('ready');
    }
    slider.classList.add('visible');
  }

  /* instant برای تغییرات ساختاری، با انیمیشن برای کلیک دکمه */
  var _rafPending = null;
  function scheduleRepaint(){
    if (_rafPending) return;
    _rafPending = requestAnimationFrame(function(){
      _rafPending = null;
      /* اگه دکمه در حال گسترشه، مقدار نهایی رو با یک محاسبه‌ی موقت بگیر */
      var active = document.querySelector('.bottom-nav-btn.active:not(.nav-btn-chat)');
      if (active){
        var savedMaxW = active.style.maxWidth;
        var savedPad = active.style.padding;
        var savedTransition = active.style.transition;
        active.style.transition = 'none';
        /* عرض نهایی احتمالی */
        var nav = document.getElementById('bottomNav');
        var pos = document.documentElement.getAttribute('data-nav-position') || 'bottom';
        var isVert = pos === 'left' || pos === 'right';
        if (!isVert){
          active.style.maxWidth = '170px';
          active.style.padding = '0 14px 0 10px';
        }
        void active.offsetWidth;
        active.style.transition = savedTransition;
        active.style.maxWidth = savedMaxW;
        active.style.padding = savedPad;
        paintSlider(false);
        requestAnimationFrame(function(){ paintSlider(true); });
      } else {
        paintSlider(false);
      }
    });
  }
  window.__moveNavSlider = function(animate){ paintSlider(animate !== false); };

  function bindNavObserver(){
    var nav = document.getElementById('bottomNav');
    if (!nav) return;
    new MutationObserver(function(muts){
      for (var i=0;i<muts.length;i++){
        if (muts[i].attributeName === 'class' &&
            muts[i].target.classList &&
            muts[i].target.classList.contains('bottom-nav-btn')){
          scheduleRepaint();
          return;
        }
      }
    }).observe(nav, {attributes:true, attributeFilter:['class'], subtree:true});
  }
  new MutationObserver(function(){
    var sl = document.getElementById('navSlider');
    if (sl) sl.classList.remove('ready');
    paintSlider(false);
    setTimeout(function(){ paintSlider(true); }, 500);
  }).observe(document.documentElement, {attributes:true, attributeFilter:['data-nav-position']});

  window.addEventListener('resize', function(){ paintSlider(false); });

  /* ═══════════════════════════════════════════════
     ۲) انیمیشن سوییچ بین تب‌های اصلی
     ═══════════════════════════════════════════════ */
  var lastActiveView = null;
  function animateActiveView(){
    var active = document.querySelector('.view.active');
    if (!active || active === lastActiveView) return;
    var first = lastActiveView === null;
    lastActiveView = active;
    if (first) return;
    active.classList.remove('switching-in');
    void active.offsetWidth;
    active.classList.add('switching-in');
    setTimeout(function(){ active.classList.remove('switching-in'); }, 460);
  }
  new MutationObserver(animateActiveView).observe(document.body, {
    subtree: true, attributes: true, attributeFilter: ['class']
  });

  /* ═══════════════════════════════════════════════
     ۳) پاک‌سازی پروفایل تکراری
     ═══════════════════════════════════════════════ */
  var _cleanTimer = null;
  function cleanupProfile(){
    if (_cleanTimer) return;
    _cleanTimer = setTimeout(function(){
      _cleanTimer = null;
      /* هر هدر فقط یک header-left-actions داشته باشه */
      document.querySelectorAll('.chat-header, .planner-hero, .page-title-bar').forEach(function(h){
        var wraps = h.querySelectorAll('.header-left-actions');
        for (var i = 1; i < wraps.length; i++) wraps[i].remove();
      });
      /* داخل هر wrapper فقط یک آواتار و یک قفل */
      document.querySelectorAll('.header-left-actions').forEach(function(w){
        var avs = w.querySelectorAll('.main-top-avatar');
        for (var i = 1; i < avs.length; i++) avs[i].remove();
        var lks = w.querySelectorAll('.main-top-icon-btn');
        for (var i = 1; i < lks.length; i++) lks[i].remove();
      });
      /* هر آواتار/قفل خارج از header-left-actions رو حذف کن */
      document.querySelectorAll('.main-top-avatar, .main-top-icon-btn').forEach(function(el){
        if (!el.closest('.header-left-actions')) el.remove();
      });
      /* قفل قدیمی HTML */
      document.querySelectorAll('#headerLockBtn').forEach(function(el){
        el.style.display = 'none';
      });
      /* mainTopActions قدیمی */
      document.querySelectorAll('#mainTopActions, .main-top-actions').forEach(function(el){ el.remove(); });
    }, 100);
  }
  new MutationObserver(cleanupProfile).observe(document.body, {
    subtree: true, childList: true
  });
  setTimeout(cleanupProfile, 700);
  setTimeout(cleanupProfile, 1500);
  setTimeout(cleanupProfile, 2800);

  /* ═══════════════════════════════════════════════
     ۴) کلیک روی پروفایل → مستقیم مشخصات من
     ═══════════════════════════════════════════════ */
  document.addEventListener('click', function(e){
    var av = e.target.closest('.main-top-avatar');
    if (!av) return;
    /* اگه خود planner-v2.js قبلاً openSettings رو صدا زده، ما هم تب profile رو می‌زنیم */
    setTimeout(function(){
      var btn = document.querySelector('.settings-tab-btn[data-cat="profile"]');
      if (btn) btn.click();
    }, 350);
  }, true);

  /* ═══════════════════════════════════════════════
     ۵) بوت
     ═══════════════════════════════════════════════ */
  var _bootAttempts = 0;
  function tryBoot(){
    var nav = document.getElementById('bottomNav');
    if (nav){
      bindNavObserver();
      paintSlider(false);
      setTimeout(function(){ paintSlider(true); }, 600);
      log('ready');
      return;
    }
    if (++_bootAttempts > 40) return;
    setTimeout(tryBoot, 150);
  }
  setTimeout(tryBoot, 200);
})();
