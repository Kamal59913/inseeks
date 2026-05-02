"use client";

import React from "react";
import { 
  Plus, 
  Image as ImageIcon, 
  Camera as CameraIcon, 
  Video, 
  Music, 
  Smile, 
  X 
} from "lucide-react";
import { Button } from "@repo/ui/index";

interface ActionButtonsProps {
  showCameraOptions: boolean;
  setShowCameraOptions: (show: boolean) => void;
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  cameraPhotoInputRef: React.RefObject<HTMLInputElement | null>;
  cameraVideoInputRef: React.RefObject<HTMLInputElement | null>;
  setShowGifPicker: (show: boolean) => void;
  showGifPicker: boolean;
  setShowMusicPicker: (show: boolean) => void;
  showMusicPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  showEmojiPicker: boolean;
  isGifDisabled?: boolean;
  isMusicDisabled?: boolean;
  hideMediaActions?: boolean;
  hasSelectedGif?: boolean;
}

export const ActionButtons = ({
  showCameraOptions,
  setShowCameraOptions,
  galleryInputRef,
  cameraPhotoInputRef,
  cameraVideoInputRef,
  setShowGifPicker,
  showGifPicker,
  setShowMusicPicker,
  showMusicPicker,
  setShowEmojiPicker,
  showEmojiPicker,
  isGifDisabled = false,
  isMusicDisabled = false,
  hideMediaActions = false,
  hasSelectedGif = false,
}: ActionButtonsProps) => {
  const shouldShowMediaActions = !hideMediaActions;

  return (
    <div className="flex items-center gap-4 mb-4 relative min-h-[36px]">
      {showCameraOptions && shouldShowMediaActions ? (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 h-9 px-4"
            onClick={() => {
              cameraPhotoInputRef.current?.click();
              setShowCameraOptions(false);
            }}
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 h-9 px-4"
            onClick={() => {
              cameraVideoInputRef.current?.click();
              setShowCameraOptions(false);
            }}
          >
            <Video className="mr-2 h-4 w-4" />
            Record Video
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:bg-gray-100 rounded-full"
            onClick={() => setShowCameraOptions(false)}
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <>
          {shouldShowMediaActions && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-primary bg-gray-100 rounded-full h-9 w-9"
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
          )}

          {shouldShowMediaActions && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-primary bg-gray-100 rounded-full h-9 w-9"
              onClick={() => setShowCameraOptions(true)}
            >
              <CameraIcon className="h-5 w-5" />
            </Button>
          )}

          {shouldShowMediaActions && !hasSelectedGif && (
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 bg-gray-100 rounded-full h-9 w-9 ${isGifDisabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:text-primary"}`}
              onClick={() => {
                if (isGifDisabled) return;
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              disabled={isGifDisabled}
            >
              <span className="text-[10px] font-bold border border-current rounded px-0.5">GIF</span>
            </Button>
          )}
          {shouldShowMediaActions && (
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full h-9 w-9 ${showMusicPicker ? "text-primary bg-primary/10" : "text-gray-400 bg-gray-100"} ${isMusicDisabled ? "opacity-50 grayscale cursor-not-allowed" : "hover:text-primary"}`}
              onClick={() => {
                if (isMusicDisabled) return;
                setShowMusicPicker(!showMusicPicker);
                setShowEmojiPicker(false);
                setShowGifPicker(false);
                setShowCameraOptions(false);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              disabled={isMusicDisabled}
            >
              <Music className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full h-9 w-9 ${showEmojiPicker ? "text-primary bg-primary/10" : "text-gray-400 bg-gray-100 hover:text-primary"}`}
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowGifPicker(false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Smile className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};
