import { useEffect, RefObject } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 * @param ref Ref of the element to monitor
 * @param handler Callback function to execute on outside click
 * @param enabled Optional boolean to enable/disable the hook (default: true)
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    // Use mousedown instead of click to avoid race conditions with toggle buttons
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
