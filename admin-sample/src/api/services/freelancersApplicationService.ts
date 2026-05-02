import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "../../types/useQueries/pagination.type";
import { queryClient } from "@/utils/queryClient";

const freelancersApplicationService = {
  getFreeLancerApplications: async (
    pagination_props: PaginationProps = {},
    filters: any = {},
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
        `/admin/freelancers/applications?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getFreeLancerApplicationById: async (applicationId: string): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/freelancers/applications/${applicationId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
  approveFreelancerApplication: async (
    applicationUuid: string,
  ): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post<any>(
        `/admin/freelancers/applications/${applicationUuid}/approve`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-applications"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-application-byId", applicationUuid],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  // ❌ REJECT APPLICATION
  rejectFreelancerApplication: async (
    applicationId: string,
    payload: { reason: string },
  ): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post<any>(
        `/admin/freelancers/applications/${applicationId}/reject`,
        payload,
      );

      // Refresh list after action
      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-applications"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-application-byId", applicationId],
        exact: false,
      });

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  exportFreelancerApplications: async (filters: any = {}): Promise<any> => {
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
        `/admin/freelancers/applications/export?${queryParams.toString()}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  importFreelancerTemplate: async (): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/freelancers/import-template`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  importFreelancers: async (file: File): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<any>(
        `/admin/freelancers/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-freelancer-applications"],
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

export default freelancersApplicationService;
