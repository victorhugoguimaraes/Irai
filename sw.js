const CACHE_NAME = 'irai-v1';
const urlsToCache = [
  '/Irai/',
  '/Irai/index.html',
  '/Irai/manifest.json',
  '/Irai/favicon.ico',
  '/Irai/logo192.png',
  '/Irai/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 