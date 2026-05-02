"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushToStack, clearGoingBack, isGoingBack } from "./navStack";

/**
 * Call this once in the dashboard layout.
 * Listens to every pathname change and:
 *   - Pushes the new path to the nav stack (forward navigation)
 *   - Skips the push when the change was triggered by router.back() (back navigation)
 */
export const useNavigationStack = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (isGoingBack()) {
      // This path change was caused by router.back() — don't record it as a forward step
      clearGoingBack();
      return;
    }
    pushToStack(pathname);
  }, [pathname]);
};
