import freelancersService from "@/api/services/freelancersService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFreelancerDetailsById = (
  freelancerID: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancer-details-byId", freelancerID],
    queryFn: () => freelancersService.getFreeLancersDetailsById(freelancerID),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
