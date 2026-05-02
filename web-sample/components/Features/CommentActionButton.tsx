"use client";
import React from "react";
import { Button } from "@repo/ui/index";
import { MessageCircle } from "lucide-react";
import { cn } from "@repo/ui/index";

interface CommentActionButtonProps {
  count: number;
  onClick: (e: React.MouseEvent) => void;
  isActive?: boolean;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}

export const CommentActionButton = ({
  count,
  onClick,
  isActive = false,
  size = "md",
  className = "",
  label,
}: CommentActionButtonProps) => {
  return (
    <Button
      variant="postAction"
      size="post-icons"
      className={cn(
        "transition-colors flex items-center group/comment [&_svg]:size-[18px]!",
        isActive ? "text-primary" : "",
        className
      )}
      onClick={onClick}
    >
      <MessageCircle
        className={cn(
          "mr-1.5 transition-colors ",
          isActive ? "fill-current text-primary" : "group-hover/comment:text-primary"
        )}
      />
      <span
        className={cn(
          "font-semibold text-base"
        )}
      >
        {label ? `${label} ` : ""}
        {count.toLocaleString()}
      </span>
    </Button>
  );
};
