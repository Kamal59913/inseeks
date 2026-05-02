"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, InfiniteLoader, cn } from "@repo/ui/index";
import { Search as SearchIcon, Loader2 } from "lucide-react";

interface UnifiedSearchProps<T> {
  onSearch: (query: string) => void;
  onInputChange: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  isRecommendationsLoading?: boolean;
  recommendations: T[];
  renderRecommendation: (item: T, index: number, isSelected: boolean, onSelect: (name: string) => void) => React.ReactNode;
  getRecommendationName: (item: T) => string;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  variant?: "default" | "header";
  containerClassName?: string;
  inputClassName?: string;
}

export const UnifiedSearch = <T,>({
  onSearch,
  onInputChange,
  placeholder = "Search...",
  isLoading = false,
  isRecommendationsLoading = false,
  recommendations,
  renderRecommendation,
  getRecommendationName,
  hasNextPage = false,
  fetchNextPage = () => {},
  isFetchingNextPage = false,
  variant = "default",
  containerClassName = "",
  inputClassName = "",
}: UnifiedSearchProps<T>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setSelectedIndex(-1);

      if (value.trim().length >= 1) {
        setShowRecommendations(true);
      } else {
        setShowRecommendations(false);
      }

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        onInputChange(value.trim());
      }, 300);
    },
    [onInputChange],
  );

  const handleSelectRecommendation = useCallback(
    (name: string) => {
      setSearchQuery(name);
      onSearch(name);
      setShowRecommendations(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    onSearch("");
    onInputChange("");
    setShowRecommendations(false);
    setSelectedIndex(-1);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    inputRef.current?.focus();
  }, [onSearch, onInputChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showRecommendations || recommendations.length === 0) {
        if (e.key === "Enter") {
          e.preventDefault();
          onSearch(searchQuery.trim());
          setShowRecommendations(false);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < recommendations.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : recommendations.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < recommendations.length) {
            const selectedRec = recommendations[selectedIndex];
            if (selectedRec) {
              handleSelectRecommendation(getRecommendationName(selectedRec));
            }
          } else {
            onSearch(searchQuery.trim());
            setShowRecommendations(false);
          }
          break;
        case "Escape":
          setShowRecommendations(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [
      showRecommendations,
      recommendations,
      selectedIndex,
      searchQuery,
      onSearch,
      handleSelectRecommendation,
      getRecommendationName,
    ],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <div className={cn("relative w-full", containerClassName, variant === "default" ? "mb-3" : "")} ref={dropdownRef}>
      <div className="relative">
        <SearchIcon
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
            variant === "header" ? "w-4 h-4" : "w-[18px] h-[18px]"
          )}
        />
        <Input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery.trim().length >= 1) setShowRecommendations(true);
          }}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-20",
            variant === "header" && "flex border px-3 py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full pl-9 pr-9 h-10 rounded-xl bg-[#F4F5F8] border-transparent focus:border-transparent focus:ring-0 text-sm text-gray-700 placeholder:text-gray-400",
            inputClassName
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className={cn("text-primary animate-spin", variant === "header" ? "w-4 h-4" : "w-5 h-5")} />
          )}
          {searchQuery && !isLoading && (
            <button
              onClick={handleClear}
              className={cn(
                "hover:bg-gray-100 rounded-full transition-colors",
                variant === "header" ? "p-1" : "p-1.5"
              )}
              title="Clear"
            >
              <svg
                className={cn("text-gray-400 hover:text-gray-600", variant === "header" ? "w-3.5 h-3.5" : "w-4 h-4")}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {showRecommendations && (
        <div className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden",
          variant === "header" ? "" : "border-gray-200"
        )}>
          {isRecommendationsLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
            </div>
          ) : recommendations.length > 0 ? (
            <>
              <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/80">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Recommendations
                </h4>
              </div>
              <div className="max-h-64 overflow-y-auto scroll-smooth">
                {recommendations.map((item, index) => renderRecommendation(item, index, index === selectedIndex, handleSelectRecommendation))}
                <div className="py-2 px-3 flex-shrink-0">
                  <InfiniteLoader
                    onLoadMore={fetchNextPage}
                    hasMore={hasNextPage}
                    isLoading={isFetchingNextPage}
                  />
                </div>
              </div>
            </>
          ) : searchQuery.trim().length >= 1 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">No suggestions found</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

