import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import {
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { queryClient } from "../../utils/queryClient";
import { PaginationProps } from "../../types/useQueries/pagination.type";

const serviceCategoryService = {
  createServiceCategories: async (payload: any): Promise<any> => {
    try {
      store.dispatch(startButtonLoading("add-service-class"));
      const response = await apiClient.post<any>(
        `/admin/service-categories`,
        payload,
      );
      await queryClient.invalidateQueries({
        queryKey: ["get-service-categories"],
        exact: false,
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("add-service-class"));
    }
  },

  getServiceCategories: async (
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
        `/admin/service-categories?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      if (showLoader) store.dispatch(setPageLoading(false));
    }
  },

  getServiceCategoriesById: async (serviceCategoryId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<any>(
        `/admin/service-categories/${serviceCategoryId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  updateServiceCategoriesById: async (
    payload: any,
    serviceCategoryId: string,
  ): Promise<any> => {
    try {
      store.dispatch(startButtonLoading("edit-service-category"));

      const formdata = {
        name: payload.name,
        description: payload.description,
      };
      const response = await apiClient.patch<any>(
        `/admin/service-categories/${serviceCategoryId}`,
        formdata,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-service-categories"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("edit-service-category"));
    }
  },

  deleteServiceCategoryById: async (
    serviceCategoryId: string,
  ): Promise<any> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<any>(
        `/admin/service-categories/${serviceCategoryId}`,
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },
};

export default serviceCategoryService;
