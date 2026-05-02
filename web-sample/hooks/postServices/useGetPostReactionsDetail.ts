import { useInfiniteQuery } from "@tanstack/react-query";
import postService from "@/lib/api/services/postService";

export const useGetPostReactionsDetail = (
  postId: number | string,
  reactionTypeId?: number | string,
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: ["post-reactions-detail", postId, reactionTypeId, limit],
    queryFn: async ({ pageParam = 0 }) => {
      return postService.getPostReactionsDetail(
        postId,
        limit,
        pageParam as number,
        reactionTypeId,
      );
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      // The API returns { data: { reactions: [ { users: [...] } ] } }
      // We need to determine if there's more based on the users returned in the target reaction group
      const targetReaction = reactionTypeId
        ? lastPage?.data?.reactions?.[0]
        : lastPage?.data?.reactions?.reduce(
            (acc: any, curr: any) => ({
              total_users: (acc.total_users || 0) + (curr.total_users || 0),
              users_length: (acc.users_length || 0) + (curr.users?.length || 0),
            }),
            { total_users: 0, users_length: 0 },
          );

      // Note: If reactionTypeId is absent, it's harder to calculate next offset perfectly if multiple reaction types return users.
      // Usually "All" might be handled differently or the API might have top-level total.
      // Given the user's curl and response, if reactionTypeId is provided, we get specific users for that.

      const totalUsersInPage = reactionTypeId
        ? lastPage?.data?.reactions?.[0]?.users?.length || 0
        : lastPage?.data?.reactions?.reduce(
            (sum: number, r: any) => sum + (r.users?.length || 0),
            0,
          ) || 0;

      if (totalUsersInPage < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    enabled: !!postId,
  });
};
