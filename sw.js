/* ═══════════════════════════════════════════════════════════════
   Siraj PWA Service Worker — Safe Version
   ═══════════════════════════════════════════════════════════════ */
const VERSION = '2.5.32';
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

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE && k.startsWith('siraj-v')) return caches.delete(k);
      })
    )).then(() => self.clients.claim())
  );
});

/* ═══ FETCH — فقط فایل‌های استاتیک خود اپ ═══ */
self.addEventListener('fetch', e => {
  // ★ فقط GET ها
  if (e.request.method !== 'GET') return;

  // ★ فقط درخواست‌های همون دامنه (GitHub Pages)
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // ★ هر چیزی به /openai/ یا /api/ یا ورکر → SW دخالت نکنه
  if (url.pathname.includes('/openai/') ||
      url.pathname.includes('/api/') ||
      url.pathname.includes('/chat/')) return;

  // ★ فایل‌های API و font-face و ... → skip
  if (url.href.includes('workers.dev') ||
      url.href.includes('siraj-proxy') ||
      url.href.includes('jsdelivr')) return;

  // ★ Network-first برای فایل‌های استاتیک
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(()=>{});
      }
      return res;
    }).catch(() => {
      return caches.match(e.request).then(cached => {
        return cached || caches.match('./index.html');
      });
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

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
