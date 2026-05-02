import { AxiosResponse } from "axios";
import apiClient from "../clients/apiClient";
import { useGlobalStore } from "@/store/useGlobalStore";
import { handleError } from "@/lib/utilities/handleError";
import { PostResponse } from "@/lib/types/Post";

const postService = {
  createPost: async (payload: {
    text_content: string;
    type: "text" | "photo" | "video";
    feed_id?: number;
    community_id?: number;
    files?: File[];
    gif_urls?: string[];
  }) => {
    useGlobalStore.getState().startButtonLoading("create-post");
    try {
      const formData = new FormData();

      formData.append("text_content", payload.text_content || "");
      formData.append("type", payload.type || "");

      if (payload.feed_id) {
        formData.append("feed_id", payload.feed_id.toString());
      }

      if (payload.community_id) {
        formData.append("community_id", payload.community_id.toString());
      }

      payload.files?.forEach((file) => {
        formData.append("files", file);
      });

      payload.gif_urls?.forEach((gifUrl) => {
        formData.append("gif_url", gifUrl);
      });

      const response = await apiClient.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("create-post");
    }
  },

  uploadPostMedia: async (postId: number, file: File) => {
    useGlobalStore.getState().startButtonLoading("upload-media");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post(
        `/posts/${postId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("upload-media");
    }
  },

  uploadPostGif: async (postId: number, gifUrl: string) => {
    useGlobalStore.getState().startButtonLoading("upload-gif");
    try {
      const params = new URLSearchParams();
      params.append("gif_url", gifUrl);
      const response = await apiClient.post(
        `/posts/${postId}/gif-media`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("upload-gif");
    }
  },

  getPosts: async (
    filter: string = "all",
    limit: number = 20,
    offset: number = 0,
    ownerId?: number | string,
    postType?: string,
    communityId?: number | string,
    feedId?: number | string,
  ) => {
    try {
      const response = await apiClient.get("/posts/", {
        params: {
          filter,
          limit,
          offset,
          owner_id: ownerId,
          post_type: postType,
          community_id: communityId,
          feed_id: feedId,
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  savePost: async (postId: number | string) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/save`, {});
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  unsavePost: async (postId: number | string) => {
    try {
      const response = await apiClient.delete(`/posts/${postId}/save`);
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  repost: async (postId: number | string) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/repost`, {});
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  getPostById: async (
    postId: string | number,
  ): Promise<
    AxiosResponse<PostResponse> | { status: number; data: unknown }
  > => {
    try {
      const response = await apiClient.get<PostResponse>(`/posts/${postId}`);
      return response;
    } catch (error) {
      return handleError(error) as { status: number; data: unknown };
    }
  },

  updatePost: async (
    postId: string | number,
    payload: {
      text_content?: string;
      type?: "text" | "photo" | "video";
      community_id?: number;
      files?: File[];
      gif_urls?: string[];
    },
  ) => {
    useGlobalStore.getState().startButtonLoading("update-post");
    try {
      const formData = new FormData();

      formData.append("text_content", payload.text_content || "");
      formData.append("type", payload.type || "");

      if (payload.community_id) {
        formData.append("community_id", payload.community_id.toString());
      }

      payload.gif_urls?.forEach((gifUrl) => {
        formData.append("gif_url", gifUrl);
      });

      payload.files?.forEach((file) => {
        formData.append("files", file);
      });

      const response = await apiClient.put(`/posts/${postId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("update-post");
    }
  },

  deletePost: async (postId: string | number) => {
    useGlobalStore.getState().startButtonLoading("delete-post");
    try {
      const response = await apiClient.delete(`/posts/${postId}`);
      return response;
    } catch (error) {
      return handleError(error);
    } finally {
      useGlobalStore.getState().stopButtonLoading("delete-post");
    }
  },

  deletePostMedia: async (
    postId: string | number,
    mediaId: string | number,
  ) => {
    try {
      const response = await apiClient.delete(
        `/posts/${postId}/media/${mediaId}`,
      );
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  reportPost: async (postId: number | string, reason: string) => {
    try {
      const params = new URLSearchParams();
      params.append("reason", reason);
      const response = await apiClient.post(`/posts/${postId}/report`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  translatePost: async (postId: number | string, lang: string) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/translate`, {
        params: { lang },
      });
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  getPostReactionsDetail: async (
    postId: number | string,
    limit: number = 20,
    offset: number = 0,
    reactionTypeId?: number | string,
  ) => {
    try {
      const params: any = { limit, offset };
      if (reactionTypeId) params.reaction_type_id = reactionTypeId;

      const response = await apiClient.get(
        `/posts/posts/${postId}/reactions/detail`,
        {
          params,
        },
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  hidePost: async (postId: string | number) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/hide`, {});
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  unhidePost: async (postId: string | number) => {
    try {
      const response = await apiClient.delete(`/posts/${postId}/hide`);
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  notInterested: async (postId: string | number) => {
    try {
      const response = await apiClient.post(
        `/posts/${postId}/not-interested`,
        {},
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },

  undoNotInterested: async (postId: string | number) => {
    try {
      const response = await apiClient.delete(
        `/posts/${postId}/not-interested`,
      );
      return response?.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default postService;
