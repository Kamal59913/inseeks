import communityService from "@/lib/api/services/communityService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetRecommendations = (
  limit: number = 10,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: ["community-recommendations", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await communityService.getRecommendations(
        limit,
        pageParam as number,
      );
      return response;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const loadedCount = lastPage?.data?.length || 0;
      if (loadedCount < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
};
