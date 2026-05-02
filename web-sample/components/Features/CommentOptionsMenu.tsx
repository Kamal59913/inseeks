"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/index";
import {
  MoreHorizontal,
  Languages,
  Copy,
  MessageSquare,
  CircleSlash2,
  EyeOff,
  UserRoundX,
  ShieldBan,
  MessageSquareWarning,
  Pencil,
  Trash2,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utilities/clipboardUtils";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { cn } from "@repo/ui/index";
import { Comment } from "@/lib/types/Comment";
import { useUserActions } from "@/hooks/userServices/useUserActions";

interface CommentOptionsMenuProps {
  comment: Comment;
  isOwnComment: boolean;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
  showNotInterestedConfirmation?: boolean;
  onNotInterested?: () => void;
  onTranslate?: () => void;
  isTranslated?: boolean;
  translateLabel?: string;
  isTranslating?: boolean;
}

export const CommentOptionsMenu = ({
  comment,
  isOwnComment,
  onEdit,
  onDelete,
  className,
  showNotInterestedConfirmation = false,
  onNotInterested,
  onTranslate,
  isTranslated,
  translateLabel,
  isTranslating,
}: CommentOptionsMenuProps) => {
  const { openModal } = useModalStore();
  const { 
    invalidatePost, 
    removeCommentFromCache, 
  } = useAppInvalidation();
  const { hideUser, blockUser, unblockUser } = useUserActions();

  // Determine if there are properties for block/hide states, typical of posts
  // Depending on how backend serves these, they might not exist on comment yet.
  const isBlocked = (comment as any)?.is_blocked || (comment as any)?.author?.is_blocked;
  const isHidden = (comment as any)?.is_hidden;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const threadUrl = `${window.location.origin}/posts/${comment.post_id}/thread/${comment.id}`;
    copyToClipboard(threadUrl, "Comment link copied to clipboard!");
  };

  const handleHideComment = () => {
    openModal("confirmation", {
      title: "Hide Comment?",
      description: "This comment will be hidden from your view.",
      confirmLabel: "Hide",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          // Optimistic UI update
          removeCommentFromCache(comment.id, comment.post_id);
          
          const response: any = await commentService.hideComment(comment.id);
          if (response?.status === true || response?.status === 200) {
            ToastService.success("Comment hidden successfully");
          } else {
            throw new Error(response?.message || "Failed to hide comment");
          }
        } catch (error: any) {
          ToastService.error(error?.message || "Failed to hide comment");
          invalidatePost(comment.post_id);
        }
      },
    });
  };

  const handleUnhideComment = async () => {
    openModal("confirmation", {
      title: "Unhide Comment?",
      description: "This comment will be visible again.",
      confirmLabel: "Unhide",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        try {
          const response: any = await commentService.unhideComment(comment.id);
          if (response?.status === true || response?.status === 200) {
            ToastService.success("Comment visible again");
            invalidatePost(comment.post_id); 
          } else {
            throw new Error(response?.message || "Failed to unhide comment");
          }
        } catch (error: any) {
          ToastService.error(error?.message || "Failed to unhide comment");
        }
      },
    });
  };

  const executeNotInterested = async () => {
    try {
      const response: any = await commentService.notInterestedComment(comment.id);
      if (response?.status === true || response?.status === 200) {
        ToastService.success("Marked as not interested");
        if (onNotInterested) {
          onNotInterested();
        }
      } else {
        throw new Error(response?.message || "Failed to mark as not interested");
      }
    } catch (error: any) {
      ToastService.error(error?.message || "Failed to mark as not interested");
    }
  };

  const handleNotInterested = () => {
    if (!showNotInterestedConfirmation) {
      executeNotInterested();
      return;
    }

    openModal("confirmation", {
      title: "Not Interested?",
      description: "You can undo this action from the comment list.",
      confirmLabel: "Not Interested",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: executeNotInterested,
    });
  };

  const handleHideUser = () => {
    const targetUsername = comment.author_username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Hide content from ${comment.author_full_name || targetUsername}?`,
      description: "You will no longer see content from this user. You can manage this in your settings.",
      confirmLabel: "Hide User",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: () => hideUser(targetUsername),
    });
  };

  const handleBlock = () => {
    const targetUsername = comment.author_username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Block ${comment.author_full_name || targetUsername}?`,
      description: "Blocked users cannot see your content and you won't see theirs.",
      confirmLabel: "Block",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: () => blockUser(targetUsername),
    });
  };

  const handleUnblock = () => {
    const targetUsername = comment.author_username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Unblock ${comment.author_full_name || targetUsername}?`,
      description: "You will be able to see their content again.",
      confirmLabel: "Unblock",
      cancelLabel: "Cancel",
      onConfirm: () => unblockUser(targetUsername),
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors",
            className
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-100 p-1">
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onClick={onTranslate} 
            className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
            disabled={isTranslating}
          >
            <Languages className={cn("w-4 h-4 mr-2", isTranslating && "animate-pulse")} />
            <span>{isTranslating ? "Translating..." : translateLabel || "Translate"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm">
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuGroup>
          {isOwnComment ? (
            <>
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm">
                <Pencil className="w-4 h-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 text-sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Message to User</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm">
                <CircleSlash2 className="w-4 h-4 mr-2" />
                <span>Not Interested</span>
              </DropdownMenuItem>
              {isHidden ? (
                <DropdownMenuItem 
                  onClick={handleUnhideComment} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  <span>Unhide Comment</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={handleHideComment} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  <span>Hide Comment</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleHideUser} className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm">
                <UserRoundX className="w-4 h-4 mr-2" />
                <span>Hide User</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>

        {!isOwnComment && (
          <>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuGroup>
              {isBlocked ? (
                <DropdownMenuItem 
                  onClick={handleUnblock} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <ShieldBan className="w-4 h-4 mr-2" />
                  <span>Unblock</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={handleBlock} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 text-sm"
                >
                  <ShieldBan className="w-4 h-4 mr-2" />
                  <span>Block</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => openModal("report-comment", { comment })}
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 text-sm"
              >
                <MessageSquareWarning className="w-4 h-4 mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
