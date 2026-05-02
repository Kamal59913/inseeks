import { setAuthToken } from "../../utils/getToken";
import apiClient from "../clients/apiClient";
import { AppPermissions, AppRoles } from "../../types/permissions";
import {
  AuthCredentials,
  FogetPassword,
  ResetPassword,
  ResetPasswordResponse,
} from "../../types/api/auth.types";
import { handleAuthError, updateAuthState } from "@/utils/storeClear";
import { fetchCurrentUser } from "@/redux/authThunk";
import { store } from "@/redux/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "@/redux/slices/globalSlice";
import { handleError } from "@/utils/handleError";

const authService = {
  login: async (credentials: AuthCredentials) => {
    store.dispatch(startButtonLoading("login"));
    try {
      const response = await apiClient.post<any>(
        "/users/admin/login",
        credentials,
        {
          skipAuthRedirect: true,
          headers: {
            Authorization: undefined,
            "Content-Type": "application/json",
          },
        }
      );
      setAuthToken(response?.data?.data?.access_token);
      updateAuthState(response?.data?.data?.user);

      await store.dispatch(fetchCurrentUser());

      return response;
    } catch (error) {
      return handleAuthError(error);
    } finally {
      store.dispatch(stopButtonLoading("login"));
    }
  },

  forgetPassword: async (credentials: FogetPassword) => {
    store.dispatch(startButtonLoading("forget-password"));
    try {
      const response = await apiClient.post(
        "/admin/password/forgot",
        credentials
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("forget-password"));
    }
  },

  resetPassword: async (credentials: ResetPassword) => {
    store.dispatch(startButtonLoading("reset-password"));

    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        `/admin/password/reset`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("reset-password"));
    }
  },

  checkUsername: async (username: string) => {
    try {
      const response = await apiClient.get(
        `/users/check-username?username=${username}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  registerOne: async (data: any) => {
    try {
      const response = await apiClient.post("/users/register-one", data);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  registerTwo: async (data: any) => {
    try {
      const response = await apiClient.post("/users/register-two", data);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default authService;

export const hasPermission = (
  requiredPermissions: AppPermissions[],
  userPermissions: AppPermissions[]
): boolean => {
  return requiredPermissions.every((p) => userPermissions.includes(p));
};

export const hasRole = (
  requiredRoles: AppRoles[],
  userRoles: AppRoles[]
): boolean => {
  return requiredRoles.some((r) => userRoles.includes(r));
};
