import bookingsService from "@/api/services/bookingsService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetBookingsById = (
  bookingId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-bookings-byId", bookingId],
    queryFn: () => bookingsService.getBookingById(bookingId),
    staleTime: 0, // Set to 0 to consider data stale immediately
    gcTime: 0, // Set to 0 for no caching
    refetchOnMount: false, // Fetch on every mount
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
