"use client";
import React from "react";
import { Button } from "@repo/ui/index";
import { useMutation } from "@tanstack/react-query";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";
import { Repeat2 } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";

import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { applyRepostLogic } from "@/lib/utilities/cacheHelpers";
import { cn } from "@repo/ui/index";

interface RepostButtonProps {
  postId: string | number;
  repostCount?: number;
  className?: string;
  variant?: "default" | "short-video";
}

export const RepostButton = ({ 
  postId, 
  repostCount = 0,
  className = "",
  variant = "default"
}: RepostButtonProps) => {
  const { updatePostCache, invalidatePost } = useAppInvalidation();
  const { openModal } = useModalStore();

  const repostMutation = useMutation({
    mutationFn: () => postService.repost(postId),
    onMutate: async () => {
      // Optimistically update the count and state
      updatePostCache(postId, (post) => applyRepostLogic(post));
    },
    onSuccess: (response: any) => {
      ToastService.success(response?.message || "Reposted successfully");
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to repost");
      // Rollback
      invalidatePost(postId);
    },
  });

  const isLoading = repostMutation.isPending;

  const handleRepost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    openModal("confirmation", {
      title: "Repost this post?",
      description: "This post will be shared on your profile for your followers to see.",
      confirmLabel: "Repost",
      onConfirm: async () => {
        await repostMutation.mutateAsync();
      },
    });
  };

  const isShortVideo = variant === "short-video";

  return (
    <Button 
      variant="postAction"
            size="post-icons"

      onClick={handleRepost}
      disabled={isLoading}
      className={cn(
        isShortVideo && "text-white hover:text-white group",
        className
      )}
    >
      <Repeat2 className={cn("mr-1 transition-all duration-200", isShortVideo && "group-hover:scale-110 mr-0")} />
      <span className={cn("font-semibold text-base", isShortVideo && "text-xs leading-none drop-shadow-md")}>
        {repostCount}
      </span>
    </Button>
  );
};
