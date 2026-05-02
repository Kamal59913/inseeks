"use client";

import { useState, useEffect, useCallback } from "react";
import { useFCMToken } from "./useFCMToken";
import userService from "@/lib/api/services/userService";
import toast from "react-hot-toast";

export function useNotificationManager() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] =
    useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    token,
    permissionStatus,
    isLoading: isFCMInitialising,
  } = useFCMToken(undefined, isNotificationsEnabled);

  // Sync with localStorage on mount (as a fallback until backend is fully ready)
  useEffect(() => {
    const savedPreference = localStorage.getItem("push_notifications_enabled");
    console.log(
      "[useNotificationManager] Mount. savedPreference:",
      savedPreference,
      "permissionStatus:",
      permissionStatus,
    );
    if (savedPreference !== null) {
      setIsNotificationsEnabled(savedPreference === "true");
    } else {
      // Default to true as requested by user
      setIsNotificationsEnabled(true);
    }
  }, [permissionStatus]);

  const toggleNotifications = useCallback(
    async (checked: boolean) => {
      console.log(
        "[useNotificationManager] toggleNotifications called. checked:",
        checked,
      );
      setIsUpdating(true);
      try {
        // 1. Update backend preference
        console.log("[useNotificationManager] Updating backend preference...");
        await userService.updateNotificationPreference(checked);

        // 2. Update local state
        setIsNotificationsEnabled(checked);
        localStorage.setItem("push_notifications_enabled", String(checked));
        console.log(
          "[useNotificationManager] Local state and localStorage updated.",
        );

        if (checked) {
          if (permissionStatus === "denied") {
            console.warn(
              "[useNotificationManager] Permission denied in browser.",
            );
            toast.error(
              "Please enable notifications in your browser settings.",
            );
            setIsNotificationsEnabled(false);
            localStorage.setItem("push_notifications_enabled", "false");
          } else {
            toast.success("Push notifications enabled!");
          }
        } else {
          toast.success("Push notifications disabled.");
        }
      } catch (error) {
        console.error(
          "[useNotificationManager] Failed to toggle notifications:",
          error,
        );
        toast.error("Failed to update notification settings.");
      } finally {
        setIsUpdating(false);
      }
    },
    [permissionStatus],
  );

  return {
    isEnabled: isNotificationsEnabled,
    permissionStatus,
    isLoading: isFCMInitialising || isUpdating,
    toggleNotifications,
  };
}
