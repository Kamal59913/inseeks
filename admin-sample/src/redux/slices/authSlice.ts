import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../authThunk";

interface AuthState {
  userData: any;
  isAuthenticated: boolean;
  authLoader: boolean;
  globalLoader: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userData: null,
  isAuthenticated: false,
  authLoader: false,
  globalLoader: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setGlobalLoader(state, action: PayloadAction<boolean>) {
      state.globalLoader = action.payload;
    },
    setUserData(state, action: PayloadAction<any>) {
      state.userData = action.payload;
    },
    setAuthLoader: (state, action: PayloadAction<boolean>) => {
      state.authLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.authLoader = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.authLoader = false;
        state.globalLoader = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.authLoader = false;
        state.globalLoader = false;
        state.userData = null;
      });
  },
});

export const { setAuthenticated, setGlobalLoader, setUserData, setAuthLoader } =
  authSlice.actions;
export default authSlice.reducer;