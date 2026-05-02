import { useQuery, UseQueryResult } from "@tanstack/react-query";
import freelancersService from "@/api/services/freelancersService";

export const useGetFreelancerReferrals = (
  freelancerId: string
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancers-referrals", freelancerId],
    queryFn: () => freelancersService?.getReferredFreelancers(freelancerId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
