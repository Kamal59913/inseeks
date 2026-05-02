"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui/index";
import CreatePost from "@/components/icons/CreatePost";
import CreateFeed from "@/components/icons/CreateFeed";

interface MainViewProps {
  onOpenPost: () => void;
  onOpenFeed: () => void;
}

export const MainView = ({ onOpenPost, onOpenFeed }: MainViewProps) => {
  return (
    <div className="p-4 bg-white rounded-md">
      <h2 className="text-lg font-medium text-gray-700 mb-3">
        Create a New
      </h2>

      <div className="space-y-3">
        <Button
          onClick={onOpenPost}
          className="w-full flex items-center justify-between transition-colors bg-[#F8E8FD] hover:bg-[#F8E8FD] shadow-none border-[#EDC5FA] border px-3 h-12"
        >
          <div className="flex items-center gap-2">
            <div className="p-1">
              <CreatePost width={24} height={24} />
            </div>
            <span className="text-primary font-normal">Post</span>
          </div>
          <Plus className="text-primary group-hover:scale-110 transition-transform" size={24} />
        </Button>

        <Button
          onClick={onOpenFeed}
          className="w-full flex items-center justify-between transition-colors bg-[#F8E8FD] hover:bg-[#F8E8FD] shadow-none border-[#EDC5FA] border px-3 h-12"
        >
          <div className="flex items-center gap-2">
            <div className="p-1">
              <CreateFeed width={24} height={24} />
            </div>
            <span className="text-primary font-normal">Create Feed</span>
          </div>
          <Plus className="text-primary group-hover:scale-110 transition-transform" size={24} />
        </Button>
      </div>
    </div>
  );
};
