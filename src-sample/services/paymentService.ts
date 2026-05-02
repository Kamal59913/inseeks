import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  startButtonLoading,
  stopButtonLoading,
  setAuthLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";

export interface HoldPaymentPayload {
  userId?: number;
  freelancerId?: number;
  amount: number;
  currency: string;
  description?: string;
  paymentMethodId: string;
  couponCode?: string;
  customerFee?: number;
  clientSecret?: string; // For Apple Pay - confirms existing PaymentIntent
}

import {
  DirectPaymentPayload,
  DirectPaymentResponse,
} from "@/types/api/payment.types";

const paymentService = {
  makePayment: async (payload: HoldPaymentPayload) => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("payment"));

    try {
      const response = await apiClient.post<any>("/payments/hold", payload);
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("payment"));
      store.dispatch(setAuthLoading(false));
    }
  },

  getFreelancerTransactions: async () => {
    store.dispatch(setAuthLoading(true));
    try {
      const response = await apiClient.get<any>(
        "/payments/freelancer/transactions",
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setAuthLoading(false));
    }
  },

  makeDirectPayment: async (payload: DirectPaymentPayload) => {
    store.dispatch(setAuthLoading(true));
    store.dispatch(startButtonLoading("make-payment"));

    try {
      const response = await apiClient.post<DirectPaymentResponse>(
        "/payments/make-payment",
        payload,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("make-payment"));
      store.dispatch(setAuthLoading(false));
    }
  },
};

export default paymentService;
