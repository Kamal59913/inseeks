import profilePortfolioService from '@/services/profilePortfolioServices';
import { PaginationProps } from '@/types/useQueries/pagination.type';
import { useQuery, UseQueryResult } from '@tanstack/react-query';


export const useGetPortfolioImages = (pagination_props: PaginationProps = {}, searchWord?: string): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-portfolio-images', pagination_props, searchWord],
    queryFn: () => profilePortfolioService.getPortfolioImages(pagination_props, searchWord),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

