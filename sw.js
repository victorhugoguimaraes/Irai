// Service Worker personalizado
const CACHE_NAME = 'irai-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]).catch(error => {
        console.error('Erro ao cachear recursos:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna a resposta do cache
      if (response) {
        return response;
      }

      // Clone a requisição
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Verifica se recebemos uma resposta válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone a resposta
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.method === 'GET') {
            cache.put(event.request, responseToCache);
          }
        });

        return response;
      }).catch(() => {
        // Se falhar, tenta retornar uma página offline
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 