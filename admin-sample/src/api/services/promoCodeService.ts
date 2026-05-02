import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "@/types/useQueries/pagination.type";
import { queryClient } from "@/utils/queryClient";

const promoCodeService = {
  getPromoCodeList: async (
    pagination_props: PaginationProps = {},
    filters: any = {}
  ) => {
    const { page = 1, limit = 10 } = pagination_props;
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
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get(`/coupons`);

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  createPromoCode: async (payload: any) => {
    store.dispatch(startButtonLoading("create-promo-code"));
    try {
      console.log("Incoming payload:", payload);

      const converted = {
        code: payload.code,
        discount_percent: Number(payload.discount_percent),
        expires_at: payload.expires_at
          ? new Date(payload.expires_at).toISOString()
          : null,
        max_uses: Number(payload.max_uses),
        active: Boolean(payload.active),
      };

      console.log("Final Converted Payload:", converted);

      const response = await apiClient.post(`/coupons`, converted);

      await queryClient.invalidateQueries({
        queryKey: ["get-promo-code-list"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("create-promo-code"));
    }
  },

  deletePromoCode: async (_id: string) => {
    store.dispatch(startButtonLoading("delete-promo-code"));
    try {
      const response = await apiClient.delete(`/coupons/${_id}`);

      await queryClient.invalidateQueries({
        queryKey: ["get-promo-code-list"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("delete-promo-code"));
    }
  },
};

export default promoCodeService;
