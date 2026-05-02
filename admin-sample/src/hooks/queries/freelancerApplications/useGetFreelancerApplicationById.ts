import freelancersApplicationService from "@/api/services/freelancersApplicationService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFreelancerApplicationById = (
  applicationId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancer-application-byId", applicationId],
    queryFn: () =>
      freelancersApplicationService.getFreeLancerApplicationById(applicationId),
    staleTime: 0, // Set to 0 to consider data stale immediately
    gcTime: 0, // Set to 0 for no caching
    refetchOnMount: false, // Fetch on every mount
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
