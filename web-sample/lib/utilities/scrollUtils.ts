"use client";

/**
 * Scrolls the page or the nearest scrollable container to the top.
 */
export const scrollToTop = () => {
  // Try to find common scrollable containers in the app
  const scrollableElements = [
    // Standard overflow-y-auto elements
    ...Array.from(document.querySelectorAll(".overflow-y-auto")),
    // Radix UI ScrollArea viewport
    ...Array.from(
      document.querySelectorAll("[data-radix-scroll-area-viewport]"),
    ),
  ];

  if (scrollableElements.length > 0) {
    scrollableElements.forEach((el) => {
      el.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    // Fallback to window
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
