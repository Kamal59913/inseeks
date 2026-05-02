"use client";

import React from "react";
import { X, Loader2 } from "lucide-react";
import { Button, InfiniteLoader } from "@repo/ui/index";

interface GifPickerProps {
  onClose: () => void;
  gifQuery: string;
  setQuery: (query: string) => void;
  gifs: any[];
  gifsLoading: boolean;
  onGifClick: (gif: any) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isFetchingNextPage: boolean;
}

export const GifPicker = ({
  onClose,
  gifQuery,
  setQuery,
  gifs,
  gifsLoading,
  onGifClick,
  onLoadMore,
  hasMore,
  isFetchingNextPage,
}: GifPickerProps) => {
  return (
    <div className="absolute inset-x-4 bottom-36 z-50 bg-white rounded-xl shadow-2xl p-4 h-[400px] flex flex-col border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm">
          {gifQuery ? "Search GIFs" : "Trending GIFs"}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>
      <div className="mb-4 relative">
        <input
          type="text"
          value={gifQuery}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Giphy..."
          className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        {gifsLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <div className="grid grid-cols-2 gap-2">
          {gifs.map((gif, index) => (
            <div
              key={`${gif.id}-${index}`}
              className="cursor-pointer rounded-md overflow-hidden hover:opacity-80 transition-opacity aspect-video bg-gray-50"
              onClick={() => onGifClick(gif)}
            >
              <img
                src={gif.preview.url}
                alt={gif.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <InfiniteLoader
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          isLoading={isFetchingNextPage}
          className="py-4"
        />

        {!gifsLoading && gifs.length === 0 && gifQuery && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No GIFs found for "{gifQuery}"
          </div>
        )}
        {!gifQuery && gifs.length === 0 && !gifsLoading && (
          <div className="text-center py-10 text-gray-400 text-sm italic">
            Start typing to search for GIFs...
          </div>
        )}
      </div>
    </div>
  );
};
