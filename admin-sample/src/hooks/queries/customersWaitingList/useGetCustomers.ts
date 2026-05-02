import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import customersWaitingListService from "@/api/services/customersWaitingListService";

export const useGetCustomersWaitingList = (
  pagination_props: PaginationProps = {},
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-waiting-list-customers", pagination_props, filters],
    queryFn: () =>
      customersWaitingListService.getCustomers(pagination_props, filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerWaitingListById = (
  customerId: string,
  options: { enabled: boolean } = { enabled: true }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-customer-waiting-list-by-id", customerId],
    queryFn: () => customersWaitingListService.getCustomerById(customerId),
    enabled: options.enabled && !!customerId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
