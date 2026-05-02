import feedService from "@/lib/api/services/feedService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetCommunityTopFeeds = (
  communityId: string | number,
  limit: number = 10,
  offset: number = 0,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-community-top-feeds", communityId, limit, offset],
    queryFn: () => feedService.getCommunityTopFeeds(communityId, limit, offset),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : !!communityId,
  });
};
