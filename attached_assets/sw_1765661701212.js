const CACHE_NAME = 'kingdom-words-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/game.css',
  '/js/game.js',
  '/assets/premium_assets/icon_castle_premium.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
