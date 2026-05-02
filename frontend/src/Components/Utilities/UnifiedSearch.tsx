import React, { useEffect, useMemo, useRef, useState } from "react";
import InfiniteLoader from "../Common/InfiniteLoader";
import { useClickOutside } from "../../hooks/useClickOutside";

interface UnifiedSearchProps<T> {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (query: string) => void;
  onInputChange?: (query: string) => void;
  onSelectRecommendation?: (item: T) => void;
  placeholder?: string;
  isLoading?: boolean;
  isRecommendationsLoading?: boolean;
  recommendations: T[];
  renderRecommendation: (
    item: T,
    index: number,
    isSelected: boolean,
    onSelect: (item: T) => void,
  ) => React.ReactNode;
  getRecommendationLabel: (item: T) => string;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  emptyMessage?: string;
  variant?: "default" | "header";
  containerClassName?: string;
  inputClassName?: string;
}

export default function UnifiedSearch<T>({
  value,
  onValueChange,
  onSearch,
  onInputChange,
  onSelectRecommendation,
  placeholder = "Search...",
  isLoading = false,
  isRecommendationsLoading = false,
  recommendations,
  renderRecommendation,
  getRecommendationLabel,
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage = false,
  emptyMessage = "No suggestions found",
  variant = "default",
  containerClassName = "",
  inputClassName = "",
}: UnifiedSearchProps<T>) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<number | null>(null);

  useClickOutside(containerRef, () => {
    setShowRecommendations(false);
    setSelectedIndex(-1);
  });

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const showEmptyState = useMemo(
    () =>
      value.trim().length >= 1 &&
      !isRecommendationsLoading &&
      recommendations.length === 0,
    [isRecommendationsLoading, recommendations.length, value],
  );

  const triggerInputChange = (nextValue: string) => {
    if (!onInputChange) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onInputChange(nextValue.trim());
    }, 250);
  };

  const handleSelect = (item: T) => {
    const nextValue = getRecommendationLabel(item);
    onValueChange(nextValue);
    onSearch(nextValue);
    setShowRecommendations(false);
    setSelectedIndex(-1);
    onSelectRecommendation?.(item);
    inputRef.current?.blur();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onValueChange(nextValue);
    setSelectedIndex(-1);
    setShowRecommendations(nextValue.trim().length >= 1);
    triggerInputChange(nextValue);
  };

  const handleClear = () => {
    onValueChange("");
    onSearch("");
    setShowRecommendations(false);
    setSelectedIndex(-1);
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    onInputChange?.("");
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    onSearch(trimmed);
    setShowRecommendations(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showRecommendations || recommendations.length === 0) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
      if (event.key === "Escape") {
        setShowRecommendations(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev < recommendations.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : recommendations.length - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < recommendations.length) {
        handleSelect(recommendations[selectedIndex]);
      } else {
        handleSubmit();
      }
      return;
    }

    if (event.key === "Escape") {
      setShowRecommendations(false);
      setSelectedIndex(-1);
    }
  };

  const wrapperClasses =
    variant === "header" ? "w-full max-w-2xl mx-auto" : "w-full";

  const shellClasses =
    variant === "header"
      ? "field-subtle hover:bg-[#1b2742] focus-within:bg-[#1b2742] rounded-xl"
      : "field-subtle focus-within:bg-[#1b2742] rounded-xl";

  return (
    <div
      ref={containerRef}
      className={`${wrapperClasses} ${containerClassName}`}
    >
      <div className={`relative transition-all duration-200 ${shellClasses}`}>
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <i className="fa-solid fa-magnifying-glass text-slate-500 text-sm"></i>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.trim().length >= 1) {
              setShowRecommendations(true);
            }
          }}
          placeholder={placeholder}
          className={`w-full bg-transparent border-none pl-12 ${variant === "header" ? "pr-28 sm:pr-32" : "pr-16"} py-3.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none ${inputClassName}`}
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
          {variant === "header" && !value && !isLoading && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#090e1a]/45 px-2 py-1 text-[10px] font-bold text-slate-500">
              <span className="text-[10px] leading-none">Ctrl</span>
              <span className="text-[10px] leading-none">K</span>
            </div>
          )}
          {isLoading && (
            <i className="fa-solid fa-circle-notch fa-spin text-indigo-400 text-sm"></i>
          )}
          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="h-7 w-7 rounded-full text-slate-500 hover:text-slate-200 hover:bg-[#090e1a]/50 transition-all"
              aria-label="Clear search"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {showRecommendations && (
        <div className="relative">
          <div className="surface-subtle absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl">
            {isRecommendationsLoading ? (
              <div className="flex items-center justify-center py-6">
                <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 text-xl"></i>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="max-h-80 overflow-y-auto py-2">
                {recommendations.map((item, index) =>
                  renderRecommendation(
                    item,
                    index,
                    index === selectedIndex,
                    handleSelect,
                  ),
                )}
                <InfiniteLoader
                  onLoadMore={() => fetchNextPage?.()}
                  hasMore={hasNextPage}
                  isLoading={isFetchingNextPage}
                  className="px-3"
                  label="Loading more suggestions..."
                />
              </div>
            ) : showEmptyState ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
