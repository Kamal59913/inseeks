import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import freelancersService from "@/api/services/freelancersService";

export const useGetFreelancers = (
  pagination_props: PaginationProps = {},
  filters?: any,
  showLoader: boolean = true,
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancers", pagination_props, filters, showLoader],
    queryFn: () =>
      freelancersService?.getFreeLancers(pagination_props, filters, showLoader),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
