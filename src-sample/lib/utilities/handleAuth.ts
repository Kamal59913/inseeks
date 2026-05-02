import { store } from "@/store/store";
import { clearAuthToken } from "./tokenManagement";
import { setAuthenticated, setUserData } from "@/store/slices/authSlice";
import { setAuthLoading } from "@/store/slices/globalSlice";
import { AxiosError } from "axios";

export const updateAuthState = (user: any) => {
  store.dispatch(setUserData(user));
  store.dispatch(setAuthenticated(true));
  store.dispatch(setAuthLoading(false));
};

export const resetUserData = (user: any) => {
  store.dispatch(setUserData(user));
};

export const clearAuthState = () => {
  clearAuthToken();
  store.dispatch(setUserData(null));
  store.dispatch(setAuthenticated(false));
  store.dispatch(setAuthLoading(false));
};

export const handleAuthError = (error: unknown) => {
  store.dispatch(setAuthLoading(false));
  store.dispatch(setAuthenticated(false));
  store.dispatch(setUserData(null));

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
