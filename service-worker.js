const CACHE_NAME = 'local-agent-wizard-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/local-agent-wizard.html',
  '/diagnose.html',
  '/templates.html',
  '/pricing.html',
  '/integrations.html',
  '/site.css',
  '/site-head.js',
  '/analytics.js',
  '/ads.js',
  '/comments.js',
  '/assets/hero-dashboard.png',
  '/favicon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        if (response.ok && new URL(request.url).origin === location.origin) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => caches.match('/local-agent-wizard.html'));
    })
  );
});
