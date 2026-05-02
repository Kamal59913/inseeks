"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@repo/ui/index";

interface MediaItem {
  id: string;
  type: "photo" | "video" | "gif";
  url: string;
  file?: File;
}

interface MediaPreviewProps {
  selectedMedia: MediaItem[];
  removeMedia: (id: string) => void;
  selectedMusic: {
    id: string;
    title: string;
    artist: string;
    cover: string;
  } | null;
  removeMusic: () => void;
}

export const MediaPreview = ({
  selectedMedia,
  removeMedia,
  selectedMusic,
  removeMusic,
}: MediaPreviewProps) => {
  return (
    <>
      {/* Selected Music Display */}
      {selectedMusic && (
        <div className="mt-3 flex items-center gap-3 p-3 bg-fuchsia-50 border border-fuchsia-100 rounded-lg">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200">
            <img src={selectedMusic.cover} alt={selectedMusic.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{selectedMusic.title}</p>
            <p className="text-xs text-fuchsia-600 truncate">{selectedMusic.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeMusic}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 shrink-0"
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Media Preview Section */}
      {selectedMedia.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {selectedMedia.map((media) => (
            <div key={media.id} className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-video">
              {media.type === "photo" || media.type === "gif" ? (
                <img src={media.url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <video src={media.url} className="w-full h-full object-cover" controls />
              )}
              <button
                onClick={() => removeMedia(media.id)}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
