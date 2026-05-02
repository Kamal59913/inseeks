"use client";
import React from "react";
import { ScrollArea, EmptyState, GlobalLoader } from "@repo/ui/index";
import { ImageOff } from "lucide-react";
import { FeedHeader } from "./FeedHeader";
import { PostCard } from "./PostCard";
import { useGetFeedById } from "@/hooks/feedServices/useGetFeedById";
import { useGetPosts } from "@/hooks/postServices/useGetPosts";
import FloatCreatePost from "../icons/FloatCreatePost";
import { useModalStore } from "@/store/useModalStore";

interface FeedViewProps {
  id: string;
}

const FeedView = ({ id }: FeedViewProps) => {
  const { openModal } = useModalStore();

  const {
    data: feedResponse,
    isLoading: isFeedLoading,
    isError: isFeedError,
  } = useGetFeedById(id);

  const feedData = feedResponse?.data;

  const {
    data: postsResponse,
    isLoading: isPostsLoading,
  } = useGetPosts("all", 20, {}, undefined, undefined, undefined, id);

  const postsData = (postsResponse as any)?.pages?.flatMap((page: any) => page.data || []) || [];

  if (isFeedLoading) {
    return (
      <GlobalLoader className="h-screen items-center bg-white" />
    );
  }

  if (isFeedError || !feedData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-center">
        <ImageOff className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Feed Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          The feed you're looking for doesn't exist or has been removed.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg"
          onClick={() => (window.location.href = "/home")}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white h-screen relative flex justify-center">
      <ScrollArea className="h-full w-full">
        <div className="max-w-3xl mx-auto border-x border-gray-100 min-h-screen bg-white">
          <FeedHeader feed={feedData} />

          <div className="px-6 pb-20 mt-6">
            <div className="space-y-6">
              {isPostsLoading ? (
                <GlobalLoader />
              ) : postsData.length > 0 ? (
                postsData.map((post: any) => (
                  <PostCard key={`feed-post-${post.id}`} post={post} />
                ))
              ) : (
                <EmptyState
                  title="No posts yet."
                  description="This feed doesn't have any posts yet."
                />
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Floating Create Post Button - fixed to viewport, aligned to center column's right edge */}
      <button
        onClick={() =>
          openModal("create-new", {
            type: "post",
            feedId: id,
            isFromFeedPage: true,
          })
        }
        className="fixed bottom-10 z-50 transition-transform hover:scale-110 active:scale-95 drop-shadow-xl"
        style={{ right: "calc(50% - 384px + 32px)" }}
        title="Create Post"
      >
        <FloatCreatePost className="w-16 h-16" />
      </button>
    </div>
  );
};

export default FeedView;