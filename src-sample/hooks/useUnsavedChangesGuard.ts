"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useModalData } from "@/store/hooks/useModal";

interface UseUnsavedChangesGuardOptions {
  /** Enable/disable the popstate (browser back) listener. Default: true */
  enablePopstateGuard?: boolean;
}

/**
 * Shared hook that encapsulates the "unsaved changes" guard pattern
 * used across section layouts (Bookings, Catalog, Profile).
 *
 * Handles:
 * - `beforeunload` browser warning
 * - `popstate` (browser back) interception with confirmation modal
 * - Tab navigation with confirmation modal
 */
export function useUnsavedChangesGuard(
  options: UseUnsavedChangesGuardOptions = {},
) {
  const { enablePopstateGuard = true } = options;

  const pathname = usePathname();
  const router = useRouter();
  const { open, close } = useModalData();
  const currentFormRef = useRef<any>(null);

  const hasUnsavedChanges = (): boolean => {
    return currentFormRef.current?.formState?.isDirty || false;
  };

  // Handle tab navigation with unsaved changes check
  const handleTabNavigation = (route: string) => {
    if (hasUnsavedChanges()) {
      open("save-changes-confirmation", {
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Are you sure you want to leave?",
        action: () => {
          if (currentFormRef.current) {
            currentFormRef.current.reset();
          }
          router.push(route);
          close();
        },
        cancel: () => {},
      });
    } else {
      router.push(route);
    }
  };

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handle browser back button
  useEffect(() => {
    if (!enablePopstateGuard) return;

    const handlePopState = () => {
      if (hasUnsavedChanges()) {
        window.history.pushState(null, "", pathname);
        open("save-changes-confirmation", {
          title: "Unsaved Changes",
          description:
            "You have unsaved changes. Are you sure you want to leave?",
          action: () => {
            if (currentFormRef.current) {
              currentFormRef.current.reset();
            }
            window.history.back();
            close();
          },
          cancel: () => {},
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname, open, close, enablePopstateGuard]);

  return {
    currentFormRef,
    hasUnsavedChanges,
    handleTabNavigation,
  };
}

