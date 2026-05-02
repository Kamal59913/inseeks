import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getAuthToken, clearAuthToken } from "@/lib/utilities/tokenManagement";
import apiClient from "@/lib/api/clients/apiClient";
import { queryClient } from "@/lib/utilities/queryClient";

interface AuthState {
  userData: any;
  isAuthenticated: boolean;
  authLoader: boolean;
  globalLoader: boolean;
  error: string | null;

  // Actions
  setAuthenticated: (isAuthenticated: boolean) => void;
  setGlobalLoader: (globalLoader: boolean) => void;
  setUserData: (userData: any) => void;
  setAuthLoader: (authLoader: boolean) => void;
  fetchCurrentUser: () => Promise<any>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    userData: null,
    isAuthenticated: false,
    authLoader: false,
    globalLoader: true,
    error: null,

    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    setGlobalLoader: (globalLoader) => set({ globalLoader }),
    setUserData: (userData) => set({ userData }),
    setAuthLoader: (authLoader) => set({ authLoader }),

    fetchCurrentUser: async () => {
      set({ authLoader: true, error: null });
      const token = getAuthToken();

      if (!token) {
        set({
          authLoader: false,
          globalLoader: false,
          isAuthenticated: false,
          userData: null,
          error: "No token provided",
        });
        return Promise.reject("No token provided");
      }

      try {
        const response: any = await apiClient.get("/auth/me");
        const userData = response?.data?.data;

        set({
          userData,
          isAuthenticated: true,
          authLoader: false,
          globalLoader: false,
          error: null,
        });

        return userData;
      } catch (error: any) {
        queryClient.clear();
        clearAuthToken();

        set({
          error: error.message,
          isAuthenticated: false,
          authLoader: false,
          globalLoader: false,
          userData: null,
        });

        return Promise.reject(error.message);
      }
    },

    logout: () => {
      clearAuthToken();
      queryClient.clear();
      set({
        userData: null,
        isAuthenticated: false,
        authLoader: false,
        error: null,
      });
    },
  })),
);
