"use client";

import React from "react";
import { EyeOff } from "lucide-react";
import { cn } from "@repo/ui/index";

interface HiddenContentUndoProps {
  message: string;
  onUndo: (e: React.MouseEvent) => void;
  className?: string;
}

export const HiddenContentUndo = ({
  message,
  onUndo,
  className,
}: HiddenContentUndoProps) => {
  return (
    <div
      className={cn(
        "bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-300",
        className
      )}
    >
      <div className="flex items-center space-x-2 text-gray-500">
        <EyeOff size={18} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onUndo}
        className="text-primary font-bold hover:underline px-4 py-2 bg-primary/10 rounded-full text-xs uppercase tracking-wider transition-colors hover:bg-primary/20"
      >
        Undo
      </button>
    </div>
  );
};
