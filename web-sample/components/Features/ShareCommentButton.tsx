"use client";
import React from "react";
import { ShareDropdown } from "./ShareDropdown";
import SvgShare from "../icons/Share";
import { Button } from "@repo/ui/index";
import { copyToClipboard } from "@/lib/utilities/clipboardUtils";
interface ShareCommentButtonProps {
  commentId: string | number;
  postId: string | number;
  className?: string;
  variant?: "default" | "short-video";
}

export const ShareCommentButton = ({ 
  commentId, 
  postId,
  className = "",
  variant = "default"
}: ShareCommentButtonProps) => {
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Construct the absolute URL for the post
    const postUrl = `${window.location.origin}/posts/${postId}/thread/${commentId}`;
    
    copyToClipboard(
      postUrl,
      "Post link copied to clipboard!"
    );
  };

  const isShortVideo = variant === "short-video";

  return (
    <ShareDropdown
      onCopyLink={handleCopyLink}
      className={
        isShortVideo
          ? "text-white hover:text-white hover:bg-transparent h-auto w-auto p-0 group"
          : `text-gray-600 hover:text-primary px-2 h-9 ${className}`
      }
      trigger={
        <Button
          variant="ghost"
          size={isShortVideo ? "icon" : "sm"}
          className={
            isShortVideo
              ? "text-white hover:text-white hover:bg-transparent h-auto w-auto p-0 group"
              : `text-gray-600 hover:text-primary px-2 h-9 ${className}`
          }
        >
          <SvgShare
            className={isShortVideo ? "w-4 h-4 transition-all duration-200 group-hover:scale-110 -rotate-12" : "w-5 h-5"}
            stroke="currentColor"
            strokeWidth={0.4}
          />
        </Button>
      }
    />
  );
};
