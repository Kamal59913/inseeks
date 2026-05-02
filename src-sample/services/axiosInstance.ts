import { config } from "@/config";
import { queryClient } from "@/lib/utilities/queryClient";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = config.serverUrl;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status =
      error?.response?.status ?? (error as { status?: number })?.status;
    const skipAuthRedirect = (
      error?.config as
        | (typeof error.config & { skipAuthRedirect?: boolean })
        | undefined
    )?.skipAuthRedirect;

    if (status === 401 && !skipAuthRedirect) {
      queryClient.clear();
      // clearAuthToken();
      // if (typeof window !== "undefined") {
      //   setTimeout(() => {
      //     window.location.href = "/";
      //   }, 2000);
      // }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;
