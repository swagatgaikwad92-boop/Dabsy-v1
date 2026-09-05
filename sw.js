const CACHE_NAME = 'dabsy-core-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles/base.css',
  './styles/presence.css',
  './styles/atmosphere.css',
  './styles/eyes.css',
  './styles/expressions.css',
  './styles/tie.css',
  './styles/subtitles.css',
  './styles/world.css',
  './styles/panels.css',
  './styles/study.css',
  './styles/butler.css',
  './styles/responsive.css',
  './styles/motion.css',
  './js/dabsy-storage.js',
  './js/dabsy-events.js',
  './js/dabsy-state.js',
  './js/dabsy-permissions.js',
  './js/dabsy-context.js',
  './js/dabsy-personality.js',
  './js/dabsy-motion.js',
  './js/dabsy-expression.js',
  './js/dabsy-eyes.js',
  './js/dabsy-tie.js',
  './js/dabsy-voice.js',
  './js/dabsy-ai.js',
  './js/dabsy-memory.js',
  './js/dabsy-scheduler.js',
  './js/dabsy-study.js',
  './js/dabsy-behaviour.js',
  './js/dabsy-notifications.js',
  './js/dabsy-ui.js',
  './js/dabsy-world.js',
  './js/dabsy-interaction.js',
  './js/dabsy-core.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => caches.match('./index.html')))
  );
});

