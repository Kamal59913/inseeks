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
  UserMinus,
  UserPlus,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utilities/clipboardUtils";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";
import { useUserActions } from "@/hooks/userServices/useUserActions";

import { cn } from "@repo/ui/index";

interface PostOptionsMenuProps {
  post: any;
  isOwnPost: boolean;
  authorName?: string;
  authorUsername?: string;
  className?: string;
  onNotInterested?: () => void;
  showNotInterestedConfirmation?: boolean;
  onTranslate?: () => void;
  translateLabel?: string;
  isTranslating?: boolean;
}

export const PostOptionsMenu = ({ 
  post, 
  isOwnPost,
  authorName,
  authorUsername,
  className,
  onNotInterested,
  showNotInterestedConfirmation = false,
  onTranslate,
  translateLabel = "Translate",
  isTranslating = false,
}: PostOptionsMenuProps) => {
  const { openModal } = useModalStore();
  const { invalidatePost, removePostFromCache } = useAppInvalidation();
  const { blockUser, followUser, unfollowUser, hideUser, unblockUser } = useUserActions();

  const isFollowing = post?.is_following_author || post?.is_following || post?.isFollowing;

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const postUrl = `${window.location.origin}/posts/${post.id}`;
    copyToClipboard(postUrl, "Post link copied to clipboard!");
  };

  const handleDelete = () => {
    openModal("confirmation", {
      title: "Delete Post",
      description: "Are you sure you want to delete this post? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        const response: any = await postService.deletePost(post.id);
        if (response?.status === true || response?.status === 200) {
          ToastService.success("Post deleted successfully");
          invalidatePost(); // Invalidate lists
        } else {
          ToastService.error(response?.message || "Failed to delete post");
        }
      },
    });
  };

  const handleEdit = () => {
    // Open edit modal - assuming 'create-new' handles edit mode or we'll need to check
    openModal("create-new", { 
      editMode: true, 
      postData: post 
    });
  };

  const handleUnsubscribe = async () => {
    const targetUsername = authorUsername || post?.author_username || post?.author?.username;
    if (!targetUsername) return;
    unfollowUser(targetUsername);
  };

  const handleSubscribe = async () => {
    const targetUsername = authorUsername || post?.author_username || post?.author?.username;
    if (!targetUsername) return;
    followUser(targetUsername);
  };

  const handleBlock = () => {
    const targetUsername = authorUsername || post?.author_username || post?.author?.username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Block ${authorName || targetUsername}?`,
      description: "Blocked users will not be able to see your posts and you will not see theirs.",
      confirmLabel: "Block",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: () => blockUser(targetUsername),
    });
  };

  const handleHidePost = () => {
    openModal("confirmation", {
      title: "Hide Post?",
      description: "This post will be hidden from your feed. You can unhide it later from your settings.",
      confirmLabel: "Hide",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          // Optimistic UI update: Remove this post from cache
          removePostFromCache(post.id);
          
          const response: any = await postService.hidePost(post.id);
          if (response?.status === true || response?.status === 200) {
            ToastService.success("Post hidden successfully");
          } else {
            throw new Error(response?.message || "Failed to hide post");
          }
        } catch (error: any) {
          ToastService.error(error?.message || "Failed to hide post");
          // Rollback: Invalidate to re-fetch
          invalidatePost();
        }
      },
    });
  };

  const handleUnhidePost = async () => {
    openModal("confirmation", {
      title: "Unhide Post?",
      description: "This post will be visible in your feed again.",
      confirmLabel: "Unhide",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        try {
          const response: any = await postService.unhidePost(post.id);
          if (response?.status === true || response?.status === 200) {
            ToastService.success("Post visible again");
            invalidatePost(); // Re-fetch to see it
          } else {
            throw new Error(response?.message || "Failed to unhide post");
          }
        } catch (error: any) {
          ToastService.error(error?.message || "Failed to unhide post");
        }
      },
    });
  };

  const handleHideUser = () => {
    const targetUsername = authorUsername || post?.author_username || post?.author?.username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Hide posts from ${authorName || targetUsername}?`,
      description: "You will no longer see any posts from this user in your feed. You can manage hidden users in your settings.",
      confirmLabel: "Hide User",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: () => hideUser(targetUsername),
    });
  };

  const handleUnblock = () => {
    const targetUsername = authorUsername || post?.author_username || post?.author?.username;
    if (!targetUsername) return;

    openModal("confirmation", {
      title: `Unblock ${authorName || targetUsername}?`,
      description: "You will be able to see their posts and they will be able to see yours again.",
      confirmLabel: "Unblock",
      cancelLabel: "Cancel",
      onConfirm: () => unblockUser(targetUsername),
    });
  };

  const executeNotInterested = async () => {
    try {
      const response: any = await postService.notInterested(post.id);
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
      description: "You can undo this action from the post card.",
      confirmLabel: "Not Interested",
      cancelLabel: "Cancel",
      variant: "destructive",
      onConfirm: executeNotInterested,
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="postAction"
          className={cn("text-gray-400 hover:text-gray-600", className)}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white border-gray-100 p-1">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              if (isTranslating) return;
              onTranslate?.();
            }}
            className="cursor-pointer text-gray-700 hover:bg-gray-50"
            disabled={isTranslating}
          >
            <Languages className="w-4 h-4 mr-2" />
            <span>{isTranslating ? "Translating..." : translateLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer text-gray-700 hover:bg-gray-50">
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy Link</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-100" />

        <DropdownMenuGroup>
          {isOwnPost ? (
            <>
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer text-gray-700 hover:bg-gray-50">
                <Pencil className="w-4 h-4 mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete} 
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => {}} className="cursor-pointer text-gray-700 hover:bg-gray-50">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Message to User</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotInterested} className="cursor-pointer text-gray-700 hover:bg-gray-50">
                <CircleSlash2 className="w-4 h-4 mr-2" />
                <span>Not Interested</span>
              </DropdownMenuItem>
              {post?.is_hidden ? (
                <DropdownMenuItem 
                  onClick={handleUnhidePost} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  <span>Unhide Post</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={handleHidePost} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  <span>Hide Posts</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleHideUser} className="cursor-pointer text-gray-700 hover:bg-gray-50">
                <UserRoundX className="w-4 h-4 mr-2" />
                <span>Hide User</span>
              </DropdownMenuItem>
              {isFollowing ? (
                <DropdownMenuItem 
                  onClick={handleUnsubscribe} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  <span>Unsubscribe</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={handleSubscribe}
                  className="cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>Subscribe</span>
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuGroup>

        {!isOwnPost && (
          <>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuGroup>
              {post?.is_blocked ? (
                <DropdownMenuItem 
                  onClick={handleUnblock} 
                  className="cursor-pointer text-gray-700 hover:bg-gray-50"
                >
                  <ShieldBan className="w-4 h-4 mr-2" />
                  <span>Unblock</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={handleBlock} 
                  className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
                >
                  <ShieldBan className="w-4 h-4 mr-2" />
                  <span>Block</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => openModal("report-post", { post })} 
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
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
