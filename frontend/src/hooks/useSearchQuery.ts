import { useInfiniteQuery } from "@tanstack/react-query";
import { searchService } from "../services/search.service";
import { SearchResponse, SearchScope } from "../types/search";

export const useSearchQuery = (
  query: string,
  scope: SearchScope = "all",
  limit = 6,
) => {
  const searchQuery = useInfiniteQuery<SearchResponse>({
    queryKey: ["search", query, scope, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await searchService.search(
        query,
        scope,
        limit,
        pageParam as number,
      );
      return response.data.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.nextOffset : undefined,
    enabled: query.trim().length > 0,
  });
  return {
    ...searchQuery,
    data: searchQuery.data
      ? searchQuery.data.pages.reduce<SearchResponse>(
          (accumulator, page, index) => ({
            query: page.query,
            scope: page.scope,
            people: accumulator.people.concat(page.people),
            spaces: accumulator.spaces.concat(page.spaces),
            posts: accumulator.posts.concat(page.posts),
            pagination:
              index === searchQuery.data.pages.length - 1
                ? page.pagination
                : accumulator.pagination,
          }),
          {
            query,
            scope,
            people: [],
            spaces: [],
            posts: [],
            pagination: {
              limit,
              offset: 0,
              nextOffset: null,
              hasMore: false,
            },
          },
        )
      : undefined,
  };
};
