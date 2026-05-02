"use client";

import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@repo/ui/index";
import { Heart, Share2 } from "lucide-react";
import { ModalEntry } from "@/store/useModalStore";

interface StoryModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

interface StoryData {
  avatar?: string;
  username?: string;
}

const StoryModal = ({ modal, onClose }: StoryModalProps) => {
  const storyData = modal.data as StoryData | undefined;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[90vh] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Story View</DialogTitle>
        <div className="relative w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
          <div className="absolute top-0 left-0 right-0 p-2 z-10">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-1/2 transition-all duration-300"></div>
            </div>
          </div>

          <div className="absolute top-6 left-0 right-0 px-4 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarImage
                  src={storyData?.avatar}
                  alt={storyData?.username}
                />
                <AvatarFallback>
                  {storyData?.username?.slice(1, 3)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">
                  {storyData?.username}
                </p>
                <p className="text-white/80 text-xs">2h ago</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>

          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center p-8">
              <h2 className="text-3xl font-bold mb-4">Story Content</h2>
              <p className="text-lg opacity-90">
                This is where the story content would appear
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 px-4 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Send message..."
              className="flex-1 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-full px-4 py-2 outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Heart className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryModal;
