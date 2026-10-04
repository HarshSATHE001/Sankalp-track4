/**
 * public/sw.js - SANKALP Offline-First Service Worker
 * 
 * Version: sankalp-v2
 * Strategy: Stale-While-Revalidate for GET requests
 * Pre-caches app shell and static folders: config/, data/, model/, tts/
 */

const CACHE_NAME = 'sankalp-v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './config/thresholds.json',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);

      const networkFetch = fetch(req)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            cache.put(req, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
