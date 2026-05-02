import apiClient from "../clients/apiClient";
import { useGlobalStore } from "@/store/useGlobalStore";
import { handleError } from "@/lib/utilities/handleError";
import { queryClient } from "@/lib/utilities/queryClient";

const communityService = {
  getCommunities: async (limit: number = 20, offset: number = 0) => {
    useGlobalStore.getState().startButtonLoading("get-communities");
    try {
      const response = await apiClient.get("/communities", {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("get-communities");
    }
  },

  getFollowedCommunities: async () => {
    try {
      const response = await apiClient.get("/communities/user/follows");
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getCommunityPosts: async (
    communityId: string,
    limit: number = 20,
    offset: number = 0,
  ) => {
    try {
      const response = await apiClient.get(
        `/communities/communities/${communityId}/posts`,
        {
          params: { limit, offset },
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  subscribe: async (communityId: string) => {
    try {
      const response = await apiClient.post(
        `/communities/${communityId}/subscribe`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-followed-communities"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-followed-community-posts"],
        exact: false,
      });

      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unsubscribe: async (communityId: string) => {
    try {
      const response = await apiClient.delete(
        `/communities/${communityId}/subscribe`,
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-followed-communities"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["get-followed-community-posts"],
        exact: false,
      });

      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  isSubscribed: async (communityId: string) => {
    try {
      const response = await apiClient.get(
        `/communities/${communityId}/is-subscribed`,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getRecommendations: async (limit: number = 10, offset: number = 0) => {
    try {
      const response = await apiClient.get(
        `/communities/communities/recommendation`,
        { params: { limit, offset } },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  searchCommunities: async (
    search: string,
    limitAvatarPreview: number = 5,
    signal?: AbortSignal,
  ) => {
    try {
      const response = await apiClient.get(`/communities/`, {
        params: { search, limit_avatar_preview: limitAvatarPreview },
        signal,
      });
      return response?.data;
    } catch (error: any) {
      // Don't treat aborted requests as errors
      if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
        return null;
      }
      return handleError(error);
    }
  },

  getFollowedCommunityPosts: async (
    limit: number = 20,
    offset: number = 0,
    avatarPreviewLimit: number = 6,
    filter: string = "all",
  ) => {
    try {
      const response = await apiClient.get(
        "/communities/followed-community-posts",
        {
          params: {
            limit,
            offset,
            avatar_preview_limit: avatarPreviewLimit,
            filter,
          },
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
  getCommunityById: async (
    id: string | number,
    avatarPreviewLimit: number = 4,
  ) => {
    useGlobalStore.getState().startButtonLoading(`get-community-${id}`);
    try {
      const response = await apiClient.get(`/communities/${id}`, {
        params: { avatar_preview_limit: avatarPreviewLimit },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`get-community-${id}`);
    }
  },
};

export default communityService;
