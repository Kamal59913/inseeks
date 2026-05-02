import serviceCategoryService from '@/services/serviceCategoryService';
import { PaginationProps } from '@/types/useQueries/pagination.type';
import { useQuery, UseQueryResult } from '@tanstack/react-query';


export const useServiceCategories = (pagination_props: PaginationProps = {}, searchWord?: string): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-service-categories', pagination_props, searchWord],
    queryFn: () => serviceCategoryService.getServiceCategories(pagination_props, searchWord),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};


export const useServiceCategoriesFreelancerOnly = (pagination_props: PaginationProps = {}, searchWord?: string): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['get-service-categories-freelancer-only', pagination_props, searchWord],
    queryFn: () => serviceCategoryService.getServiceCategoriesFreelancerOnly(pagination_props, searchWord),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

