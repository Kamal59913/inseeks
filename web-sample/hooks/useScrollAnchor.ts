"use client";

import { useCallback, useRef } from "react";

const STORAGE_PREFIX = "avom-scroll-anchor:";
const CLICKED_POST_KEY = "avom-clicked-post";
const SCROLL_INTENT_KEY = "avom-scroll-intent";
const SCROLL_ORIGIN_PATH_KEY = "avom-scroll-origin-path";

/**
 * Provides post-ID-based scroll restoration.
 *
 * Instead of saving a pixel offset (which breaks when comments expand/collapse
 * and change the DOM height), we save the ID of the last visible post and
 * restore position by scrolling that element into view.
 *
 * Usage in a feed page:
 *   const { startTracking, restore } = useScrollAnchor("feed-home");
 *   useEffect(() => { startTracking(listRef); }, [posts]);
 *   useEffect(() => { if (posts.length) restore(); }, [posts]);
 */
export function useScrollAnchor(key: string) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const storageKey = `${STORAGE_PREFIX}${key}`;

  /**
   * Start observing all [data-post-id] elements inside the container.
   * The most recently intersecting element's ID is saved to sessionStorage.
   */
  const startTracking = useCallback(
    (containerRef: React.RefObject<HTMLElement | null>) => {
      if (typeof window === "undefined") return;

      // Disconnect any previous observer
      observerRef.current?.disconnect();

      const container = containerRef.current;
      if (!container) return;

      const targets = container.querySelectorAll<HTMLElement>("[data-post-id]");
      if (!targets.length) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Pick the topmost visible post (lowest boundingClientRect.top >= 0)
          const visible = entries
            .filter((e) => e.isIntersecting && e.boundingClientRect.top >= 0)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
            );

          if (visible.length > 0) {
            const first = visible[0];
            if (first) {
              const postId = (first.target as HTMLElement).dataset.postId;
              if (postId) {
                sessionStorage.setItem(storageKey, postId);
              }
            }
          }
        },
        {
          threshold: [0.1, 0.3, 0.5],
          rootMargin: "-10% 0px -10% 0px",
        },
      );

      targets.forEach((el) => observerRef.current!.observe(el));

      return () => observerRef.current?.disconnect();
    },
    [storageKey],
  );

  /**
   * Scroll the saved post into view and clear the saved anchor.
   * Call this after the post list has rendered.
   */
  const restore = useCallback(() => {
    if (typeof window === "undefined") return;

    const hasIntent = sessionStorage.getItem(SCROLL_INTENT_KEY) === "true";
    const originPath = sessionStorage.getItem(SCROLL_ORIGIN_PATH_KEY);
    const currentPath = window.location.pathname;

    // Only restore if user explicitly navigated to a post.
    // On refresh, no intent flag exists → stay at top.
    if (!hasIntent) {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(CLICKED_POST_KEY);
      sessionStorage.removeItem(SCROLL_ORIGIN_PATH_KEY);
      return;
    }

    // Restore only when returning to the exact page where the click originated.
    // This prevents stale post-click intent from affecting unrelated screens
    // like a different user's profile feed.
    if (originPath && originPath !== currentPath) {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(SCROLL_INTENT_KEY);
      sessionStorage.removeItem(CLICKED_POST_KEY);
      sessionStorage.removeItem(SCROLL_ORIGIN_PATH_KEY);
      return;
    }

    // Prefer the click-time save (exact post clicked) over the observer save
    // (which may be stale if the user scrolled and clicked quickly).
    const postId =
      sessionStorage.getItem(CLICKED_POST_KEY) ||
      sessionStorage.getItem(storageKey);

    if (!postId) {
      sessionStorage.removeItem(SCROLL_INTENT_KEY);
      sessionStorage.removeItem(SCROLL_ORIGIN_PATH_KEY);
      return;
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`post-${postId}`);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" });
      }
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(SCROLL_INTENT_KEY);
      sessionStorage.removeItem(CLICKED_POST_KEY);
      sessionStorage.removeItem(SCROLL_ORIGIN_PATH_KEY);
    });
  }, [storageKey]);

  const clear = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    observerRef.current?.disconnect();
  }, [storageKey]);

  return { startTracking, restore, clear };
}
