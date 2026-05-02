import apiClient from "./clients/apiClient";
import { store } from "@/store/store";
import {
  setPageLoading,
  startButtonLoading,
  stopButtonLoading,
} from "@/store/slices/globalSlice";
import { handleError } from "@/lib/utilities/handleAuth";
// import { fetchCurrentUser } from "@/store/slices/authSlice";
import { queryClient } from "@/lib/utilities/queryClient";
import { PaginationProps } from "@/types/useQueries/pagination.type";
import { PortfolioImageFormData } from "@/types/api/services.types";
import { ServiceResponse, BadResponse } from "@/types/api/response.types";
import { ApiResponse } from "@/types/api/base";
import { PortfolioItem } from "@/types/api/freelancer.types";

const profilePortfolioService = {
  uploadImages: async (formData: FormData, isSilent: boolean = false) => {
    try {
      if (!isSilent) {
        store.dispatch(setPageLoading(true));
      }
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
      if (!isSilent) {
        store.dispatch(setPageLoading(false));
      }
      store.dispatch(stopButtonLoading("upload-photos"));
    }
  },

  createPortfolioImage: async (formData: PortfolioImageFormData) => {
    store.dispatch(startButtonLoading("create-portfolios"));
    // store.dispatch(setPageLoading(true));

    try {
      //please optimze this in future
      const existing = await apiClient.get<{ data: unknown[] }>(
        "/users/freelancer/portfolio/my?page=1&limit=1",
      );
      const alreadyHasImages = existing?.data?.data?.length > 0;

      const payload = {
        image_url: formData.image_url,
        thumbnail: formData.thumbnail_url || "",
        caption: formData.image_caption,
        status: formData.status,
        is_primary: alreadyHasImages ? false : true,
      };

      const response = await apiClient.post(
        "/users/freelancer/portfolio",
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-portfolio-images"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      // store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("create-portfolios"));
    }
  },

  getPortfolioImages: async (
    pagination_props: PaginationProps = {},
    searchWord?: string,
  ): ServiceResponse<ApiResponse<PortfolioItem[]>> => {
    const { page = 1, limit = 10 } = pagination_props;

    const queryParams = new URLSearchParams();

    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    searchWord && queryParams.append("searchWord", searchWord);
    // store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<ApiResponse<PortfolioItem[]>>(
        `/users/freelancer/portfolio/my?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      // store.dispatch(setPageLoading(false));
    }
  },

  getPortfolioImageById: async (
    portfolioImagesId: string,
  ): ServiceResponse<ApiResponse<PortfolioItem>> => {
    // store.dispatch(setPageLoading(true));
    try {
      const response = await apiClient.get<ApiResponse<PortfolioItem>>(
        `/users/freelancer/portfolio/${portfolioImagesId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      // store.dispatch(setPageLoading(false));
    }
  },

  updatePortfolioImagesById: async (
    formData: PortfolioImageFormData,
    portfolioImagesId: string,
  ): ServiceResponse<ApiResponse<PortfolioItem>> => {
    try {
      // store.dispatch(setPageLoading(true));
      store.dispatch(startButtonLoading("edit-portfolios"));

      const payload = {
        image_url: formData.image_url,
        thumbnail: formData.thumbnail_url || "",
        caption: formData.image_caption,
        order_index: 2,
      };

      const response = await apiClient.patch<ApiResponse<PortfolioItem>>(
        `/users/freelancer/portfolio/${portfolioImagesId}`,
        payload,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-portfolio-images"],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      // store.dispatch(setPageLoading(false));
      store.dispatch(stopButtonLoading("edit-portfolios"));
    }
  },

  deletePortfolioImagesById: async (
    portfolioImagesId: string,
  ): ServiceResponse<ApiResponse<unknown>> => {
    try {
      store.dispatch(startButtonLoading("confirm-delete"));

      const response = await apiClient.delete<ApiResponse<unknown>>(
        `/users/freelancer/portfolio/${portfolioImagesId}`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-portfolio-images"],
        exact: false,
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(stopButtonLoading("confirm-delete"));
    }
  },

  updatePortfolioOrder: async (
    orderData: Array<{ id: number; order_index: number }>,
  ): ServiceResponse<ApiResponse<unknown>> => {
    try {
      const response = await apiClient.post<ApiResponse<unknown>>(
        "/users/freelancer/portfolio/update-order",
        orderData,
      );
      return response;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default profilePortfolioService;
