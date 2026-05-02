import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "../../types/useQueries/pagination.type";
import { queryClient } from "@/utils/queryClient";
import { fetchCurrentUser } from "@/redux/authThunk";

const freelancersService = {
  getFreeLancers: async (
    pagination_props: PaginationProps = {},
    filters: any = {},
    showLoader: boolean = true,
  ): Promise<any> => {
    const { page = 1, limit = 50 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        queryParams.append(key, filters[key]);
      }
    });
    if (showLoader) store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/freelancers?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      if (showLoader) store.dispatch(setPageLoading(false));
    }
  },
  getFreeLancersBookingDetails: async (freelancerId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/freelancers/${freelancerId}/bookings`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getFreeLancersDetailsById: async (freelancerId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/users/freelancers/${freelancerId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  bookingForceCancel: async (
    bookingId: string,
    payload: { booking_id: string; reason: string },
  ): Promise<any> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.patch<any>(
        `/admin/bookings/${bookingId}/force-cancel`,
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-bookings-byId"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-all-bookings"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  bookingForceComplete: async (
    bookingId: string,
    payload: { booking_id: string; completed_at: string },
  ): Promise<any> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.patch<any>(
        `/admin/bookings/${bookingId}/force-complete`,
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-bookings-byId"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-customer-byId"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-all-bookings"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  updateFreelancerById: async (
    userUUID: string,
    payload: any,
  ): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.patch<any>(
        `/admin/users/${userUUID}`,
        payload,
      );

      // Optional but recommended cache refresh
      await queryClient.invalidateQueries({
        queryKey: ["get-freelancers"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-details"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  exportFreelancers: async (filters: any = {}): Promise<any> => {
    const queryParams = new URLSearchParams();
    queryParams.append("role", "freelancer");

    Object.keys(filters).forEach((key) => {
      if (
        filters[key] !== undefined &&
        filters[key] !== null &&
        filters[key] !== ""
      ) {
        queryParams.append(key, filters[key]);
      }
    });

    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<any>(
        `/admin/users/export?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  deleteCalenderSync: async (email: any) => {
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

  suspendFreelancer: async (userId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.patch<any>(
        `/admin/users/${userId}/status`,
        { status: "suspended" },
      );
      await queryClient.invalidateQueries({
        queryKey: ["get-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  unsuspendFreelancer: async (userId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.patch<any>(
        `/admin/users/${userId}/status`,
        { status: "active" },
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getReferredFreelancers: async (freelancerId: string): Promise<any> => {
    if (!freelancerId) {
      throw new Error("Freelancer ID is required");
    }

    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<any>(
        `/admin/freelancers/${freelancerId}/referred-freelancers`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default freelancersService;
