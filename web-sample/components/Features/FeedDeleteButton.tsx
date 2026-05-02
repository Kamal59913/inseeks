"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ActionIconButton, Button, cn } from "@repo/ui/index";
import { Trash2 } from "lucide-react";
import feedService from "@/lib/api/services/feedService";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalStore } from "@/store/useModalStore";
import { useAppInvalidation } from "@/hooks/postServices/useAppInvalidation";

interface FeedDeleteButtonProps {
  feedId: string | number;
  feedTitle?: string | null;
  className?: string;
  redirectTo?: string;
  iconOnly?: boolean;
  iconClassName?: string;
}

export const FeedDeleteButton = ({
  feedId,
  feedTitle = "this feed",
  className = "",
  redirectTo,
  iconOnly = false,
  iconClassName = "",
}: FeedDeleteButtonProps) => {
  const router = useRouter();
  const { openModal } = useModalStore();
  const { removeFeedFromCache } = useAppInvalidation();

  const deleteMutation = useMutation<
    { status?: boolean | number; message?: string },
    Error
  >({
    mutationFn: () => feedService.deleteFeed(feedId),
    onSuccess: (response) => {
      if (!(response?.status === true || response?.status === 200)) {
        ToastService.error(response?.message || "Failed to delete feed");
        return;
      }

      removeFeedFromCache(feedId);
      ToastService.success(response?.message || "Feed deleted successfully");
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error) => {
      ToastService.error(error?.message || "Failed to delete feed");
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (deleteMutation.isPending) return;

    openModal("confirmation", {
      title: `Delete ${feedTitle}?`,
      description:
        "This is using a temporary dummy API for now. Are you sure you want to continue?",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteMutation.mutateAsync();
      },
    });
  };

  if (iconOnly) {
    return (
      <ActionIconButton
        type="button"
        onClick={handleClick}
        disabled={deleteMutation.isPending}
        className={cn(
          "h-9 w-9 rounded-full bg-white text-red-500 shadow-sm ring-1 ring-black/5 transition hover:bg-red-50 hover:text-red-600",
          className,
        )}
        aria-label={`Delete ${feedTitle}`}
        title={`Delete ${feedTitle}`}
      >
        <Trash2 className={cn("h-4 w-4", iconClassName)} />
      </ActionIconButton>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={deleteMutation.isPending}
      className={`w-full bg-red-600 text-white hover:bg-red-700 ${className}`}
    >
      {deleteMutation.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
};
