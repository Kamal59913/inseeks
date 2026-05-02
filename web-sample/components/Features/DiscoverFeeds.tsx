"use client";

import React from "react";
import { useFeedSuggestions } from "@/hooks/feedServices/useFeedSuggestions";
import { ProposedFeedCard } from "./ProposedFeedCard";
import { Loader2, Sparkles } from "lucide-react";
import { EmptyState, GlobalLoader } from "@repo/ui/index";

export const DiscoverFeeds = () => {
  const { data, isLoading, error } = useFeedSuggestions();

  // Flatten the pages to an array of feeds
  const feeds = React.useMemo(() => {
    return data?.pages?.flatMap((page: any) => page?.feeds || []) || [];
  }, [data]);
  if (isLoading) {
    return <GlobalLoader className="p-8" iconClassName="text-gray-400" />;
  }

  if (error || feeds.length === 0) {
    return (
      <EmptyState
        title="No feed suggestions available."
        description="Check back later for new feeds to discover."
        className="h-[200px] mx-0"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-yellow-500 fill-current" />
        <h2 className="text-lg font-semibold text-gray-900">Discover New Feeds</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {feeds.map((feed: any) => (
           <ProposedFeedCard key={feed.id} feed={feed} />
        ))}
      </div>
    </div>
  );
};
