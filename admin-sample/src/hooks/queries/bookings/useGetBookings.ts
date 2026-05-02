import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import bookingsService from "@/api/services/bookingsService";

export const useGetBookings = (
  pagination_props: PaginationProps = {},
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-all-bookings", pagination_props, filters],
    queryFn: () => bookingsService.getAllBookings(pagination_props, filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
