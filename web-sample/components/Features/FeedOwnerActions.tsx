"use client";

import React from "react";
import { cn } from "@repo/ui/index";
import { FeedEditButton } from "./FeedEditButton";
import { FeedDeleteButton } from "./FeedDeleteButton";

interface FeedOwnerActionFeed {
  id: string | number;
  title?: string | null;
}

interface FeedOwnerActionsProps {
  feed: FeedOwnerActionFeed;
  redirectTo?: string;
  className?: string;
  actionClassName?: string;
  iconClassName?: string;
}

export const FeedOwnerActions = ({
  feed,
  redirectTo,
  className,
  actionClassName,
  iconClassName,
}: FeedOwnerActionsProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 p-1.5 shadow-lg backdrop-blur",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <FeedEditButton
        feed={feed}
        className={actionClassName}
        iconClassName={iconClassName}
      />
      <FeedDeleteButton
        feedId={feed.id}
        feedTitle={feed.title}
        redirectTo={redirectTo}
        iconOnly
        className={actionClassName}
        iconClassName={iconClassName}
      />
    </div>
  );
};
