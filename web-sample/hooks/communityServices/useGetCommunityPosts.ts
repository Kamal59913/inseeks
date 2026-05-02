import communityService from "@/lib/api/services/communityService";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetCommunityPosts = (
  communityId: string,
  limit: number = 20,
  offset: number = 0,
  options?: { enabled?: boolean },
): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ["get-community-posts", communityId, limit, offset],
    queryFn: () =>
      communityService.getCommunityPosts(communityId, limit, offset),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : !!communityId,
  });
};
