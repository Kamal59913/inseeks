import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";
import { ToastService } from "@/lib/utilities/toastService";
import { useAppInvalidation } from "../postServices/useAppInvalidation";

export const useUserActions = () => {
  const queryClient = useQueryClient();
  const {
    removeUserPostsFromCache,
    removeUserCommentsFromCache,
    updateAllPostsCache,
    updateUserCache,
    updateAllUsersCache,
    invalidatePost,
  } = useAppInvalidation();

  const blockMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.blockUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to block user",
        );
      }
      return response;
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      removeUserPostsFromCache(username);
      removeUserCommentsFromCache(username);
      ToastService.success("User blocked successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to block user");
    },
  });

  const unblockMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.unblockUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to unblock user",
        );
      }
      return response;
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      // When unblocking, we refetch to bring back their content
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      ToastService.success("User unblocked successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to unblock user");
    },
  });

  const hideMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.hideUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to mute user",
        );
      }
      return response;
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["hidden-users"] });
      removeUserPostsFromCache(username);
      removeUserCommentsFromCache(username);
      ToastService.success("User hidden successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to mute user");
    },
  });

  const unhideMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.unhideUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to unmute user",
        );
      }
      return response;
    },
    onSuccess: (_, username) => {
      queryClient.invalidateQueries({ queryKey: ["hidden-users"] });
      // When unmuting, we refetch to bring back their content
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      ToastService.success("User unhidden successfully");
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to unmute user");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.unfollowUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to unfollow user",
        );
      }
      return response;
    },
    onMutate: async (username) => {
      updateAllPostsCache(
        (p) => (p.author_username || p.author?.username) === username,
        (p) => ({
          ...p,
          is_following_author: false,
          is_following: false,
          isFollowing: false,
          author_followers_count: Math.max(
            0,
            (p.author_followers_count || 1) - 1,
          ),
        }),
      );

      updateUserCache(username, (user) => ({
        ...user,
        is_following: false,
        followers_count: Math.max(0, (user.followers_count || 1) - 1),
      }));

      if (updateAllUsersCache) {
        updateAllUsersCache(
          (u) => u.username === username,
          (u) => ({
            ...u,
            is_subscribed: false,
            subscribers_count: Math.max(0, (u.subscribers_count || 1) - 1),
            is_following: false,
            followers_count: Math.max(0, (u.followers_count || 1) - 1),
          }),
        );
      }
    },
    onSuccess: (_, username) => {
      ToastService.success(`Unfollowed ${username}`);
    },
    onError: (error: any, username) => {
      ToastService.error(error?.message || "Failed to unfollow user");
      invalidatePost();
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
  });

  const followMutation = useMutation({
    mutationFn: async (username: string) => {
      if (!username || username === "undefined")
        throw new Error("User not found");
      const response: any = await userService.followUser(username);
      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to follow user",
        );
      }
      return response;
    },
    onMutate: async (username) => {
      updateAllPostsCache(
        (p) => (p.author_username || p.author?.username) === username,
        (p) => ({
          ...p,
          is_following_author: true,
          is_following: true,
          isFollowing: true,
          author_followers_count: (p.author_followers_count || 0) + 1,
        }),
      );

      updateUserCache(username, (user) => ({
        ...user,
        is_following: true,
        followers_count: (user.followers_count || 0) + 1,
      }));

      if (updateAllUsersCache) {
        updateAllUsersCache(
          (u) => u.username === username,
          (u) => ({
            ...u,
            is_subscribed: true,
            subscribers_count: (u.subscribers_count || 0) + 1,
            is_following: true,
            followers_count: (u.followers_count || 0) + 1,
          }),
        );
      }
    },
    onSuccess: (_, username) => {
      ToastService.success(`Subscribed to ${username}`);
    },
    onError: (error: any, username) => {
      ToastService.error(error?.message || "Failed to follow user");
      invalidatePost();
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
  });

  return {
    blockUser: blockMutation.mutate,
    isBlocking: blockMutation.isPending,
    unblockUser: unblockMutation.mutate,
    isUnblocking: unblockMutation.isPending,
    hideUser: hideMutation.mutate,
    isHiding: hideMutation.isPending,
    unhideUser: unhideMutation.mutate,
    isUnhiding: unhideMutation.isPending,
    followUser: followMutation.mutate,
    isFollowingUser: followMutation.isPending,
    unfollowUser: unfollowMutation.mutate,
    isUnfollowing: unfollowMutation.isPending,
  };
};
