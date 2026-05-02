"use client";

import { useRouter } from "next/navigation";
import { getStack, popFromStack, setGoingBack } from "./navStack";

/**
 * Returns a `goBack` function that navigates using the app's own nav stack:
 *   - Stack has > 1 entry   → router.back()        (came here from within the app)
 *   - Stack has 0–1 entries → router.push(fallback) (direct link / new tab)
 *
 * The stack is maintained by useNavigationStack() in the dashboard layout.
 */
export const useSmartBack = (fallback: string) => {
  const router = useRouter();

  const goBack = () => {
    const stack = getStack();

    if (stack.length > 1) {
      // Pop current page off the stack, flag the next pathname change as a back-nav
      popFromStack();
      setGoingBack();
      router.back();
    } else {
      // No in-app history — opened directly, use fallback
      router.push(fallback);
    }
  };

  return goBack;
};
