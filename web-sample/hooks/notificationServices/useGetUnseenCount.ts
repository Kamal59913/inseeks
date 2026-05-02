import { useQuery } from "@tanstack/react-query";
import notificationService from "@/lib/api/services/notificationService";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";

export const useGetUnseenCount = () => {
  const setUnseenCount = useNotificationStore((state) => state.setUnseenCount);

  const query = useQuery({
    queryKey: ["unseen-count"],
    queryFn: async () => {
      const response = await notificationService.getUnseenCount();
      return response?.data?.unseen_count ?? 0;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setUnseenCount(query.data);
    }
  }, [query.data, setUnseenCount]);

  return query;
};
