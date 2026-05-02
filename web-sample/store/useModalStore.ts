import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface BaseModal<T = unknown> {
  type: string;
  data?: T;
}

export type ModalEntry = BaseModal & {
  id: string;
};

interface ModalState {
  stack: ModalEntry[];

  // Actions
  openModal: (type: string, data?: any) => void;
  closeTopModal: () => void;
  closeModalById: (id: string) => void;
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>()(
  devtools((set) => ({
    stack: [],

    openModal: (type, data) =>
      set((state) => {
        // Prevent duplicate modals of the same type
        const filteredStack = state.stack.filter(
          (modal) => modal.type !== type,
        );
        return {
          stack: [
            ...filteredStack,
            {
              type,
              data,
              id: Math.random().toString(36).slice(2),
            },
          ],
        };
      }),

    closeTopModal: () =>
      set((state) => {
        const newStack = [...state.stack];
        newStack.pop();
        return { stack: newStack };
      }),

    closeModalById: (id) =>
      set((state) => ({
        stack: state.stack.filter((modal) => modal.id !== id),
      })),

    closeAllModals: () => set({ stack: [] }),
  })),
);
