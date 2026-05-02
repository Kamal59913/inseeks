"use client";

import React from "react";
import { Search as SearchIcon, ImageOff } from "lucide-react";
import Image from "next/image";
import { UnifiedSearch } from "./UnifiedSearch";
import { useSearchFeeds } from "@/hooks/feedServices/useSearchFeeds";

interface FeedSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const FeedSearch = ({
  onSearch,
  placeholder = "Search feeds...",
  isLoading = false,
}: FeedSearchProps) => {
  const [inputQuery, setInputQuery] = React.useState("");
  
  // Use search hook for recommendations as the user types
  const { data: searchResults, isLoading: isRecsLoading } = useSearchFeeds(inputQuery, 10, {
    enabled: inputQuery.trim().length >= 1
  });

  const recommendations = (searchResults?.data || searchResults || []);

  const renderRecommendation = (
    rec: any,
    index: number,
    isSelected: boolean,
    onSelect: (name: string) => void,
  ) => (
    <button
      key={rec.id || index}
      onClick={() => onSelect(rec.title)}
      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-gray-50 border-l-2 border-primary" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {rec.image ? (
          <Image
            src={rec.image}
            alt={rec.title}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        ) : (
          <ImageOff className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{rec.title}</p>
        <p className="text-xs text-gray-500">{rec.subscriber_count || 0} Members</p>
      </div>
      <SearchIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </button>
  );

  return (
    <UnifiedSearch
      onSearch={onSearch}
      onInputChange={setInputQuery}
      placeholder={placeholder}
      isLoading={isLoading}
      isRecommendationsLoading={isRecsLoading}
      recommendations={recommendations}
      renderRecommendation={renderRecommendation}
      getRecommendationName={(rec) => rec.title}
    />
  );
};
