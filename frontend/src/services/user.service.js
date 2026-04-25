import apiClient from './apiClient'

export const userService = {
  /** GET /users/profile/:username */
  getProfile: (username) => apiClient.get(`/users/profile/${username}`),

  /** PATCH /users/update-account */
  updateAccount: ({ fullname, username, email, about }) =>
    apiClient.patch('/users/update-account', { fullname, username, email, about }),

  /** PATCH /users/updateavatar — FormData with 'avatar' field */
  updateAvatar: (avatarFile) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    return apiClient.patch('/users/updateavatar', formData)
  },

  /** PATCH /users/deleteavatar */
  deleteAvatar: () => apiClient.patch('/users/deleteavatar'),

  /** GET /users/getuserlist */
  getUserList: () => apiClient.get('/users/getuserlist'),
}
