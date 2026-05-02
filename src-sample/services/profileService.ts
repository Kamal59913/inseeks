import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { addressUtils } from "@/lib/payloadFormatting";
import {
  UpdateProfileFormData,
  UpdateLocationFormData,
} from "@/types/api/services.types";

const profileService = {
  updateProfile: async (formData: UpdateProfileFormData) => {
    store.dispatch(startButtonLoading("update-profile"));
    store.dispatch(setPageLoading(true));

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        additional_email: formData.additional_email,
        whats_app_number: formData.whatsapp,
        bio: formData.bio,
        sms_number: formData.text,
        whats_app_number_enabled: formData.isWhatsAppEnabled,
        sms_number_enabled: formData.isTextEnabled,
        email_enabled: formData.isEmailEnabled,
      };

      const response = await apiClient.post(
        "/users/freelancer/profile/update",
        payload,
      );

      await store.dispatch(fetchCurrentUser());
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("update-profile"));
    }
  },

  updateLocationProfile: async (formData: UpdateLocationFormData) => {
    store.dispatch(startButtonLoading("update-location"));
    store.dispatch(setPageLoading(true));
    try {
      const freelancerAddress = addressUtils.getFreelancerAddress(formData);
      const payload = {
        places: [
          {
            service_place_id: 1,
            postcode: freelancerAddress.postcode,
            address: freelancerAddress.address,
            latitude:
              formData.serviceLocation?.latitude?.toString() || "51.5074",
            longitude:
              formData.serviceLocation?.longitude?.toString() || "-0.1276",
            radius: formData.serviceRadius
              ? `${formData.serviceRadius}km`
              : "5km",
            local_travel_fee: formData.localTravelFee?.toString() || "0",
          },
        ],
      };

      const response = await apiClient.post(
        "/users/freelancer/profile/update",
        payload,
      );

      await store.dispatch(fetchCurrentUser());
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("update-location"));
    }
  },
};

export default profileService;
