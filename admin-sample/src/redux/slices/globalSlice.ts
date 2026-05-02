import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryData } from "../types/types";

interface GlobalState {
  loading: boolean;
  pageloading: boolean;
  buttonLoaders: Record<string, boolean>; // { [buttonId]: boolean }
  action: Record<string, boolean>; // { [buttonId]: boolean }
  categoryData: CategoryData | null;
  photoSaving: boolean;
  photoSaveStatus: "idle" | "success" | "error";
  photoSaveTrigger: number;
}

const initialState: GlobalState = {
  loading: false,
  pageloading: false,
  buttonLoaders: {}, // No buttons loading initially
  action: {}, // No buttons loading initially
  categoryData: null,
  photoSaving: false,
  photoSaveStatus: "idle",
  photoSaveTrigger: 0,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageloading = action.payload;
    },
    startButtonLoading: (state, action: PayloadAction<string>) => {
      state.buttonLoaders[action.payload] = true; // Enable loader for this ID
    },
    stopButtonLoading: (state, action: PayloadAction<string>) => {
      state.buttonLoaders[action.payload] = false; // Disable loader for this ID
    },
    resetButtonLoading: (state, action: PayloadAction<string>) => {
      delete state.buttonLoaders[action.payload]; // Clean up ID (optional)
    },

    startAction: (state, action: PayloadAction<string>) => {
      state.action[action.payload] = true; // Enable loader for this ID
    },
    stopAction: (state, action: PayloadAction<string>) => {
      state.action[action.payload] = false; // Disable loader for this ID
    },
    resetAction: (state, action: PayloadAction<string>) => {
      delete state.action[action.payload]; // Clean up ID (optional)
    },
    setCategoryData: (state, action: PayloadAction<CategoryData | null>) => {
      state.categoryData = action.payload;
    },
    setPhotoSaving: (state, action: PayloadAction<boolean>) => {
      state.photoSaving = action.payload;
    },
    setPhotoSaveStatus: (
      state,
      action: PayloadAction<"idle" | "success" | "error">
    ) => {
      state.photoSaveStatus = action.payload;
    },
    triggerPhotoSave: (state) => {
      state.photoSaveTrigger += 1;
    },
  },
});

export const {
  setLoading,
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
  resetButtonLoading,
  startAction,
  stopAction,
  resetAction,
  setCategoryData,
  setPhotoSaving,
  setPhotoSaveStatus,
  triggerPhotoSave,
} = globalSlice.actions;

export default globalSlice.reducer;
