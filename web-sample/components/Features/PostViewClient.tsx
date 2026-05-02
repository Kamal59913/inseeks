"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button, GlobalLoader } from "@repo/ui/index";
import { useGetPostById } from "@/hooks/postServices/useGetPostById";
import { PostResponse } from "@/lib/types/Post";
import { PostCard } from "./PostCard";
import { useSmartBack } from "@/hooks/utils/useSmartBack";

export const PostViewClient = () => {
  const params = useParams();
  const router = useRouter();
  const goBack = useSmartBack("/home");
  const postId = params.postId as string;

  const { data: postData, isLoading, isError } = useGetPostById(postId);
  const post = (postData as PostResponse)?.data;

  if (isLoading) {
    return (
      <GlobalLoader className="py-24 bg-gray-50" />
    );
  }

  if (isError || !post) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 bg-gray-50 p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">Post Not Found</h2>
        <p className="text-gray-500 mt-2 max-w-xs">
          The post you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 h-16 flex items-center sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goBack()}
          className="mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Post</h1>
      </div>

      <div className="max-w-3xl mx-auto py-6 px-6 bg-white min-h-full">
        <PostCard post={post} isDetailView />
      </div>
    </div>
  );
};
