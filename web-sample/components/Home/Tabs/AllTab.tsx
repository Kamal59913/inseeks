import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { Button, EmptyState, InfiniteLoader, GlobalLoader } from "@repo/ui/index";
import { PostCard } from "@/components/Features/PostCard";
import { useGetPosts } from "@/hooks/postServices/useGetPosts";
import { useScrollAnchor } from "@/hooks/useScrollAnchor";
import Link from "next/link";

import { useVirtualizer } from "@tanstack/react-virtual";

const AllTab = ({ 
  activeSubTab = "All",
  virtualize = false 
}: { 
  activeSubTab?: string;
  virtualize?: boolean;
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const { startTracking, restore } = useScrollAnchor(`feed-home-${activeSubTab}`);

  // Map tab names to filter values
  const getFilterValue = (tab: string) => {
    switch (tab) {
      case "You Subscribed":
        return "subscribed";
      case "Liked":
        return "liked";
      case "Saved":
        return "saved";
      case "All":
      default:
        return "all";
    }
  };

  // Choose hook based on sub-tab
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPosts(getFilterValue(activeSubTab));


  // Flatten the pages into a single array
  const posts = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data || []) || [];
  }, [data]);

  // Virtualizer setup
  const getScrollElement = useCallback(() => {
    const parent = listRef.current?.closest("[data-radix-scroll-area-viewport]");
    return (parent as HTMLElement) || listRef.current;
  }, []);

  const estimateSize = useCallback(() => 600, []);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    getScrollElement,
    estimateSize,
    overscan: 10,
    enabled: virtualize,
  });

  // Start tracking once posts are rendered
  useEffect(() => {
    if (posts.length > 0) startTracking(listRef);
  }, [posts.length, startTracking]);

  // Restore scroll anchor after posts load
  useEffect(() => {
    if (posts.length > 0) restore();
  }, [posts.length > 0, restore]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterTabs = [
    { name: "All", href: "/home" },
    { name: "You Subscribed", href: "/home/subscribed" },
    { name: "Liked", href: "/home/liked" },
    { name: "Saved", href: "/home/saved" },
  ];

  return (
    <div ref={listRef} className="w-full">
      <div className="flex space-x-2 mb-6 justify-center">
        {filterTabs.map((tab) => (
          <Link key={tab.name} href={tab.href}>
            <Button
              variant={activeSubTab === tab.name ? "default" : "outline"}
              className={`rounded-full text-xs h-10 shadow-none px-5 ${
                activeSubTab === tab.name
                  ? "bg-primary hover:bg-primary text-white border-primary"
                  : "border-gray-200 text-gray-600 bg-gray-100"
              }`}
            >
              {tab.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="w-full">
        {isLoading ? (
          <GlobalLoader />
        ) : isError ? (
          <div className="text-center py-20 text-red-500">
            <p>Failed to load posts. Please try again later.</p>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState title="No posts found." />
        ) : virtualize ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index >= posts.length;
              const post = posts[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="pb-6"
                >
                  {isLoaderRow ? (
                    <InfiniteLoader
                      onLoadMore={fetchNextPage}
                      hasMore={hasNextPage}
                      isLoading={isFetchingNextPage}
                    />
                  ) : (
                    <PostCard post={post} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <InfiniteLoader
              onLoadMore={fetchNextPage}
              hasMore={hasNextPage}
              isLoading={isFetchingNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTab;
