"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import communityService from "@/lib/api/services/communityService";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { toggleFollowState } from "@/lib/utilities/cacheHelpers";

interface FollowButtonProps {
  communityId: string | number;
  initialIsFollowing?: boolean;
  className?: string;
  communityName?: string;
}

export const FollowButton = ({ 
  communityId, 
  initialIsFollowing = false,
  className = "",
  communityName = "this community"
}: FollowButtonProps) => {
  const queryClient = useQueryClient();
  const { updateCommunityCache } = useAppInvalidation();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const { openModal } = useModalStore();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const followMutation = useMutation({
    mutationFn: () => communityService.subscribe(String(communityId)),
    onMutate: async () => {
      setIsFollowing(true);
      // Optimistically update all community lists (isNowFollowing = true)
      updateCommunityCache(communityId, true, (c) => toggleFollowState(c, true));
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(false);
      ToastService.error(error?.message || "Failed to follow");
      // Rollback
      queryClient.invalidateQueries({ queryKey: ["get-communities"] });
      queryClient.invalidateQueries({ queryKey: ["get-followed-communities"] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => communityService.unsubscribe(String(communityId)),
    onMutate: async () => {
      setIsFollowing(false);
      // Optimistically update all community lists (isNowFollowing = false)
      updateCommunityCache(communityId, false, (c) => toggleFollowState(c, false));
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsFollowing(true);
      ToastService.error(error?.message || "Failed to unfollow");
      // Rollback
      queryClient.invalidateQueries({ queryKey: ["get-communities"] });
      queryClient.invalidateQueries({ queryKey: ["get-followed-communities"] });
    },
  });

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (isFollowing) {
      openModal("confirmation", {
        title: `Unfollow ${communityName}?`,
        description:
          "Are you sure you want to unfollow this community? You won't see its posts in your feed anymore.",
        confirmLabel: "Unfollow",
        variant: "destructive",
        onConfirm: async () => {
          await unfollowMutation.mutateAsync();
        },
      });
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
