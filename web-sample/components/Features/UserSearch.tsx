"use client";

import React from "react";
import { Search as SearchIcon, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useGetUserRecommendations } from "@/hooks/userServices/useGetUserRecommendations";
import { UnifiedSearch } from "./UnifiedSearch";
import { getUserInitials, getRandomUserColor } from "@/lib/utilities/userUtils";

interface UserSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  variant?: "default" | "header";
  containerClassName?: string;
  inputClassName?: string;
}

export const UserSearch = ({
  onSearch,
  placeholder = "Search users...",
  isLoading = false,
  variant = "default",
  containerClassName = "",
  inputClassName = "",
}: UserSearchProps) => {
  const [inputQuery, setInputQuery] = React.useState("");
  const {
    data: recommendationsData,
    isLoading: isRecsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetUserRecommendations(inputQuery, 10, { enabled: inputQuery.trim().length >= 1 });

  const recommendations = React.useMemo(() => {
    return (recommendationsData as any)?.pages?.flatMap((page: any) => page?.data || []) || [];
  }, [recommendationsData]);

  const renderRecommendation = (
    rec: any,
    index: number,
    isSelected: boolean,
    onSelect: (name: string) => void,
  ) => (
    <button
      key={rec.id || index}
      onClick={() => onSelect(rec.username)} // Using username for search input refill if needed
      className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-gray-50 border-l-2 border-primary" : ""
      }`}
    >
      <div 
        className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-100"
        style={{ backgroundColor: getRandomUserColor(rec.id || rec.username) }}
      >
        {(rec.profile_photo_url || rec.profile_thumbnail_url) && 
         (rec.profile_photo_url || rec.profile_thumbnail_url).startsWith("http") ? (
          <Image
            src={rec.profile_photo_url || rec.profile_thumbnail_url}
            alt={rec.full_name || rec.username}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-xs font-semibold text-gray-900">
            {getUserInitials(rec.full_name || rec.username)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {rec.full_name || rec.username}
        </p>
        <p className="text-xs text-gray-500 truncate">
          @{rec.username} • {rec.subscribers_count || 0} Subscriber
        </p>
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
      getRecommendationName={(rec) => rec.full_name || rec.username}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      variant={variant}
      containerClassName={containerClassName}
      inputClassName={inputClassName}
    />
  );
};
