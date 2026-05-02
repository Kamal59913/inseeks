import apiClient from "../clients/apiClient";
import { handleError } from "@/lib/utilities/handleError";

const userService = {
  getUserByUsername: async (username: string) => {
    try {
      const response = await apiClient.get(`/users/${username}/profile`);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  followUser: async (username: string) => {
    try {
      const response = await apiClient.post(`/users/${username}/follow`, {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unfollowUser: async (username: string) => {
    try {
      const response = await apiClient.delete(`/users/${username}/follow`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  saveFCMToken: async (token: string) => {
    console.log("[userService] saveFCMToken called with token:", token);
    try {
      const response = await apiClient.post(`/auth/users/fcm-token`, null, {
        params: { token },
      });
      console.log("[userService] saveFCMToken response:", response?.data);
      return response?.data;
    } catch (error) {
      console.error("[userService] saveFCMToken error:", error);
      return handleError(error);
    }
  },

  updateNotificationPreference: async (enabled: boolean) => {
    console.log(
      "[userService] updateNotificationPreference called. enabled:",
      enabled,
    );
    try {
      const response = await apiClient.patch("/auth/users/preferences", {
        pushNotifications: enabled,
      });
      console.log(
        "[userService] updateNotificationPreference response:",
        response?.data,
      );
      return response?.data;
    } catch (error) {
      console.error("[userService] updateNotificationPreference error:", error);
      return handleError(error);
    }
  },

  getUsers: async (limit: number = 20, offset: number = 0, q?: string) => {
    try {
      const params: any = { limit, offset };
      if (q) params.q = q;

      const response = await apiClient.get("/users/users", { params });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  blockUser: async (username: string) => {
    try {
      const response = await apiClient.post(`/users/${username}/block`, {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unblockUser: async (username: string) => {
    try {
      const response = await apiClient.delete(`/users/${username}/block`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  hideUser: async (username: string) => {
    try {
      const response = await apiClient.post(`/users/${username}/hide`, {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unhideUser: async (username: string) => {
    try {
      const response = await apiClient.delete(`/users/${username}/hide`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getBlockedUsers: async (limit: number = 20, offset: number = 0) => {
    try {
      const response = await apiClient.get("/users/blocked-users", {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getHiddenUsers: async (limit: number = 20, offset: number = 0) => {
    try {
      const response = await apiClient.get("/users/hidden", {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getFollowers: async (
    userId: string | number,
    limit: number = 20,
    offset: number = 0,
  ) => {
    try {
      const response = await apiClient.get(`/users/${userId}/followers`, {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getFollowing: async (
    userId: string | number,
    limit: number = 20,
    offset: number = 0,
  ) => {
    try {
      const response = await apiClient.get(`/users/${userId}/following`, {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default userService;
