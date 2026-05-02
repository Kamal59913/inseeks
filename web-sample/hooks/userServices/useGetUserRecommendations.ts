import { useInfiniteQuery } from "@tanstack/react-query";
import userService from "@/lib/api/services/userService";

export const useGetUserRecommendations = (
  q: string = "",
  limit: number = 10,
  options: any = {},
) => {
  return useInfiniteQuery({
    queryKey: ["user-recommendations", q, limit],
    queryFn: ({ pageParam = 0 }) =>
      userService.getUsers(limit, pageParam as number, q),
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const loadedCount = lastPage?.data?.length || 0;
      if (loadedCount < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    ...options,
  });
};
