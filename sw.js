/* ═══════════════════════════════════════════════════════════════
   Siraj SW — Minimal (فقط PWA نصب شدن)
   ═══════════════════════════════════════════════════════════════ */
const VERSION = '2.6.0';
const CACHE = 'siraj-v' + VERSION;

self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k.startsWith('siraj-v') && k !== CACHE)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

/* ★ هیچ fetch listener ای وجود نداره — SW هیچ درخواستی رو نمی‌گیره */
/* PWA هنوز نصب می‌شه، ولی هیچ caching اتفاق نمی‌افته */
