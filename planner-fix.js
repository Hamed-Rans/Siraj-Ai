/* ═══════════════════════════════════════════════════════════════
   Siraj planner-fix.js — فیکس هنگ نوار منو
   ⚠️ این فایل باید BEFORE planner-v2.js لود بشه
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  console.log('[NavFix] loading...');

  /* ─── ۱) مسدودسازی Observer باگ‌دار planner-v2 ─── */
  var origObserve = MutationObserver.prototype.observe;
  var blockedCount = 0;
  MutationObserver.prototype.observe = function(target, options){
    /* الگوی باگ‌دار: watch کردن bottomNav برای class تغییرات دکمه‌ها */
    if (target && target.id === 'bottomNav' &&
        options && options.subtree === true &&
        options.attributeFilter &&
        options.attributeFilter.length === 1 &&
        options.attributeFilter[0] === 'class'){
      blockedCount++;
      console.warn('[NavFix] blocked buggy observer #' + blockedCount);
      return;
    }
    return origObserve.apply(this, arguments);
  };

  /* برگردوندن به حالت عادی بعد از ۸ ثانیه (وقتی planner-v2 کامل لود شد) */
  setTimeout(function(){
    MutationObserver.prototype.observe = origObserve;
    console.log('[NavFix] observer override removed (blocked: ' + blockedCount + ')');
  }, 8000);

  /* ─── ۲) اسلایدر تمیز و امن ─── */
  var _navReady = false;

  function initSlider(){
    if (_navReady) return true;
    var nav = document.getElementById('bottomNav');
    if (!nav) return false;

    _navReady = true;

    /* پاک‌سازی اسلایدر قبلی */
    var oldSlider = nav.querySelector('#navSlider');
    if (oldSlider) oldSlider.remove();

    /* اسلایدر تازه */
    var slider = document.createElement('div');
    slider.id = 'navSlider';
    slider.className = 'nav-slider';
    nav.insertBefore(slider, nav.firstChild);

    var lock = false;

    function computeTarget(){
      var active = nav.querySelector('.bottom-nav-btn.active:not(.nav-btn-chat)');
      if (!active) return null;
      var navRect = nav.getBoundingClientRect();
      var btnRect = active.getBoundingClientRect();
      var pos = document.documentElement.getAttribute('data-nav-position') || 'bottom';
      var isVert = pos === 'left' || pos === 'right';
      return {
        L: btnRect.left - navRect.left,
        T: btnRect.top - navRect.top,
        W: btnRect.width,
        H: btnRect.height,
        R: isVert ? '16px' : '21px'
      };
    }

    function paint(animate){
      var t = computeTarget();
      if (!t){ slider.classList.remove('visible'); return; }

      if (!animate){
        slider.style.transition = 'none';
        slider.classList.remove('ready');
      } else {
        slider.classList.add('ready');
      }

      slider.style.left = t.L + 'px';
      slider.style.top = t.T + 'px';
      slider.style.width = t.W + 'px';
      slider.style.height = t.H + 'px';
      slider.style.borderRadius = t.R;

      if (!animate){
        void slider.offsetWidth;
        slider.style.transition = '';
        slider.classList.add('ready');
      }
      slider.classList.add('visible');
    }

    /* جایگزینی تابع v22 — هر جا v22 صدا بزنه، نسخه‌ی ما اجرا می‌شه */
    window.__moveNavSlider = function(a){
      requestAnimationFrame(function(){ paint(a !== false); });
    };

    /* اولین رنگ با انیمیشن grow */
    requestAnimationFrame(function(){
      paint(false);
      slider.classList.add('grow');
      setTimeout(function(){ slider.classList.remove('grow'); }, 560);
    });

    /* ★ Observer امن — فقط روی دکمه‌های نوار ★ */
    new MutationObserver(function(muts){
      if (lock) return;
      var relevant = false;
      for (var i = 0; i < muts.length; i++){
        var t = muts[i].target;
        if (t && t.classList && t.classList.contains('bottom-nav-btn')){
          relevant = true;
          break;
        }
      }
      if (!relevant) return;

      lock = true;
      requestAnimationFrame(function(){
        paint(true);
        setTimeout(function(){ lock = false; }, 60);
      });
    }).observe(nav, { attributes: true, attributeFilter: ['class'], subtree: true });

    /* تغییر موقعیت نوار */
    new MutationObserver(function(){
      requestAnimationFrame(function(){ paint(false); });
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-nav-position']
    });

    /* ریسایز */
    window.addEventListener('resize', function(){ paint(false); });

    console.log('[NavFix] slider ready ✓');
    return true;
  }

  /* ─── ۳) صبر برای #bottomNav ─── */
  var tries = 0;
  var iv = setInterval(function(){
    if (initSlider() || ++tries > 150){
      clearInterval(iv);
      if (tries > 150) console.warn('[NavFix] nav never appeared');
    }
  }, 100);

})();
