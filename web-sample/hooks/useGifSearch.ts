import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/clients/apiClient";

export interface GifData {
  id: string;
  title: string;
  url: string;
  embed_url: string;
  preview: {
    url: string;
    width: string;
    height: string;
  };
  original: {
    url: string;
    width: string;
    height: string;
    size: string;
  };
  downsized: {
    url: string;
    width: string;
    height: string;
  };
}

export const useGifSearch = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["gif-search", debouncedQuery],
      queryFn: async ({ pageParam = 0 }) => {
        const endpoint = debouncedQuery
          ? "/posts/gifs/search"
          : "/posts/gifs/trending";
        const response: any = await apiClient.get(endpoint, {
          params: { q: debouncedQuery, limit: 20, offset: pageParam },
        });
        return response.data.data as GifData[];
      },
      getNextPageParam: (lastPage, allPages) => {
        // If the last page has fewer than 20 items, we've reached the end
        if (!lastPage || lastPage.length < 20) return undefined;
        // Calculate next offset
        return allPages.length * 20;
      },
      initialPageParam: 0,
      enabled: true,
    });

  const gifs = data?.pages.flat() || [];

  return {
    gifs,
    setQuery,
    loading: isLoading,
    query,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
