import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppForm } from "../../hooks/useAppForm";
import { commentSchema } from "../../validations/schemas/post.schema";
import { preprocessTrimmedFormData } from "../../utils/formValidation";
import { useCommentsQuery } from "../../hooks/useCommentsQuery";
import { queryKeys } from "../../hooks/queryKeys";
import { CommentItem } from "../../services/comment.service";
import { getDiscussionSocket } from "../../services/discussionSocket";
import VoteControls from "../Common/VoteControls";
import PostAttachmentGallery from "../Common/PostAttachmentGallery";
import ImageWithFallback from "../Common/ImageWithFallback";

interface CurrentUser {
  username?: string;
  avatar?: string;
}

interface RightSideCommentBarProps {
  currentPostId: string;
  postType?: string;
  currentUser?: CurrentUser;
  summaryText?: string;
}

interface DiscussionParticipant {
  username?: string;
  avatar?: string;
}

const ACTIVITY_TIMEOUT_MS = 3200;
const TYPING_TIMEOUT_MS = 1600;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

const updatePostInCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  updater: (post: any) => any
) => {
  queryClient.setQueriesData({ queryKey: ["posts"] }, (data: any) => {
    if (!data) return data;

    if (data.pages && Array.isArray(data.pages)) {
      return {
        ...data,
        pages: data.pages.map((page: any) => ({
          ...page,
          items: Array.isArray(page.items)
            ? page.items.map((post: any) =>
                post?._id === postId ? updater(post) : post
              )
            : page.items,
        })),
      };
    }

    if (Array.isArray(data)) {
      return data.map((post: any) =>
        post?._id === postId ? updater(post) : post
      );
    }

    return data;
  });
};

export default function RightSideCommentBar({
  currentPostId,
  postType,
  currentUser,
  summaryText,
}: RightSideCommentBarProps) {
  const fallback =
    "https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png";
  const queryClient = useQueryClient();
  const [participants, setParticipants] = useState<DiscussionParticipant[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [activityMessage, setActivityMessage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const remoteTypingTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const { comments, createComment, voteComment } =
    useCommentsQuery(currentPostId);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useAppForm({
    schema: commentSchema,
    defaultValues: { comment: "" },
  });

  const currentComment = watch("comment") || "";
  const currentUsername = currentUser?.username || "Anonymous";
  const currentAvatar = currentUser?.avatar;

  const selectedFilePreviews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        mimeType: file.type,
        originalName: file.name,
        bytes: file.size,
        resourceType: file.type?.split("/")[0],
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      selectedFilePreviews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [selectedFilePreviews]);

  useEffect(() => {
    if (currentPostId && postType) {
      import("../../services/post.service").then(({ postService }) => {
        postService.recordView(currentPostId, postType).then((res) => {
          if (res.data?.data?.views !== undefined) {
            updatePostInCache(queryClient, currentPostId, (post) => ({
              ...post,
              views: res.data.data.views,
            }));
          }
        }).catch(console.error);
      });
    }
  }, [currentPostId, postType, queryClient]);

  const showActivityMessage = (message: string) => {
    setActivityMessage(message);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(
      () => setActivityMessage(null),
      ACTIVITY_TIMEOUT_MS,
    );
  };

  useEffect(() => {
    if (!currentPostId) return;

    const socket = getDiscussionSocket();
    const user = {
      username: currentUsername,
      avatar: currentAvatar,
    };

    const handlePresence = (payload: {
      postId: string;
      participants?: DiscussionParticipant[];
    }) => {
      if (payload.postId !== currentPostId) return;
      setParticipants(payload.participants || []);
    };

    const handleUserJoined = (payload: {
      postId: string;
      user?: DiscussionParticipant;
    }) => {
      if (payload.postId !== currentPostId || !payload.user?.username) return;
      if (payload.user.username === currentUsername) return;
      showActivityMessage(`${payload.user.username} joined the discussion`);
    };

    const handleUserLeft = (payload: {
      postId: string;
      user?: DiscussionParticipant;
    }) => {
      if (payload.postId !== currentPostId || !payload.user?.username) return;
      if (payload.user.username === currentUsername) return;
      showActivityMessage(`${payload.user.username} went offline`);
    };

    const handleTyping = (payload: {
      postId: string;
      user?: DiscussionParticipant;
      isTyping?: boolean;
    }) => {
      if (payload.postId !== currentPostId || !payload.user?.username) return;
      if (payload.user.username === currentUsername) return;

      const username = payload.user.username;
      const existingTimeout = remoteTypingTimeoutsRef.current[username];
      if (existingTimeout) clearTimeout(existingTimeout);

      if (payload.isTyping) {
        setTypingUsers((previous) =>
          previous.includes(username) ? previous : [...previous, username],
        );
        remoteTypingTimeoutsRef.current[username] = setTimeout(() => {
          setTypingUsers((previous) =>
            previous.filter((item) => item !== username),
          );
          delete remoteTypingTimeoutsRef.current[username];
        }, TYPING_TIMEOUT_MS);
      } else {
        setTypingUsers((previous) =>
          previous.filter((item) => item !== username),
        );
        delete remoteTypingTimeoutsRef.current[username];
      }
    };

    const handleNewMessage = (payload: {
      postId: string;
      comment?: CommentItem;
    }) => {
      if (payload.postId !== currentPostId || !payload.comment) return;

      let countDelta = 0;
      queryClient.setQueryData<CommentItem[]>(
        queryKeys.comments(currentPostId),
        (previous = []) => {
          if (
            previous.some((comment) => comment._id === payload.comment?._id)
          ) {
            return previous;
          }

          if (payload.comment?.clientTempId) {
            const hasTemp = previous.some(
              (comment) => comment._id === payload.comment?.clientTempId,
            );
            if (hasTemp) {
              return previous.map((comment) =>
                comment._id === payload.comment?.clientTempId
                  ? payload.comment!
                  : comment,
              );
            }
          }

          countDelta = 1;
          return [...previous, payload.comment];
        },
      );
      if (countDelta > 0) {
        updatePostInCache(queryClient, currentPostId, (post) => ({
          ...post,
          conversationCount: Math.max(0, (post.conversationCount || 0) + 1),
        }));
      }

      if (payload.comment.username) {
        setTypingUsers((previous) =>
          previous.filter((item) => item !== payload.comment?.username),
        );
      }
    };

    const handleVoteUpdated = (payload: {
      postId: string;
      commentId: string;
      summary?: {
        upvotesCount: number;
        downvotesCount: number;
        score: number;
        userVote: "upvote" | "downvote" | null;
      };
      actor?: DiscussionParticipant;
      voteType?: "upvote" | "downvote";
    }) => {
      if (payload.postId !== currentPostId || !payload.summary) return;

      queryClient.setQueryData<CommentItem[]>(
        queryKeys.comments(currentPostId),
        (previous = []) =>
          previous.map((comment) =>
            comment._id === payload.commentId
              ? { ...comment, ...payload.summary }
              : comment,
          ),
      );

      if (
        payload.actor?.username &&
        payload.actor.username !== currentUsername
      ) {
        showActivityMessage(
          `${payload.actor.username} ${payload.voteType === "downvote" ? "downvoted" : "upvoted"} a message`,
        );
      }
    };

    if (!socket.connected) socket.connect();

    socket.on("discussion:presence", handlePresence);
    socket.on("discussion:user-joined", handleUserJoined);
    socket.on("discussion:user-left", handleUserLeft);
    socket.on("discussion:typing", handleTyping);
    socket.on("discussion:new-message", handleNewMessage);
    socket.on("discussion:vote-updated", handleVoteUpdated);

    socket.emit("discussion:join", {
      postId: currentPostId,
      user,
    });

    return () => {
      socket.emit("discussion:typing", {
        postId: currentPostId,
        user,
        isTyping: false,
      });
      socket.emit("discussion:leave");
      socket.off("discussion:presence", handlePresence);
      socket.off("discussion:user-joined", handleUserJoined);
      socket.off("discussion:user-left", handleUserLeft);
      socket.off("discussion:typing", handleTyping);
      socket.off("discussion:new-message", handleNewMessage);
      socket.off("discussion:vote-updated", handleVoteUpdated);
    };
  }, [currentAvatar, currentPostId, currentUsername, queryClient]);

  useEffect(() => {
    if (!currentPostId) return;

    const socket = getDiscussionSocket();
    const user = {
      username: currentUsername,
      avatar: currentAvatar,
    };

    if (localTypingTimeoutRef.current)
      clearTimeout(localTypingTimeoutRef.current);

    if (currentComment.trim()) {
      socket.emit("discussion:typing", {
        postId: currentPostId,
        user,
        isTyping: true,
      });

      localTypingTimeoutRef.current = setTimeout(() => {
        socket.emit("discussion:typing", {
          postId: currentPostId,
          user,
          isTyping: false,
        });
      }, TYPING_TIMEOUT_MS);
    } else {
      socket.emit("discussion:typing", {
        postId: currentPostId,
        user,
        isTyping: false,
      });
    }

    return () => {
      if (localTypingTimeoutRef.current)
        clearTimeout(localTypingTimeoutRef.current);
    };
  }, [currentAvatar, currentComment, currentPostId, currentUsername]);

  useEffect(() => {
    return () => {
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      Object.values(remoteTypingTimeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout),
      );
    };
  }, []);

  const onlineUsernames = useMemo(
    () =>
      new Set(
        participants.map((participant) => participant.username).filter(Boolean),
      ),
    [participants],
  );

  const roomMembers = useMemo(() => {
    const uniqueMembers = new Map<
      string,
      { username: string; avatar?: string; online: boolean }
    >();

    comments.forEach((comment) => {
      if (!comment.username) return;
      uniqueMembers.set(comment.username, {
        username: comment.username,
        avatar: comment.avatar,
        online: onlineUsernames.has(comment.username),
      });
    });

    participants.forEach((participant) => {
      if (!participant.username) return;
      uniqueMembers.set(participant.username, {
        username: participant.username,
        avatar: participant.avatar,
        online: true,
      });
    });

    if (currentUsername) {
      uniqueMembers.set(currentUsername, {
        username: currentUsername,
        avatar: currentAvatar,
        online: onlineUsernames.has(currentUsername),
      });
    }

    return Array.from(uniqueMembers.values());
  }, [comments, currentAvatar, currentUsername, onlineUsernames, participants]);

  const onlineCount = roomMembers.filter((member) => member.online).length;

  const typingLabel = useMemo(() => {
    if (!typingUsers.length) return "";
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing`;
    if (typingUsers.length === 2)
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    return `${typingUsers[0]} and others are typing`;
  }, [typingUsers]);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const incomingFiles = Array.from(files);
    const oversized = incomingFiles.find(
      (file) => file.size > MAX_ATTACHMENT_BYTES,
    );

    if (oversized) {
      setAttachmentError(`${oversized.name} exceeds the 10 MB limit.`);
      return;
    }

    setAttachmentError(null);
    setSelectedFiles((previous) => [...previous, ...incomingFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  };

  const handlesubmit = (values: Record<string, unknown>) => {
    const { comment } = preprocessTrimmedFormData(values);
    const trimmedComment = String(comment || "").trim();

    if (!trimmedComment && selectedFiles.length === 0) {
      setAttachmentError("Send a message or attach at least one file.");
      return;
    }

    const clientTempId = `temp-${Date.now()}`;

    createComment.mutate({
      Post_Id: currentPostId,
      username: currentUsername,
      avatar: currentAvatar,
      content: trimmedComment,
      clientTempId,
      attachments: selectedFiles,
    });
    setAttachmentError(null);
    setSelectedFiles([]);
    reset();
  };

  return (
    <div className="flex h-full flex-col bg-[#0d1829]">
      <div className="border-b border-[#1f2e47] px-5 py-4">
        <div className="flex items-center gap-2">
          <i className="fa-regular fa-comments text-indigo-400"></i>
          <span className="text-sm font-semibold text-slate-200">
            Real time discussions
          </span>
          {comments.length > 0 ? (
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-400">
              {comments.length}
            </span>
          ) : null}
          <span className="ml-auto rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
            {onlineCount} online
          </span>
        </div>

        {summaryText ? (
          <p
            className="mt-2 truncate text-sm text-slate-400"
            title={summaryText}
          >
            {summaryText}
          </p>
        ) : null}

        {roomMembers.length > 0 ? (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {roomMembers.map((member) => (
              <div
                key={member.username}
                className="flex shrink-0 items-center gap-2 rounded-full bg-indigo-500/10 px-2.5 py-1"
                title={`${member.username} is ${member.online ? "online" : "offline"}`}
              >
                <div className="relative">
                  <ImageWithFallback
                    variant="avatar"
                    src={member.avatar || fallback}
                    alt={member.username}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0d1829] ${
                      member.online ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  ></span>
                </div>
                <span className="max-w-[90px] truncate text-[11px] text-slate-300">
                  {member.username}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {activityMessage ? (
          <p className="mt-3 text-xs text-cyan-300/80">{activityMessage}</p>
        ) : null}
      </div>

      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {comments.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-slate-500">
            <i className="fa-regular fa-comments mb-2 text-3xl text-slate-600"></i>
            <p className="text-sm">No discussion yet</p>
            <p className="mt-1 text-xs">Start the conversation in this room.</p>
          </div>
        ) : (
          [...comments].reverse().map((c) => {
            const isOnline = onlineUsernames.has(c.username);

            return (
              <div key={c._id} className="group">
                <div className="flex items-start gap-2.5">
                  <div className="relative">
                    <ImageWithFallback
                      variant="avatar"
                      src={c.avatar || fallback}
                      alt={c.username}
                      className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-[#2a3d5c]"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0d1829] ${
                        isOnline ? "bg-emerald-400" : "bg-slate-600"
                      }`}
                    ></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {c.username}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "just now"}
                      </span>
                    </div>
                    {c.content ? (
                      <p className="text-xs leading-relaxed text-slate-400">
                        {c.content}
                      </p>
                    ) : null}
                    {c.attachments?.length ? (
                      <div className="mt-3">
                        <PostAttachmentGallery
                          attachments={c.attachments}
                          mode="discussion"
                        />
                      </div>
                    ) : null}
                    <div className="mt-2">
                      <VoteControls
                        compact
                        summary={{
                          upvotesCount: c.upvotesCount || 0,
                          downvotesCount: c.downvotesCount || 0,
                          score:
                            (c.upvotesCount || 0) - (c.downvotesCount || 0),
                          userVote: c.userVote || null,
                        }}
                        onVote={(voteType) =>
                          voteComment.mutate({ commentId: c._id, voteType })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="min-h-[24px] px-4 text-xs text-slate-400">
        {typingLabel ? (
          <div className="flex items-center gap-2">
            <span>{typingLabel}</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"></span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:120ms]"></span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400 [animation-delay:240ms]"></span>
            </span>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit(handlesubmit)}
        className="border-t border-[#1f2e47] px-4 py-3"
      >
        {selectedFilePreviews.length ? (
          <div className="mb-3 space-y-2 rounded-2xl bg-[#111827] p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Pending attachments
              </p>
              <span className="text-[10px] text-slate-500">Max 10 MB each</span>
            </div>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#0f172a] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-200">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-[#1a2540] hover:text-rose-300"
                    aria-label={`Remove ${file.name}`}
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
            <PostAttachmentGallery
              attachments={selectedFilePreviews}
              mode="discussion"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-2 rounded-xl bg-[#1a2540] px-3 py-2 transition-all">
          <ImageWithFallback
            variant="avatar"
            src={currentUser?.avatar || fallback}
            alt=""
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          <label className="cursor-pointer text-slate-500 transition-colors hover:text-indigo-400">
            <i className="fa-solid fa-paperclip text-sm"></i>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.txt,.doc,.docx,.zip"
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          <div className="flex-1">
            <input
              type="text"
              {...register("comment")}
              placeholder="Send a message or attach files..."
              maxLength={1001}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {errors.comment ? (
              <p className="mt-1 text-[10px] text-red-400">
                {errors.comment.message as string}
              </p>
            ) : null}
            {attachmentError ? (
              <p className="mt-1 text-[10px] text-red-400">{attachmentError}</p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={
              (!currentComment.trim() && selectedFiles.length === 0) ||
              createComment.isPending
            }
            className="text-indigo-400 transition-colors hover:text-indigo-300 disabled:text-slate-600"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
