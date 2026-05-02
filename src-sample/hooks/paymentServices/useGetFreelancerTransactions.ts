import paymentService from "@/services/paymentService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFreelancerTransactions = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-freelancer-transactions"],
    queryFn: () => paymentService.getFreelancerTransactions(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
