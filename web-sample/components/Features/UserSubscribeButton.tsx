"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { toggleFollowLogic } from "@/lib/utilities/cacheHelpers";

interface UserSubscribeButtonProps {
  username: string;
  displayName?: string;
  initialIsFollowing?: boolean;
  className?: string;
  variant?: "default" | "overlay";
  isConfirmPopup?: boolean;
}

export const UserSubscribeButton = ({
  username,
  displayName,
  initialIsFollowing = false,
  className = "",
  variant = "default",
  isConfirmPopup = false,
}: UserSubscribeButtonProps) => {
  const queryClient = useQueryClient();
  const {
    updateAllPostsCache,
    updateUserCache,
    updateAllUsersCache,
    invalidatePost,
    removePostFromFilteredViews,
  } = useAppInvalidation();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  // Sync state with props
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const { openModal } = useModalStore();

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(username),
    onMutate: async () => {
      setIsFollowing(true);

      // 1. Update all posts in all lists by this author
      updateAllPostsCache(
        (p) => (p.author_username || p.author?.username) === username,
        (p) => toggleFollowLogic(p, true)
      );

      // 2. Update specific user profile cache if it exists
      updateUserCache(username, (user) => ({
        ...user,
        is_following: true,
        followers_count: (user.followers_count || 0) + 1
      }));

      // 3. Update all users in search lists
      if (updateAllUsersCache) {
        updateAllUsersCache(
          (u) => u.username === username,
          (u) => ({
            ...u,
            is_subscribed: true,
            subscribers_count: (u.subscribers_count || 0) + 1,
            is_following: true,
            followers_count: (u.followers_count || 0) + 1,
          })
        );
      }
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(false);
      ToastService.error(error?.message || "Failed to follow user");
      // Rollback
      invalidatePost();
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(username),
    onMutate: async () => {
      setIsFollowing(false);

      // 1. Update all posts in all lists by this author
      updateAllPostsCache(
        (p) => (p.author_username || p.author?.username) === username,
        (p) => toggleFollowLogic(p, false)
      );
      removePostFromFilteredViews(
        "subscribed",
        (p) => (p.author_username || p.author?.username) === username,
      );

      // 2. Update specific user profile cache if it exists
      updateUserCache(username, (user) => ({
        ...user,
        is_following: false,
        followers_count: Math.max(0, (user.followers_count || 1) - 1)
      }));

      // 3. Update all users in search lists
      if (updateAllUsersCache) {
        updateAllUsersCache(
          (u) => u.username === username,
          (u) => ({
            ...u,
            is_subscribed: false,
            subscribers_count: Math.max(0, (u.subscribers_count || 1) - 1),
            is_following: false,
            followers_count: Math.max(0, (u.followers_count || 1) - 1),
          })
        );
      }
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(true);
      ToastService.error(error?.message || "Failed to unfollow user");
      // Rollback
      invalidatePost();
      queryClient.invalidateQueries({ queryKey: ["user", username] });
    },
  });

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFollowing) {
      if (isConfirmPopup) {
        openModal("confirmation", {
          title: `Unsubscribe from ${displayName || username}?`,
          description: `Are you sure you want to unsubscribe from @${username}?`,
          confirmLabel: "Unsubscribe",
          variant: "destructive",
          onConfirm: async () => {
            await unfollowMutation.mutateAsync();
          },
        });
      } else {
        unfollowMutation.mutate();
      }
    } else {
      followMutation.mutate();
    }
  };

  const isOverlay = variant === "overlay";

  const buttonStyles = isOverlay
    ? `text-sm font-medium border border-white/30 px-3 py-1 rounded-lg backdrop-blur-sm transition-colors ${isFollowing
      ? "bg-white/20 text-white border-white/50"
      : "text-white/90 bg-transparent hover:bg-white/10"
    }`
    : `bg-primary hover:bg-primary text-white rounded-full px-6 ${className}`;

  const buttonLabel = isFollowing
    ? "Subscribed"
    : "Subscribe";

  return (
    <Button
      onClick={handleClick}
      className={`${buttonStyles} ${isOverlay ? "" : className}`}
    >
      {buttonLabel}
    </Button>
  );
};
