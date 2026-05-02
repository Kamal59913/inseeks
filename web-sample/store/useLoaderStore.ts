import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoaderState {
  loader: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}

export const useLoaderStore = create<LoaderState>()(
  devtools((set) => ({
    loader: false, // Start with loader hidden
    showLoader: () => set({ loader: true }),
    hideLoader: () => set({ loader: false }),
  })),
);
