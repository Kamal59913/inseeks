"use client";

import { useCallback, useRef } from "react";

interface UseEntityScrollAnchorOptions {
  key: string;
  dataAttribute: string;
  clickedStorageKey: string;
  intentStorageKey: string;
  elementIdPrefix: string;
}

const STORAGE_PREFIX = "avom-scroll-anchor:";

export function useEntityScrollAnchor({
  key,
  dataAttribute,
  clickedStorageKey,
  intentStorageKey,
  elementIdPrefix,
}: UseEntityScrollAnchorOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const storageKey = `${STORAGE_PREFIX}${key}`;

  const startTracking = useCallback(
    (containerRef: React.RefObject<HTMLElement | null>) => {
      if (typeof window === "undefined") return;

      observerRef.current?.disconnect();

      const container = containerRef.current;
      if (!container) return;

      const targets = container.querySelectorAll<HTMLElement>(`[${dataAttribute}]`);
      if (!targets.length) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting && entry.boundingClientRect.top >= 0)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

          const first = visible[0];
          if (!first) return;

          const entityId = first.target.getAttribute(dataAttribute);
          if (entityId) {
            sessionStorage.setItem(storageKey, entityId);
          }
        },
        {
          threshold: [0.1, 0.3, 0.5],
          rootMargin: "-10% 0px -10% 0px",
        },
      );

      targets.forEach((el) => observerRef.current?.observe(el));
    },
    [dataAttribute, storageKey],
  );

  const restore = useCallback(() => {
    if (typeof window === "undefined") return;

    const hasIntent = sessionStorage.getItem(intentStorageKey) === "true";
    if (!hasIntent) {
      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(clickedStorageKey);
      return;
    }

    const entityId =
      sessionStorage.getItem(clickedStorageKey) ||
      sessionStorage.getItem(storageKey);

    if (!entityId) {
      sessionStorage.removeItem(intentStorageKey);
      return;
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`${elementIdPrefix}${entityId}`);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "instant" });
      }

      sessionStorage.removeItem(storageKey);
      sessionStorage.removeItem(intentStorageKey);
      sessionStorage.removeItem(clickedStorageKey);
    });
  }, [clickedStorageKey, elementIdPrefix, intentStorageKey, storageKey]);

  const clear = useCallback(() => {
    sessionStorage.removeItem(storageKey);
    observerRef.current?.disconnect();
  }, [storageKey]);

  return { startTracking, restore, clear };
}
