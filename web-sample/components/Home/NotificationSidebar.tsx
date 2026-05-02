import { useState, useMemo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  InfiniteLoader,
  EmptyState,
  Button,
  GlobalLoader,
} from "@repo/ui/index";
import { useGetNotifications } from "@/hooks/notificationServices/useGetNotifications";
import { formatTimeAgo } from "@/lib/utilities/timeUtils";
import { Notification } from "@/lib/types/Notification";
import { useEffect } from "react";
import notificationService from "@/lib/api/services/notificationService";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";

const NotificationItem = ({ notification }: { notification: Notification }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer">
    <Avatar className="w-10 h-10 border border-gray-200">
      <AvatarImage
        src={notification.profile_image || undefined}
        alt={notification.title}
      />
      <AvatarFallback className="bg-gray-100 text-gray-400">
        <User size={20} />
      </AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
      <p className="text-sm text-gray-700">{notification.message}</p>
      <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
    </div>
    {!notification.is_read && (
      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
    )}
  </div>
);

export const NotificationSidebar = () => {
  const [activeTab, setActiveTab] = useState("all");
  const resetUnseenCount = useNotificationStore((state) => state.resetUnseenCount);
  const queryClient = useQueryClient();

  useEffect(() => {
    const markAsSeen = async () => {
      try {
        // Optimistically update the notifications list in React Query cache
        queryClient.setQueriesData({ queryKey: ["notifications"] }, (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: (page.data || []).map((n: Notification) => ({
                ...n,
                is_read: true,
              })),
            })),
          };
        });

        await notificationService.markNotificationsAsSeen();
        // Reset local count instantly
        resetUnseenCount();
        // Invalidate the unseen count query to keep it in sync
        queryClient.invalidateQueries({ queryKey: ["unseen-count"] });
      } catch (error) {
        console.error("Failed to mark notifications as seen", error);
      }
    };

    markAsSeen();
  }, [resetUnseenCount, queryClient]);

  const getFilterValue = (tab: string) => {
    switch (tab) {
      case "mentions":
        return "comment";
      case "interactions":
        return "like";
      default:
        return "all";
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetNotifications(getFilterValue(activeTab));

  const notifications = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data || []) || [];
  }, [data]);

  return (
    <div className="h-full flex flex-col border-none">
      <div className="p-4 border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="grid grid-cols-3 m-4 bg-gray-100 rounded-full flex-shrink-0">
          <TabsTrigger value="all" className="rounded-full">
            All
          </TabsTrigger>
          <TabsTrigger value="mentions" className="rounded-full">
            Mentions
          </TabsTrigger>
          <TabsTrigger value="interactions" className="rounded-full">
            Interactions
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 mt-2 pb-10">
            {isLoading ? (
              <GlobalLoader />
            ) : isError ? (
              <div className="text-center py-10 text-red-500 text-sm bg-red-50 rounded-xl m-2">
                Failed to load notifications. Please try again.
              </div>
            ) : notifications.length === 0 ? (
              <div className="pt-20">
                <EmptyState title="No notifications found" />
              </div>
            ) : (
              <>
                {notifications.map((notification: Notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}

                {/* Infinite Loader Trigger & Manual Fallback */}
                <div className="mt-4">
                  {hasNextPage && (
                    <div className="flex flex-col items-center gap-2">
                      <InfiniteLoader
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                        isLoading={isFetchingNextPage}
                        className="py-2"
                      />
                      {!isFetchingNextPage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          className="text-xs text-gray-400 hover:text-primary transition-colors"
                        >
                          Show more
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
