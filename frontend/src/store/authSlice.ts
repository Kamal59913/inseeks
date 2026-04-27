import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../services/auth.service';
import { clearAuthTokens, getAccessToken } from '../utils/tokenStorage';

interface AuthState {
  userData: any | null;
  isAuthenticated: boolean;
  authLoader: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userData: null,
  isAuthenticated: false,
  authLoader: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const token = getAccessToken();
    if (!token) {
      return rejectWithValue('No token provided');
    }

    try {
      const response = await authService.getCurrentUser();
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('User not authenticated');
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setUserData(state, action: PayloadAction<any | null>) {
      state.userData = action.payload;
    },
    setAuthLoader(state, action: PayloadAction<boolean>) {
      state.authLoader = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.error = null;
        state.authLoader = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.authLoader = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        clearAuthTokens();
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.userData = null;
        state.authLoader = false;
      });
  },
});

export const { setAuthenticated, setUserData, setAuthLoader } = authSlice.actions;
export default authSlice.reducer;
