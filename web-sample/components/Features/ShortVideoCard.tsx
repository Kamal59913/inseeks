"use client";
import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  Pause,
  Play,
  MessageCircle,
  Volume2,
  VolumeX,
  User,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ActionIconButton,
  Button,
  cn,
} from "@repo/ui/index";
import { UserSubscribeButton } from "./UserSubscribeButton";
import { ReactionButton } from "./ReactionButton";
import { SavePostButton } from "./SavePostButton";
import { RepostButton } from "./RepostButton";
import { SharePostButton } from "./SharePostButton";
import { PostOptionsMenu } from "./PostOptionsMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { SHORT_VIDEO_CARD_CONFIG } from "@/lib/config/config";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";
import { LinkifiedText } from "@/components/ui/linkified-text";

interface ShortVideoCardProps {
  post: any;
  isActive: boolean;
  videoRef: (el: HTMLVideoElement | null) => void;
  muted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  commentsOpen?: boolean;
  onToggleComments?: () => void;
}

export const ShortVideoCard: React.FC<ShortVideoCardProps> = ({
  post,
  isActive,
  videoRef,
  muted,
  toggleMute,
  commentsOpen,
  onToggleComments,
}) => {
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [isNotInterested, setIsNotInterested] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showOverlayIcon, setShowOverlayIcon] = useState(false);
  const overlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { userData } = useAuthStore();
  const internalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Safely get author details
  const authorName = post?.author_full_name || post?.author?.full_name || "Unknown User";
  const authorUsername = post?.author_username || post?.author?.username || "unknown";
  const authorAvatar = post?.author_profile_image || post?.author?.profile_photo_url;
  const isOwnPost = userData?.username === authorUsername;
  const profileUrl = `/u/${authorUsername}`;

  // Use either nested media or top-level media_url/thumbnail_url
  const videoUrl = post?.media?.find((m: any) => m.media_type === "video")?.url || post?.media_url;
  const thumbnail = post?.media?.find((m: any) => m.media_type === "video")?.thumbnail_url || post?.thumbnail_url;
  const actionItemClass = SHORT_VIDEO_CARD_CONFIG.ACTION_ITEM_CLASS;
  const actionCountClass = SHORT_VIDEO_CARD_CONFIG.ACTION_COUNT_CLASS;
  const cardClassName =
    "video-container relative w-full h-full snap-start snap-always shrink-0 flex items-center justify-center bg-black";

  const assignVideoRef = useCallback(
    (element: HTMLVideoElement | null) => {
      internalVideoRef.current = element;
      videoRef(element);
    },
    [videoRef],
  );

  const togglePlayback = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const videoElement = internalVideoRef.current;
      if (!videoElement) return;

      // Flash overlay icon (YouTube Shorts behaviour)
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
      setShowOverlayIcon(true);
      overlayTimerRef.current = setTimeout(() => setShowOverlayIcon(false), 600);

      if (videoElement.paused) {
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setIsPaused(true);
          });
        }
      } else {
        videoElement.pause();
      }
    },
    [],
  );

  const handleUndoNotInterested = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response: any = await postService.undoNotInterested(post.id);
      if (response?.status === true || response?.status === 200) {
        setIsNotInterested(false);
        ToastService.success("Post restored");
      } else {
        throw new Error(response?.message || "Failed to undo");
      }
    } catch (error: any) {
      ToastService.error(error?.message || "Failed to undo");
    }
  };

  if (isNotInterested) {
    return (
      <div data-id={post.id} className={cardClassName}>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-black to-stone-950" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/8 px-6 py-7 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <p className="text-sm font-medium leading-6 text-white/90">
              Post hidden. We'll show you fewer posts like this.
            </p>
            <button
              onClick={handleUndoNotInterested}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/12 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-white/20"
            >
              Undo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-id={post.id}
      className={cardClassName}
    >
      {/* Video Player */}
      <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
        <video
          ref={assignVideoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          loop
          muted={muted}
          playsInline
          poster={thumbnail}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
          onClick={togglePlayback}
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />

      {/* Right Side Actions */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-5 pb-4">
        <div className="flex flex-col items-center gap-1">
          <Link href={profileUrl} className="block">
            <Avatar className="w-10 h-10 border-2 border-white cursor-pointer transition-transform hover:scale-110">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback className="bg-gray-100 text-gray-400">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        <ReactionButton
          targetId={post.id}
          type="post"
          className={actionItemClass}
          variant="short-video"
          iconClassName={SHORT_VIDEO_CARD_CONFIG.REACTION_ICON_CLASS}
          activeReactionClassName={SHORT_VIDEO_CARD_CONFIG.REACTION_ACTIVE_CLASS}
          pickerClassName={SHORT_VIDEO_CARD_CONFIG.REACTION_PICKER_CLASS}
          pickerButtonClassName={SHORT_VIDEO_CARD_CONFIG.REACTION_PICKER_BUTTON_CLASS}
          initialUserReactionId={post?.viewer_reaction_type_id}
          isReacted={post?.is_reacted}
          viewerReactionTypeId={post?.viewer_reaction_type_id}
          viewerReactionEmoji={post?.viewer_reaction_emoji}
          totalReactions={post?.reactions_total || post?.reactions || 0}
        />

        <Button
          variant="postAction"
          size="post-icons"
          onClick={onToggleComments}
          className={cn(
            actionItemClass,
            "group/comment",
            commentsOpen && "text-primary",
          )}
        >
          <MessageCircle
            className={cn(
              "transition-all duration-200",
              commentsOpen ? "fill-current text-primary" : "group-hover/comment:text-white group-hover/comment:scale-110",
            )}
          />
          <span className={actionCountClass}>
            {post?.comment_count || post?.comments_count || 0}
          </span>
        </Button>

        <RepostButton
          postId={post.id}
          repostCount={post?.reposts_count || post?.reposts || 0}
          className={actionItemClass}
          variant="short-video"
        />

        <SavePostButton
          postId={post.id}
          initialIsSaved={post?.is_saved || post?.isSaved}
          className={actionItemClass}
          variant="short-video"
        />

        <SharePostButton postId={post.id} className={actionItemClass} variant="short-video" />

        <PostOptionsMenu
          post={post}
          isOwnPost={isOwnPost}
          authorName={authorName}
          authorUsername={authorUsername}
          className={actionItemClass}
          onNotInterested={() => setIsNotInterested(true)}
        />
      </div>

      {/* Bottom Left Info */}
      <div className="absolute bottom-6 left-4 right-16 z-20 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Link
              href={profileUrl}
              className="text-white font-semibold text-sm drop-shadow-md hover:underline cursor-pointer"
            >
              {authorName}
            </Link>
            <UserSubscribeButton
              username={authorUsername}
              displayName={authorName}
              initialIsFollowing={post?.is_following_author || post?.is_following}
              variant="overlay"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p
            className={cn(
              "text-white text-sm drop-shadow-sm font-light cursor-pointer whitespace-pre-wrap",
              !expandedDesc && "line-clamp-2"
            )}
            onClick={() => !expandedDesc && setExpandedDesc(true)}
          >
            <LinkifiedText
              text={post?.content || post?.text_content || ""}
              linkClassName="text-white underline decoration-white/70 underline-offset-2 hover:text-white/85"
            />
            {!expandedDesc && (post?.content?.length > 100 || post?.text_content?.length > 100) && (
              <span
                className="font-semibold ml-2 text-white/80"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedDesc(true);
                }}
              >
                ...more
              </span>
            )}
          </p>

          <div className="flex items-center gap-2 text-white/80 text-xs">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
               <span className="animate-pulse">♪</span>
            </div>
            <span>Original Audio - {authorUsername}</span>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-3">
        <ActionIconButton
          onClick={togglePlayback}
          className={SHORT_VIDEO_CARD_CONFIG.TOP_CONTROL_BUTTON_CLASS}
          aria-label={isPaused ? "Play video" : "Pause video"}
        >
          {isPaused ? (
            <Play className="h-5 w-5 fill-current" />
          ) : (
            <Pause className="h-5 w-5 fill-current" />
          )}
        </ActionIconButton>
        <ActionIconButton
          onClick={toggleMute}
          className={SHORT_VIDEO_CARD_CONFIG.TOP_CONTROL_BUTTON_CLASS}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </ActionIconButton>
      </div>

      {/* Center Play/Pause Overlay — YouTube Shorts style */}
      {showOverlayIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm"
            style={{ animation: "shorts-icon-fade 0.6s ease forwards" }}
          >
            {isPaused ? (
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            ) : (
              <Pause className="h-8 w-8 fill-white text-white" />
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shorts-icon-fade {
          0%   { opacity: 0; transform: scale(0.8); }
          20%  { opacity: 1; transform: scale(1); }
          70%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};