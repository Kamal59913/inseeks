import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { clearAuthToken, getAuthToken } from "@/lib/utilities/tokenManagement";
import authService from "@/services/authService";
import { queryClient } from "@/lib/utilities/queryClient";
import apiClient from "@/services/clients/apiClient";
import { UserProfileData } from "@/types/api/auth.types";

interface AuthState {
  userData: UserProfileData | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userData: null,
  isAuthenticated: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue, dispatch }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      // Note: Components/middleware should ideally set global loaders for start/end
      const response: any = await apiClient.get("/users/profile");
      return response?.data?.data;
    } catch (error: unknown) {
      queryClient.clear();
      clearAuthToken();
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setUserData(state, action: PayloadAction<UserProfileData | null>) {
      state.userData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.userData = null;
      });
  },
});

export const { setAuthenticated, setUserData } = authSlice.actions;
export default authSlice.reducer;
