import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { CreateCommentPayload } from "@/lib/types/Comment";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppInvalidation } from "../postServices/useAppInvalidation";
import {
  updateCommentInTree,
  removeCommentFromTree,
} from "@/lib/utilities/cacheHelpers";

export const useComments = (postId: number | string) => {
  const queryClient = useQueryClient();
  const { updatePostCache, updateCommentCache } = useAppInvalidation();

  // Fetch comments with infinite query
  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useInfiniteQuery({
    queryKey: ["comments", String(postId)],
    queryFn: ({ pageParam = 0 }) =>
      commentService.getComments({
        post_id: postId,
        offset: pageParam as number,
        limit: 5,
      }),
    getNextPageParam: (lastPage: any) => {
      const { offset, limit, total } = lastPage?.data || {};
      if (typeof total === "number" && offset + limit < total) {
        return offset + limit;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: !!postId,
  });

  // Create comment
  const createCommentMutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentService.createComment(payload),
    onSuccess: (response: any) => {
      // response is the Axios data object: { status, message, data: { ... } }
      // Standardize extraction: check for nested data.comment or response.data
      let newComment = response?.data?.comment || response?.data;

      // If the API returns success but newComment is still missing text,
      // it might be because the response structure is different.
      if (newComment) {
        const { userData } = useAuthStore.getState();

        // Enrich with user metadata to ensure immediate display is full-fidelity
        newComment = {
          ...newComment,
          author_full_name: newComment.author_full_name || userData?.full_name,
          author_profile_image:
            newComment.author_profile_image || userData?.profile_photo_url,
          author_username: newComment.author_username || userData?.username,
          reactions_total: newComment.reactions_total || 0,
          top_reactions: newComment.top_reactions || [],
          total_replies: newComment.total_replies || 0,
          replies: newComment.replies || [],
        };

        // 1. Update post comment count
        updatePostCache(postId, (post) => ({
          ...post,
          comments_count: (post.comments_count || 0) + 1,
        }));

        // 2. Add to cache
        updateCommentCache(postId, (comments) => {
          if (!Array.isArray(comments)) return comments;

          if (newComment.parent_comment_id) {
            return updateCommentInTree(
              comments,
              newComment.parent_comment_id,
              (parent) => ({
                ...parent,
                total_replies: (parent.total_replies || 0) + 1,
                replies: [...(parent.replies || []), newComment],
              }),
            );
          }
          return [newComment, ...comments];
        });
      }
      ToastService.success(response?.message || "Comment created successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to create comment");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // Edit comment
  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId,
      text,
    }: {
      commentId: number | string;
      text: string;
    }) => commentService.editComment(commentId, text),
    onMutate: async ({ commentId, text }) => {
      updateCommentCache(postId, (comments) =>
        updateCommentInTree(comments, commentId, (c) => ({
          ...c,
          text,
          edited: true,
        })),
      );
    },
    onSuccess: (response: any) => {
      ToastService.success(response?.message || "Comment updated successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to update comment");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  // Delete comment
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number | string) =>
      commentService.deleteComment(commentId),
    onMutate: async (commentId) => {
      // Update post count
      updatePostCache(postId, (post) => ({
        ...post,
        comments_count: Math.max(0, (post.comments_count || 0) - 1),
      }));

      // Remove from tree
      updateCommentCache(postId, (comments) =>
        removeCommentFromTree(comments, commentId),
      );
    },
    onSuccess: (response: any) => {
      ToastService.success(response?.message || "Comment deleted successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to delete comment");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return {
    comments:
      commentsData?.pages.flatMap((page: any) => page?.data?.comments || []) ||
      [],
    total: (commentsData?.pages[0] as any)?.data?.total || 0,
    isLoading: isCommentsLoading,
    error: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createComment: createCommentMutation.mutate,
    isCreating: createCommentMutation.isPending,
    editComment: editCommentMutation.mutate,
    isEditing: editCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeleting: deleteCommentMutation.isPending,
  };
};
