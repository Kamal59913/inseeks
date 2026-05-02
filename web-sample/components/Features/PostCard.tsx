"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";

import {
  User,
  ImageOff,
  Play
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
} from "@repo/ui/index";
import { PostOptionsMenu } from "./PostOptionsMenu";

import { formatTimeAgo } from "@/lib/utilities/timeUtils";
import { getTranslationLanguage } from "@/lib/utilities/translationUtils";
import { HiddenContentUndo } from "./HiddenContentUndo";

import { useAuthStore } from "@/store/useAuthStore";
import { UserSubscribeButton } from "./UserSubscribeButton";
import { SavePostButton } from "./SavePostButton";
import { RepostButton } from "./RepostButton";
import { ReactionButton } from "./ReactionButton";
import { ReactionSummary } from "./ReactionSummary";
import { CommentSection } from "./CommentSection";
import { CommentActionButton } from "./CommentActionButton";
import { UserHoverCard } from "./UserHoverCard";
import { SharePostButton } from "./SharePostButton";
import { ExpandableText } from "@/components/ui/expandable-text";
import { LinkifiedText } from "@/components/ui/linkified-text";
import postService from "@/lib/api/services/postService";
import { ToastService } from "@/lib/utilities/toastService";

/* ---------------- INTERNAL HELPER ---------------- */
const ImageWithFallback = ({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) => {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Filter out image-specific layout classes that don't apply to the fallback div
  const divClassName = className
    ?.replace("object-contain", "")
    ?.replace("object-cover", "")
    ?.trim();

  // Optimized strategy: use Giphy still images as placeholders
  const stillUrl = React.useMemo(() => {
    if (src?.includes("giphy.com") && src?.includes("/giphy.gif")) {
      return src.replace("/giphy.gif", "/giphy_s.gif");
    }
    if (src?.includes("giphy.com") && src?.includes("/giphy-downsized.gif")) {
      return src.replace("/giphy-downsized.gif", "/giphy-downsized_s.gif");
    }
    return null;
  }, [src]);

  if (error || !src) {
    return (
      <div
        className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 select-none min-h-[300px] w-full ${divClassName}`}
        onClick={onClick}
      >
        <ImageOff className="w-8 h-8 opacity-50" />
        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-50">
          Media Unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${divClassName}`}>
      {/* Skeleton / Still Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0 flex items-center justify-center">
          {stillUrl ? (
            <img
              src={stillUrl}
              alt="loading..."
              className={`w-full h-full blur-sm opacity-50 ${className}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] animate-shimmer" />
          )}
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ease-in-out ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
      />
    </div>
  );
};

/* ---------------- DATA ---------------- */
export const PostCard = React.memo(({ post, showTrending = true, isDetailView = false }: any) => {
  const router = useRouter();
  const { openModal } = useModalStore();
  const { userData } = useAuthStore();
  const [showComments, setShowComments] = React.useState(false);
  const [isNotInterested, setIsNotInterested] = React.useState(false);
  const [isTextExpanded, setIsTextExpanded] = React.useState(false);
  const [translatedText, setTranslatedText] = React.useState<string | null>(null);
  const [isTranslated, setIsTranslated] = React.useState(false);
  const [isTranslating, setIsTranslating] = React.useState(false);

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

  if (!post) return null;

  // Helper to safely get author details
  const getAuthorName = (post: any) => {
    return (
      post?.author_full_name ||
      (typeof post?.author === "object"
        ? post.author.full_name || post.author.name
        : post?.author) ||
      "Unknown User"
    );
  };

  const getAuthorUsername = (post: any) => {
    return (
      post?.author_username ||
      (typeof post?.author === "object"
        ? post.author.username
        : post?.username) ||
      "unknown"
    );
  };

  const getAuthorAvatar = (post: any) => {
    return (
      post?.author_profile_image ||
      post?.author?.profile_photo_url ||
      post?.avatar
    );
  };

  const authorName = getAuthorName(post);
  const authorUsername = getAuthorUsername(post);
  const authorAvatar = getAuthorAvatar(post);
  const isOwnPost = userData?.username === authorUsername;
  const originalText = post?.content || post?.text_content || "";
  const hasMedia = (post?.media && post.media.length > 0) || post?.image || post?.media_url;

  const extractTranslatedText = React.useCallback((response: any): string | null => {
    const candidates = [
      response?.data?.translatedText,
      response?.data?.translated_text,
      response?.data?.translated_content,
      response?.data?.text_content,
      response?.data?.content,
      response?.translatedText,
      response?.translated_text,
      response?.translated_content,
      response?.text_content,
      response?.content,
      typeof response?.data === "string" ? response.data : null,
      typeof response === "string" ? response : null,
    ];

    return candidates.find(
      (candidate) => typeof candidate === "string" && candidate.trim().length > 0,
    ) || null;
  }, []);

  const handleTranslate = React.useCallback(async () => {
    if (!originalText.trim()) {
      ToastService.warning("This post has no text to translate");
      return;
    }

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
      const response: any = await postService.translatePost(
        post.id,
        getTranslationLanguage(),
      );
      const nextText = extractTranslatedText(response);

      if (!nextText) {
        throw new Error("Translated text was not found in the response");
      }

      setTranslatedText(nextText);
      setIsTranslated(true);
    } catch (error: any) {
      ToastService.error(error?.message || "Failed to translate post");
    } finally {
      setIsTranslating(false);
    }
  }, [
    extractTranslatedText,
    getTranslationLanguage,
    isTranslated,
    originalText,
    post.id,
    translatedText,
  ]);

  const getProfileUrl = () => `/u/${authorUsername}`;

  const profileUrl = getProfileUrl();

  const navigateToPost = React.useCallback(() => {
    sessionStorage.setItem("avom-scroll-intent", "true");
    sessionStorage.setItem("avom-clicked-post", String(post.id));
    sessionStorage.setItem("avom-scroll-origin-path", window.location.pathname);
    router.push(`/posts/${post.id}`);
  }, [post.id, router]);

  if (isNotInterested) {
    return (
      <HiddenContentUndo
        message="Post hidden. We'll show you fewer posts like this."
        onUndo={handleUndoNotInterested}
      />
    );
  }

  return (
    <div
      id={`post-${post.id}`}
      data-post-id={post.id}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="p-4 flex items-start justify-between gap-3.5">
        <div className="flex items-center space-x-3">
          <UserHoverCard
            authorName={authorName}
            authorUsername={authorUsername}
            authorAvatar={authorAvatar}
            authorBio={post?.author_bio}
            followingCount={post?.author_following_count}
            followersCount={post?.author_followers_count}
            isOwnPost={isOwnPost}
            isFollowing={post?.is_following_author || post?.is_following}
          >
            <Link href={profileUrl} className="shrink-0 block">
              <Avatar className="w-12 h-12 border border-gray-200">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="bg-gray-100 text-gray-400">
                  <User size={24} />
                </AvatarFallback>
              </Avatar>
            </Link>
          </UserHoverCard>

          <div>
            <div className="flex items-center gap-3">
              <UserHoverCard
                authorName={authorName}
                authorUsername={authorUsername}
                authorAvatar={authorAvatar}
                authorBio={post?.author_bio}
                followingCount={post?.author_following_count}
                followersCount={post?.author_followers_count}
                isOwnPost={isOwnPost}
                isFollowing={post?.is_following_author || post?.is_following}
              >
                <Link href={profileUrl} className="block">
                  <h3 className="font-semibold text-gray-900 hover:underline">
                    {authorName}
                  </h3>
                </Link>
              </UserHoverCard>

              <span className="text-primary font-medium text-xs whitespace-nowrap cursor-default">
                {formatTimeAgo(post?.created_at) || post?.timeAgo || ""}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <UserHoverCard
                authorName={authorName}
                authorUsername={authorUsername}
                authorAvatar={authorAvatar}
                authorBio={post?.author_bio}
                followingCount={post?.author_following_count}
                followersCount={post?.author_followers_count}
                isOwnPost={isOwnPost}
                isFollowing={post?.is_following_author || post?.is_following}
              >
                <Link href={profileUrl} className="block w-fit">
                  <span className="hover:underline">
                    {authorUsername ? `@${authorUsername}` : "@unknown"}
                  </span>
                </Link>
              </UserHoverCard>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isOwnPost && (
            <UserSubscribeButton
              username={authorUsername}
              displayName={authorName}
              initialIsFollowing={
                post?.is_following_author ||
                post?.is_following ||
                post?.isFollowing
              }
            />
          )}

          <PostOptionsMenu
            post={post}
            isOwnPost={isOwnPost}
            authorName={authorName}
            authorUsername={authorUsername}
            onNotInterested={() => setIsNotInterested(true)}
            onTranslate={handleTranslate}
            translateLabel={isTranslated ? "See Original" : "Translate"}
            isTranslating={isTranslating}
          />
        </div>
      </div>

      <div
        className={cn("block", !isDetailView && "cursor-pointer")}
        onClick={() => {
          if (!isDetailView) {
            navigateToPost();
          }
        }}
        onKeyDown={(event) => {
          if (isDetailView) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigateToPost();
          }
        }}
        role={isDetailView ? undefined : "link"}
        tabIndex={isDetailView ? undefined : 0}
      >
        <div className="px-4 pb-3">
          <ExpandableText
            maxHeight={hasMedia ? "6rem" : "20rem"}
            expanded={isDetailView || isTextExpanded}
            onToggle={setIsTextExpanded}
            showExpandButton={!isDetailView}
            className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap"
          >
            <LinkifiedText text={isTranslated && translatedText ? translatedText : originalText} />
          </ExpandableText>
          {isTranslated && translatedText && (
            <button
              type="button"
              className="mt-2 text-xs font-medium text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTranslated(false);
              }}
            >
              See original
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {post?.media && post.media.length > 0 ? (
        <div
          className={`grid gap-0.5 overflow-hidden ${post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
        >
          {post.media.slice(0, 4).map((item: any, idx: number) => {
            const isLast = idx === 3 && post.media.length > 4;
            const isSingleRow = post.media.length === 1;
            const isThreeOdd = post.media.length === 3 && idx === 0;

            return (
              <div
                key={item.id || idx}
                className={`relative cursor-pointer overflow-hidden bg-gray-100 ${isSingleRow
                  ? "max-h-[500px]"
                  : isThreeOdd
                    ? "row-span-2 h-full"
                    : "aspect-square"
                  }`}
                onClick={() =>
                  openModal("image-preview", {
                    media: post.media,
                    initialIndex: idx,
                  })
                }
              >
                {item.media_type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={item.url}
                      poster={item.thumbnail_url}
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : item.media_type === "gif" ? (
                  <ImageWithFallback
                    src={item.gif_url}
                    alt={`GIF ${idx + 1}`}
                    className={`w-full h-full ${isSingleRow
                      ? "object-contain max-h-[500px]"
                      : "object-cover"
                      }`}
                  />
                ) : (
                  <ImageWithFallback
                    src={item.thumbnail_url || item.url}
                    alt={`Media ${idx + 1}`}
                    className={`w-full h-full ${isSingleRow
                      ? "object-contain max-h-[500px]"
                      : "object-cover"
                      }`}
                  />
                )}
                {isLast && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{post.media.length - 4}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : post?.image || post?.media_url ? (
        <div
          className="relative overflow-hidden bg-gray-100 cursor-pointer"
          onClick={() =>
            openModal("image-preview", {
              imageUrl: post.image || post.media_url,
            })
          }
        >
          <ImageWithFallback
            src={post.image || post.media_url}
            alt="Post content"
            className="w-full max-h-[500px] object-contain"
          />
        </div>
      ) : null}

      {/* Reactions Info & Action Bar */}
      <div className="px-4 pb-4">
        {/* Top Reactions Line */}
        <ReactionSummary
          postId={post?.id}
          total={post?.reactions_total || post?.reactions || 0}
          topReactions={post?.top_reactions}
          className="py-3"
        />

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <ReactionButton
              targetId={post.id}
              type="post"
              initialUserReactionId={
                post?.viewer_reaction_type_id ||
                post?.user_reaction?.id ||
                post?.userReactionId
              }
              isReacted={post?.is_reacted}
              viewerReactionTypeId={post?.viewer_reaction_type_id}
              viewerReactionEmoji={post?.viewer_reaction_emoji}
              totalReactions={post?.reactions_total || post?.reactions || 0}
            />

            <CommentActionButton
              count={
                post?.comment_count ||
                post?.commentCount ||
                post?.comments_count ||
                0
              }
              onClick={() => setShowComments(!showComments)}
              isActive={showComments}
            />

            <RepostButton
              postId={post.id}
              repostCount={post?.reposts_count || post?.reposts || 0}
            />
          </div>
          <div className="flex items-center space-x-2">
            <SavePostButton
              postId={post.id}
              initialIsSaved={post?.is_saved || post?.isSaved}
            />
            <SharePostButton postId={post.id} />
          </div>
        </div>
      </div>
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
});

PostCard.displayName = "PostCard";
