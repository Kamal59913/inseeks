"use client";

import React, { useState, useRef, useEffect } from "react";

interface ExpandableTextProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
  expanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  showExpandButton?: boolean;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({
  children,
  maxHeight = "20rem",
  className = "",
  expanded: controlledExpanded,
  onToggle,
  showExpandButton = true,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setIsOverflowing(scrollHeight > clientHeight + 1);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, maxHeight, isExpanded]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggle) {
      onToggle(!isExpanded);
    } else {
      setInternalExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`${className} overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{
          maxHeight: isExpanded ? "none" : maxHeight,
        }}
      >
        {children}
      </div>
      
      {showExpandButton && (isOverflowing || isExpanded) && (
        <button
          type="button"
          onClick={toggleExpand}
          className="mt-1 text-xs font-semibold text-primary hover:underline focus:outline-none"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};
