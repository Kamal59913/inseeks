"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import reactionService from "@/lib/api/services/reactionService";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { ReactionPicker, ReactionType } from "./ReactionPicker";
import { useGetReactionTypes } from "@/hooks/postServices/useGetReactionTypes";
import { useCommentReactionTypes } from "@/hooks/commentServices/useCommentReactionTypes";
import { cn } from "@repo/ui/index";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import { applyReactionLogic, updateCommentInTree } from "@/lib/utilities/cacheHelpers";

interface ReactionButtonProps {
  targetId: number | string;
  type: "post" | "comment";
  postId?: number | string; // Required for comments to invalidate queries
  initialUserReactionId?: number | null;
  totalReactions?: number;
  className?: string;
  isReacted?: boolean;
  viewerReactionTypeId?: number | null;
  viewerReactionEmoji?: string | null;
  size?: "sm" | "md";
  variant?: "default" | "short-video" | "side-panel";
  iconClassName?: string;
  activeReactionClassName?: string;
  pickerClassName?: string;
  pickerButtonClassName?: string;
}

export const ReactionButton = ({
  targetId,
  type,
  postId,
  initialUserReactionId = null,
  totalReactions = 0,
  className = "",
  viewerReactionTypeId = null,
  size = "md",
  variant = "default",
  iconClassName = "",
  activeReactionClassName = "",
  pickerClassName = "",
  pickerButtonClassName = "",
}: ReactionButtonProps) => {
  const queryClient = useQueryClient();
  const {
    invalidatePost,
    updatePostCache,
    updateCommentCache,
    removePostFromFilteredViews,
  } =
    useAppInvalidation();

  // Pick the right hook for reaction types
  const postReactionTypes = useGetReactionTypes({ enabled: type === "post" });
  const commentReactionTypes = useCommentReactionTypes({
    enabled: type === "comment",
  }) as any;

  const reactionTypes =
    type === "post"
      ? postReactionTypes.data || []
      : commentReactionTypes.data?.data || [];

  const initialTypeId = viewerReactionTypeId || initialUserReactionId;

  const [userReactionId, setUserReactionId] = useState<number | null>(
    initialTypeId
  );
  const [count, setCount] = useState(totalReactions);
  const [showPicker, setShowPicker] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeReaction = reactionTypes.find(
    (r: ReactionType) => r.id === userReactionId
  );

  useEffect(() => {
    setUserReactionId(initialTypeId);
    setCount(totalReactions);
  }, [initialTypeId, totalReactions]);

  const updateAnchorRect = () => {
    if (buttonRef.current) {
      setAnchorRect(buttonRef.current.getBoundingClientRect());
    }
  };

  const reactMutation = useMutation({
    mutationFn: (reactionTypeId: number) =>
      type === "post"
        ? reactionService.addReaction(targetId, reactionTypeId)
        : commentService.reactToComment(targetId, reactionTypeId),
    onMutate: async (reactionTypeId) => {
      const selectedReaction = reactionTypes.find((r: any) => r.id === reactionTypeId);
      if (!selectedReaction) return;

      // Optimistically update the global cache
      if (type === "post") {
        updatePostCache(targetId, (post) =>
          applyReactionLogic(post, reactionTypeId, selectedReaction.emoji, false)
        );
      } else {
        updateCommentCache(postId!, (comments) =>
          updateCommentInTree(comments, targetId, (comment) =>
            applyReactionLogic(comment, reactionTypeId, selectedReaction.emoji, false)
          )
        );
      }
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to react");
      // Rollback only on error
      if (type === "post") {
        invalidatePost(targetId);
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: () =>
      type === "post"
        ? reactionService.removeReaction(targetId)
        : commentService.removeCommentReaction(targetId),
    onMutate: async () => {
      if (!userReactionId) return;
      const currentEmoji = activeReaction?.emoji || "";

      // Optimistically update the global cache
      if (type === "post") {
        updatePostCache(targetId, (post) =>
          applyReactionLogic(post, userReactionId, currentEmoji, true)
        );
        removePostFromFilteredViews(
          "liked",
          (post) => String(post.id) === String(targetId),
        );
      } else {
        updateCommentCache(postId!, (comments) =>
          updateCommentInTree(comments, targetId, (comment) =>
            applyReactionLogic(comment, userReactionId, currentEmoji, true)
          )
        );
      }
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to remove reaction");
      // Rollback
      if (type === "post") {
        invalidatePost(targetId);
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      }
    },
  });

  const handleSelectReaction = (reaction: ReactionType) => {
    setShowPicker(false);
    if (userReactionId === reaction.id) {
      removeMutation.mutate();
    } else {
      reactMutation.mutate(reaction.id);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (userReactionId) {
      removeMutation.mutate();
    } else {
      const likeReaction =
        reactionTypes.find(
          (r: ReactionType) => r.code === "heart" || r.code === "like"
        ) || reactionTypes[0];
      if (likeReaction) {
        reactMutation.mutate(likeReaction.id);
      }
    }
  };

  const handleMouseEnter = () => {
    updateAnchorRect();
    if (pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current);
    pickerTimeoutRef.current = setTimeout(() => {
      setShowPicker(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current);
    pickerTimeoutRef.current = setTimeout(() => {
      setShowPicker(false);
    }, 300);
  };

  const isShortVideo = variant === "short-video";

  return (
    <div
      className={cn("relative flex items-center", isShortVideo && "flex-col")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showPicker && reactionTypes.length > 0 && (
        <ReactionPicker
          reactions={reactionTypes}
          onSelect={handleSelectReaction}
          isReversed={variant === "side-panel"}
          anchorRect={anchorRect}
          className={cn(
            size === "sm" && "scale-90",
            pickerClassName,
          )}
          buttonClassName={pickerButtonClassName}
        />
      )}

      <Button
        ref={buttonRef}
        variant="postAction"
        size="post-icons"
        onClick={handleToggleLike}
        className={cn(
          "transition-colors flex items-center",
          isShortVideo && "text-white group",
          userReactionId && !isShortVideo ? "text-primary" : "",
          className
        )}
      >
        {activeReaction ? (
          <span
            className={cn(
              "animate-in zoom-in duration-200 text-base mr-1",
              activeReactionClassName,
            )}
          >
            {activeReaction.emoji}
          </span>
        ) : (
          <Heart
            className={cn(
              userReactionId ? "fill-primary" : (isShortVideo ? "text-white" : ""),
              isShortVideo && "group-hover:scale-110 transition-transform",
              iconClassName,
            )}
          />
        )}

      </Button>
    </div>
  );
};
