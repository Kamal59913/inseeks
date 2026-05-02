import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { clearAuthToken, getAuthToken } from "../utils/getToken";
import { queryClient } from "@/utils/queryClient";

const API_BASE_URL = `${import.meta.env.VITE_EMPERA_BASE_URL}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();

    if (token && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     console.error("API Error:", error);
//     return Promise.reject(error || "An error occurred");
//   }
// );

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    const status = error?.status || error.response?.status;
    const skipAuthRedirect = error?.config?.skipAuthRedirect;

    if (status === 401 && !skipAuthRedirect) {
      queryClient.clear();
      clearAuthToken();
      // ToastService?.error(
      //   error?.response?.data?.message || "Authorization Failed"
      // );
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error || "An error occurred");
  }
);
export default axiosInstance;
