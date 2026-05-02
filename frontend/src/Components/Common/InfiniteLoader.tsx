import React, { useEffect, useMemo, useRef } from "react";

const isScrollable = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  return /(auto|scroll|overlay)/.test(style.overflowY);
};

const getScrollParent = (element: HTMLElement | null): HTMLElement | null => {
  let current = element?.parentElement || null;

  while (current) {
    if (isScrollable(current)) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
};

interface InfiniteLoaderProps {
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  className?: string;
  label?: string;
}

export default function InfiniteLoader({
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className = "",
  label = "Loading more...",
}: InfiniteLoaderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  const canObserve = useMemo(
    () => hasMore && !isLoading,
    [hasMore, isLoading],
  );

  useEffect(() => {
    rootRef.current = getScrollParent(sentinelRef.current);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !canObserve) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;
        onLoadMore();
      },
      {
        root: rootRef.current,
        rootMargin: "160px 0px",
        threshold: 0.1,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [canObserve, onLoadMore]);

  if (!hasMore && !isLoading) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className={`flex items-center justify-center py-4 text-sm text-slate-500 ${className}`}
    >
      {isLoading ? (
        <>
          <i className="fa-solid fa-circle-notch fa-spin mr-2 text-xs text-indigo-400"></i>
          <span>{label}</span>
        </>
      ) : (
        <span className="text-slate-600">Scroll to load more</span>
      )}
    </div>
  );
}
