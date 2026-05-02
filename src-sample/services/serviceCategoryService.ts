import { PaginationProps } from "@/types/useQueries/pagination.type";
import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import { setPageLoading } from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";

const serviceCategoryService = {
  getServiceCategories: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ): Promise<any> => {
    const { page = 1, limit = 10 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/freelancer/service-categories?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getServiceCategoriesFreelancerOnly: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ): Promise<any> => {
    const { page = 1, limit = 10 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/users/freelancer/service-categories?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default serviceCategoryService;
