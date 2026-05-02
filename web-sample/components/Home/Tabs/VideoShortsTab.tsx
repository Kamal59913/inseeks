"use client";
import React from "react";
import VideoShorts from "@/components/Features/AvowShorts";
import { useGetPosts } from "@/hooks/postServices/useGetPosts";
import Link from "next/link";
import { Button, EmptyState, GlobalLoader } from "@repo/ui/index";

interface VideoShortsTabProps {
  isMinimal?: boolean;
  activeSubTab?: string;
}

const VideoShortsTab = ({
  isMinimal = false,
  activeSubTab = "All",
}: VideoShortsTabProps) => {
  const filterTabs = [
    {
      name: "All",
      href: isMinimal ? "/home/short-videos" : "/short-videos",
      value: "all",
    },
    {
      name: "You Subscribed",
      href: isMinimal
        ? "/home/short-videos/subscribed"
        : "/short-videos/subscribed",
      value: "subscribed",
    },
    {
      name: "Liked",
      href: isMinimal ? "/home/short-videos/liked" : "/short-videos/liked",
      value: "liked",
    },
    {
      name: "Saved",
      href: isMinimal ? "/home/short-videos/saved" : "/short-videos/saved",
      value: "saved",
    },
  ];

  const currentTab = filterTabs.find((tab) => tab.name === activeSubTab) || filterTabs[0];

  const { data: postsData, isLoading } = useGetPosts(
    currentTab!.value,
    20,
    {},
    undefined,
    "video"
  ) as any;

  const videos = React.useMemo(() => {
    return (postsData?.pages?.flatMap((page: any) => page.data || []) || [])
      .filter((post: any) => post?.media && post?.media?.length > 0);
  }, [postsData]);

  return (
    <div className="-mx-6">
      {isMinimal && (
        <div className="flex space-x-2 mb-6 px-6 overflow-x-auto scrollbar-hide justify-center">
          {filterTabs.map((tab) => (
            <Link key={tab.name} href={tab.href}>
              <Button
                variant={
                  activeSubTab === tab.name ||
                  (activeSubTab === "All" && tab.name === "All")
                    ? "default"
                    : "outline"
                }
                className={`rounded-full text-xs h-10 shadow-none whitespace-nowrap px-5 ${
                  activeSubTab === tab.name ||
                  (activeSubTab === "All" && tab.name === "All")
                    ? "bg-primary hover:bg-primary text-white border-primary"
                    : "border-gray-200 text-gray-600 bg-gray-100"
                }`}
              >
                {tab.name}
              </Button>
            </Link>
          ))}
        </div>
      )}

      {isLoading ? (
        <GlobalLoader className="h-[500px] items-center" />
      ) : videos.length > 0 ? (
        <VideoShorts videos={videos} />
      ) : (
        <EmptyState
          title="No videos found"
          description="Check back later for more content"
        />
      )}
    </div>
  );
};

export default VideoShortsTab;
