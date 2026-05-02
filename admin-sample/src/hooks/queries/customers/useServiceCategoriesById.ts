import customersService from "@/api/services/customersService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetCustomerById = (
  customerId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-customer-byId", customerId],
    queryFn: () => customersService.getCustomerById(customerId),
    staleTime: 0, // Set to 0 to consider data stale immediately
    gcTime: 0, // Set to 0 for no caching
    refetchOnMount: false, // Fetch on every mount
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
