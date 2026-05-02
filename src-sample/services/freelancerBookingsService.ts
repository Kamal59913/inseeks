import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";
import { PaginationProps } from "@/types/useQueries/pagination.type";
import { queryClient } from "@/lib/utilities/queryClient";
import {
  ServiceFormData,
  ServiceProductOption,
} from "@/types/api/services.types";
import { ServiceResponse, BadResponse } from "@/types/api/response.types";
import { ApiResponse } from "@/types/api/base";

const freelancerBookingsService = {
  createBookings: async (
    formData: ServiceFormData,
  ): ServiceResponse<ApiResponse<unknown>> => {
    store.dispatch(startButtonLoading("update-bookings"));
    store.dispatch(setPageLoading(true));

    try {
      const optionsToSend = formData.is_product_options
        ? (formData.product_options ?? [])
            .filter(
              (opt: ServiceProductOption) =>
                opt &&
                (opt.product_name?.trim() ||
                  opt.product_duration?.trim() ||
                  opt.product_price ||
                  opt.product_payout),
            )
            .map((opt: ServiceProductOption) => ({
              name: opt.product_name,
              duration: Number(opt.product_duration) || 0,
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: Number(formData.initial_product_duration) || 0,
              price: Number(formData.initial_product_price) || 0,
              discount: Number(formData.initial_product_payout) || 0,
            },
          ];

      const payload = {
        service_category_id: Number(formData?.product_category),
        name: formData.product_name,
        description: formData.product_description,
        status: true,
        options: optionsToSend,
      };

      const response = await apiClient.post<ApiResponse<unknown>>(
        "/freelancer/freelancer-products",
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("update-bookings"));
    }
  },
  getBookings: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ): ServiceResponse<unknown> => {
    const { page = 1, limit = 10 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<ApiResponse<unknown>>(
        `/bookings/freelancer/my-bookings?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
  getBoookingsById: async (bookingId: string): ServiceResponse<unknown> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<ApiResponse<unknown>>(
        `/freelancer/freelancer-products/${bookingId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
  updateBookingsById: async (
    formData: ServiceFormData,
    bookingId: string,
  ): ServiceResponse<unknown> => {
    try {
      store.dispatch(setPageLoading(true));
      store.dispatch(startButtonLoading("edit-services"));

      const optionsToSend = formData.is_product_options
        ? (formData.product_options ?? [])
            .filter(
              (opt: ServiceProductOption) =>
                opt &&
                (opt.product_name?.trim() ||
                  opt.product_duration?.trim() ||
                  opt.product_price ||
                  opt.product_payout),
            )
            .map((opt: ServiceProductOption) => ({
              name: opt.product_name,
              duration: Number(opt.product_duration) || 0,
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: Number(formData.initial_product_duration) || 0,
              price: Number(formData.initial_product_price) || 0,
              discount: Number(formData.initial_product_payout) || 0,
            },
          ];

      const payload = {
        service_category_id: Number(formData.product_category),
        name: formData.product_name,
        description: formData.product_description,
        status: true,
        options: optionsToSend,
      };

      const response = await apiClient.patch<ApiResponse<unknown>>(
        `/freelancer/freelancer-products/${bookingId}`,
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("edit-services"));
    }
  },
  deleteBookingsById: async (bookingId: string): ServiceResponse<unknown> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<ApiResponse<unknown>>(
        `/freelancer/freelancer-products/${bookingId}`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },
  declineBookingsById: async (
    bookingId: string,
    reason: string,
  ): ServiceResponse<unknown> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.patch<any>(`/bookings/reject`, {
        booking_id: bookingId,
        cancellation_reason: reason,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-bookings-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },

  acceptBookingsById: async (bookingId: string): ServiceResponse<unknown> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.patch<any>(`/bookings/accept`, {
        booking_id: bookingId,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-bookings-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },

  updateBookingsOrder: async (
    orderData: Array<{ id: number; order_index: number }>,
  ): ServiceResponse<unknown> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/freelancer/freelancer-products/update-order",
        orderData,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default freelancerBookingsService;
