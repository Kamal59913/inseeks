import { useInfiniteQuery } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";

export const useSearchUsers = (
  searchQuery: string = "",
  limit: number = 20,
) => {
  return useInfiniteQuery({
    queryKey: ["users", searchQuery, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await userService.getUsers(
        limit,
        pageParam as number,
        searchQuery,
      );
      return response;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const loadedUsersCount = lastPage?.data?.length || 0;
      if (loadedUsersCount < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    // If you want it only when there is query, uncomment below:
    // enabled: searchQuery.trim().length > 0,
  });
};
