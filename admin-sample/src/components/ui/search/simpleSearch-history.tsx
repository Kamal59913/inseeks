import { useRef, useState, useCallback, ReactNode, useEffect } from "react";

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
}

interface SimpleSearchProps<T> {
  placeholder?: string;
  icon?: ReactNode;
  fetchData: (input: string) => Promise<T>;
  onDataFound: (data: T | null) => void;
  onDataClear: () => void;
  getErrorMessage: (params: {
    error: ApiError | null;
    searchedValue: string;
  }) => string;
  messageToShow?: string;
  showResponseMessages?: boolean;
  initialValue?: string;
}

export const SimpleSearch = <T,>({
  placeholder = "Search",
  fetchData,
  onDataFound,
  onDataClear,
  getErrorMessage,
  messageToShow,
  showResponseMessages = false,
  initialValue = ""
}: SimpleSearchProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [foundData, setFoundData] = useState<T | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  // Initialize with initialValue when it changes
  useEffect(() => {
    setInputValue(initialValue);
    setSearchValue(initialValue);

    // If initialValue is cleared (e.g. from Clear All Filters), reset subsequent states
    if (!initialValue) {
      setHasSearched(false);
      setFoundData(null);
      setApiError(null);
    }
  }, [initialValue]);

  const handleGetData = useCallback(async () => {
    const targetValue = inputValue.trim();
    if (!targetValue) return;

    setFoundData(null);
    onDataFound(null);
    setSearchValue(targetValue);
    setApiError(null);
    setHasSearched(true);

    try {
      setIsLoading(true);
      const data = await fetchData(targetValue);
      
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
  }, [inputValue, fetchData, onDataFound]);

  const handleReset = useCallback(() => {
    setInputValue("");
    setSearchValue("");
    setHasSearched(false);
    setFoundData(null);
    onDataFound(null);
    setApiError(null);
    onDataClear();
    if (inputRef.current) inputRef.current.focus();
  }, [onDataFound, onDataClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleGetData();
      }
    },
    [handleGetData]
  );

  const shouldShowError = hasSearched && !isLoading && (apiError !== null || foundData === null);
  const error = shouldShowError
    ? getErrorMessage({ error: apiError, searchedValue: searchValue })
    : "";

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative group">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-200"
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
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full h-11 pl-12 pr-40 rounded-xl bg-white text-black placeholder:text-gray-400 border-2 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg dark:bg-black dark:text-white dark:placeholder:text-gray-500 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-gray-200 focus:border-[#9B3B97] focus:ring-4 focus:ring-[#9B3B97]/10 dark:border-gray-700 dark:focus:border-[#9B3B97]"
            }`}
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
              // disabled={isLoading || !inputValue.trim()}
              className="bg-[#000000] hover:bg-gray-600 dark:bg-white dark:from-white dark:to-gray-100 dark:hover:from-gray-100 dark:hover:to-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none duration-200 flex focus:outline-none focus:ring-2 focus:ring-[#9B3B97]/50 font-semibold gap-2 items-center px-3.5 py-2 rounded-lg text-sm text-white dark:text-black"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-800/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {showResponseMessages && error && (
          <div className="mt-4 p-5 bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
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
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success State - Data Found */}
        {showResponseMessages && messageToShow && foundData && !error && (
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
                  Data retrieved for: <span className="font-mono font-semibold">{inputValue}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};