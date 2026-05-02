import freelancerBookingsService from '@/services/freelancerBookingsService';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetBookingById = (
  serviceId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-bookings-byId', serviceId],
    queryFn: () => freelancerBookingsService.getBoookingsById(serviceId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

