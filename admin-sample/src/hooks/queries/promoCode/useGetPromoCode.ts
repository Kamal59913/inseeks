import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { PaginationProps } from "../../../types/useQueries/pagination.type";
import promoCodeService from "@/api/services/promoCodeService";

export const useGetPromoCode = (
  pagination_props: PaginationProps = {},
  filters?: any
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-promo-code-list", pagination_props, filters],
    queryFn: () => promoCodeService.getPromoCodeList(pagination_props, filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
