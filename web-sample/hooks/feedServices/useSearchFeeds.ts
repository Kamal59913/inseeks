import feedService from "@/lib/api/services/feedService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useSearchFeeds = (
  search: string,
  limit: number = 20,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["search-feeds", search, limit],
    queryFn: () => feedService.searchFeeds(search, limit),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled:
      options?.enabled !== undefined
        ? options.enabled
        : search.trim().length >= 1,
  });
};
