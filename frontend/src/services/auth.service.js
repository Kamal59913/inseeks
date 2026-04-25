import apiClient from './apiClient'

export const authService = {
  /** POST /users/login */
  login: ({ username, email, password }) =>
    apiClient.post('/users/login', { username, email, password }),

  /** POST /users/register */
  register: ({ fullname, username, email, password }) =>
    apiClient.post('/users/register', { fullname, username, email, password }),

  /** POST /users/logout */
  logout: () => apiClient.post('/users/logout'),

  /** GET /users/current-user */
  getCurrentUser: () => apiClient.get('/users/current-user'),
}
