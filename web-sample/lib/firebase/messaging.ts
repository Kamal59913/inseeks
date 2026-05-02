import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  Messaging,
} from "firebase/messaging";
import app from "./firebase";

let messaging: Messaging | null = null;

/**
 * Returns the Firebase Messaging instance.
 * Only safe to call in a browser environment.
 * Returns null if the browser does not support the required APIs.
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!app) return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!messaging) {
    messaging = getMessaging(app);
  }
  return messaging;
}

/**
 * Requests notification permission from the browser and retrieves the FCM token.
 * @param vapidKey - Your Firebase VAPID key from the Firebase Console.
 * @returns The FCM token string, or null if permission was denied or an error occurred.
 */
export async function requestNotificationPermission(
  vapidKey: string,
  serviceWorkerRegistration?: ServiceWorkerRegistration,
): Promise<string | null> {
  console.log("[FCM lib] requestNotificationPermission called.");
  try {
    const permission = await Notification.requestPermission();
    console.log("[FCM lib] Browser permission result:", permission);
    if (permission !== "granted") {
      console.warn("[FCM lib] Notification permission denied.");
      return null;
    }

    const fcmMessaging = await getFirebaseMessaging();
    if (!fcmMessaging) {
      console.error("[FCM lib] Failed to initialize Firebase Messaging.");
      return null;
    }

    console.log("[FCM lib] Retrieving FCM token...");
    const token = await getToken(fcmMessaging, {
      vapidKey,
      serviceWorkerRegistration,
    });

    if (!token) {
      console.warn("[FCM lib] No registration token available.");
      return null;
    }

    console.log("[FCM lib] FCM token retrieved successfully.");
    return token;
  } catch (error) {
    console.error(
      "[FCM lib] Error getting notification permission/token:",
      error,
    );
    return null;
  }
}

export { onMessage, getFirebaseMessaging as messaging };
