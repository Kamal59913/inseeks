import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalEntry, ModalName } from "../../types/modal";

interface ModalState {
  stack: ModalEntry[];
}

const initialState: ModalState = {
  stack: [],
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: {
      reducer: (state, action: PayloadAction<ModalEntry>) => {
        state.stack.push(action.payload);
      },
      prepare: <K extends ModalName>(type: K, data?: any) => ({
        payload: {
          type,
          data,
          id: Math.random().toString(36).slice(2),
        } as ModalEntry,
      }),
    },
    closeTopModal: (state, _action: PayloadAction<void>) => {
      state.stack.pop();
    },
    closeModalById: (state, action: PayloadAction<string>) => {
      state.stack = state.stack.filter((modal) => modal.id !== action.payload);
    },
    closeAllModals: (state, _action: PayloadAction<void>) => {
      state.stack = [];
    },
  },
});

export const { openModal, closeTopModal, closeModalById, closeAllModals } =
  modalSlice.actions;
export default modalSlice.reducer;
