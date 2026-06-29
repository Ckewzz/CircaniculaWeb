// firebase-messaging-sw.js — Service Worker dedicado a Firebase Cloud Messaging (FCM).
// Recibe y muestra notificaciones push cuando la pestaña está en segundo plano o cerrada.
// Usa el SDK "compat" porque los service workers no soportan imports ESM.
// Se registra con scope propio (/firebase-cloud-messaging-push-scope) para NO
// chocar con el service worker de la PWA (sw.js, scope "/").
// NOTA: el ENVÍO remoto de notificaciones llega con el backend (n8n/VPS, Fase 4);
// este archivo solo RECIBE lo que ese backend mande vía FCM.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB_2POgJsaN6ueZQLQpq8cAIXMBNp0x_rc",
  authDomain: "circanicula-267.firebaseapp.com",
  projectId: "circanicula-267",
  storageBucket: "circanicula-267.firebasestorage.app",
  messagingSenderId: "465761059184",
  appId: "1:465761059184:web:8623539f525f8ec6aecfb5"
});

const messaging = firebase.messaging();

// Mensajes recibidos con la app en segundo plano / cerrada.
messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Circanícula', {
    body: n.body || '',
    icon: '/Images/Icono_4.png',
    badge: '/Images/Icono_4.png',
    data: payload.data || {}
  });
});

// Al hacer click en la notificación: enfoca una pestaña abierta o abre el sitio.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) { if ('focus' in w) return w.focus(); }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
