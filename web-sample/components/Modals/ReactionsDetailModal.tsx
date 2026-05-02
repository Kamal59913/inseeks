"use client";

import React, { useState, useMemo } from "react";
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
  TabsContent,
  GlobalLoader,
} from "@repo/ui/index";
import { User } from "lucide-react";
import { ModalEntry } from "@/store/useModalStore";
import { useGetPostReactionsDetail } from "@/hooks/postServices/useGetPostReactionsDetail";
import { useGetCommentReactionsDetail } from "@/hooks/commentServices/useGetCommentReactionsDetail";

interface ReactionsDetailModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const ReactionsDetailModal = ({ modal, onClose }: ReactionsDetailModalProps) => {
  const { postId, commentId, initialTab = "all" } = (modal.data as { 
    postId?: string | number; 
    commentId?: string | number;
    initialTab?: string | number 
  }) || {};
  const [activeTab, setActiveTab] = useState<string | number>(initialTab);
  const [stableReactionTypes, setStableReactionTypes] = useState<any[]>([]);
  const [stableTotal, setStableTotal] = useState<number>(0);

  // 1. Fetch data with infinite scroll
  const postQuery = useGetPostReactionsDetail(
    postId || "", 
    activeTab === "all" ? undefined : activeTab
  );
  
  const commentQuery = useGetCommentReactionsDetail(
    commentId || "", 
    activeTab === "all" ? undefined : activeTab
  );

  const {
    data,
    isLoading,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = postId ? postQuery : commentQuery;

  const firstPageData = (data as any)?.pages?.[0]?.data;

  // 2. Keep tabs list stable even when filtering
  React.useEffect(() => {
    if (firstPageData?.reactions?.length > 0) {
      // If we don't have a stable list yet, or we're on "all" (which is the source of truth)
      if (stableReactionTypes.length === 0 || activeTab === "all") {
        setStableReactionTypes(firstPageData.reactions);
        setStableTotal(firstPageData.total_reactions);
      }
    }
  }, [firstPageData, activeTab, stableReactionTypes.length]);

  // 3. Flatten users from all pages
  const users = useMemo(() => {
    return data?.pages?.flatMap((page: any) => {
      return page?.data?.reactions?.flatMap((r: any) => 
        (r.users || []).map((u: any) => ({ ...u, reaction_emoji: r.emoji }))
      ) || [];
    }) || [];
  }, [data]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 bg-white border-0 shadow-xl sm:rounded-2xl flex flex-col overflow-hidden">
        <DialogHeader className="p-0">
          <DialogTitle className="sr-only">Post Reactions</DialogTitle>
          
          <Tabs 
            value={String(activeTab)} 
            onValueChange={(val) => setActiveTab(val === "all" ? "all" : Number(val))}
            className="w-full"
          >
            <div className="border-b border-gray-100 bg-white px-2">
              <TabsList className="h-16 bg-transparent p-0 justify-start overflow-x-auto no-scrollbar flex flex-nowrap min-w-full rounded-none">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent h-16 px-4 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none hover:text-gray-700"
                >
                  All {stableTotal > 0 && stableTotal}
                </TabsTrigger>

                {stableReactionTypes.map((rt: any) => (
                  <TabsTrigger
                    key={rt.reaction_type_id}
                    value={String(rt.reaction_type_id)}
                    className="rounded-none border-b-2 border-transparent h-16 px-4 text-sm font-medium transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none hover:text-gray-700 flex items-center gap-1.5"
                  >
                    <span>{rt.emoji}</span>
                    <span className="opacity-70 group-data-[state=active]:opacity-100">
                      {rt.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden h-full flex flex-col">
              <div className="overflow-y-auto min-h-[400px] max-h-[60vh]">
                {isLoading && !isRefetching ? (
                  <GlobalLoader className="py-20" />
                ) : users.length > 0 ? (
                  <div className="flex flex-col">
                    {users.map((user: any, idx: number) => (
                      <div
                        key={`${user.user_id}-${idx}`}
                        className="flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors border-b border-gray-50/50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border border-gray-100 shadow-sm">
                              <AvatarImage src={user.profile_photo_url} alt={user.full_name} />
                              <AvatarFallback className="bg-purple-50 text-purple-600 font-semibold">
                                {user.full_name?.charAt(0) || user.username?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md border border-gray-50 text-xs">
                              {user.reaction_emoji}
                            </div>
                          </div>
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
                    
                    <div className="py-1">
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
                      <User className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-semibold">No reactions yet</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                      Be the first to react to this post and it will show up here.
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

export default ReactionsDetailModal;
