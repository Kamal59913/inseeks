import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Create a local types folder if needed, or import from Redux slice location for now.
// Assuming types exist at ../types/types relative to slices.
// Since we are creating store files in `apps/web/store/`, the path `api/types` or similar might be better.
// Based on file list, `store/types` exists.

interface GlobalState {
  loading: boolean;
  pageloading: boolean;
  buttonLoaders: Record<string, boolean>;
  action: Record<string, boolean>;
  foundParentData: any;
  foundOtherGuardianData: any;

  // Actions
  setLoading: (loading: boolean) => void;
  setPageLoading: (pageloading: boolean) => void;
  startButtonLoading: (id: string) => void;
  stopButtonLoading: (id: string) => void;
  resetButtonLoading: (id: string) => void;
  startAction: (id: string) => void;
  stopAction: (id: string) => void;
  resetAction: (id: string) => void;
  setFoundParentData: (data: any) => void;
  setFoundOtherGuardianData: (data: any) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools((set) => ({
    loading: false,
    pageloading: false,
    buttonLoaders: {},
    action: {},
    categoryData: null,
    foundParentData: null,
    foundOtherGuardianData: null,

    setLoading: (loading) => set({ loading }),
    setPageLoading: (pageloading) => set({ pageloading }),

    startButtonLoading: (id) =>
      set((state) => ({
        buttonLoaders: { ...state.buttonLoaders, [id]: true },
      })),
    stopButtonLoading: (id) =>
      set((state) => ({
        buttonLoaders: { ...state.buttonLoaders, [id]: false },
      })),
    resetButtonLoading: (id) =>
      set((state) => {
        const newLoaders = { ...state.buttonLoaders };
        delete newLoaders[id];
        return { buttonLoaders: newLoaders };
      }),

    startAction: (id) =>
      set((state) => ({
        action: { ...state.action, [id]: true },
      })),
    stopAction: (id) =>
      set((state) => ({
        action: { ...state.action, [id]: false },
      })),
    resetAction: (id) =>
      set((state) => {
        const newActions = { ...state.action };
        delete newActions[id];
        return { action: newActions };
      }),

    setFoundParentData: (foundParentData) => set({ foundParentData }),
    setFoundOtherGuardianData: (foundOtherGuardianData) =>
      set({ foundOtherGuardianData }),
  })),
);
