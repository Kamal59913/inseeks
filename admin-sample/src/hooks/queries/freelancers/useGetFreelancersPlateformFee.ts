import platformFeeService from "@/api/services/plateformFeeService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFreelancersPlateformFee = (
  freelancerID: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancers-plateform-fee-byId", freelancerID],
    queryFn: () => platformFeeService.getFreelancerPlatformFee(freelancerID),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
