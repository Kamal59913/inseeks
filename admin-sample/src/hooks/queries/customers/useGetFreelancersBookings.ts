import freelancersService from "@/api/services/freelancersService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFreelancerBookingsById = (
  freelancerID: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancer-bookings-byId", freelancerID],
    queryFn: () =>
      freelancersService.getFreeLancersBookingDetails(freelancerID),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
