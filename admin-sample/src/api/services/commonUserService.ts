import apiClient from "../clients/apiClient";
import { store } from "@/redux/store";
import { setPageLoading } from "@/redux/slices/globalSlice";
import { handleError } from "@/utils/handleError";

const commonUserService = {
  deleteUserById: async (userUuid: string): Promise<any> => {
    if (!userUuid) {
      throw new Error("User UUID is required");
    }

    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.delete<any>(`/admin/users/${userUuid}`);
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  deleteBookingById: async (bookingId: string | number): Promise<any> => {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.delete<any>(
        `/admin/bookings/${bookingId}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default commonUserService;
