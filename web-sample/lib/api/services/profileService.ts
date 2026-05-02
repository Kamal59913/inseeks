import apiClient from "../clients/apiClient";
import { useGlobalStore } from "@/store/useGlobalStore";
import { handleAuthError, handleError } from "@/lib/utilities/handleError";

const profileService = {
  upDatePassword: async (payload: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    useGlobalStore.getState().startButtonLoading("change-password");
    try {
      const response = await apiClient.post(
        "/auth/change-password",
        {},
        {
          params: payload,
        },
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("change-password");
    }
  },

  updateAccountDetails: async (payload: any) => {
    try {
      const response = await apiClient.put("/users/me", payload);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  uploadProfilePhotos: async (formData: FormData) => {
    useGlobalStore.getState().startButtonLoading("upload-photos");
    try {
      const response = await apiClient.post("/users/profile/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("upload-photos");
    }
  },
};

export default profileService;
