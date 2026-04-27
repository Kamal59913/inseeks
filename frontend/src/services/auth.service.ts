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
};
