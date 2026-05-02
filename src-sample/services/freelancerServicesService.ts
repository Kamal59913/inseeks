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
import { timeToMinutes } from "@/components/ui/form/TimeInput";

import { AxiosResponse } from "axios";
import {
  FreelancerListResponse,
  FreelancerResponse,
} from "@/types/api/freelancer.types";
import {
  ServiceFormData,
  ServiceProductOption,
} from "@/types/api/services.types";
import { ApiResponse } from "@/types/api/base";
import { ServiceResponse, BadResponse } from "@/types/api/response.types";
import { FreelancerService } from "@/types/api/freelancer.types";

export interface ServiceProductResponse {
  message: string;
  data: FreelancerService;
}

export interface ServiceListResponse {
  message: string;
  data: {
    products: FreelancerService[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

const freelancerServicesService = {
  createServices: async (
    formData: ServiceFormData,
  ): ServiceResponse<ServiceProductResponse> => {
    store.dispatch(startButtonLoading("update-services"));
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
              duration: timeToMinutes(opt.product_duration ?? ""),
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: timeToMinutes(formData.initial_product_duration ?? ""),
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

      const response = await apiClient.post<ServiceProductResponse>(
        "/freelancer/freelancer-products",
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-service-categories-freelancer-only"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("update-services"));
    }
  },

  getServices: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ): ServiceResponse<ServiceListResponse> => {
    const { page = 1, limit = 10 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<ServiceListResponse>(
        `/freelancer/freelancer-products?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getFreelancerList: async (): Promise<
    AxiosResponse<FreelancerListResponse>
  > => {
    store.dispatch(setPageLoading(true));

    try {
      const response =
        await apiClient.get<FreelancerListResponse>(`/users/freelancers`);
      return response;
    } catch (error) {
      const handled = handleError(error) as any;
      throw handled;
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getFreelancerById: async (
    id: string,
  ): Promise<AxiosResponse<FreelancerResponse>> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<FreelancerResponse>(
        `/users/freelancers/${id}`,
      );
      return response;
    } catch (error) {
      const handled = handleError(error) as any;
      throw handled;
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getFreelancerByUserName: async (
    username: string,
  ): Promise<AxiosResponse<FreelancerResponse>> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<FreelancerResponse>(
        `/users/freelancer/${username}`,
      );
      return response;
    } catch (error) {
      const handled = handleError(error) as any;
      throw handled;
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getServicesById: async (
    serviceCategoryId: string,
  ): ServiceResponse<ServiceProductResponse> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<ServiceProductResponse>(
        `/freelancer/freelancer-products/${serviceCategoryId}`,
      );
      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  updateServicesById: async (
    formData: ServiceFormData,
    serviceCategoryId: string,
  ): ServiceResponse<ServiceProductResponse> => {
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
              duration: timeToMinutes(opt.product_duration ?? ""), // ← convert HH:MM → minutes
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: timeToMinutes(formData.initial_product_duration ?? ""), // ← convert here
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

      const response = await apiClient.patch<ServiceProductResponse>(
        `/freelancer/freelancer-products/${serviceCategoryId}`,
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-service-categories-freelancer-only"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("edit-services"));
    }
  },

  deleteServicesById: async (
    serviceCategoryId: string,
  ): ServiceResponse<ApiResponse<unknown>> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<ApiResponse<unknown>>(
        `/freelancer/freelancer-products/${serviceCategoryId}`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error) as BadResponse;
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },

  updateServicesOrder: async (
    orderData: Array<{ id: number; order_index: number }>,
  ): ServiceResponse<ApiResponse<unknown>> => {
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
      return handleError(error) as BadResponse;
    }
  },
};

export default freelancerServicesService;
