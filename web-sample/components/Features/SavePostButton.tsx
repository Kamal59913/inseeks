"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { useMutation } from "@tanstack/react-query";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";
import { Bookmark } from "lucide-react";

import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { toggleSaveLogic } from "@/lib/utilities/cacheHelpers";
import { cn } from "@repo/ui/index";

interface SavePostButtonProps {
  postId: string | number;
  initialIsSaved?: boolean;
  className?: string;
  variant?: "default" | "short-video";
}

export const SavePostButton = ({
  postId,
  initialIsSaved = false,
  className = "",
  variant = "default"
}: SavePostButtonProps) => {
  const { updatePostCache, invalidatePost, removePostFromFilteredViews } =
    useAppInvalidation();
  const [isSaved, setIsSaved] = useState(initialIsSaved);

  // Sync state with props when data changes
  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const saveMutation = useMutation({
    mutationFn: () => postService.savePost(postId),
    onMutate: async () => {
      setIsSaved(true);
      // Optimistically update cache
      updatePostCache(postId, (post) => toggleSaveLogic(post, true));
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsSaved(false);
      ToastService.error(error?.message || "Failed to save post");
      // Rollback
      invalidatePost(postId);
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => postService.unsavePost(postId),
    onMutate: async () => {
      setIsSaved(false);
      // Optimistically update cache
      updatePostCache(postId, (post) => toggleSaveLogic(post, false));
      removePostFromFilteredViews(
        "saved",
        (post) => String(post.id) === String(postId),
      );
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      setIsSaved(true);
      ToastService.error(error?.message || "Failed to unsave post");
      // Rollback
      invalidatePost(postId);
    },
  });

  const isLoading = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      unsaveMutation.mutate();
    } else {
      saveMutation.mutate();
    }
  };

  const isShortVideo = variant === "short-video";

  return (
    <Button
      variant="postAction"
      size="post-icons"

      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        isShortVideo && "text-white",
        !isShortVideo && isSaved ? "text-primary fill-current" : "",
        className
      )}
    >
      <Bookmark
        className={cn(
          isSaved ? "fill-current" : "",
          isShortVideo && isSaved ? "fill-white text-white" : "",
          isShortVideo && !isSaved ? "text-white" : ""
        )}
      />
    </Button>
  );
};
