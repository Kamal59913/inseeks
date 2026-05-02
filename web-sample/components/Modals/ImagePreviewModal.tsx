"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface MediaItem {
  id?: number;
  url: string;
  gif_url?: string | null;
  thumbnail_url?: string | null;
  media_type?: string;
}

interface ImagePreviewModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

function preloadImage(src?: string | null) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function getMediaSrc(item?: MediaItem): string | undefined {
  if (!item) return undefined;
  if (item.media_type === "gif") return item.gif_url || item.url;
  return item.url;
}

const MediaSlot = ({
  item,
  onLoad,
  onError,
  visible,
}: {
  item?: MediaItem;
  onLoad: () => void;
  onError: () => void;
  visible: boolean;
}) => {
  if (!item) return null;
  const src = getMediaSrc(item);

  if (item.media_type === "video") {
    return (
      <video
        src={src}
        controls
        autoPlay
        poster={item.thumbnail_url || undefined}
        onCanPlay={onLoad}
        onError={onError}
        style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease-in-out" }}
        className="max-w-full max-h-[calc(100vh-270px)] object-contain rounded-lg shadow-2xl absolute inset-0 m-auto"
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      onLoad={onLoad}
      onError={onError}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease-in-out" }}
      className="max-w-full max-h-[calc(100vh-270px)] object-contain rounded-lg shadow-2xl absolute inset-0 m-auto"
    />
  );
};

const ImagePreviewModal = ({ modal, onClose }: ImagePreviewModalProps) => {
  const data = (modal.data as {
    imageUrl?: string;
    media?: MediaItem[];
    initialIndex?: number;
  }) || {};

  const media: MediaItem[] = data.media
    ? data.media
    : data.imageUrl
      ? [{ url: data.imageUrl }]
      : [];

  const [currentIndex, setCurrentIndex] = useState(data.initialIndex || 0);
  const [slots, setSlots] = useState<{ a: MediaItem | undefined; b: MediaItem | undefined }>({
    a: media[data.initialIndex || 0],
    b: undefined,
  });

  // Keep activeSlot in BOTH a ref (for callbacks) and state (for rendering)
  const activeSlotRef = useRef<"a" | "b">("a");
  const [activeSlot, setActiveSlot] = useState<"a" | "b">("a");

  const [slotALoaded, setSlotALoaded] = useState(true);
  const [slotBLoaded, setSlotBLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Each navigate call gets a unique ticket; only the latest ticket's
  // onLoad is allowed to trigger the flip.
  const navTicketRef = useRef<number>(0);
  const pendingIndexRef = useRef<number>(data.initialIndex || 0);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (nextIndex: number) => {
      if (nextIndex === pendingIndexRef.current && nextIndex === currentIndex) return;

      // Cancel any pending cleanup timer from a previous nav
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }

      const ticket = ++navTicketRef.current;
      pendingIndexRef.current = nextIndex;
      const nextItem = media[nextIndex];
      setHasError(false);

      const inactive = activeSlotRef.current === "a" ? "b" : "a";

      if (inactive === "b") {
        setSlotBLoaded(false);
        setSlots((s) => ({ ...s, b: nextItem }));
      } else {
        setSlotALoaded(false);
        setSlots((s) => ({ ...s, a: nextItem }));
      }

      // Return the ticket so the slot's onLoad can validate it
      return ticket;
    },
    [currentIndex, media]
  );

  // We need onLoad to know which ticket it belongs to, so we track it per-slot
  const slotTicketRef = useRef<{ a: number; b: number }>({ a: 0, b: 0 });

  const handleSlotLoaded = useCallback((slot: "a" | "b") => {
    // Only flip if this slot was loaded for the LATEST navigate call
    if (slotTicketRef.current[slot] !== navTicketRef.current) return;

    const current = activeSlotRef.current;
    if (slot === current) return; // already active, nothing to do

    // Flip
    activeSlotRef.current = slot;
    setActiveSlot(slot);
    setCurrentIndex(pendingIndexRef.current);

    if (slot === "b") setSlotBLoaded(true);
    else setSlotALoaded(true);

    // Clean up the old slot after transition
    const oldSlot = slot === "b" ? "a" : "b";
    cleanupTimerRef.current = setTimeout(() => {
      setSlots((s) => ({ ...s, [oldSlot]: undefined }));
      if (oldSlot === "a") setSlotALoaded(false);
      else setSlotBLoaded(false);
    }, 350);
  }, []);

  // Wrap navigate to also stamp the ticket onto the target slot
  const go = useCallback(
    (nextIndex: number) => {
      const inactive = activeSlotRef.current === "a" ? "b" : "a";
      navigate(nextIndex);
      slotTicketRef.current[inactive] = navTicketRef.current;
    },
    [navigate]
  );

  useEffect(() => {
    preloadImage(getMediaSrc(media[currentIndex - 1]));
    preloadImage(getMediaSrc(media[currentIndex + 1]));
  }, [currentIndex, media]);

  const handlePrevious = useCallback(() => {
    go(currentIndex > 0 ? currentIndex - 1 : media.length - 1);
  }, [currentIndex, media.length, go]);

  const handleNext = useCallback(() => {
    go(currentIndex < media.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, media.length, go]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
    };
  }, []);

  if (media.length === 0) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="!bg-black/80 fixed inset-0 !w-screen !h-screen !max-w-none !max-h-none !translate-x-0 !translate-y-0 !left-0 !top-0 p-0 bg-transparent border-0 shadow-none flex items-center justify-center overflow-hidden rounded-none [&>button:last-child]:hidden"
        onClick={onClose}
      >
        <DialogTitle className="sr-only">Media Preview</DialogTitle>

        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-[60] p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-[60] p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Display — dual slot container */}
          <div className="relative flex items-center justify-center w-full h-full px-4 sm:px-20">
            <div className="relative max-w-full max-h-[calc(100vh-270px)] w-full h-full flex items-center justify-center">

              {hasError && (
                <div className="flex flex-col items-center gap-2 text-white/50">
                  <ImageOff className="w-12 h-12 opacity-50" />
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-50">
                    Media Unavailable
                  </span>
                </div>
              )}

              <MediaSlot
                item={slots.a}
                visible={activeSlot === "a" && slotALoaded}
                onLoad={() => handleSlotLoaded("a")}
                onError={() => setHasError(true)}
              />

              <MediaSlot
                item={slots.b}
                visible={activeSlot === "b" && slotBLoaded}
                onLoad={() => handleSlotLoaded("b")}
                onError={() => setHasError(true)}
              />
            </div>
          </div>

          {/* Counter */}
          {media.length > 1 && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[60] py-1.5 px-3 bg-black/50 rounded-full">
              <p className="text-sm text-white font-medium select-none">
                {currentIndex + 1} of {media.length}
              </p>
            </div>
          )}

          {/* Thumbnail Strip */}
          {media.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-[60] flex gap-2 pb-10 px-6 justify-center overflow-x-auto scrollbar-hide max-w-full">
              <div className="flex gap-2 p-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10">
                {media.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      go(idx);
                    }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 ${idx === currentIndex
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                      }`}
                  >
                    <img
                      src={
                        item.media_type === "gif"
                          ? item.gif_url || item.url
                          : item.thumbnail_url || item.url
                      }
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;