const CACHE_NAME = 'diwan-store-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './manifest.json',
  'img.jpeg'
];

// مرحلة التثبيت وتخزين الملفات في الكاش
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// مرحلة التفعيل وتنظيف الكاش القديم
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// جلب الملفات من الكاش أثناء انقطاع الإنترنت
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
