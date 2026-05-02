import feedService from "@/lib/api/services/feedService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetFeedById = (
  id: string | number,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-feed-by-id", id],
    queryFn: () => feedService.getFeedById(id),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
};
