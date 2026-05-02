"use client";
import React, { useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, EmptyState } from "@repo/ui/index";
import { FeedCard } from "./FeedCard";
import { PostCard } from "./PostCard";
import { GlobalLoader } from "@repo/ui/index";
import { useRouter } from "next/navigation";
import { useGetCommunityTopFeeds } from "@/hooks/feedServices/useGetCommunityTopFeeds";
import { useEntityScrollAnchor } from "@/hooks/useEntityScrollAnchor";

interface CommunityFeedProps {
  id: string | number;
  posts: any[];
  isLoading?: boolean;
  activeTab?: string;
}

export const CommunityFeed = ({ id, posts, isLoading, activeTab = "top-feeds" }: CommunityFeedProps) => {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const { 
    data: topFeedsResponse, 
    isLoading: isTopFeedsLoading,
    isError: isTopFeedsError 
  } = useGetCommunityTopFeeds(id);

  const topFeeds = (topFeedsResponse as any)?.data || topFeedsResponse || [];
  const {
    startTracking,
    restore,
  } = useEntityScrollAnchor({
    key: `community-top-feeds:${id}:${activeTab}`,
    dataAttribute: "data-feed-id",
    clickedStorageKey: "avom-clicked-feed",
    intentStorageKey: "avom-feed-scroll-intent",
    elementIdPrefix: "feed-",
  });

  const handleTabChange = (value: string) => {
    router.push(`/community/${id}/${value}`);
  };

  useEffect(() => {
    startTracking(contentRef);
  }, [startTracking, topFeeds.length, activeTab]);

  useEffect(() => {
    if (contentRef.current?.querySelector("[data-feed-id]")) {
      restore();
    }
  }, [restore, topFeeds.length, activeTab]);

  return (
    <div ref={contentRef} className="px-6 pb-20">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent h-auto p-0 border-b border-gray-100 rounded-none gap-0">
          <TabsTrigger
            value="top-feeds"
            className="rounded-full border-b-2 border-transparent data-[state=active]:border-[#D16DF2] data-[state=active]:text-white data-[state=active]:shadow-none bg-transparent text-gray-500 p-2 text-sm font-medium"
          >
            Top Feeds
          </TabsTrigger>
          <TabsTrigger
            value="latest-posts"
            className="rounded-full border-b-2 border-transparent data-[state=active]:border-[#D16DF2] data-[state=active]:text-white data-[state=active]:shadow-none bg-transparent text-gray-500 p-2 text-sm font-medium"
          >
            Latest posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-feeds" className="space-y-6 mt-0">
          {isTopFeedsLoading ? (
            <GlobalLoader />
          ) : isTopFeedsError ? (
            <EmptyState title="Failed to load feeds." description="Something went wrong. Please try again later." />
          ) : topFeeds.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {topFeeds.map((feed: any) => (
                <FeedCard key={feed.id} feed={feed} />
              ))}
            </div>
          ) : (
            <EmptyState title="No top feeds yet." description="This community doesn't have any feeds yet." />
          )}
        </TabsContent>
        
        <TabsContent value="latest-posts" className="space-y-6 mt-0">
           {isLoading ? (
              <GlobalLoader />
           ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={`latest-${post.id}`} post={post} />
            ))
           ) : (
             <EmptyState title="No posts yet." description="This community doesn't have any posts yet." />
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
