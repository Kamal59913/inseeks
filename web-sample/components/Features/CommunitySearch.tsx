"use client";

import React from "react";
import { Search as SearchIcon, ImageOff } from "lucide-react";
import Image from "next/image";
import { useGetRecommendations } from "@/hooks/communityServices/useGetRecommendations";
import { UnifiedSearch } from "./UnifiedSearch";

interface CommunitySearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export const CommunitySearch = ({
  onSearch,
  placeholder = "Search communities...",
  isLoading = false,
}: CommunitySearchProps) => {
  const [inputQuery, setInputQuery] = React.useState("");
  const {
    data: recommendationsData,
    isLoading: isRecsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetRecommendations(10, { enabled: inputQuery.trim().length >= 1 });
  
  const recommendations = React.useMemo(() => {
    return recommendationsData?.pages?.flatMap((page: any) => page?.data || []) || [];
  }, [recommendationsData]);

  const renderRecommendation = (
    rec: any,
    index: number,
    isSelected: boolean,
    onSelect: (name: string) => void,
  ) => (
    <button
      key={rec.id || index}
      onClick={() => onSelect(rec.name)}
      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-gray-50 border-l-2 border-primary" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
        {rec.profile_photo_url ? (
          <Image
            src={rec.profile_photo_url}
            alt={rec.name}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        ) : (
          <ImageOff className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{rec.name}</p>
        {rec.subscriber_count !== undefined && (
          <p className="text-xs text-gray-500">{rec.subscriber_count} Members</p>
        )}
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
      getRecommendationName={(rec) => rec.name}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};
