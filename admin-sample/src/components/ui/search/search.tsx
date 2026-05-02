import { useRef, useState, useEffect, useCallback, ReactNode } from "react";

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
}

interface SearchProps<T> {
  placeholder?: string;
  tagline?: string;
  icon?: ReactNode;
  minInputLength?: number;
  fetchRecommendations: (input: string, page?: number, limit?: number) => Promise<string[]>;
  fetchData: (input: string) => Promise<T>;
  onDataFound: (data: T | null) => void;
  onDataClear: () => void;
  getErrorMessage: (params: {
    error: ApiError | null;
    searchedValue: string;
  }) => string;
  shouldDescShow?: boolean;
  messageToShow?: string;
  infiniteScroll?: boolean;
  limit?: number;
}

export const Search = <T,>({
  placeholder = "Search",
  tagline = "Recommendations",
  icon,
  minInputLength = 3,
  fetchRecommendations,
  fetchData,
  onDataFound,
  getErrorMessage,
  onDataClear,
  messageToShow,
  infiniteScroll = false,
  limit = 5
}: SearchProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [showRecommendations, setShowRecommendations] =
    useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingRecommendations, setIsFetchingRecommendations] =
    useState<boolean>(false);
  const [foundData, setFoundData] = useState<T | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [shouldShowError, setShouldShowError] = useState<boolean>(false);
  
  // Infinite scroll states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMoreRecommendations, setHasMoreRecommendations] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Clear error when user starts typing again
  useEffect(() => {
    if (inputValue.length >= minInputLength && isInputFocused) {
      setShouldShowError(false);
      setApiError(null);
      
      const fetchRecs = async () => {
        setIsFetchingRecommendations(true);
        setCurrentPage(1);
        setHasMoreRecommendations(true);
        
        try {
          const recs = await fetchRecommendations(
            inputValue, 
            1, 
            infiniteScroll ? limit : 5
          );
          setRecommendations(recs);
          
          // Check if we got fewer results than requested (end of data)
          if (infiniteScroll && recs.length < limit) {
            setHasMoreRecommendations(false);
          }
        } catch (error) {
          setRecommendations([]);
          setHasMoreRecommendations(false);
        } finally {
          setIsFetchingRecommendations(false);
        }
      };

      const timerId = setTimeout(fetchRecs, 300);
      return () => clearTimeout(timerId);
    } else {
      setRecommendations([]);
      setCurrentPage(1);
      setHasMoreRecommendations(true);
      if (inputValue.length < minInputLength) {
        setApiError(null);
        setShouldShowError(false);
      }
    }
  }, [inputValue, minInputLength, isInputFocused, fetchRecommendations, infiniteScroll, limit]);

  // Load more recommendations for infinite scroll
  const loadMoreRecommendations = useCallback(async () => {
    if (!infiniteScroll || isLoadingMore || !hasMoreRecommendations || inputValue.length < minInputLength) {
      return;
    }

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newRecs = await fetchRecommendations(inputValue, nextPage, limit);
      
      if (newRecs.length === 0 || newRecs.length < limit) {
        setHasMoreRecommendations(false);
      }
      
      if (newRecs.length > 0) {
        setRecommendations(prev => [...prev, ...newRecs]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      setHasMoreRecommendations(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [infiniteScroll, isLoadingMore, hasMoreRecommendations, inputValue, minInputLength, currentPage, limit, fetchRecommendations]);

  // Scroll handler for infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !infiniteScroll) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const threshold = 50; // Load more when 50px from bottom
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMoreRecommendations();
    }
  }, [infiniteScroll, loadMoreRecommendations]);

  useEffect(() => {
    const shouldShow =
      inputValue.length >= minInputLength &&
      recommendations.length > 0 &&
      isInputFocused &&
      !isLoading &&
      !shouldShowError; // Don't show recommendations when error is showing
    setShowRecommendations(shouldShow);
  }, [inputValue, recommendations, isInputFocused, isLoading, minInputLength, shouldShowError]);

  useEffect(() => {
    setShouldShowError(
      hasSearched && !isLoading && (apiError !== null || foundData === null)
    );
  }, [hasSearched, isLoading, apiError, foundData]);

  const handleGetData = useCallback(
    async (value?: string) => {
      const targetValue = value || inputValue.trim();
      if (!targetValue) return;

      // Immediately close recommendations and clear states when search starts
      setShowRecommendations(false);
      setSelectedIndex(-1);
      setIsInputFocused(false); // Remove focus to prevent recommendations from reappearing
      
      setFoundData(null);
      onDataFound(null);
      setSearchValue(targetValue);
      setApiError(null);
      setHasSearched(true);
      setShouldShowError(false); // Reset error state on new search

      try {
        setIsLoading(true);
        const data = await fetchData(targetValue);
        console.log("data", data)
        if (Array.isArray(data) && data.length > 0) {
          setFoundData(data);
          onDataFound(data);
        } else {
          setFoundData(null);
          onDataFound(null);
        }
      } catch (error) {
        setApiError(error as ApiError);
        setFoundData(null);
        onDataFound(null);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, fetchData, onDataFound]
  );

  const handleSelect = useCallback(
    (selected: string) => {
      setInputValue(selected);
      setShowRecommendations(false);
      setSelectedIndex(-1);
      setIsInputFocused(false);
      setShouldShowError(false); // Clear error when selecting
      if (inputRef.current) inputRef.current.blur();
      handleGetData(selected);
    },
    [handleGetData]
  );

  const handleReset = useCallback(() => {
    setInputValue("");
    setSearchValue("");
    setShowRecommendations(false);
    setSelectedIndex(-1);
    setIsInputFocused(false);
    setHasSearched(false);
    setFoundData(null);
    onDataFound(null);
    setApiError(null);
    setShouldShowError(false); // Hide error on reset
    setCurrentPage(1);
    setHasMoreRecommendations(true);
    onDataClear()
    if (inputRef.current) inputRef.current.focus();
  }, [onDataFound, onDataClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showRecommendations || recommendations.length === 0) {
        if (e.key === "Enter") {
          e.preventDefault();
          handleGetData();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < recommendations.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : recommendations.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < recommendations.length) {
          handleSelect(recommendations[selectedIndex] ?? '');
          } else {
            handleGetData();
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
      handleSelect,
      handleGetData,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowRecommendations(false);
        setSelectedIndex(-1);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const error = shouldShowError
    ? getErrorMessage({ error: apiError, searchedValue: searchValue })
    : "";

  return (
<div className="space-y-6">
  <div className="relative" ref={dropdownRef}>
    <div className="relative group">
      {/* Search Icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
        <svg
          className="w-5 h-5 text-gray-400 group-focus-within:text-[#9B3B97] transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        type="tel"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsInputFocused(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsInputFocused(true)}
        placeholder={placeholder}
        className={`w-full h-14 pl-12 pr-40 rounded-xl bg-white text-black placeholder:text-gray-400 border-2 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg dark:bg-black dark:text-white dark:placeholder:text-gray-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#9B3B97] focus:ring-4 focus:ring-[#9B3B97]/10 dark:border-gray-700 dark:focus:border-[#9B3B97]"
        } ${showRecommendations || error ? "rounded-b-none border-b-0" : ""}`}
      />

      {/* Action Buttons Container */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* Reset Button */}
        {(inputValue || searchValue || foundData) && (
          <button
            onClick={handleReset}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-700 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400/50 group"
            title="Clear all"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleGetData();
          }}
          disabled={isLoading || !inputValue.trim()}
          className="bg-[#000000] hover:bg-gray-600 dark:bg-white dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-white disabled:cursor-not-allowed disabled:transform-none duration-200 flex focus:outline-none focus:ring-2 focus:ring-[#9B3B97]/50 font-semibold gap-2 items-center px-5 py-2.5 rounded-lg text-sm text-white dark:text-black"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-800/30 border-t-white dark:border-t-black rounded-full animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <span>Search</span>
             
            </>
          )}
        </button>
      </div>
    </div>

    {/* Recommendations Dropdown */}
    {showRecommendations && (
      <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border-2 border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl shadow-xl z-50 max-h-80 overflow-hidden">
        {isFetchingRecommendations ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-3 border-[#9B3B97] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Loading suggestions...
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/50">
              <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {tagline}
              </h3>
            </div>
            <div
              ref={scrollContainerRef}
              className="max-h-64 overflow-y-auto"
              onScroll={handleScroll}
            >
              {recommendations.map((phone: string, index: number) => (
                <button
                  key={`${phone}-${index}`}
                  onClick={() => handleSelect(phone)}
                  className={`w-full text-left px-5 py-4 transition-all duration-200 flex items-center gap-4 hover:bg-[#9B3B97]/5 dark:hover:bg-[#9B3B97]/10 border-l-4 ${
                    index === selectedIndex
                      ? "bg-[#9B3B97]/5 dark:bg-[#9B3B97]/10 border-l-[#9B3B97]"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9B3B97] to-[#7d2f79] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-base font-semibold text-black dark:text-white truncate">
                      {phone}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Click to search
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}

              {/* Infinite Scroll Loading Indicator */}
              {infiniteScroll && isLoadingMore && (
                <div className="px-5 py-4 text-center border-t border-gray-100 dark:border-gray-800">
                  <div className="w-5 h-5 border-2 border-[#9B3B97] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Loading more...
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )}

    {/* Error Display */}
    {error && (
      <div className="absolute top-full left-0 right-0 bg-white dark:bg-black border-2 border-t-0 border-red-200 dark:border-red-700 rounded-b-xl shadow-xl z-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
            Search Error
          </h3>
        </div>
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-red-600 dark:text-red-400">
              No results found
            </p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-0.5">
              Please try a different search term
            </p>
          </div>
        </div>
      </div>
    )}

    {/* Success State - Data Found */}
    {messageToShow && foundData && !error && (
      <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
              {messageToShow}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Parent data retrieved for phone: <span className="font-mono font-semibold">{inputValue}</span>
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
</div>
  );
};