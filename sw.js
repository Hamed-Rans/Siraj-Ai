/* ═══════════════════════════════════════════════════════════════
   Siraj SW — MINIMAL (فقط برای PWA نصب شدن)
   ═══════════════════════════════════════════════════════════════ */
const VERSION = '2.6.0';
const CACHE = 'siraj-v' + VERSION;

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('siraj-v') && k !== CACHE)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* ★★★ کلید حل: fetch handler وجود نداره. مرورگر همه چیز رو مستقیم می‌فرسته. ★★★ */

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
