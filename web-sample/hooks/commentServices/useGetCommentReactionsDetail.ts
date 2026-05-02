import { useInfiniteQuery } from "@tanstack/react-query";
import commentService from "@/lib/api/services/commentService";

export const useGetCommentReactionsDetail = (
  commentId: number | string,
  reactionTypeId?: number | string,
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: ["comment-reactions-detail", commentId, reactionTypeId, limit],
    queryFn: async ({ pageParam = 0 }) => {
      return commentService.getCommentReactionsDetail(
        commentId,
        limit,
        pageParam as number,
        reactionTypeId,
      );
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      // The API structure is expected to be similar to post reactions detail
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
    enabled: !!commentId,
  });
};
