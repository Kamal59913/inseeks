import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  startButtonLoading,
  stopButtonLoading,
  setAuthLoading,
} from "@/store/slices/globalSlice";

import { handleError } from "@/lib/utilities/handleAuth";
import {
  BillingInfoPayload,
  BillingInfoResponse,
  ConnectAccountResponse,
  PayoutStatsResponse,
} from "@/types/api/wallet.types";
import { ServiceResponse, BadResponse } from "@/types/api/response.types";
import { ApiResponse } from "@/types/api/base";

const walletService = {
  createConnectAccount: async (): ServiceResponse<ConnectAccountResponse> => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("wallet"));
    try {
      const response = await apiClient.post<ConnectAccountResponse>(
        "/stripe/create-connect-account",
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("wallet"));
    }
  },
  getPayoutStats: async (): ServiceResponse<PayoutStatsResponse> => {
    try {
      const response = await apiClient.get<PayoutStatsResponse>(
        "/payments/freelancer/earnings/stats",
      );

      return response;
    } catch (error) {
      return handleError(error);
    }
  },
  // updateStripeStatus: async () => {
  //   try {
  //     const response = await apiClient.post("/stripe/update-status");
  //     return response;
  //   } catch (error) {
  //     return handleError(error);
  //   }
  // },

  getBillingInfo: async (): ServiceResponse<BillingInfoResponse> => {
    try {
      const response = await apiClient.get<BillingInfoResponse>("/billing");
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  updateBillingInfo: async (
    payload: BillingInfoPayload,
  ): ServiceResponse<BillingInfoResponse> => {
    store.dispatch(startButtonLoading("billing"));

    try {
      // ⭐ Transform payload BEFORE sending
      const formattedPayload = {
        generateInvoices: payload.generateInvoices,
        billingName: payload.billingName,
        address1: payload.address1,
        address2: payload.address2,
        postcode: payload.postcode,
        city: payload.city,
        vatNumber: payload.vatNumber,
      };

      const response = await apiClient.post<BillingInfoResponse>(
        "/billing",
        formattedPayload,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("billing"));
    }
  },

  generateInvoice: async (bookingId: number | string): ServiceResponse<any> => {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    store.dispatch(startButtonLoading("generate-invoice"));
    try {
      const response = await apiClient.post<any>(
        "/bookings/freelancer/generate-invoice",
        { booking_id: bookingId },
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("generate-invoice"));
    }
  },
  getStripeAccountInfo: async (): ServiceResponse<ApiResponse<unknown>> => {
    store.dispatch(startButtonLoading("stripe-account-info"));
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/stripe/stripe-account-info",
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("stripe-account-info"));
    }
  },
};

export default walletService;
