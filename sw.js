const CACHE_NAME = 'ruangtenang-cache-v10';
const ASSETS = [
  './',
  './index.html',
  './napas',
  './napas.html',
  './jurnal',
  './jurnal.html',
  './bantuan',
  './bantuan.html',
  './panduan',
  './panduan.html',
  './style.css?v=10.0',
  './script.js?v=10.0',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if (cached) return cached;
      return fetch(evt.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(evt.request, toCache));
        return response;
      }).catch(() => {
        if (cached) return cached;
        const url = new URL(evt.request.url);
        const path = url.pathname.replace(/\/$/, '');
        const fallback = path + '.html';
        return caches.match(fallback).then(fb => {
          if (fb) return fb;
          if (evt.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      });
    })
  );
});
