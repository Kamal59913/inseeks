import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { fetchCurrentUser } from "@/redux/authThunk";

const profileService = {
  upDatePassword: async (payload: any) => {
    store.dispatch(startButtonLoading("update-password"));

    try {
      const { confirmPassword, ...filteredPayload } = payload;

      const response = await apiClient.post(
        `/admin/password/update`,
        filteredPayload
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-password"));
    }
  },

  upDateProfile: async (credentials: any) => {
    store.dispatch(startButtonLoading("update-profile"));
    try {
      const payload = {
        first_name: credentials.firsName,
        last_name: credentials.lastName,
        username: credentials.userName,
        email: credentials.email,
        country_code: credentials.phoneData?.countryCode || "+1",
        phone: credentials.phoneData?.phoneNumber || credentials.phone,
        profile_picture: credentials.profile_picture || "",
      };

      const response = await apiClient.post(`/admin/profile/update`, payload);
      await store.dispatch(fetchCurrentUser());

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-profile"));
    }
  },
};

export default profileService;
