import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  startButtonLoading,
  stopButtonLoading,
  setAuthLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";
import { createCustomer } from "@/types/api/customer.types";
import { ApiResponse } from "@/types/api/base";

export interface BookAppointmentPayload {
  freelancer_id: number | string;
  customer_id: number | string;
  service_place_id: number | string;
  product_id: number | string;
  product_option_id: number | string;
  service_start_at: string;
  service_amount: number;
  service_duration: number;
  promo_code?: string;
  location: {
    address_1?: string;
    address_2?: string;
    postal_code?: string;
    city?: string;
  };
  images?: Array<{ image_url: string }>;
  special_instructions?: string;
}

import { ServiceResponse, BadResponse } from "@/types/api/response.types";

const customerService = {
  createCustomer: async (data: createCustomer): ServiceResponse<unknown> => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("create-customer"));
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/bookings/customers",
        data,
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("create-customer"));
    }
  },

  bookAppointment: async (
    data: BookAppointmentPayload,
  ): ServiceResponse<unknown> => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("book-appointment"));
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/bookings",
        data,
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("book-appointment"));
    }
  },

  getAvailableSlots: async (
    uuid: string,
    params: {
      product_option_id: number | string;
      start_date: string;
      days_ahead: number | string;
    },
  ): ServiceResponse<any> => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("get-available-slots"));
    try {
      const response = await apiClient.get<ApiResponse<unknown>>(
        `/users/freelancer/${uuid}/available-slots`,
        { params },
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("get-available-slots"));
    }
  },

  applyPromoCode: async (promoValue: string): ServiceResponse<unknown> => {
    store.dispatch(startButtonLoading("apply-promo-code"));
    try {
      const payload = {
        code: promoValue,
      };
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/coupons/apply",
        payload,
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("apply-promo-code"));
    }
  },

  checkFreelancerLocation: async (data: {
    freelancer_uuid: string;
    latitude: number;
    longitude: number;
  }): ServiceResponse<unknown> => {
    store.dispatch(startButtonLoading("check-freelancer-location"));
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/freelancers/check-location",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("check-freelancer-location"));
    }
  },
};

export default customerService;
