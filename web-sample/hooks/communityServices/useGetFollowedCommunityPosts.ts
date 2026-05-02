import communityService from "@/lib/api/services/communityService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetFollowedCommunityPosts = (
  limit: number = 20,
  avatarPreviewLimit: number = 6,
  filter: string = "all",
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: [
      "get-followed-community-posts",
      limit,
      avatarPreviewLimit,
      filter,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const response = (await communityService.getFollowedCommunityPosts(
        limit,
        pageParam as number,
        avatarPreviewLimit,
        filter,
      )) as any;
      const data = response?.data?.posts || response?.data || [];
      return {
        posts: Array.isArray(data) ? data : [],
        nextOffset: (pageParam as number) + limit,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.posts.length < limit) return undefined;
      return lastPage.nextOffset;
    },
    initialPageParam: 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled,
  });
};
