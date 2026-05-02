import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NonRestrictiveTutorialState {
  dismissedPages: string[]; // Array of page routes that have been dismissed (persistent)
  sessionDismissedPages: string[]; // Array of pages dismissed in current browser session
  isEnabled: boolean; // Toggle for this tutorial flow
  isLoading: boolean; // Track API call status
  isInitialized: boolean; // Track if we've loaded from API
}

const STORAGE_KEY = "nonRestrictiveTutorial_dismissed";

// Load dismissed pages from localStorage (fallback)
const loadDismissedPages = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load dismissed tutorial pages:", error);
    return [];
  }
};

// Save dismissed pages to localStorage (backup)
const saveDismissedPages = (pages: string[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (error) {
    console.error("Failed to save dismissed tutorial pages:", error);
  }
};

const initialState: NonRestrictiveTutorialState = {
  dismissedPages: loadDismissedPages(),
  sessionDismissedPages: [],
  isEnabled: true, // Enabled by default
  isLoading: false,
  isInitialized: false,
};

const nonRestrictiveTutorialSlice = createSlice({
  name: "nonRestrictiveTutorial",
  initialState,
  reducers: {
    // Load dismissed modules from user profile meta (called in protected wrapper)
    loadDismissedPagesFromAPI: (state, action: PayloadAction<string[]>) => {
      state.dismissedPages = action.payload;
      state.isInitialized = true;
      saveDismissedPages(action.payload);
    },

    // Dismiss a module - will trigger API call
    dismissTutorialPage: (state, action: PayloadAction<string>) => {
      const moduleName = action.payload;

      // Always track in session to prevent reappearance in client-side navigation
      if (!state.sessionDismissedPages.includes(moduleName)) {
        state.sessionDismissedPages.push(moduleName);
      }

      if (!state.dismissedPages.includes(moduleName)) {
        state.dismissedPages.push(moduleName);
        saveDismissedPages(state.dismissedPages);
        state.isLoading = true;
      }
    },

    // Mark API call as complete
    dismissTutorialPageSuccess: (state) => {
      state.isLoading = false;
    },

    // Mark API call as failed (keep module in dismissed list anyway for UX)
    dismissTutorialPageFailure: (state) => {
      state.isLoading = false;
    },

    enableNonRestrictiveTutorial: (state) => {
      state.isEnabled = true;
    },
    disableNonRestrictiveTutorial: (state) => {
      state.isEnabled = false;
    },
    resetDismissedPages: (state) => {
      state.dismissedPages = [];
      saveDismissedPages([]);
    },
  },
});

export const {
  loadDismissedPagesFromAPI,
  dismissTutorialPage,
  dismissTutorialPageSuccess,
  dismissTutorialPageFailure,
  enableNonRestrictiveTutorial,
  disableNonRestrictiveTutorial,
  resetDismissedPages,
} = nonRestrictiveTutorialSlice.actions;

// Thunk to dismiss module and sync with API
export const dismissPageAndSync =
  (route: string) => async (dispatch: any, getState: any) => {
    // Get module name from route
    const { NON_RESTRICTIVE_TUTORIAL_CONFIG } = await import(
      "@/components/features/tutorials/nonRestrictiveTutorialConfig"
    );
    const config = NON_RESTRICTIVE_TUTORIAL_CONFIG.find(
      (c) => c.route === route
    );

    const moduleName = config?.module || route;

    // Optimistically update state with module name
    dispatch(dismissTutorialPage(moduleName));

    // Sync with API
    try {
      const state = getState();
      const dismissedPages = state.nonRestrictiveTutorial.dismissedPages;
      // Dynamic import to break circular dependency
      const tutorialsService = (
        await import("@/services/tutorialsService")
      ).default;
      await tutorialsService.updateDismissedTutorialPages(dismissedPages);
      dispatch(dismissTutorialPageSuccess());
    } catch (error) {
      console.error("Failed to sync dismissed modules with API:", error);
      dispatch(dismissTutorialPageFailure());
    }
  };

// Thunk to dismiss a specific module by name and sync with API
export const dismissPageAndSyncModule =
  (moduleName: string) => async (dispatch: any, getState: any) => {
    // Optimistically update state with module name
    dispatch(dismissTutorialPage(moduleName));

    // Sync with API
    try {
      const state = getState();
      const dismissedPages = state.nonRestrictiveTutorial.dismissedPages;
      // Dynamic import to break circular dependency
      const tutorialsService = (
        await import("@/services/tutorialsService")
      ).default;
      await tutorialsService.updateDismissedTutorialPages(dismissedPages);
      dispatch(dismissTutorialPageSuccess());
    } catch (error) {
      console.error("Failed to sync dismissed modules with API:", error);
      dispatch(dismissTutorialPageFailure());
    }
  };

export default nonRestrictiveTutorialSlice.reducer;

