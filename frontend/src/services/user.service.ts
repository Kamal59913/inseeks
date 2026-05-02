import apiClient from "./apiClient";

export interface UpdateAccountPayload {
  fullname: string;
  username: string;
  email: string;
  about: string;
}

export const userService = {
  getCurrentUser: () => apiClient.get("/users/current-user"),
  getProfile: (username: string) => apiClient.get(`/users/profile/${username}`),

  updateAccount: ({ fullname, username, email, about }: UpdateAccountPayload) =>
    apiClient.patch("/users/update-account", {
      fullname,
      username,
      email,
      about,
    }),

  updateAvatar: (avatarFile: File) => {
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    return apiClient.patch("/users/updateavatar", formData);
  },

  deleteAvatar: () => apiClient.patch("/users/deleteavatar"),
  getUserList: (limit = 6, offset = 0) =>
    apiClient.get("/users/getuserlist", { params: { limit, offset } }),
};
