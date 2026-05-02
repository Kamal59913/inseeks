"use client";

import React from "react";
import { X, Search, Play, Pause } from "lucide-react";
import { Button } from "@repo/ui/index";

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

interface MusicPickerProps {
  onClose: () => void;
  tracks: MusicTrack[];
  onSelect: (track: MusicTrack) => void;
  selectedTrackId?: string;
  playingTrackId: string | null;
  onPlayToggle: (track: MusicTrack) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onAudioEnded: () => void;
}

export const MusicPicker = ({
  onClose,
  tracks,
  onSelect,
  selectedTrackId,
  playingTrackId,
  onPlayToggle,
  searchQuery,
  onSearchChange,
  audioRef,
  onAudioEnded,
}: MusicPickerProps) => {
  return (
    <div className="absolute inset-x-4 bottom-36 z-50 bg-white rounded-xl shadow-2xl p-4 h-[400px] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          Select Music
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X size={14} />
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search Music"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group ${selectedTrackId === track.id ? "bg-fuchsia-50" : "hover:bg-gray-50"}`}
            onClick={() => onSelect(track)}
          >
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 shrink-0">
              <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayToggle(track);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {playingTrackId === track.id ? <Pause size={16} className="text-white fill-current" /> : <Play size={16} className="text-white fill-current" />}
              </button>
              {playingTrackId === track.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Pause size={16} className="text-white fill-current" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${selectedTrackId === track.id ? "text-fuchsia-700" : "text-gray-800"}`}>
                {track.title}
              </p>
              <p className="text-xs text-gray-500 truncate">{track.artist}</p>
            </div>

            {selectedTrackId === track.id && (
              <div className="w-4 h-4 rounded-full bg-fuchsia-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
        {tracks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No music found
          </div>
        )}
      </div>
      <audio ref={audioRef} onEnded={onAudioEnded} />
    </div>
  );
};
