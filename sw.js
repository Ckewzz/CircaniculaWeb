const CACHE_NAME = 'circanicula-v1';

// Recursos a cachear para uso offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Images/Logo_4.png',
  '/Images/Icono_4.png',
  '/Images/Icono_negro.png',
  '/Images/BG-01.jpg',
  '/Images/BG-02.jpg',
  '/Images/BG-03.jpeg',
  '/Images/BG-04.jpg',
  '/Images/BG-05.jpg',
  '/Images/BG-06.jpg',
  '/Images/BG-07.jpg',
  '/Images/BG-08.jpg',
  '/Images/BG-09.jpeg',
  '/Images/BG-10.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia: cache primero para assets estáticos, red primero para Firebase/Stripe
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Nunca cachear Firebase, Stripe, Formspree, YouTube
  const skipCache = [
    'firebaseapp.com', 'googleapis.com', 'gstatic.com',
    'stripe.com', 'formspree.io', 'youtube.com'
  ].some(d => url.hostname.includes(d));

  if (skipCache || event.request.method !== 'GET') {
    return;
  }

  // Cache first para assets estáticos
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
