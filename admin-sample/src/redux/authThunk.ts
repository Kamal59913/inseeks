import apiClient from "@/api/clients/apiClient";
import { clearToken, getAuthToken } from "@/utils/getToken";
import { queryClient } from "@/utils/queryClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue("No token provided");
    }
    try {
      const response: any = await apiClient.get("/users/profile");
      return response?.data?.data;
    } catch (error: any) {
      queryClient.clear();
      clearToken();
      return rejectWithValue(error.message);
    }
  }
);