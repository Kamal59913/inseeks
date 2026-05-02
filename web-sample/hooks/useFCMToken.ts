"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  requestNotificationPermission,
  getFirebaseMessaging,
} from "@/lib/firebase/messaging";
import { onMessage } from "firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationStore } from "@/store/useNotificationStore";

interface UseFCMTokenReturn {
  token: string | null;
  permissionStatus: NotificationPermission | "loading";
  isLoading: boolean;
}

/**
 * Registers the Firebase service worker, requests notification permission,
 * retrieves the FCM token, and listens for foreground messages.
 *
 * @param onTokenReceived - Optional callback when the FCM token is obtained.
 *                          Use this to send the token to your backend.
 */
export function useFCMToken(
  onTokenReceived?: (token: string) => void,
  enabled: boolean = true,
): UseFCMTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "loading"
  >("loading");
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const incrementUnseenCount = useNotificationStore(
    (state) => state.incrementUnseenCount,
  );

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  const initFCM = useCallback(async () => {
    console.log("[useFCMToken] initFCM called. enabled:", enabled);
    // FCM only works in the browser
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.log("[useFCMToken] Browser does not support notifications.");
      setIsLoading(false);
      setPermissionStatus("denied");
      return;
    }

    if (!vapidKey) {
      console.warn("[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set.");
      setIsLoading(false);
      return;
    }

    try {
      // Register the service worker manually so we can pass the Firebase config
      let swRegistration: ServiceWorkerRegistration | undefined;

      if ("serviceWorker" in navigator) {
        console.log("[useFCMToken] Registering service worker...");

        // Pass Firebase config as query parameters so the SW can initialize synchronously
        const swConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId:
            process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        const queryParams = new URLSearchParams(swConfig as any).toString();
        const swUrl = `/firebase-messaging-sw.js?${queryParams}`;

        swRegistration = await navigator.serviceWorker.register(swUrl, {
          scope: "/",
        });
        console.log(
          "[useFCMToken] Service worker registered with config in URL.",
        );

        // A newly installed SW goes: installing → waiting → active.
        // We must wait for it to be active before postMessage works.
        const getActiveWorker = (
          reg: ServiceWorkerRegistration,
        ): Promise<ServiceWorker> => {
          return new Promise((resolve) => {
            if (reg.active) {
              console.log("[useFCMToken] SW is active.");
              resolve(reg.active);
              return;
            }
            const installing = reg.installing ?? reg.waiting;
            if (!installing) {
              console.log(
                "[useFCMToken] No installing/waiting SW, waiting for controllerchange...",
              );
              // Fallback: wait for the controllerchange event
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                () => {
                  if (navigator.serviceWorker.controller) {
                    console.log(
                      "[useFCMToken] Controller changed, Resolve active worker.",
                    );
                    resolve(navigator.serviceWorker.controller);
                  }
                },
                { once: true },
              );
              return;
            }
            console.log("[useFCMToken] Waiting for SW to activate...");
            installing.addEventListener("statechange", function handler() {
              if (this.state === "activated") {
                console.log("[useFCMToken] SW activated.");
                this.removeEventListener("statechange", handler);
                resolve(this as ServiceWorker);
              }
            });
          });
        };

        const activeWorker = await getActiveWorker(swRegistration);

        // Inject Firebase config into the now-active service worker
        console.log(
          "[useFCMToken] Posting FIREBASE_CONFIG to service worker...",
        );
        activeWorker.postMessage({
          type: "FIREBASE_CONFIG",
          config: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId:
              process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          },
        });
      }

      console.log(
        "[useFCMToken] Requesting notification permission and token...",
      );
      const fcmToken = await requestNotificationPermission(
        vapidKey,
        swRegistration,
      );
      const currentPermission = Notification.permission;
      console.log("[useFCMToken] Permission status:", currentPermission);
      setPermissionStatus(currentPermission);

      if (fcmToken) {
        setToken(fcmToken);
        console.log("[useFCMToken] FCM Token obtained:", fcmToken);
        onTokenReceived?.(fcmToken);
      } else {
        console.log("[useFCMToken] No FCM token obtained.");
      }
    } catch (error) {
      console.error("[FCM] Initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [vapidKey, onTokenReceived, enabled]);

  // Initialize FCM on mount
  useEffect(() => {
    initFCM();
  }, [initFCM]);

  // Listen for foreground messages and show a toast
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    getFirebaseMessaging().then((fcmMessaging) => {
      if (!fcmMessaging) {
        console.log("[useFCMToken] Failed to get Firebase Messaging instance.");
        return;
      }

      console.log("[useFCMToken] Setting up foreground message listener.");
      unsubscribe = onMessage(fcmMessaging, (payload) => {
        if (!enabled) {
          console.log(
            "[useFCMToken] Foreground message received but notifications are disabled.",
            payload,
          );
          return;
        }

        console.log(
          "[useFCMToken] Foreground message received:",
          JSON.stringify(payload, null, 2),
        );

        // 1. Increment Count in Global Store
        incrementUnseenCount();

        // 2. Inject into React Query Cache for instant Sidebar update
        const newNotification = {
          id: payload.messageId || Date.now(),
          title: payload.notification?.title ?? "New Notification",
          message: payload.notification?.body ?? "",
          is_read: false,
          created_at: new Date().toISOString(),
          notification_type: payload.data?.type || "system",
          ...(payload.data as any),
        };

        // We target the 'all' filter as a safe default
        queryClient.setQueryData(
          ["notifications", "all", 10],
          (oldData: any) => {
            if (!oldData) return oldData;
            const firstPage = oldData.pages[0];
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  data: [newNotification, ...(firstPage.data || [])],
                },
                ...oldData.pages.slice(1),
              ],
            };
          },
        );

        const title = payload.notification?.title ?? "New Notification";
        const body = payload.notification?.body ?? "";

        toast(body ? `${title}: ${body}` : title, {
          icon: "🔔",
          duration: 5000,
        });
      });
    });

    return () => unsubscribe?.();
  }, [enabled]);

  return { token, permissionStatus, isLoading };
}
