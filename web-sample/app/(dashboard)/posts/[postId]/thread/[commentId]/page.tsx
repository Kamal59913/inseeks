"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronLeft, User, SendHorizontal, CornerDownRight, X, MessageSquare, ArrowLeft } from "lucide-react";
import { Button, Avatar, AvatarImage, AvatarFallback, Textarea, ScrollArea } from "@repo/ui/index";
import { CommentItem } from "@/components/Features/CommentSection";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommentThread } from "@/hooks/commentServices/useCommentThread";
import { Comment } from "@/lib/types/Comment";
import { useScrollRestoration } from "@/hooks/utils/useScrollRestoration";
import { useSmartBack } from "@/hooks/utils/useSmartBack";
import { hasSubmittableCommentText } from "@/lib/utilities/commentText";

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const commentId = params.commentId as string;
  const goBack = useSmartBack(`/posts/${params.postId}`);
  const { userData } = useAuthStore();
  const scrollRef = useScrollRestoration(`thread-scroll-${commentId}`);

  const [newCommentText, setNewCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const canSubmitComment = hasSubmittableCommentText(newCommentText);

  const {
    comment,
    isLoading,
    createReply,
    isCreatingReply,
    editComment,
    deleteComment,
  } = useCommentThread(commentId, postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitComment) return;

    createReply(
      {
        post_id: Number(postId),
        text: newCommentText,
        parent_comment_id: replyingTo?.id ? Number(replyingTo.id) : Number(commentId),
      },
      {
        onSuccess: () => {
          setNewCommentText("");
          setReplyingTo(null);
        },
      }
    );
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setNewCommentText("");
  };

  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing) return;
    if (!canSubmitComment || isCreatingReply) return;

    e.preventDefault();
    e.currentTarget.form?.requestSubmit();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!comment) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="text-gray-500 font-medium">Thread not found</div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to post
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => goBack()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 pl-0 hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to post
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Thread
          </h2>
          <span className="text-xs text-gray-500">
            Viewing single conversation thread
          </span>
        </div>

        <ScrollArea ref={scrollRef} className="h-full">
          <div className="p-4 pb-8 space-y-6">
            {/* Main Input Area (Replying to the thread) */}
            <div className="flex gap-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
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
                      "{replyingTo.text}"
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="relative group">
                  <Textarea
                    placeholder={
                      replyingTo
                        ? `Reply to ${replyingTo.author_full_name}...`
                        : "Reply to this thread..."
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
                      disabled={!canSubmitComment || isCreatingReply}
                      className="bg-primary text-white hover:bg-primary/90 rounded-full w-8 h-8 p-0 flex items-center justify-center shadow-sm disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                    >
                      {isCreatingReply ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <SendHorizontal className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Root Comment of the Thread */}
            {comment && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CommentItem
                  comment={comment}
                  postId={postId}
                  currentUserId={userData?.id}
                  canEdit={userData?.id === comment.user_id}
                  onReply={(commentToReply: Comment) => {
                    setReplyingTo(commentToReply);
                    document.querySelector("textarea")?.focus();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onEdit={(data: { commentId: number | string; text: string }) => editComment(data)}
                  onDelete={(id: number | string) => deleteComment(id)}
                  depth={0}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
