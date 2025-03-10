import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Precache todos os assets estáticos
precacheAndRoute(self.__WB_MANIFEST)

// Cache para fontes do Google
registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' || 
             url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

// Cache para dados da API do Firebase
registerRoute(
  ({url}) => url.origin.includes('firestore.googleapis.com'),
  new NetworkFirst({
    cacheName: 'firebase-data',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 // 1 dia
      })
    ]
  })
)

// Cache para outros recursos estáticos
registerRoute(
  ({request}) => request.destination === 'image' ||
                 request.destination === 'style' ||
                 request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
      })
    ]
  })
) 