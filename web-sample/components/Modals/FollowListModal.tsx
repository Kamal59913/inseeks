"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  InfiniteLoader,
  Tabs,
  TabsList,
  TabsTrigger,
  GlobalLoader,
} from "@repo/ui/index";
import { User as UserIcon } from "lucide-react";
import { ModalEntry } from "@/store/useModalStore";
import { useGetFollowers } from "@/hooks/userServices/useGetFollowers";
import { useGetFollowing } from "@/hooks/userServices/useGetFollowing";

interface FollowListModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const FollowListModal = ({ modal, onClose }: FollowListModalProps) => {
  const router = useRouter();
  const { userId, initialTab = "followers" } = (modal.data as { 
    userId: string | number; 
    initialTab?: "followers" | "following" 
  }) || {};
  
  const [activeTab, setActiveTab] = useState<"followers" | "following">(initialTab);

  const followersQuery = useGetFollowers(userId, 20, { enabled: activeTab === "followers" });
  const followingQuery = useGetFollowing(userId, 20, { enabled: activeTab === "following" });

  const {
    data,
    isLoading,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = activeTab === "followers" ? followersQuery : followingQuery;

  const users = useMemo(() => {
    return data?.pages?.flatMap((page: any) => page?.data || []) || [];
  }, [data]);

  const handleUserClick = (username: string) => {
    onClose();
    router.push(`/u/${username}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white border-0 shadow-xl sm:rounded-2xl flex flex-col overflow-hidden">
        <DialogHeader className="p-0">
          <DialogTitle className="sr-only">
            {activeTab === "followers" ? "Followers" : "Following"}
          </DialogTitle>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(val) => setActiveTab(val as "followers" | "following")}
            className="w-full"
          >
            <div className="border-b border-gray-100 bg-white">
              <TabsList className="h-14 bg-transparent p-0 justify-center flex rounded-none">
                <TabsTrigger
                  value="followers"
                  className="flex-1 rounded-none border-b-2 border-transparent h-14 text-sm font-semibold transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none hover:text-gray-700"
                >
                  Followers
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="flex-1 rounded-none border-b-2 border-transparent h-14 text-sm font-semibold transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none hover:text-gray-700"
                >
                  Following
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden h-full flex flex-col">
              <div className="overflow-y-auto min-h-[300px] max-h-[60vh]">
                {isLoading && !isRefetching ? (
                  <GlobalLoader className="py-20" />
                ) : users.length > 0 ? (
                  <div className="flex flex-col">
                    {users.map((user: any) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                        onClick={() => handleUserClick(user.username)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                            <AvatarImage src={user.profile_photo_url} alt={user.full_name} />
                            <AvatarFallback className="bg-purple-50 text-purple-600 font-semibold">
                              {user.full_name?.charAt(0) || user.username?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 leading-tight">
                              {user.full_name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="py-2">
                      <InfiniteLoader
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                        isLoading={isFetchingNextPage}
                      />
                    </div>
                  </div>
                ) : !isLoading && (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <UserIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-semibold">
                      {activeTab === "followers" ? "No followers yet" : "No following yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FollowListModal;
