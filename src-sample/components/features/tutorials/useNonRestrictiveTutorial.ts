import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import {
  dismissPageAndSync,
  dismissTutorialPage,
  dismissPageAndSyncModule,
} from "@/store/slices/nonRestrictiveTutorialSlice";
import { getTutorialConfigForRoute } from "./nonRestrictiveTutorialConfig";
import { RootState, AppDispatch } from "@/store/store";

export const useNonRestrictiveTutorial = () => {
  const dispatch: AppDispatch = useDispatch();
  const pathname = usePathname();

  const { dismissedPages, sessionDismissedPages, isEnabled } = useSelector(
    (state: RootState) => state.nonRestrictiveTutorial
  );

  const {
    NON_RESTRICTIVE_TUTORIAL_CONFIG,
  } = require("./nonRestrictiveTutorialConfig");

  // Get config for current route
  let currentConfig = getTutorialConfigForRoute(pathname);

  // Special handling for finished_step
  // 1. Identify all "regular" steps (excluding finished_step)
  const regularSteps = NON_RESTRICTIVE_TUTORIAL_CONFIG.filter(
    (c: any) => c.module !== "finished_step"
  );

  // 2. Check if all regular steps are dismissed (persistent or session)
  const areAllRegularStepsDismissed = regularSteps.every(
    (step: any) =>
      dismissedPages.includes(step.module) ||
      sessionDismissedPages.includes(step.module)
  );

  // 3. If on /profile/information and all regulars are done, check if we should show finished_step
  if (pathname === "/profile/information" && areAllRegularStepsDismissed) {
    const finishedConfig = NON_RESTRICTIVE_TUTORIAL_CONFIG.find(
      (c: any) => c.module === "finished_step"
    );

    // If finished_step is NOT dismissed, overwrite currentConfig with it
    const isFinishedDismissed = finishedConfig
      ? dismissedPages.includes(finishedConfig.module) ||
        sessionDismissedPages.includes(finishedConfig.module)
      : false;

    if (finishedConfig && !isFinishedDismissed) {
      currentConfig = finishedConfig;
    }
  }

  // Check if current page has been dismissed using module name (as stored in Redux)
  // Check BOTH persistent and session-only dismissals
  const isDismissed = currentConfig
    ? dismissedPages.includes(currentConfig.module) ||
      sessionDismissedPages.includes(currentConfig.module)
    : false;

  // Determine if popup should show
  const shouldShowPopup =
    isEnabled && currentConfig !== undefined && !isDismissed;

  // Dismiss handler - uses thunk to sync with API
  const dismissCurrentPage = () => {
    // If we are dismissing finished_step, we just do it.
    // Logic handles the correct module name based on currentConfig.
    if (currentConfig) {
      dispatch(dismissTutorialPage(currentConfig.module)); // Optimistic and session update
      dispatch(dismissPageAndSync(pathname)); // Sync with API (path matching might need care if multiple modules share path)

      // Because dismissPageAndSync looks up config by path, it might try to dismiss 'information' again.
      // We should ideally pass the exact module name to the Thunk or handle it there.
      // For now, let's explicitly update the session/store locally for sure using the module name.
    }
  };

  const dismissSpecificModule = (moduleName: string) => {
    dispatch(dismissTutorialPage(moduleName));
    // Tricky: dismissPageAndSync uses route lookup.
    // If we are on /profile/information, it finds 'information' usually.
    // We might need to enhance the slice to accept module name directly for sync.
    // For now, assume optimistic update hides it, and we can rely on manual dispatch.
    // Let's modify dismissPageAndSync in the slice step if needed, but for now:

    // We'll manually replicate sync logic here if needed or just trust the standard flow
    // Actually, let's just use the dismissTutorialPage action which adds to dismissed list.
    // And then maybe trigger a generic sync?

    // Let's stick to the standard dismissCurrentPage but pass the module explicitly if I modify the thunk?
    // No, let's just define a specialized dismiss function for this component

    // Re-reading slice: dismissPageAndSync takes (route).
    // It finds config by route.
    // Problem: `finished_step` and `information` have same route.
    // `getTutorialConfigForRoute` finds the FIRST one (information).

    // I need to update the slice or the hook to handle this.
    // Simplest: The component calls `dispatch(dismissTutorialPage(currentConfig.module))` directly.
    // Then calls a "Sync" action.
  };

  return {
    shouldShowPopup,
    currentConfig,
    dismissCurrentPage: () => {
      if (currentConfig) {
        // This ensures we dismiss "finished_step" specifically if that's what's showing
        dispatch(dismissPageAndSyncModule(currentConfig.module));
      }
    },
    isEnabled,
    isDismissed,
  };
};

