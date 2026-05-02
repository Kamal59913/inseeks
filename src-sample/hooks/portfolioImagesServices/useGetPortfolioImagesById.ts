import freelancerServicesService from '@/services/freelancerServicesService';
import profilePortfolioService from '@/services/profilePortfolioServices';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetPortfolioImagesById = (
  portfolioImagesId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-portfolio-images-byId', portfolioImagesId],
    queryFn: () => profilePortfolioService?.getPortfolioImageById(portfolioImagesId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

