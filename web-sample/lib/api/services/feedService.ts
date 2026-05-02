import apiClient from "../clients/apiClient";
import { useGlobalStore } from "@/store/useGlobalStore";
import { handleError } from "@/lib/utilities/handleError";
import { queryClient } from "@/lib/utilities/queryClient";

const callMockFeedRoute = async (
  feedId: number | string,
  method: "PATCH" | "DELETE",
  payload?: Record<string, unknown>,
) => {
  const response = await fetch(`/api/mock/feeds/${feedId}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Failed to ${method === "PATCH" ? "update" : "delete"} feed`);
  }

  return data;
};

const feedService = {
  getDiscoverNewFeeds: async () => {
    useGlobalStore.getState().startButtonLoading("get-feeds");
    try {
      const response = await apiClient.get("/communities");
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("get-feeds");
    }
  },

  getFeedSuggestions: async (
    limit: number = 50,
    filter: string = "all",
    offset: number = 0,
  ) => {
    useGlobalStore.getState().startButtonLoading("get-feed-suggestions");
    try {
      const response = await apiClient.get(`/feed/feeds/suggestion`, {
        params: { limit, filter, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("get-feed-suggestions");
    }
  },

  subscribeToFeed: async (feedId: number | string) => {
    useGlobalStore.getState().startButtonLoading(`subscribe-feed-${feedId}`);
    try {
      const response = await apiClient.post(
        `/feed/feeds/${feedId}/subscribe`,
        {},
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`subscribe-feed-${feedId}`);
    }
  },

  unsubscribeFromFeed: async (feedId: number | string) => {
    useGlobalStore.getState().startButtonLoading(`unsubscribe-feed-${feedId}`);
    try {
      const response = await apiClient.delete(
        `/feed/feeds/${feedId}/subscribe`,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`unsubscribe-feed-${feedId}`);
    }
  },

  createFeed: async (payload: {
    title: string;
    community_id?: number;
    main_post_id?: number;
    description?: string;
    avatar?: File | Blob;
  }) => {
    useGlobalStore.getState().startButtonLoading("create-feed");
    try {
      const formData = new FormData();
      formData.append("title", payload.title || "");
      formData.append("description", payload.description || "");

      if (payload.community_id !== undefined) {
        formData.append("community_id", payload.community_id.toString());
      }

      if (payload.main_post_id !== undefined) {
        formData.append("main_post_id", payload.main_post_id.toString());
      }

      if (payload.avatar) {
        formData.append("avatar", payload.avatar);
      }

      const response = await apiClient.post("/feed/feeds/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ["feed-suggestions"],
        exact: false,
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("create-feed");
    }
  },

  uploadFeedMedia: async (feedId: number, file: File) => {
    useGlobalStore.getState().startButtonLoading("upload-feed-media");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post(
        `/feed/feeds/${feedId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      await queryClient.invalidateQueries({
        queryKey: ["feed-suggestions"],
        exact: false,
      });

      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("upload-feed-media");
    }
  },

  uploadFeedAvatar: async (feedId: number | string, file: File) => {
    useGlobalStore.getState().startButtonLoading("upload-feed-avatar");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post(
        `/feed/feeds/${feedId}/avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("upload-feed-avatar");
    }
  },

  deleteFeedAvatar: async (feedId: number | string) => {
    useGlobalStore.getState().startButtonLoading("delete-feed-avatar");
    try {
      const response = await apiClient.delete(`/feed/feeds/${feedId}/avatar`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("delete-feed-avatar");
    }
  },

  updateFeed: async (
    feedId: number | string,
    payload: {
      title: string;
      description?: string;
      community_id?: number | null;
      avatar_url?: string;
      community?:
        | {
            id: string | number;
            name?: string;
            profile_photo_url?: string;
          }
        | null;
    },
  ) => {
    useGlobalStore.getState().startButtonLoading(`update-feed-${feedId}`);
    try {
      // TODO: Replace this mock route with the real update feed API once available.
      return await callMockFeedRoute(feedId, "PATCH", payload);
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`update-feed-${feedId}`);
    }
  },

  deleteFeed: async (feedId: number | string) => {
    useGlobalStore.getState().startButtonLoading(`delete-feed-${feedId}`);
    try {
      // TODO: Replace this mock route with the real delete feed API once available.
      return await callMockFeedRoute(feedId, "DELETE");
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`delete-feed-${feedId}`);
    }
  },

  searchFeeds: async (
    query: string,
    limit: number = 20,
    offset: number = 0,
  ) => {
    useGlobalStore.getState().startButtonLoading("search-feeds");
    try {
      const response = await apiClient.get("/feed/feeds/search", {
        params: { q: query, limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("search-feeds");
    }
  },
  getCommunityTopFeeds: async (
    communityId: string | number,
    limit: number = 10,
    offset: number = 0,
  ) => {
    useGlobalStore
      .getState()
      .startButtonLoading(`get-community-top-feeds-${communityId}`);
    try {
      const response = await apiClient.get(`/feed/${communityId}/feeds/top`, {
        params: { limit, offset },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore
        .getState()
        .stopButtonLoading(`get-community-top-feeds-${communityId}`);
    }
  },

  getFeedById: async (id: string | number) => {
    useGlobalStore.getState().startButtonLoading(`get-feed-${id}`);
    try {
      const response = await apiClient.get(`/feed/feeds/${id}`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading(`get-feed-${id}`);
    }
  },
};

export default feedService;
