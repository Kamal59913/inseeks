import communityService from "@/lib/api/services/communityService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetCommunities = (
  limit: number = 20,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: ["get-communities", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await communityService.getCommunities(
        limit,
        pageParam as number,
      );
      const data = (response as any)?.data || response;
      return {
        communities: Array.isArray(data) ? data : [],
        nextOffset: (pageParam as number) + limit,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.communities.length < limit) return undefined;
      return lastPage.nextOffset;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};
