import walletService from "@/services/walletService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetStripeAccountInfo = (options?: {
  enabled?: boolean;
}): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-stripe-account-info"],
    queryFn: () => walletService.getStripeAccountInfo(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

