import React, { useState, useRef, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { ReactionPicker, ReactionType } from "./ReactionPicker";
import { useCommentReactionTypes } from "@/hooks/commentServices/useCommentReactionTypes";

interface CommentReactionButtonProps {
  commentId: number | string;
  postId: number | string;
  initialUserReactionId?: number | null;
  totalReactions?: number;
  className?: string;
  isReacted?: boolean;
  viewerReactionTypeId?: number | null;
  viewerReactionEmoji?: string | null;
}

export const  CommentReactionButton = ({
  commentId,
  postId,
  initialUserReactionId = null,
  totalReactions = 0,
  className = "",
  isReacted = false,
  viewerReactionTypeId = null,
  viewerReactionEmoji = null,
}: CommentReactionButtonProps) => {
  const queryClient = useQueryClient();
  const { data: reactionTypesData = { data: [] } } = useCommentReactionTypes() as any;
  const reactionTypes = reactionTypesData?.data || [];
  
  const initialTypeId = viewerReactionTypeId || initialUserReactionId;
  
  const [userReactionId, setUserReactionId] = useState<number | null>(initialTypeId);
  const [count, setCount] = useState(totalReactions);
  const [showPicker, setShowPicker] = useState(false);
  const pickerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeReaction = reactionTypes.find((r: ReactionType) => r.id === userReactionId);

  useEffect(() => {
    setUserReactionId(initialTypeId);
    setCount(totalReactions);
  }, [initialTypeId, totalReactions]);

  const reactMutation = useMutation({
    mutationFn: (reactionTypeId: number) => 
      commentService.reactToComment(commentId, reactionTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to react");
      setUserReactionId(initialTypeId);
      setCount(totalReactions);
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => commentService.removeCommentReaction(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to remove reaction");
      setUserReactionId(userReactionId);
      setCount(count);
    },
  });

  const handleSelectReaction = (reaction: ReactionType) => {
    setShowPicker(false);
    if (userReactionId === reaction.id) {
      removeMutation.mutate();
      setCount(prev => Math.max(0, prev - 1));
      setUserReactionId(null);
    } else {
      const isNew = userReactionId === null;
      reactMutation.mutate(reaction.id);
      setUserReactionId(reaction.id);
      if (isNew) setCount(prev => prev + 1);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (userReactionId) {
      removeMutation.mutate();
      setUserReactionId(null);
      setCount(prev => Math.max(0, prev - 1));
    } else {
      const likeReaction = reactionTypes.find((r: ReactionType) => r.code === "heart" || r.code === "like") || reactionTypes[0];
      if (likeReaction) {
        reactMutation.mutate(likeReaction.id);
        setUserReactionId(likeReaction.id);
        setCount(prev => prev + 1);
      }
    }
  };

  const handleMouseEnter = () => {
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

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showPicker && reactionTypes.length > 0 && (
        <ReactionPicker 
          reactions={reactionTypes}
          onSelect={handleSelectReaction} 
          className="bottom-full mb-2 left-0"
        />
      )}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleToggleLike}
        className={`text-gray-500 hover:text-primary transition-colors h-7 px-2 ${userReactionId ? "text-primary bg-primary/5" : ""} ${className}`}
      >
        {activeReaction ? (
          <span className="text-base mr-1.5 animate-in zoom-in duration-200">{activeReaction.emoji}</span>
        ) : (
          <Heart className={`w-4 h-4 mr-1.5 ${userReactionId ? "fill-current" : ""}`} />
        )}
        <span className="text-xs font-semibold">{count > 0 ? count.toLocaleString() : "Like"}</span>
      </Button>
    </div>
  );
};
