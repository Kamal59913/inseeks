import freelancerBookingsService from '@/services/freelancerBookingsService';
import { PaginationProps } from '@/types/useQueries/pagination.type';
import { useQuery, UseQueryResult } from '@tanstack/react-query';


export const useGetFreeLancerBookings = (pagination_props: PaginationProps = {}, searchWord?: string): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-bookings-freelancers', pagination_props, searchWord],
    queryFn: () => freelancerBookingsService.getBookings(pagination_props, searchWord),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

