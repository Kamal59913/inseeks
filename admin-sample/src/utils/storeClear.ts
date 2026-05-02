import { store } from "../redux/store";
import { setAuthenticated, setAuthLoader, setUserData } from "../redux/slices/authSlice";
import { clearToken } from "./getToken";
import { AxiosError } from "axios";

export const updateAuthState = (user: any) => {
    store.dispatch(setUserData(user));
    store.dispatch(setAuthenticated(true));
    store.dispatch(setAuthLoader(false));
  };

  export const resetUserData = (user: any) => {
    store.dispatch(setUserData(user));
  };
  
export const clearAuthState = () => {
    clearToken();
    store.dispatch(setUserData(null));
    store.dispatch(setAuthenticated(false));
    store.dispatch(setAuthLoader(false));
  };

export const handleAuthError = (error: unknown) => {

  store.dispatch(setAuthLoader(false));
  store.dispatch(setAuthenticated(false));
  store.dispatch(setUserData(null));

  const isAxiosError =  error && typeof error === "object" && "isAxiosError" in error;

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

  
