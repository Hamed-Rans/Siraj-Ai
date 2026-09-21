/* ═══════════════════════════════════════════════════════════════
   Siraj PWA Service Worker — Version-based Cache
   هر بار این نسخه رو عوض کنی، SW آپدیت می‌شه
   ═══════════════════════════════════════════════════════════════ */
const VERSION = '2.5.31';
const CACHE = 'siraj-v' + VERSION;

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './style-v2.css',
  './script.js',
  './planner-v2.js',
  './siraj-logo.png',
  './manifest.json'
];

/* ═══ INSTALL: کش اولیه ═══ */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  /* ★ با نصب، فوراً فعال شو ولی منتظر بمون تا کاربر بگه */
  self.skipWaiting();
});

/* ═══ ACTIVATE: پاک کردن کش‌های قدیمی ═══ */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE && k.startsWith('siraj-v')) {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        }
      })
    )).then(() => self.clients.claim())
  );
});

/* ═══ FETCH: استراتژی Network-first برای فایل‌های اصلی ═══ */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('siraj-proxy') > -1) return;
  if (e.request.url.startsWith('chrome-extension')) return;

  var url = new URL(e.request.url);
  var isAppFile = url.origin === self.location.origin;

  if (isAppFile) {
    /* ★ Network-first برای فایل‌های خود اپ */
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        return caches.match(e.request).then(cached => {
          return cached || caches.match('./index.html');
        });
      })
    );
  } else {
    /* ★ Cache-first برای منابع خارجی (فونت‌ها، CDN) */
    e.respondWith(
      caches.match(e.request).then(cached => {
        return cached || fetch(e.request).then(res => {
          if (res && res.ok && res.type === 'basic') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
});

/* ═══ MESSAGE: از اپ پیام بگیر ═══ */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/* ═══ NOTIFICATION CLICK ═══ */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
