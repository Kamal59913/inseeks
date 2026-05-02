import { queryClient } from "@/lib/utilities/queryClient";
import {
  clearAuthToken,
  getAuthToken,
  getRefreshToken,
} from "@/lib/utilities/tokenManagement";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { tokenService } from "./services/tokenService";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

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

// Flags and queues to handle multiple concurrent 401 errors
// 1. isRefreshing: Prevents multiple simultaneous refresh calls to the backend
let isRefreshing = false;
// 2. failedQueue: Stores the 'resolve' and 'reject' functions of requests that
// failed with 401 while a refresh was already in progress.
let failedQueue: any[] = [];

/**
 * Iterates through the failedQueue and either resolves or rejects the pending promises.
 * @param error - If present, all queued requests will be rejected with this error
 * @param token - If present, all queued requests will be resolved (retried) with this token
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;
    const status = error?.status || error.response?.status;
    const skipAuthRedirect = originalRequest?.skipAuthRedirect;

    if (status === 401 && !originalRequest._retry && !skipAuthRedirect) {
      /**
       * CASE A: A refresh is already happening (triggered by another concurrent request)
       * Instead of calling the refresh API again, we create a new Promise that 'waits'.
       * We store this promise's resolve/reject in the failedQueue so CASE B can trigger it later.
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Once resolved by CASE B, we update this request's header and retry it
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      /**
       * CASE B: This is the FIRST request to hit a 401.
       * It's responsible for triggering the refresh API call.
       */
      originalRequest._retry = true;
      isRefreshing = true;

      const refresh_token = getRefreshToken();
      if (refresh_token) {
        try {
          // 1. Call the refresh service
          const response = await tokenService.refreshAccessToken(refresh_token);

          const { access_token } = response.data;

          // 2. Update the header of the current (original) request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;

          // 3. IMPORTANT: Resolve all other requests that were waiting in CASE A
          processQueue(null, access_token);

          // 4. Retry the current request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          queryClient.clear();
          clearAuthToken();
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        queryClient.clear();
        clearAuthToken();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error || "An error occurred");
  },
);

export default axiosInstance;
