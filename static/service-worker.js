const CACHE_NAME = 'bloxel-shell-%__RELEASE_UUID__%';
// index.html, launcher.js, and servers.json are intentionally excluded from
// the pre-cache so the browser always fetches the latest version.
const APP_SHELL = [
  './app.webmanifest',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './icon-maskable.svg',
  './%__RELEASE_UUID__%/worker.js'
];
// These paths are always fetched fresh from the network (no cache read/write).
const NEVER_CACHE = [
  'index.html',
  'launcher.js',
  'servers.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith('bloxel-shell-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  // Always fetch these fresh — never serve from cache
  const pathname = url.pathname;
  if (NEVER_CACHE.some(n => pathname.endsWith('/' + n) || pathname.endsWith(n))) {
    event.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 })));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => {
        // Avoid unhandled promise rejections when upstream fetch fails.
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    })
  );
});