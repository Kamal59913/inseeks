import apiClient from "../clients/apiClient";
import { handleError } from "@/lib/utilities/handleError";

const reactionService = {
  getReactionTypes: async () => {
    try {
      const response = await apiClient.get("/reactions/types");
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  addReaction: async (postId: number | string, reactionTypeId: number) => {
    try {
      const response = await apiClient.post(
        `/reactions/posts/${postId}/react`,
        {
          reaction_type_id: reactionTypeId,
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  removeReaction: async (postId: number | string) => {
    try {
      const response = await apiClient.delete(
        `/reactions/posts/${postId}/react`,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default reactionService;
