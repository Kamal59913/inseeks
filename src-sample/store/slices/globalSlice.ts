import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryData } from "../types/types";

interface GlobalState {
  loading: boolean; // Generic loader
  appLoading: boolean; // Initial app startup loader
  authLoading: boolean; // Auth-specific loader (Login/Signup/Profile)
  pageloading: boolean; // Page-level navigation loader
  buttonLoaders: Record<string, boolean>; // { [buttonId]: boolean }
  action: Record<string, boolean>; // { [buttonId]: boolean }
  categoryData: CategoryData | null;
  foundParentData: unknown;
  foundOtherGuardianData: unknown;
}

const initialState: GlobalState = {
  loading: false,
  appLoading: true,
  authLoading: false,
  pageloading: false,
  buttonLoaders: {},
  action: {},
  categoryData: null,
  foundParentData: null,
  foundOtherGuardianData: null,
};

import { fetchCurrentUser } from "./authSlice";

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageloading = action.payload;
    },
    startButtonLoading: (state, action: PayloadAction<string>) => {
      state.buttonLoaders[action.payload] = true;
    },
    stopButtonLoading: (state, action: PayloadAction<string>) => {
      state.buttonLoaders[action.payload] = false;
    },
    resetButtonLoading: (state, action: PayloadAction<string>) => {
      delete state.buttonLoaders[action.payload];
    },
    startAction: (state, action: PayloadAction<string>) => {
      state.action[action.payload] = true;
    },
    stopAction: (state, action: PayloadAction<string>) => {
      state.action[action.payload] = false;
    },
    resetAction: (state, action: PayloadAction<string>) => {
      delete state.action[action.payload];
    },
    setCategoryData: (state, action: PayloadAction<CategoryData | null>) => {
      state.categoryData = action.payload;
    },
    setFoundParentData: (state, action: PayloadAction<unknown>) => {
      state.foundParentData = action.payload;
    },
    setFoundOtherGuardianData: (state, action: PayloadAction<unknown>) => {
      state.foundOtherGuardianData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state) => {
        state.authLoading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.authLoading = false;
      });
  },
});

export const {
  setLoading,
  setAppLoading,
  setAuthLoading,
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
  resetButtonLoading,
  startAction,
  stopAction,
  resetAction,
  setCategoryData,
  setFoundParentData,
  setFoundOtherGuardianData,
} = globalSlice.actions;

export default globalSlice.reducer;
