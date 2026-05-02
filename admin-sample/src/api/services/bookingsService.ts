import apiClient from "../clients/apiClient";
import { store } from "../../redux/store";
import { setPageLoading } from "../../redux/slices/globalSlice";
import { handleError } from "../../utils/handleError";
import { PaginationProps } from "../../types/useQueries/pagination.type";

const bookingsService = {
  getAllBookings: async (
    pagination_props: PaginationProps = {},
    filters: any = {}
  ): Promise<any> => {
    const { page = 1, limit = 50 } = pagination_props;
    const queryParams = new URLSearchParams();
    console.log("hi", filters);
    // // Add pagination
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    // Add filters dynamically
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
        `/admin/bookings?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  getBookingById: async (bookingId: string | number): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(`/admin/bookings/${bookingId}`);
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  exportBookings: async (filters: any = {}): Promise<any> => {
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
        `/admin/bookings/export?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  freelancerByProductFilter: async (filters: {
    freelancer_uuid: string;
    service?: number | string;
  }): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      // if (!filters?.freelancer_uuid) {
      //   throw new Error("Freelancer UUID is required");
      // }

      const queryParams = new URLSearchParams();
      queryParams.append("freelancer", filters.freelancer_uuid);

      if (filters.service) {
        queryParams.append("category", String(filters.service));
      }

      const response = await apiClient.get<any>(
        `/admin/freelancers/products?${queryParams.toString()}`
      );

      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  generateInvoice: async (bookingId: string | number): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.post<any>(
        `/admin/bookings/${bookingId}/generate-invoice`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },

  downloadInvoice: async (bookingId: string | number): Promise<any> => {
    store.dispatch(setPageLoading(true));

    try {
      const response = await apiClient.get<any>(
        `/admin/bookings/${bookingId}/invoice/download`
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      store.dispatch(setPageLoading(false));
    }
  },
};

export default bookingsService;
