"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import feedService from "@/lib/api/services/feedService";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { toggleFollowState } from "@/lib/utilities/cacheHelpers";

interface FeedFollowButtonProps {
  feedId: string | number;
  initialIsFollowing?: boolean;
  className?: string;
  feedTitle?: string;
  isConfirmPopup?: boolean;
}

export const FeedFollowButton = ({ 
  feedId, 
  initialIsFollowing = false,
  className = "",
  feedTitle = "this feed",
  isConfirmPopup = false,
}: FeedFollowButtonProps) => {
  const queryClient = useQueryClient();
  const { updateFeedCache } = useAppInvalidation();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { openModal } = useModalStore();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const followMutation = useMutation({
    mutationFn: () => feedService.subscribeToFeed(feedId),
    onMutate: async () => {
      setIsFollowing(true);
      // Optimistically update all feed lists
      updateFeedCache(feedId, true, (f) => toggleFollowState(f, true));
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(false);
      ToastService.error(error?.message || "Failed to subscribe to feed");
      // Rollback
      queryClient.invalidateQueries({ queryKey: ["feed-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["search-feeds"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => feedService.unsubscribeFromFeed(feedId),
    onMutate: async () => {
      setIsFollowing(false);
      // Optimistically update all feed lists
      updateFeedCache(feedId, false, (f) => toggleFollowState(f, false));
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(true);
      ToastService.error(error?.message || "Failed to unsubscribe from feed");
      // Rollback
      queryClient.invalidateQueries({ queryKey: ["feed-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["search-feeds"] });
    },
  });

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (isFollowing) {
      if (isConfirmPopup) {
        openModal("confirmation", {
          title: `Unfollow ${feedTitle}?`,
          description: "Are you sure you want to unfollow this feed?",
          confirmLabel: "Unfollow",
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

  return (
    <Button 
      onClick={handleClick}
      className={`w-full bg-primary hover:bg-primary text-white ${className}`}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
