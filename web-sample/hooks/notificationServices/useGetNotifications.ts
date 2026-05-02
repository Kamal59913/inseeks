import { useInfiniteQuery } from "@tanstack/react-query";
import notificationService from "@/lib/api/services/notificationService";

export const useGetNotifications = (
  filter: string = "all",
  limit: number = 10,
  options: any = {},
) => {
  return useInfiniteQuery({
    queryKey: ["notifications", filter, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await notificationService.getNotifications(
        filter,
        limit,
        pageParam as number,
      );
      // Depending on axios response structure (response.data)
      return (response as any).data;
    },
    getNextPageParam: (lastPage: any, allPages: any[]) => {
      const notifications = lastPage?.data || [];
      if (notifications.length < limit) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
    ...options,
  });
};
