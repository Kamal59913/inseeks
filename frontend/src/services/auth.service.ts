import apiClient from './apiClient';
import { clearAuthTokens, setAuthTokens } from '../utils/tokenStorage';

export interface LoginPayload {
  username: string;
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export const authService = {
  /** POST /users/login */
  login: async ({ username, email, password }: LoginPayload) => {
    const response = await apiClient.post('/users/login', { username, email, password });
    const accessToken = response?.data?.data?.accessToken;
    const refreshToken = response?.data?.data?.refreshToken;

    if (accessToken) {
      setAuthTokens(accessToken, refreshToken);
    }

    return response;
  },

  /** POST /users/register */
  register: ({ fullname, username, email, password }: RegisterPayload) =>
    apiClient.post('/users/register', { fullname, username, email, password }),

  /** POST /users/logout */
  logout: async () => {
    try {
      return await apiClient.post('/users/logout');
    } finally {
      clearAuthTokens();
    }
  },

  /** GET /users/current-user */
  getCurrentUser: () => apiClient.get('/users/current-user'),

  /** POST /users/forgot-password */
  forgotPassword: (email: string) => apiClient.post('/users/forgot-password', { email }),

  /** POST /users/verify-otp */
  verifyOTP: (email: string, otp: string) => apiClient.post('/users/verify-otp', { email, otp }),

  /** POST /users/reset-password */
  resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
    apiClient.post('/users/reset-password', payload),
};
