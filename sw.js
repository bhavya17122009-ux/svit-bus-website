const CACHE_NAME = 'svit-bus-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/script.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force this worker to become active immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim()); // Take control of the page immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
