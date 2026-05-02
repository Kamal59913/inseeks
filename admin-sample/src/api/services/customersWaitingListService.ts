import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "../../types/useQueries/pagination.type";

const customersWaitingListService = {
  getCustomers: async (
    pagination_props: PaginationProps = {},
    filters: any = {}
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
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/waiting-list?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getCustomerById: async (customerId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/users/customers/${customerId}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  // -----------------------------
  // EXPORT APIs
  // -----------------------------

  exportCustomers: async (filters: any = {}): Promise<any> => {
    const queryParams = new URLSearchParams();

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
        `/admin/waiting-list/export?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default customersWaitingListService;
