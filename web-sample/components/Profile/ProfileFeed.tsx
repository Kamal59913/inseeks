"use client";
import React, { useEffect, useRef } from "react";
import { useGetPosts } from "@/hooks/postServices/useGetPosts";
import { useGetUserByUsername } from "@/hooks/userServices/useGetUserByUsername";
import { PostCard } from "@/components/Features/PostCard";
import { useScrollAnchor } from "@/hooks/useScrollAnchor";
import { GlobalLoader } from "@repo/ui/index";

interface ProfileFeedProps {
  username: string;
  activeTab: string;
}

export const ProfileFeed = ({ username, activeTab }: ProfileFeedProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { startTracking, restore } = useScrollAnchor(`feed-profile-${username}-${activeTab}`);

  const { data: userDataResponse } = useGetUserByUsername(username);
  const userData = (userDataResponse as any)?.data || userDataResponse;

  const getFilterForTab = () => {
    switch (activeTab) {
      case "posts":
        return "all";
      case "reposts":
        return "reposts";
      case "media":
        return "media";
      case "saved":
        return "saved";
      default:
        return "all";
    }
  };

  const { data: postsData, isLoading: isPostsLoading } = useGetPosts(
    getFilterForTab(),
    20,
    { enabled: !!userData?.id },
    activeTab === "saved" ? undefined : userData?.id,
  );

  const posts =
    (postsData as any)?.pages?.flatMap((page: any) => page.data || []) || [];

  useEffect(() => {
    if (posts.length > 0) startTracking(listRef);
  }, [posts, startTracking]);

  useEffect(() => {
    if (posts.length > 0) restore();
  }, [posts.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPostsLoading) {
    return <GlobalLoader className="py-12" />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No {activeTab} yet
      </div>
    );
  }

  return (
    <div ref={listRef} className="mt-4 space-y-6 pb-6">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
