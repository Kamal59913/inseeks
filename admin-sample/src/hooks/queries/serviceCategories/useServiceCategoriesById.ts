import serviceCategoryService from '@/api/services/serviceCategoryService';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useServiceCategoriesById = (
  serviceCategoryId: string,
  options?: { enabled?: boolean }
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-service-category-byId', serviceCategoryId],
    queryFn: () => serviceCategoryService.getServiceCategoriesById(serviceCategoryId),
    staleTime: 0, // Set to 0 to consider data stale immediately
    gcTime: 0, // Set to 0 for no caching
    refetchOnMount: false, // Fetch on every mount
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
