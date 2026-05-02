import apiClient from "../clients/apiClient";
import { handleError } from "@/lib/utilities/handleError";
import { NotificationResponse } from "@/lib/types/Notification";
import { AxiosResponse } from "axios";

const notificationService = {
  getNotifications: async (
    filter: string = "all",
    limit: number = 20,
    offset: number = 0,
  ): Promise<
    AxiosResponse<NotificationResponse> | { status: number; data: unknown }
  > => {
    try {
      const response = await apiClient.get<NotificationResponse>(
        "/notifications/",
        {
          params: {
            filter,
            limit,
            offset,
          },
        },
      );
      return response;
    } catch (error) {
      return handleError(error) as { status: number; data: unknown };
    }
  },

  getNotificationSettings: async (): Promise<any> => {
    try {
      const response = await apiClient.get(
        "/notifications/notification-settings",
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateNotificationSettings: async (settings: any): Promise<any> => {
    try {
      const response = await apiClient.patch(
        "/notifications/update-notification-settings",
        settings,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getUnseenCount: async (): Promise<any> => {
    try {
      const response = await apiClient.get("/notifications/unseen-count");
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  markNotificationsAsSeen: async (): Promise<any> => {
    try {
      const response = await apiClient.post("/notifications/mark-as-seen/", {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default notificationService;
