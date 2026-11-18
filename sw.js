const CACHE_NAME = 'nt-overview-v1';
const ASSETS = [
  './',
  'index.html',
  'gospels.html',
  'act.html',
  'epistles.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// 安裝階段：寫入所有主頁與子頁面快取
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 啟動階段：清除舊版本快取
self.addEventListener('activate', (e) => {
  e.waitUntil(
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

// 攔截請求：優先讀取快取，若無則向網路請求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
