import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import serviceCategoryService from "@/api/services/serviceCategoryService";

export const useServiceCategories = (
  pagination_props: PaginationProps = {},
  filters?: any,
  showLoader: boolean = true,
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-service-categories", pagination_props, filters, showLoader],
    queryFn: () =>
      serviceCategoryService.getServiceCategories(
        pagination_props,
        filters,
        showLoader,
      ),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
