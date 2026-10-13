const CACHE_NAME = 'diwan-v3';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './manifest.json'
];

// 1. التثبيت والتخزين المباشر
self.addEventListener('install', (event) => {
  self.skipWaiting(); // التفعيل الفوري بدون انتظار
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// 2. التفعيل وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. الاستجابة للطلبات
self.addEventListener('fetch', (event) => {
  // تجنب كاش طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // إذا انقطع النت، استرجع صفحة index أو login
        return caches.match('./index.html');
      });
    })
  );
});
