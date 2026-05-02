// Firebase Cloud Messaging Service Worker
// This file MUST be at the root of the public directory (served at /firebase-messaging-sw.js)

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Do NOT call firebase.initializeApp() here — the config is injected via postMessage
// from the main app after the service worker becomes active.

// 1. Parse config from URL (set during registration)
const urlParams = new URLSearchParams(location.search);
const config = {
  apiKey: urlParams.get("apiKey"),
  authDomain: urlParams.get("authDomain"),
  projectId: urlParams.get("projectId"),
  storageBucket: urlParams.get("storageBucket"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
};

let messagingInitialized = false;

function initFirebase(cfg) {
  if (messagingInitialized) return;
  if (!cfg.apiKey) {
    console.warn("[firebase-messaging-sw.js] No config found in URL, waiting for message...");
    return;
  }

  try {
    if (!firebase.apps.length) {
      console.log("[firebase-messaging-sw.js] Initializing Firebase synchronously from URL config.");
      firebase.initializeApp(cfg);
    }

    const messaging = firebase.messaging();
    
    // Background message handler must be registered synchronously
    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Background message received:", payload);
      const notificationTitle = payload.notification?.title ?? "New Notification";
      const notificationOptions = {
        body: payload.notification?.body ?? "",
        icon: payload.notification?.icon ?? "/logo_avow_social.svg",
        badge: "/logo_avow_social.svg",
        data: payload.data,
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    messagingInitialized = true;
    console.log("[firebase-messaging-sw.js] Firebase Messaging initialized successfully.");
  } catch (err) {
    console.error("[firebase-messaging-sw.js] Synchronous initialization failed:", err);
  }
}

// Attempt immediate initialization
initFirebase(config);

/**
 * Fallback: Receives config from the main app if not already initialized.
 */
self.addEventListener("message", (event) => {
  if (event.data?.type !== "FIREBASE_CONFIG") return;
  if (messagingInitialized) {
    console.log("[firebase-messaging-sw.js] Already initialized, ignoring message config.");
    return;
  }
  console.log("[firebase-messaging-sw.js] Initializing via fallback message listener.");
  initFirebase(event.data.config);
});

// Handle notification click – opens/focuses the app
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked:", event.notification.tag, event.notification.data);
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // If a window is already open, focus it
        for (const client of windowClients) {
          if ("focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
