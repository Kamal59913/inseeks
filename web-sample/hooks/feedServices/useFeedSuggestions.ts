import { useInfiniteQuery } from "@tanstack/react-query";
import feedService from "@/lib/api/services/feedService";

interface FeedSuggestion {
  id: number;
  title: string;
  creator_user_id: number;
  main_post_id: number | null;
  created_at: string;
  updated_at: string;
  subscriber_count?: number;
  follower_avatars?: string[];
}

export const useFeedSuggestions = (
  filter: string = "all",
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: ["feed-suggestions", filter, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await feedService.getFeedSuggestions(
        limit,
        filter,
        pageParam as number,
      );
      const data = (response as any)?.data || response;
      return {
        feeds: Array.isArray(data) ? data : [],
        nextOffset: pageParam + limit,
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.feeds.length < limit) return undefined;
      return lastPage.nextOffset;
    },
    initialPageParam: 0,
  });
};
