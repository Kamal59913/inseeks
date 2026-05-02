import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import freelancersApplicationService from "@/api/services/freelancersApplicationService";

export const useGetFreelancerApplications = (
  pagination_props: PaginationProps = {},
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancer-applications", pagination_props, filters],
    queryFn: () =>
      freelancersApplicationService.getFreeLancerApplications(
        pagination_props,
        filters
      ),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
