"use client";
import React from "react";
import { ScrollArea, GlobalLoader } from "@repo/ui/index";
import { ImageOff } from "lucide-react";
import { CommunityHeader } from "./CommunityHeader";
import { CommunityFeed } from "./CommunityFeed";
import { useGetCommunityById } from "@/hooks/communityServices/useGetCommunityById";
import { useGetPosts } from "@/hooks/postServices/useGetPosts";

interface CommunityViewProps {
  id: string;
  activeTab?: string;
}

const CommunityView = ({ id, activeTab = "top-feeds" }: CommunityViewProps) => {
  // 1. Fetch Community Details
  const { 
    data: communityResponse, 
    isLoading: isCommunityLoading, 
    isError: isCommunityError 
  } = useGetCommunityById(id);
  
  const communityData = (communityResponse as any)?.data || communityResponse;

  // 2. Fetch Latest Posts using generic posts API with community_id filter
  const { 
    data: postsResponse, 
    isLoading: isPostsLoading 
  } = useGetPosts("all", 20, {}, undefined, undefined, id);

  const postsData = (postsResponse as any)?.pages?.flatMap((page: any) => page.data || []) || [];

  if (isCommunityLoading) {
    return (
      <GlobalLoader className="h-screen items-center bg-white" />
    );
  }

  if (isCommunityError || !communityData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-center">
        <ImageOff className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Community Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          The community you're looking for doesn't exist or has been removed.
        </p>
        <button 
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg"
          onClick={() => window.location.href = "/home"}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white h-screen">
      <ScrollArea className="h-full">
         <div className="max-w-3xl mx-auto border-x border-gray-100 min-h-screen bg-white">
            <CommunityHeader community={communityData} />
            <CommunityFeed 
              id={id} 
              posts={postsData} 
              isLoading={isPostsLoading} 
              activeTab={activeTab}
            />
         </div>
      </ScrollArea>
    </div>
  );
};

export default CommunityView;
