import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@repo/ui/index";

export interface ReactionType {
  id: number;
  emoji: string;
  code: string;
  description: string;
}

interface ReactionPickerProps {
  reactions: ReactionType[];
  onSelect: (reactionType: ReactionType) => void;
  className?: string;
  buttonClassName?: string;
  isReversed?: boolean;
  anchorRect?: DOMRect | null;
}

export const ReactionPicker = ({
  reactions,
  onSelect,
  className = "",
  buttonClassName = "",
  isReversed = false,
  anchorRect = null,
}: ReactionPickerProps) => {
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!reactions || reactions.length === 0 || !mounted) return null;

  const content = (
    <div
      className={cn(
        "fixed p-1 bg-white border border-gray-100 rounded-full shadow-2xl flex items-center gap-1 z-[100000] animate-in fade-in zoom-in-95 duration-200",
        isReversed && "flex-row-reverse",
        className
      )}
      style={anchorRect ? {
        top: `${anchorRect.top - 2}px`,
        left: isReversed ? "auto" : `${anchorRect.left}px`,
        right: isReversed ? `${window.innerWidth - anchorRect.right}px` : "auto",
        transform: "translateY(-100%)"
      } : {}}
      onClick={(e) => e.stopPropagation()}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.id}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(reaction);
          }}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 hover:scale-125 transition-all text-lg duration-200",
            buttonClassName
          )}
          title={reaction.description}
        >
          {reaction.emoji}
        </button>
      ))}
    </div>
  );

  return createPortal(content, document.body);
};
