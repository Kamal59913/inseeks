import apiClient from "../clients/apiClient";
import { handleError } from "../../utils/handleError";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "../../redux/slices/globalSlice";
import { store } from "../../redux/store";
import { queryClient } from "@/utils/queryClient";

const profilePortfolioService = {
  updatePortfolioOrder: async (payload: any) => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.patch("/portfolio/order", payload);
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  addPortfolioImage: async (formData: FormData) => {
    store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.post("/portfolio", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  uploadImages: async (formData: FormData) => {
    try {
      store.dispatch(setPageLoading(true));
      store.dispatch(startButtonLoading("upload-photos"));
      const response = await apiClient.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("upload-photos"));
    }
  },
  createPortfolioImage: async (payload: any) => {
    try {
      const response = await apiClient.post("/portfolio", payload);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  updatePortfolioImagesById: async (payload: any, id: string) => {
    try {
      const response = await apiClient.patch(`/portfolio/${id}`, payload);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  deletePortfolioImagesById: async (
    freelancerUuid: string,
    portfolioImageId: string | number
  ): Promise<any> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<any>(
        `/admin/freelancers/${freelancerUuid}/portfolio/${portfolioImageId}`
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-portfolio-byId"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-details-byId"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },
};

export default profilePortfolioService;
