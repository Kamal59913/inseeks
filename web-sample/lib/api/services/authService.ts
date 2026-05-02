import apiClient from "../clients/apiClient";
import { format } from "date-fns";

import { useAuthStore } from "@/store/useAuthStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { setAuthToken, setRefreshToken } from "@/lib/utilities/tokenManagement";
import { handleAuthError } from "@/lib/utilities/handleError";
import { tokenService } from "./tokenService";

type SignupFormPayload = {
  username: string;
  account_of: string;
  full_name: string;
  email: string;
  password: string;
  birthday?: string | Date;
  phone?: string;
  phoneData?: {
    fullPhone: string;
    countryCode: string;
    phoneNumber: string;
  };
};

const authService = {
  sendRegisterOtp: async (data: SignupFormPayload) => {
    useGlobalStore.getState().startButtonLoading("send-otp");
    try {
      const body = {
        username: data.username,
        account_of: data.account_of,
        full_name: data.full_name,
        bio: "",
        profile_photo_url: "",
        birthday: data.birthday
          ? format(new Date(data.birthday), "yyyy-MM-dd")
          : "",
        birthday_visible: true,
        is_private: false,
        email: data.email,
        phone: data.phoneData?.phoneNumber || data.phone || "",
        password: data.password,
      };

      const country_code = data.phoneData?.countryCode?.replace(/\+/g, "");

      return await apiClient.post("/auth/register/send-otp", body, {
        params: {
          country_code,
        },
      });
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("send-otp");
    }
  },
  verifyRegisterOtp: async (payload: { phone: string; otp: string }) => {
    useGlobalStore.getState().startButtonLoading("verify-otp");
    try {
      const response: any = await apiClient.post(
        "/auth/register/verify-otp",
        {},
        {
          params: {
            phone: payload.phone,
            otp: payload.otp,
          },
        },
      );

      const token = response?.data?.access_token;
      const refresh_token = response?.data?.refresh_token;
      if (token) {
        setAuthToken(token);
        if (refresh_token) {
          setRefreshToken(refresh_token);
        }
        await useAuthStore.getState().fetchCurrentUser();
      }

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("verify-otp");
    }
  },

  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<any> => {
    useAuthStore.getState().setAuthLoader(true);
    useGlobalStore.getState().startButtonLoading("login");

    try {
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response: any = await apiClient.post("/auth/token", formData);

      const token = response?.data?.access_token;
      const refresh_token = response?.data?.refresh_token;
      if (token) {
        setAuthToken(token);
        if (refresh_token) {
          setRefreshToken(refresh_token);
        }
        await useAuthStore.getState().fetchCurrentUser();
      }

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("login");
      useAuthStore.getState().setAuthLoader(false);
    }
  },

  refreshAccessToken: async (refresh_token: string) => {
    return tokenService.refreshAccessToken(refresh_token);
  },

  getMe: async () => {
    try {
      return await apiClient.get("/auth/me");
    } catch (error) {
      return handleAuthError(error);
    }
  },
  changePassword: async (payload: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    useGlobalStore.getState().startButtonLoading("change-password");
    try {
      return await apiClient.post("/auth/change-password", payload);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("change-password");
    }
  },

  forgotPassword: async (payload: { email: string }) => {
    useGlobalStore.getState().startButtonLoading("forgot-password");
    try {
      return await apiClient.post(
        "/auth/forgot-password",
        {},
        {
          params: {
            email: payload.email,
          },
        },
      );
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("forgot-password");
    }
  },

  verifyForgotPasswordOtp: async (payload: { email: string; otp: string }) => {
    useGlobalStore.getState().startButtonLoading("verify-otp");
    try {
      return await apiClient.post("/auth/verify-otp", payload);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("verify-otp");
    }
  },

  resetPassword: async (payload: {
    email: string;
    otp: string;
    new_password: string;
    confirm_password: string;
  }) => {
    useGlobalStore.getState().startButtonLoading("reset-password");
    try {
      return await apiClient.post("/auth/reset-password", payload);
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("reset-password");
    }
  },

  deactivateAccount: async (payload: {
    username: string;
    password: string;
  }) => {
    useGlobalStore.getState().startButtonLoading("deactivate-account");
    try {
      const formData = new FormData();
      formData.append("username", payload.username);
      formData.append("password", payload.password);
      return await apiClient.post("/auth/deactivate-account", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("deactivate-account");
    }
  },

  reactivateAccount: async (payload: {
    username: string;
    password: string;
  }) => {
    useGlobalStore.getState().startButtonLoading("reactivate-account");
    try {
      const formData = new FormData();
      formData.append("username", payload.username);
      formData.append("password", payload.password);
      return await apiClient.post("/auth/reactivate-account", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      return handleAuthError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("reactivate-account");
    }
  },
};

export default authService;
