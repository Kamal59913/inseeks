import freelancerServicesService from "@/api/services/freelancerServicesService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetServiceById = (
  serviceId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-services-byId", serviceId],
    queryFn: () => freelancerServicesService.getServicesById(serviceId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
