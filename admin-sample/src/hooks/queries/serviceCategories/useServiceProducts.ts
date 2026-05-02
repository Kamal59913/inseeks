import { useQuery, UseQueryResult } from "@tanstack/react-query";
import bookingsService from "@/api/services/bookingsService";

export const useGetServiceProducts = (
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-service-products", filters],
    queryFn: () => bookingsService.freelancerByProductFilter(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!filters?.freelancer_uuid,
  });
};
