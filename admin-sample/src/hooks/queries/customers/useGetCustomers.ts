import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import customersService from "@/api/services/customersService";

export const useGetCustomers = (
  pagination_props: PaginationProps = {},
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-customers", pagination_props, filters],
    queryFn: () => customersService.getCustomers(pagination_props, filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
