"use client";

import React from "react";
import { ActionIconButton, cn } from "@repo/ui/index";
import { Pencil } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";

interface FeedActionFeed {
  id: string | number;
  title?: string | null;
}

interface FeedEditButtonProps {
  feed: FeedActionFeed;
  className?: string;
  iconClassName?: string;
}

export const FeedEditButton = ({
  feed,
  className,
  iconClassName,
}: FeedEditButtonProps) => {
  const { openModal } = useModalStore();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    openModal("edit-feed", { feed });
  };

  return (
    <ActionIconButton
      type="button"
      onClick={handleClick}
      className={cn(
        "h-9 w-9 rounded-full bg-white text-gray-600 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50 hover:text-gray-900",
        className,
      )}
      aria-label={`Edit ${feed?.title || "feed"}`}
      title={`Edit ${feed?.title || "feed"}`}
    >
      <Pencil className={cn("h-4 w-4", iconClassName)} />
    </ActionIconButton>
  );
};
