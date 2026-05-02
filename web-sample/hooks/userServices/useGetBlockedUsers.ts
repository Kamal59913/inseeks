import { useInfiniteQuery } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";

export const useGetBlockedUsers = (limit: number = 20, options: any = {}) => {
  return useInfiniteQuery({
    queryKey: ["blocked-users", limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response: any = await userService.getBlockedUsers(
        limit,
        pageParam as number,
      );

      if (
        response?.status === false ||
        (typeof response?.status === "number" && response.status >= 400)
      ) {
        if (response.status === 404 || response?.data?.detail === "Not Found") {
          return { data: [] };
        }
        throw new Error(
          response?.data?.message ||
            response?.message ||
            response?.data?.detail ||
            "Failed to fetch blocked users",
        );
      }
      if (
        response?.detail === "Not Found" ||
        response?.data?.detail === "Not Found"
      ) {
        return { data: [] };
      }

      return response;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const loadedCount = lastPage?.data?.length || 0;
      if (loadedCount < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    ...options,
  });
};
