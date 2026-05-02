"use client";

import { useCallback } from "react";
import { useNotificationManager } from "@/hooks/useNotificationManager";
import userService from "@/lib/api/services/userService";
import { useFCMToken } from "@/hooks/useFCMToken";

export default function NotificationProvider() {
  const { isEnabled } = useNotificationManager();

  console.log("[NotificationProvider] Mount. isEnabled:", isEnabled);

  const handleTokenReceived = useCallback(
    async (token: string) => {
      console.log("[NotificationProvider] handleTokenReceived called with token. isEnabled:", isEnabled);
      if (!isEnabled) {
        console.log(
          "[NotificationProvider] Notifications were manually disabled by the user, skipping registration.",
        );
        return;
      }
      try {
        console.log("[NotificationProvider] Attempting to save FCM token to backend...");
        await userService.saveFCMToken(token);
        console.log("[NotificationProvider] FCM token registered with backend successfully.");
      } catch (error) {
        console.error(
          "[NotificationProvider] Failed to register FCM token with backend:",
          error,
        );
      }
    },
    [isEnabled],
  );

  useFCMToken(handleTokenReceived, isEnabled);

  return null;
}
