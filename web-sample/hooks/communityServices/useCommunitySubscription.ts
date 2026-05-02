import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import communityService from "@/lib/api/services/communityService";
import { ToastService } from "@/lib/utilities/toastService";
import { useAppInvalidation } from "../postServices/useAppInvalidation";
import { toggleFollowState } from "@/lib/utilities/cacheHelpers";

export const useCommunitySubscription = (communityId: string) => {
  const queryClient = useQueryClient();
  const { updateCommunityCache } = useAppInvalidation();

  // Check subscription status
  const { data: isSubscribedData, isLoading: isStatusLoading } = useQuery({
    queryKey: ["community-subscription", communityId],
    queryFn: () => communityService.isSubscribed(communityId),
    enabled: !!communityId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const subscribeMutation = useMutation({
    mutationFn: () => communityService.subscribe(communityId),
    onMutate: async () => {
      // 1. Update the status query for this community
      queryClient.setQueryData(
        ["community-subscription", communityId],
        (old: any) => ({
          ...old,
          status: true,
        }),
      );

      // 2. Update community lists (isNowFollowing = true)
      updateCommunityCache(communityId, true, (c) =>
        toggleFollowState(c, true),
      );
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to subscribe");
      // Rollback
      queryClient.invalidateQueries({
        queryKey: ["community-subscription", communityId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-communities"] });
      queryClient.invalidateQueries({ queryKey: ["get-followed-communities"] });
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: () => communityService.unsubscribe(communityId),
    onMutate: async () => {
      // 1. Update the status query
      queryClient.setQueryData(
        ["community-subscription", communityId],
        (old: any) => ({
          ...old,
          status: false,
        }),
      );

      // 2. Update community lists (isNowFollowing = false)
      updateCommunityCache(communityId, false, (c) =>
        toggleFollowState(c, false),
      );
    },
    onSuccess: () => {
      // ZERO REFETCH MANDATE
    },
    onError: (error: any) => {
      ToastService.error(error?.message || "Failed to unsubscribe");
      // Rollback
      queryClient.invalidateQueries({
        queryKey: ["community-subscription", communityId],
      });
      queryClient.invalidateQueries({ queryKey: ["get-communities"] });
      queryClient.invalidateQueries({ queryKey: ["get-followed-communities"] });
    },
  });

  return {
    isSubscribed: !!(isSubscribedData as any)?.status,
    isLoading:
      isStatusLoading ||
      subscribeMutation.isPending ||
      unsubscribeMutation.isPending,
    subscribe: subscribeMutation.mutate,
    unsubscribe: unsubscribeMutation.mutate,
  };
};
