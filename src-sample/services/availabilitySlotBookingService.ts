import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  startButtonLoading,
  stopButtonLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";
import { fetchCurrentUser } from "@/store/slices/authSlice";

import {
  AvailabilityResponse,
  BulkAvailabilityPayload,
} from "@/types/api/availability.types";

const availabilitySlotBookingService = {
  getAvailability: async () => {
    store.dispatch(startButtonLoading("get-availability"));

    try {
      const response = await apiClient.get<AvailabilityResponse>(
        "/freelancer/availability",
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("get-availability"));
    }
  },

  updateAvailabilityBulk: async (payload: BulkAvailabilityPayload) => {
    store.dispatch(startButtonLoading("update-availability-bulk"));

    try {
      const response = await apiClient.put<AvailabilityResponse>(
        "/freelancer/availability/bulk",
        payload,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("update-availability-bulk"));
    }
  },

  deleteCalenderSync: async (email: string) => {
    store.dispatch(startButtonLoading("delete-calender-sync"));
    try {
      const response = await apiClient.post("google-calendar/disconnect", {
        email: email,
      });
      await store.dispatch(fetchCurrentUser());

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("delete-calender-sync"));
    }
  },
};

export default availabilitySlotBookingService;
