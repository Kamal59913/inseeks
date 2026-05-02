"use client";

import { useEffect, useRef } from "react";

// Global in-memory store for instant access before sessionStorage is read
const scrollStore = new Map<string, number>();

/**
 * A hook that returns a ref to be attached to a Radix ScrollArea component.
 * It tracks the scroll position of the viewport and restores it based on the storageKey.
 *
 * @param storageKey A unique key for this scroll context (e.g. pathname)
 */
export function useScrollRestoration(storageKey: string | null) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!storageKey || !scrollAreaRef.current) return;

    const root = scrollAreaRef.current;
    // Find the actual scrollable viewport inside the Radix ScrollArea
    const viewport = root.querySelector("[data-radix-scroll-area-viewport]");
    if (!viewport) return;

    // 1. Restore scroll
    const saved =
      sessionStorage.getItem(storageKey) || scrollStore.get(storageKey);

    if (saved) {
      const pos = parseInt(saved as string, 10);
      viewport.scrollTo({ top: pos, behavior: "instant" });

      // Setup observer to keep restoring as long as height expands
      // This is crucial for lazy-loaded images or infinite query data
      const observer = new ResizeObserver(() => {
        viewport.scrollTo({ top: pos, behavior: "instant" });
        // Disconnect observer once we've successfully reached the target or close to it
        if (viewport.scrollTop >= pos - 20) {
          observer.disconnect();
        }
      });

      if (viewport.firstElementChild) {
        observer.observe(viewport.firstElementChild);
      }

      // Failsafe cleanup for the observer
      setTimeout(() => observer.disconnect(), 1500);
    } else {
      // If no saved position, ensure we start at the top
      viewport.scrollTo({ top: 0, behavior: "instant" });
    }

    // 2. Track scroll to save on continuous update
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = (e: Event) => {
      const tgt = e.target as HTMLElement;
      const top = tgt.scrollTop;
      scrollStore.set(storageKey, top); // Instant memory save

      // Throttle sessionStorage writes
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem(storageKey, top.toString());
      }, 100);
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup and final save
    return () => {
      const lastKnown = scrollStore.get(storageKey);
      if (lastKnown !== undefined) {
        sessionStorage.setItem(storageKey, lastKnown.toString());
      }
      viewport.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [storageKey]);

  return scrollAreaRef;
}
