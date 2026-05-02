import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { queryClient } from "@/utils/queryClient";
import { timeToMinutes } from "@shared/common/components/ui/form/input/TimeInput.js";

const freelancerServicesService = {
  updateServicesOrder: async (payload: {
    services: { id: string; order_id: number }[];
  }): Promise<any> => {
    // Optimistic update often doesn't show loading, but let's follow pattern
    // store.dispatch(setPageLoading(true));
    // Usually ordering is background or silent, but for consistency:
    try {
      const response = await apiClient.patch<any>(
        `/admin/freelancer-services/order`,
        payload
      );

      // Invalidate relevant queries
      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-details"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteServicesById: async (serviceCategoryId: string): Promise<any> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<any>(
        `/admin/freelancer-products/${serviceCategoryId}`
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-services-freelancers"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },

  createServices: async (formData: any) => {
    store.dispatch(startButtonLoading("update-services"));
    store.dispatch(setPageLoading(true));

    try {
      const optionsToSend = formData.is_product_options
        ? formData.product_options
            .filter(
              (opt: any) =>
                opt &&
                (opt.product_name?.trim() ||
                  opt.product_duration?.trim() ||
                  opt.product_price ||
                  opt.product_payout)
            )
            .map((opt: any) => ({
              name: opt.product_name,
              duration: timeToMinutes(opt.product_duration), // ← convert HH:MM → minutes
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: timeToMinutes(formData.initial_product_duration), // ← convert here
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

      const response = await apiClient.post(
        "/admin/freelancer-products",
        payload
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
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("update-services"));
    }
  },

  updateServicesById: async (
    formData: any,
    serviceCategoryId: string
  ): Promise<any> => {
    try {
      store.dispatch(setPageLoading(true));
      store.dispatch(startButtonLoading("edit-services"));

      const optionsToSend = formData.is_product_options
        ? formData.product_options
            .filter(
              (opt: any) =>
                opt &&
                (opt.product_name?.trim() ||
                  opt.product_duration?.trim() ||
                  opt.product_price ||
                  opt.product_payout)
            )
            .map((opt: any) => ({
              name: opt.product_name,
              duration: timeToMinutes(opt.product_duration), // ← convert HH:MM → minutes
              price: Number(opt.product_price) || 0,
              discount: Number(opt.product_payout) || 0,
            }))
        : [
            {
              name: formData.product_name,
              duration: timeToMinutes(formData.initial_product_duration), // ← convert here
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

      const response = await apiClient.patch<any>(
        `/admin/freelancer-products/${serviceCategoryId}`,
        payload
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
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("edit-services"));
    }
  },

  getServicesById: async (serviceCategoryId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<any>(
        `/admin/freelancer-products/${serviceCategoryId}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default freelancerServicesService;
