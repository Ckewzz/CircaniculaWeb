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

messaging.onBackgroundMessage((payload) => {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Circanícula', {
    body: n.body || '',
    icon: '/Images/Icono_4.png',
    badge: '/Images/Icono_4.png',
    data: payload.data || {}
  });
});

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
