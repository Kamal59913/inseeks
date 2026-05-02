"use client";

import React, { useState, useEffect } from "react";
import { formatTimeAgo } from "@/lib/utilities/timeUtils";
import { useAuthStore } from "@/store/useAuthStore";
import { useComments } from "@/hooks/commentServices/useComments";
import { getTranslationLanguage } from "@/lib/utilities/translationUtils";
import { Comment } from "@/lib/types/Comment";
import SvgArrowPlane from "@/components/icons/ArrowPlane";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Textarea,
  cn,
  GlobalLoader,
  InfiniteLoader,
} from "@repo/ui/index";
import {
  CornerDownRight,
  MessageSquare,
  Loader2,
  Pencil,
  User,
  X,
  ArrowRight
} from "lucide-react";
import { CommentOptionsMenu } from "./CommentOptionsMenu";
import { HiddenContentUndo } from "./HiddenContentUndo";
import { ReactionButton } from "./ReactionButton";
import { ReactionSummary } from "./ReactionSummary";
import { CommentActionButton } from "./CommentActionButton";
import Link from "next/link";
import { ShareCommentButton } from "./ShareCommentButton";
import commentService from "@/lib/api/services/commentService";
import { ToastService } from "@/lib/utilities/toastService";
import { COMMENT_DISPLAY_CONFIG } from "@/lib/config/config";
import { collapseBlankLineRuns } from "@/lib/utilities/textFormatting";
import { LinkifiedText } from "@/components/ui/linkified-text";
import { hasSubmittableCommentText } from "@/lib/utilities/commentText";
import { ComposerLinkPreview } from "@/components/ui/composer-link-preview";
import { COMPOSER_CONFIG } from "@/lib/config/config";

// Maximum depth for visual indentation before redirecting to thread view
const MAX_DEPTH = 3;

interface CommentSectionProps {
  postId: number | string;
  variant?: "default" | "side-panel";
}

export const CommentSection = ({ postId, variant = "default" }: CommentSectionProps) => {
  const {
    comments,
    isLoading,
    createComment,
    editComment,
    deleteComment,
    isCreating,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useComments(postId);
  const { userData } = useAuthStore();
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const canSubmitComment = hasSubmittableCommentText(newCommentText);

  // Goal 2: when returning from thread view, scroll to the comment that had "View thread"
  useEffect(() => {
    const anchorId = sessionStorage.getItem("avom-comment-anchor");
    if (!anchorId || !comments.length) return;
    requestAnimationFrame(() => {
      document.getElementById(`comment-${anchorId}`)?.scrollIntoView({ block: "start", behavior: "instant" });
      sessionStorage.removeItem("avom-comment-anchor");
    });
  }, [comments.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;

    createComment(
      {
        post_id: Number(postId),
        text: newCommentText,
        parent_comment_id: replyingTo?.id,
      },
      {
        onSuccess: () => {
          setNewCommentText("");
          setReplyingTo(null);
        },
      },
    );
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setNewCommentText("");
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    if (!canSubmitComment || isCreating) return;

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  if (isLoading) {
    return <GlobalLoader className="p-8" />;
  }

  // Root level comments are provided by the hierarchical API

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-top-2 duration-300">
      {/* Comment Input */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={userData?.profile_photo_url} />
          <AvatarFallback>
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          {replyingTo && (
            <div className="flex flex-col gap-1 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <CornerDownRight className="w-3 h-3" />
                  Replying to {replyingTo.author_full_name || "User"}
                </span>
                <button
                  onClick={handleCancelReply}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 line-clamp-1 italic">
                "
                <LinkifiedText text={replyingTo.text} />
                "
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative group">
            <Textarea
              placeholder={
                replyingTo
                  ? `Reply to ${replyingTo.author_full_name}...`
                  : "Write a comment..."
              }
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              allowEmptySpaces={true}
              className="resize-none min-h-[80px] bg-white pr-12 text-sm focus:ring-1 focus:ring-primary/20 transition-all shadow-sm group-hover:shadow-md"
            />
            <div className="absolute bottom-2 right-2">
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmitComment || isCreating}
                className="bg-primary text-white hover:bg-primary/90 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-sm disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SvgArrowPlane className="w-5 h-5 stroke-[2.5] p-1" />
                )}
              </Button>
            </div>
          </form>
          {COMPOSER_CONFIG.SHOW_COMMENT_LINK_PREVIEW && (
            <ComposerLinkPreview text={newCommentText} />
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            No comments yet. Be the first to start the conversation!
          </div>
        ) : (
          comments.map((comment: Comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={userData?.id}
              canEdit={userData?.id === comment.user_id}
              onReply={(comment) => {
                setReplyingTo(comment);
                document.querySelector("textarea")?.focus();
              }}
              onEdit={editComment}
              onDelete={deleteComment}
              variant={variant}
              collapseBlankLines={COMMENT_DISPLAY_CONFIG.COLLAPSE_BLANK_LINES_IN_LIST}
              maxBlankLines={COMMENT_DISPLAY_CONFIG.MAX_BLANK_LINES_IN_LIST}
            />
          ))
        )}
      </div>

      <InfiniteLoader
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        isManual={true}
      />
    </div>
  );
};

export interface CommentItemProps {
  comment: Comment;
  postId: number | string;
  currentUserId: number | undefined;
  canEdit: boolean;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: number | string) => void;
  onEdit: (data: { commentId: number | string; text: string }) => void;
  variant?: "default" | "side-panel";
  depth?: number;
  collapseBlankLines?: boolean;
  maxBlankLines?: number;
}

export const CommentItem = ({
  comment,
  postId,
  currentUserId,
  canEdit,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
  variant = "default",
  collapseBlankLines = false,
  maxBlankLines = 0,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplies, setShowReplies] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const canSaveEdit = hasSubmittableCommentText(editText);
  const isEditUnchanged = editText.trim() === comment.text.trim();

  const handleTranslate = React.useCallback(async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedText) {
      setIsTranslated(true);
      return;
    }
    try {
      setIsTranslating(true);
      const response: any = await commentService.translateComment(comment.id, getTranslationLanguage());
      const nextText = response?.data?.translatedText || response?.data?.translated_text || response?.translatedText || response?.translated_text;

      if (!nextText) {
        throw new Error("Translation failed");
      }
      setTranslatedText(nextText);
      setIsTranslated(true);
    } catch (error: any) {
      ToastService.error(error?.message || "Failed to translate comment");
    } finally {
      setIsTranslating(false);
    }
  }, [comment.id, getTranslationLanguage, isTranslated, translatedText]);

  const handleUndoNotInterested = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response: any = await commentService.undoNotInterestedComment(comment.id);
      if (response?.status === true || response?.status === 200) {
        setIsNotInterested(false);
        ToastService.success("Comment restored");
      } else {
        throw new Error(response?.message || "Failed to undo");
      }
    } catch (error: any) {
      ToastService.error(error?.message || "Failed to undo");
    }
  };

  const handleSaveEdit = () => {
    if (!canSaveEdit) {
      return;
    }

    if (isEditUnchanged) {
      setIsEditing(false);
      return;
    }
    onEdit({ commentId: comment.id, text: editText });
    setIsEditing(false);
  };

  const replies = comment.replies || [];
  const commentText = isTranslated && translatedText ? translatedText : comment.text;
  const displayedCommentText = collapseBlankLines
    ? collapseBlankLineRuns(commentText, maxBlankLines)
    : commentText;

  // Determine if we should show the "View thread" link instead of nesting
  const shouldShowThreadLink = depth >= MAX_DEPTH && replies.length > 0;

  if (isNotInterested) {
    return (
      <HiddenContentUndo
        message="Comment hidden."
        onUndo={handleUndoNotInterested}
        className={cn(depth > 0 && "mt-3")}
      />
    );
  }

  return (
    <div id={`comment-${comment.id}`} className={cn("flex flex-col gap-2", depth > 0 && "mt-3")}>
      <div className="flex gap-3 group">
        <Avatar className="w-8 h-8 shrink-0 border border-gray-100">
          <AvatarImage
            src={comment.author_profile_image || undefined}
            alt={comment.author_full_name}
          />
          <AvatarFallback className="bg-gray-100 text-gray-400 text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                allowEmptySpaces={true}
                className="resize-none min-h-[60px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-none transition-colors focus-visible:border-gray-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-gray-200/80"
                autoFocus
              />
              {COMPOSER_CONFIG.SHOW_COMMENT_LINK_PREVIEW && (
                <ComposerLinkPreview text={editText} />
              )}
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                  className="h-7 text-xs hover:bg-gray-100 text-gray-500"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!canSaveEdit || isEditUnchanged}
                  className="h-7 text-xs bg-primary hover:bg-primary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm relative group-hover:border-gray-200 group-hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-3.5">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.author_full_name || "User"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                    {comment.edited && (
                      <span className="text-[10px] text-gray-400 italic whitespace-nowrap flex items-center gap-0.5">
                        <Pencil className="w-2 h-2" /> edited
                      </span>
                    )}
                  </div>

                  <CommentOptionsMenu
                    comment={comment}
                    isOwnComment={canEdit}
                    onEdit={() => setIsEditing(true)}
                    onDelete={() => onDelete(comment.id)}
                    onNotInterested={() => setIsNotInterested(true)}
                    onTranslate={handleTranslate}
                    isTranslated={isTranslated}
                    translateLabel={isTranslated ? "See Original" : "Translate"}
                    isTranslating={isTranslating}
                  />
                </div>
                <LinkifiedText
                  as="p"
                  text={displayedCommentText}
                  className="text-sm text-gray-700 break-words leading-relaxed whitespace-pre-wrap"
                />
                {isTranslated && translatedText && (
                  <button
                    type="button"
                    className="mt-1 text-[10px] font-medium text-primary hover:underline"
                    onClick={() => setIsTranslated(false)}
                  >
                    See original
                  </button>
                )}

                <ReactionSummary
                  commentId={comment.id}
                  total={comment.reactions_total}
                  topReactions={comment.top_reactions}
                  size="sm"
                  className="mt-2"
                />
                <div className="flex items-center gap-2 border-gray-50 pt-2">
                  <ReactionButton
                    targetId={comment.id}
                    type="comment"
                    postId={comment.post_id}
                    totalReactions={comment.reactions_total}
                    isReacted={comment.is_reacted}
                    viewerReactionTypeId={comment.viewer_reaction_type_id}
                    viewerReactionEmoji={comment.viewer_reaction_emoji}
                    size="sm"
                    variant={variant === "side-panel" ? "side-panel" : "default"}
                    className="hover:bg-gray-100 rounded-full"
                  />

                  <CommentActionButton
                    count={comment.total_replies || 0}
                    onClick={() => onReply(comment)}
                    size="sm"
                  />

                  <ShareCommentButton
                    commentId={comment.id}
                    postId={comment.post_id}
                    className="ml-auto"
                  />
                </div>
              </div>

              {comment.total_replies > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 mt-2 ml-2"
                >
                  <MessageSquare className="w-3 h-3" />
                  {showReplies ? "Hide" : `View`} {comment.total_replies}{" "}
                  {comment.total_replies === 1 ? "reply" : "replies"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {showReplies && replies.length > 0 && (
        <div className="pl-4 ml-4 border-l-2 border-gray-100 space-y-3 animate-in slide-in-from-left-2 fade-in duration-300">
          {shouldShowThreadLink ? (
            <Link
              href={`/posts/${comment.post_id}/thread/${comment.id}`}
              className="group flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors p-2 rounded-md hover:bg-primary/5 w-fit"
              onClick={() => {
                sessionStorage.setItem("avom-comment-anchor", String(comment.id));
                sessionStorage.setItem("avom-clicked-post", String(comment.post_id));
                sessionStorage.setItem("avom-scroll-intent", "true");
                sessionStorage.setItem(
                  "avom-scroll-origin-path",
                  window.location.pathname,
                );
              }}
            >
              <span>View thread</span>
              <span className="text-muted-foreground group-hover:text-primary/60 transition-colors">
                ({replies.length} {replies.length === 1 ? "reply" : "replies"})
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                currentUserId={currentUserId}
                canEdit={currentUserId === reply.user_id}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                depth={depth + 1}
                variant={variant}
                collapseBlankLines={collapseBlankLines}
                maxBlankLines={maxBlankLines}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
