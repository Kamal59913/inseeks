import apiClient from "../clients/apiClient";
import { useGlobalStore } from "@/store/useGlobalStore";
import { handleError } from "@/lib/utilities/handleError";
import { CreateCommentPayload, GetCommentsParams } from "@/lib/types/Comment";

const commentService = {
  createComment: async (payload: CreateCommentPayload) => {
    useGlobalStore.getState().startButtonLoading("create-comment");
    try {
      const response = await apiClient.post("/comments/", payload);
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("create-comment");
    }
  },

  getComments: async ({
    post_id,
    offset = 0,
    limit = 20,
  }: GetCommentsParams) => {
    try {
      const response = await apiClient.get("/comments/", {
        params: { post_id, offset, limit },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getComment: async (commentId: number | string) => {
    try {
      const response = await apiClient.get(`/comments/${commentId}`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  editComment: async (commentId: number | string, text: string) => {
    useGlobalStore.getState().startButtonLoading(`edit-comment-${commentId}`);
    try {
      const response = await apiClient.put(`/comments/${commentId}`, { text });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`edit-comment-${commentId}`);
    }
  },

  deleteComment: async (commentId: number | string) => {
    useGlobalStore.getState().startButtonLoading(`delete-comment-${commentId}`);
    try {
      const response = await apiClient.delete(`/comments/${commentId}`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore
        .getState()
        .stopButtonLoading(`delete-comment-${commentId}`);
    }
  },

  reactToComment: async (
    commentId: number | string,
    reactionTypeId: number,
  ) => {
    try {
      const response = await apiClient.post(
        `/comments/${commentId}/react`,
        null,
        {
          params: { reaction_type_id: reactionTypeId },
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  removeCommentReaction: async (commentId: number | string) => {
    try {
      const response = await apiClient.delete(`/comments/${commentId}/react`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getCommentReactionTypes: async () => {
    try {
      const response = await apiClient.get("/comments/comment-reaction-types");
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getCommentReactionsDetail: async (
    commentId: number | string,
    limit: number = 20,
    offset: number = 0,
    reactionTypeId?: number | string,
  ) => {
    try {
      const params: any = { limit, offset };
      if (reactionTypeId) params.reaction_type_id = reactionTypeId;

      const response = await apiClient.get(
        `/comments/${commentId}/reactions/detail`,
        { params },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  notInterestedComment: async (commentId: number | string) => {
    try {
      const response = await apiClient.post(
        `/comments/${commentId}/not-interested`,
        {},
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  undoNotInterestedComment: async (commentId: number | string) => {
    try {
      const response = await apiClient.delete(
        `/comments/${commentId}/not-interested`,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  hideComment: async (commentId: number | string) => {
    try {
      const response = await apiClient.post(`/comments/${commentId}/hide`, {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unhideComment: async (commentId: number | string) => {
    try {
      const response = await apiClient.delete(`/comments/${commentId}/hide`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  reportComment: async (commentId: number | string, reason: string) => {
    try {
      const response = await apiClient.post(
        `/comments/${commentId}/report`,
        "",
        {
          params: { reason },
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
  translateComment: async (commentId: number | string, lang: string) => {
    try {
      const response = await apiClient.get(`/comments/${commentId}/translate`, {
        params: { lang },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default commentService;
