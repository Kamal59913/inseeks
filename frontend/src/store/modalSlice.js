import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stack: [],
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: {
      reducer: (state, action) => {
        state.stack.push(action.payload);
      },
      prepare: (type, data) => ({
        payload: {
          id: Math.random().toString(36).slice(2),
          type,
          data,
        },
      }),
    },
    closeTopModal: (state) => {
      state.stack.pop();
    },
    closeModalById: (state, action) => {
      state.stack = state.stack.filter((modal) => modal.id !== action.payload);
    },
    closeAllModals: (state) => {
      state.stack = [];
    },
  },
});

export const { openModal, closeTopModal, closeModalById, closeAllModals } =
  modalSlice.actions;

export default modalSlice.reducer;
