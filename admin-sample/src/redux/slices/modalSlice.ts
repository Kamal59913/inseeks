import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalEntry } from "../../types/modal";

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
      prepare: <T>(type: string, data?: T) => ({
        payload: {
          type,
          data,
          id: Math.random().toString(36).slice(2),
        }
      })
    },
    closeTopModal: (state) => {
      state.stack.pop();
    },
    closeModalById: (state, action: PayloadAction<string>) => {
      state.stack = state.stack.filter(modal => modal.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.stack = [];
    },
  },
});

export const { openModal, closeTopModal, closeModalById, closeAllModals } = modalSlice.actions;
export default modalSlice.reducer;