/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCSqxyesFoq1znF1LxHA_2nSiT_0xg86SM",
  authDomain: "housing-platform.firebaseapp.com",
  projectId: "housing-platform",
  storageBucket: "housing-platform.appspot.com",
  messagingSenderId: "843938039071",
  appId: "1:843938039071:web:9c0677d7105dd84f0c9c2a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title ?? "Notification", {
    body,
    icon: "/icon.png",
    data: payload.data,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.route || "/")
  );
});
