const CACHE_NAME = 'try-typescript-v1';
const TYPECRIPT_CACHE = 'typescript-v1';

const TYPE_SCRIPTS = [
  'https://unpkg.com/typescript@5.3.3/lib/typescript.js',
  'https://unpkg.com/typescript@5.3.3/lib/typescript.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(TYPECRIPT_CACHE).then((cache) => {
      return Promise.allSettled(
        TYPE_SCRIPTS.map((url) =>
          fetch(url).then((response) => {
            if (response.ok) {
              cache.put(url, response);
            }
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== TYPECRIPT_CACHE && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.hostname === 'unpkg.com' && url.pathname.includes('/typescript@')) {
    event.respondWith(
      caches.open(TYPECRIPT_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
  }
});
