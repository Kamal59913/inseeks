import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "@/types/useQueries/pagination.type";

const referralsService = {
  getReferrersList: async (
    pagination_props: PaginationProps = {},
    filters: any = {}
  ) => {
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
      const response = await apiClient.get(
        `/admin/freelancers/used-as-referrers?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default referralsService;
