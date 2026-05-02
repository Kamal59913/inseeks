import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface NotificationState {
  unseenCount: number;
  setUnseenCount: (count: number) => void;
  incrementUnseenCount: () => void;
  resetUnseenCount: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set) => ({
    unseenCount: 0,
    setUnseenCount: (unseenCount) => set({ unseenCount }),
    incrementUnseenCount: () =>
      set((state) => ({ unseenCount: state.unseenCount + 1 })),
    resetUnseenCount: () => set({ unseenCount: 0 }),
  })),
);
