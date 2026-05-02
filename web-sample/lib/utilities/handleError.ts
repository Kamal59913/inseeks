import { useAuthStore } from "@/store/useAuthStore";
import { AxiosError } from "axios";
import { clearAuthToken } from "./tokenManagement";

export const updateAuthState = (user: any) => {
  useAuthStore.getState().setUserData(user);
  useAuthStore.getState().setAuthenticated(true);
  useAuthStore.getState().setAuthLoader(false);
};

export const resetUserData = (user: any) => {
  useAuthStore.getState().setUserData(user);
};

export const clearAuthState = () => {
  clearAuthToken();
  useAuthStore.getState().setUserData(null);
  useAuthStore.getState().setAuthenticated(false);
  useAuthStore.getState().setAuthLoader(false);
};

export const handleAuthError = (error: unknown) => {
  useAuthStore.getState().setAuthLoader(false);
  useAuthStore.getState().setAuthenticated(false);
  useAuthStore.getState().setUserData(null);

  const isAxiosError =
    error && typeof error === "object" && "isAxiosError" in error;

  if (isAxiosError) {
    const axiosError = error as AxiosError<any>;
    const backendData = axiosError.response?.data;

    const normalizedError = {
      status: axiosError.response?.status ?? 500,
      data:
        backendData ??
        ({
          message: axiosError.message || "Something went wrong",
        } as any),
    };

    return normalizedError;
  }

  const fallbackError = {
    status: 500,
    data: {
      message: "An unexpected error occurred",
    },
  };

  return fallbackError;
};

export const handleError = (error: unknown) => {
  const isAxiosError =
    error && typeof error === "object" && "isAxiosError" in error;

  if (isAxiosError) {
    const axiosError = error as AxiosError<any>;
    const backendData = axiosError.response?.data;

    const normalizedError = {
      status: axiosError.response?.status ?? 500,
      data:
        backendData ??
        ({
          message: axiosError.message || "Something went wrong",
        } as any),
    };

    return normalizedError;
  }

  const fallbackError = {
    status: 500,
    data: {
      message: "An unexpected error occurred",
    },
  };

  return fallbackError;
};
