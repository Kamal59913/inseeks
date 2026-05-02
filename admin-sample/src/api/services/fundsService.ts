import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "@/types/useQueries/pagination.type";
import { queryClient } from "@/utils/queryClient";

const fundService = {
  getFundsList: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ) => {
    const { page = 1, limit = 10 } = pagination_props;
    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);

    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get(
        `payments/admin/pending-payments?status=succeeded`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  freezePayment: async (payload: { paymentId: number; reason: string }) => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post(`/payments/freeze`, payload);

      await queryClient.invalidateQueries({
        queryKey: ["get-all-funds"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  releasePayment: async (payload: { paymentId: number }) => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post(`/payments/release`, payload);
      await queryClient.invalidateQueries({
        queryKey: ["get-all-funds"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  refundPayment: async (payload: { paymentId: number; percentage: number }) => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post(`/payments/refund`, payload);
      await queryClient.invalidateQueries({
        queryKey: ["get-all-funds"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  addAdminRemark: async (payload: { paymentId: number; comment: string }) => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post(
        `/payments/partial-refund-logs`,
        payload,
      );
      await queryClient.invalidateQueries({
        queryKey: ["get-all-funds"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-bookings-byId"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-bookings-byId"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
  partialRefund: async (payload: {
    payment_id: number;
    refund_type: "percentage" | "amount";
    amount: number;
  }) => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post(
        `/payments/partial-refund`,
        payload,
      );
      await queryClient.invalidateQueries({
        queryKey: ["get-all-funds"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-bookings-byId"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default fundService;
