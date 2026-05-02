import axiosInstance from "../axiosInstance";

import { AxiosRequestConfig, AxiosResponse } from "axios";
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRedirect?: boolean;
}

const apiClient = {
  get: async <T>(
    url: string,
    config: CustomAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.get<T>(url, config);
    return response;
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.post<T>(url, data, {
      ...config,
      headers: {
        ...axiosInstance.defaults.headers.common,
        ...(config.headers ?? {}),
      },
    });
    return response;
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.put<T>(url, data, {
      ...config,
      headers: {
        ...axiosInstance.defaults.headers.common,
        ...(config.headers ?? {}),
      },
    });
    return response;
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config: CustomAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.patch<T>(url, data, {
      ...config,
      headers: {
        ...axiosInstance.defaults.headers.common,
        ...(config.headers ?? {}),
      },
    });
    return response;
  },

  delete: async <T>(
    url: string,
    config: CustomAxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const response = await axiosInstance.delete<T>(url, {
      ...config,
      headers: {
        ...axiosInstance.defaults.headers.common,
        ...(config.headers ?? {}),
      },
    });
    return response;
  },

  request: async <T>(config: CustomAxiosRequestConfig): Promise<T> => {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  },
};

export default apiClient;
