"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/index";
import { useCommunitySubscription } from "@/hooks/communityServices/useCommunitySubscription";
import { useModalStore } from "@/store/useModalStore";

interface SubscribeButtonProps {
  communityId: string;
  initialIsSubscribed?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  isConfirmPopup?: boolean;
  communityName?: string;
}

export const SubscribeButton = ({ 
  communityId, 
  initialIsSubscribed = false,
  className = "",
  size = "default",
  isConfirmPopup = false,
  communityName = "this community",
}: SubscribeButtonProps) => {
  const { openModal } = useModalStore();
  const { isSubscribed, isLoading, subscribe, unsubscribe } = useCommunitySubscription(communityId);
  
  // Local state for optimistic UI updates (optional, but good for UX)
  // We initialize with prop but useEffect will sync with real hook data
  const [optimisticSubscribed, setOptimisticSubscribed] = useState(initialIsSubscribed);

  useEffect(() => {
    // Once hook fetches real status, sync it
    // Note: You might want to skip this if you want purely optimistic behavior during action
    if (!isLoading) {
      setOptimisticSubscribed(isSubscribed);
    }
  }, [isSubscribed, isLoading]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    e.stopPropagation();

    if (optimisticSubscribed) {
      if (isConfirmPopup) {
        openModal("confirmation", {
          title: `Unsubscribe from ${communityName}?`,
          description: "Are you sure you want to unsubscribe from this community?",
          confirmLabel: "Unsubscribe",
          variant: "destructive",
          onConfirm: async () => {
            unsubscribe();
            setOptimisticSubscribed(false);
          },
        });
      } else {
        unsubscribe();
        setOptimisticSubscribed(false);
      }
    } else {
      subscribe();
      setOptimisticSubscribed(true);
    }
  };

  return (
    <Button 
      onClick={handleClick}
      size={size}
      className={`
        ${optimisticSubscribed 
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200" 
          : "bg-primary text-white hover:bg-primary/90"
        } 
        font-medium transition-colors ${className}
      `}
    >
      {optimisticSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
};
