import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { Comment, CreateCommentPayload } from "@/lib/types/Comment";
import { useAppInvalidation } from "../postServices/useAppInvalidation";
import {
  updateCommentInTree,
  removeCommentFromTree,
} from "@/lib/utilities/cacheHelpers";
import { useAuthStore } from "@/store/useAuthStore";

export const useCommentThread = (
  commentId: number | string,
  postId?: number | string,
) => {
  const queryClient = useQueryClient();
  const { updatePostCache, updateCommentCache, updateCommentThreadCache } =
    useAppInvalidation();

  // Fetch single comment thread
  const {
    data: commentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comment", String(commentId)],
    queryFn: () => commentService.getComment(commentId),
    enabled: !!commentId,
  });

  const comment = (commentData as any)?.data as Comment | undefined;

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentService.createComment(payload),
    onSuccess: (response: any) => {
      let newComment = response?.data?.comment || response?.data;

      if (newComment) {
        const { userData } = useAuthStore.getState();
        // Enrich
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

        // 1. Update Post Cache if postId exists
        if (postId) {
          updatePostCache(postId, (post) => ({
            ...post,
            comments_count: (post.comments_count || 0) + 1,
          }));
          updateCommentCache(postId, (comments) => {
            if (!Array.isArray(comments)) return comments;
            return updateCommentInTree(comments, commentId, (parent) => ({
              ...parent,
              total_replies: (parent.total_replies || 0) + 1,
              replies: [...(parent.replies || []), newComment],
            }));
          });
        }

        // 2. Update Direct Thread Cache
        updateCommentThreadCache(commentId, (parent) => ({
          ...parent,
          total_replies: (parent.total_replies || 0) + 1,
          replies: [...(parent.replies || []), newComment],
        }));
      }

      ToastService.success(response?.message || "Reply posted successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to post reply");
      // Rollback
      queryClient.invalidateQueries({
        queryKey: ["comment", String(commentId)],
      });
      if (postId)
        queryClient.invalidateQueries({
          queryKey: ["comments", String(postId)],
        });
    },
  });

  // Edit comment mutation
  const editCommentMutation = useMutation({
    mutationFn: ({
      commentId: id,
      text,
    }: {
      commentId: number | string;
      text: string;
    }) => commentService.editComment(id, text),
    onMutate: async ({ commentId: id, text }) => {
      const updateFn = (c: any) => ({ ...c, text, edited: true });

      // Update thread
      updateCommentThreadCache(commentId, (c) => {
        if (String(c.id) === String(id)) return updateFn(c);
        return {
          ...c,
          replies: updateCommentInTree(c.replies || [], id, updateFn),
        };
      });

      // Update global post cache
      if (postId) {
        updateCommentCache(postId, (comments) =>
          updateCommentInTree(comments, id, updateFn),
        );
      }
    },
    onSuccess: (response: any) => {
      ToastService.success(response?.message || "Comment updated successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to update comment");
      queryClient.invalidateQueries({
        queryKey: ["comment", String(commentId)],
      });
      if (postId)
        queryClient.invalidateQueries({
          queryKey: ["comments", String(postId)],
        });
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (id: number | string) => commentService.deleteComment(id),
    onMutate: async (id) => {
      // 1. Update Post Count
      if (postId) {
        updatePostCache(postId, (post) => ({
          ...post,
          comments_count: Math.max(0, (post.comments_count || 0) - 1),
        }));
        updateCommentCache(postId, (comments) =>
          removeCommentFromTree(comments, id),
        );
      }

      // 2. Update Thread
      updateCommentThreadCache(commentId, (c) => {
        if (String(c.id) === String(id)) return { ...c, is_deleted: true }; // Or filter out
        return {
          ...c,
          replies: removeCommentFromTree(c.replies || [], id),
          total_replies: (c.replies || []).some(
            (r: any) => String(r.id) === String(id),
          )
            ? Math.max(0, (c.total_replies || 0) - 1)
            : c.total_replies,
        };
      });
    },
    onSuccess: (response: any) => {
      ToastService.success(response?.message || "Comment deleted successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to delete comment");
      queryClient.invalidateQueries({
        queryKey: ["comment", String(commentId)],
      });
      if (postId)
        queryClient.invalidateQueries({
          queryKey: ["comments", String(postId)],
        });
    },
  });

  return {
    comment,
    isLoading,
    error,
    createReply: createReplyMutation.mutate,
    isCreatingReply: createReplyMutation.isPending,
    editComment: editCommentMutation.mutate,
    isEditingComment: editCommentMutation.isPending,
    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,
  };
};
