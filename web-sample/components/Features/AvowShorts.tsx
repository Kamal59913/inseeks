"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import {
  ActionIconButton,
  ScrollArea,
  GlobalLoader,
} from "@repo/ui/index";
import { ShortVideoCard } from "./ShortVideoCard";
import { CommentSection } from "./CommentSection";
import { SHORT_VIDEO_CARD_CONFIG } from "@/lib/config/config";

interface VideoShortsProps {
  videos: any[]; // Standard Post model from API
}

export const VideoShorts: React.FC<VideoShortsProps> = ({ videos }) => {
  const [activeVideoId, setActiveVideoId] = useState<number | string | null>(null);
  const videoRefs = useRef<{ [key: string | number]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [desktopPanelLayout, setDesktopPanelLayout] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDesktopPanelMeasured, setIsDesktopPanelMeasured] = useState(false);
  const activeVideo = videos.find((video) => String(video.id) === String(activeVideoId));

  // Intersection Observer to handle auto-play/pause
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6, // Video must be 60% visible to play
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id) setActiveVideoId(id);
        }
      });
    }, options);

    const videoElements = containerRef.current?.querySelectorAll(".video-container");
    videoElements?.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  // Handle Play/Pause based on active state
  useEffect(() => {
    videos.forEach((video) => {
      const videoEl = videoRefs.current[video.id];
      if (videoEl) {
        if (String(video.id) === String(activeVideoId)) {
          // Restart and play
          videoEl.currentTime = 0;
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Auto-play prevented
            });
          }
        } else {
          videoEl.pause();
        }
      }
    });
  }, [activeVideoId, videos]);

  useEffect(() => {
    if (!showComments) {
      setDesktopPanelLayout(null);
      setIsDesktopPanelMeasured(false);
      return;
    }

    const updateDesktopPanelLayout = () => {
      const viewportPadding =
        SHORT_VIDEO_CARD_CONFIG.DESKTOP_COMMENTS_PANEL_VIEWPORT_PADDING;
      const top = SHORT_VIDEO_CARD_CONFIG.DESKTOP_COMMENTS_PANEL_TOP;
      const left = SHORT_VIDEO_CARD_CONFIG.DESKTOP_COMMENTS_PANEL_LEFT;
      const width = SHORT_VIDEO_CARD_CONFIG.DESKTOP_COMMENTS_PANEL_WIDTH;
      const height = SHORT_VIDEO_CARD_CONFIG.DESKTOP_COMMENTS_PANEL_HEIGHT;
      const fitsViewport =
        window.innerWidth >= left + width + viewportPadding &&
        window.innerHeight >= top + height + viewportPadding;

      if (window.innerWidth < 1024 || !fitsViewport) {
        setDesktopPanelLayout(null);
        setIsDesktopPanelMeasured(true);
        return;
      }

      setDesktopPanelLayout({
        top,
        left,
        width,
        height,
      });
      setIsDesktopPanelMeasured(true);
    };

    updateDesktopPanelLayout();

    window.addEventListener("resize", updateDesktopPanelLayout);

    return () => {
      window.removeEventListener("resize", updateDesktopPanelLayout);
    };
  }, [showComments]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(!muted);
  };

  const scrollUp = () => {
    containerRef.current?.scrollBy({
      top: -containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  const scrollDown = () => {
    containerRef.current?.scrollBy({
      top: containerRef.current.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full px-6 h-[calc(100svh-240px)] md:h-[calc(100vh-220px)]">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="w-full max-w-3xl mx-auto h-full">
        {/* Container - Full width of parent */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black rounded-xl relative shadow-lg"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video) => (
            <ShortVideoCard
              key={video.id}
              post={video}
              isActive={String(video.id) === String(activeVideoId)}
              videoRef={(el) => {
                if (el) videoRefs.current[video.id] = el;
              }}
              muted={muted}
              toggleMute={toggleMute}
              commentsOpen={showComments && String(video.id) === String(activeVideoId)}
              onToggleComments={() => setShowComments(!showComments)}
            />
          ))}
        </div>
      </div>

      {/* Persistent Side Panel (Desktop only) */}
      {showComments && desktopPanelLayout && (
        <div
          className="fixed z-40 flex flex-col rounded-xl border border-gray-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]"
          style={{
            top: desktopPanelLayout.top,
            left: desktopPanelLayout.left,
            width: desktopPanelLayout.width,
            height: desktopPanelLayout.height,
          }}
        >
          <div className="flex items-center justify-between px-6 py-5 bg-white">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Comments</h3>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-semibold">
                {activeVideo?.comments_count || activeVideo?.comment_count || 0}
              </span>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900 border-none outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <ScrollArea className="flex-1">
            <div className="px-4 pb-4">
              {activeVideoId ? (
                <CommentSection postId={activeVideoId} key={activeVideoId} variant="side-panel" />
              ) : (
                <GlobalLoader className="p-20" />
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Mobile/Tablet Overlay (When not using persistent split view) */}
      {showComments && isDesktopPanelMeasured && !desktopPanelLayout && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center bg-black/35 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-3xl bg-white rounded-t-[2.5rem] flex flex-col animate-in slide-in-from-bottom-10 duration-500 shadow-[-20px_0_60px_rgba(0,0,0,0.35)]"
            style={{
              height: `${SHORT_VIDEO_CARD_CONFIG.MOBILE_COMMENTS_SHEET_HEIGHT_RATIO * 100}%`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-4 shrink-0" />
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-900">Comments</h3>
              <button onClick={() => setShowComments(false)} className="p-2 bg-gray-100 rounded-full border-none outline-none">
                <X size={20} />
              </button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-4 pb-20">
                {activeVideoId && <CommentSection postId={activeVideoId} key={activeVideoId} variant="side-panel" />}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Navigation Arrows - Floating Right */}
      <div className="hidden md:flex flex-col gap-4 fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <ActionIconButton
          onClick={scrollUp}
          className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-sm border-none h-12 w-12"
        >
          <ChevronUp className="w-6 h-6" />
        </ActionIconButton>
        <ActionIconButton
          onClick={scrollDown}
          className="p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-sm border-none h-12 w-12"
        >
          <ChevronDown className="w-6 h-6" />
        </ActionIconButton>
      </div>
    </div>
  );
};

export default VideoShorts;
