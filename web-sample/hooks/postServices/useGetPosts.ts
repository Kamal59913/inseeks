import { useInfiniteQuery } from "@tanstack/react-query";
import postService from "@/lib/api/services/postService";

export const useGetPosts = (
  filter: string = "all",
  limit: number = 20,
  options: any = {},
  ownerId?: number | string,
  postType?: string,
  communityId?: number | string,
  feedId?: number | string,
) => {
  return useInfiniteQuery({
    queryKey: ["posts", filter, limit, ownerId, postType, communityId, feedId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await postService.getPosts(
        filter,
        limit,
        pageParam as number,
        ownerId,
        postType,
        communityId,
        feedId,
      );
      return response.data;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const posts = lastPage?.data || [];
      if (posts.length < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    ...options,
  });
};
