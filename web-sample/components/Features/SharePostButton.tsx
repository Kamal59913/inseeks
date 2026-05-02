"use client";
import React from "react";
import { ShareDropdown } from "./ShareDropdown";
import SvgShare from "../icons/Share";
import { copyToClipboard } from "@/lib/utilities/clipboardUtils";
import { Button, cn } from "@repo/ui/index";

interface SharePostButtonProps {
  postId: string | number;
  className?: string;
  variant?: "default" | "short-video";
}

export const SharePostButton = ({ 
  postId, 
  className = "",
  variant = "default"
}: SharePostButtonProps) => {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Construct the absolute URL for the post
    const postUrl = `${window.location.origin}/posts/${postId}`;
    
    copyToClipboard(
      postUrl,
      "Post link copied to clipboard!"
    );
  };

  const isShortVideo = variant === "short-video";

  return (
    <ShareDropdown
      onCopyLink={handleCopyLink}
      className={cn(
        isShortVideo && "text-white hover:text-white group",
        className
      )}
      trigger={
        <Button
          variant="postAction"
          size="post-icons"
          className={cn(
            isShortVideo && "text-white hover:text-white group",
            className
          )}
        >
          <SvgShare
            className={cn(
              "transition-all duration-200",
              isShortVideo && "group-hover:scale-110",
            )}
            stroke="currentColor"
            strokeWidth={0.4}
          />
        </Button>
      }
    />
  );
};
