import React from "react";
import { cn } from "@repo/ui/index";
import { useModalStore } from "@/store/useModalStore";

interface ReactionSummaryProps {
  postId?: string | number;
  commentId?: string | number;
  total: number;
  topReactions?: Array<{
    reaction_type_id: number;
    emoji: string;
    count?: number;
  }>;
  className?: string;
  size?: "sm" | "md";
}

export const ReactionSummary = ({
  postId,
  commentId,
  total,
  topReactions = [],
  className,
  size = "md",
}: ReactionSummaryProps) => {
  const { openModal } = useModalStore();
  if (total <= 0) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (!postId && !commentId) return;
    e.preventDefault();
    e.stopPropagation();
    openModal("reactions-detail", { postId, commentId });
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 self-start cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
    >
      <div className="flex -space-x-1">
        {topReactions.map((r: any, idx) => (
          <span
            key={r.reaction_type_id || idx}
            className={cn(
              "filter drop-shadow-sm text-base"
            )}
          >
            {r.emoji}
          </span>
        ))}
      </div>
      <span
        className={cn(
          "font-semibold text-gray-500 text-base"
        )}
      >
        {total.toLocaleString()}
      </span>
    </div>
  );
};
