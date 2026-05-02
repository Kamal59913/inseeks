"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useNonRestrictiveTutorial } from "./useNonRestrictiveTutorial";
import { useUserData } from "@/store/hooks/useUserData";
import { copyToClipboard } from "@/lib/utilities/copyToClipboard";
import { getFullProfileUrl } from "@/lib/utilities/profileUtils";

export const NonRestrictiveTutorialPopup: React.FC = () => {
  const { shouldShowPopup, currentConfig, dismissCurrentPage } =
    useNonRestrictiveTutorial();
  const { userData } = useUserData();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay to ensure proper rendering
    if (shouldShowPopup) {
      const timer = setTimeout(() => setIsOpen(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [shouldShowPopup]);

  const handleClose = () => {
    setIsOpen(false);
    dismissCurrentPage();
  };

  const handleCTA = () => {
    setIsOpen(false);
    dismissCurrentPage();
    // Optionally execute any custom action from config
    // if (currentConfig?.ctaAction) {
    //   currentConfig.ctaAction();
    // }
  };

  if (!shouldShowPopup || !currentConfig) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-[341px]"
      outsideClick={true}
      showCloseButton={true}
      crossButtonVariant="white-circle"
      variant="transparent"
    >
      <div className="text-center items-center no-scrollbar relative w-full h-full min-h-[280px] overflow-y-auto rounded-2xl border border-white pt-[72px] px-12 pb-12 flex flex-col gap-8 backdrop-blur-lg bg-black/40">
        {/* Title */}
        <h2 className="text-[16px] font-medium text-white">
          {currentConfig.title}
        </h2>

        {/* Description */}
        <p className="text-[12px] text-white font-medium">
          {currentConfig.description}
        </p>

        {currentConfig.module === "finished_step" ? (
          <div className="flex gap-2 w-full">
            <div className="flex-1 h-10 bg-[#FFFFFF0D] border border-white/5 rounded-lg px-4 py-2 flex items-center overflow-x-auto min-w-0">
              <span className="text-gray-500 text-sm whitespace-nowrap">
                {process.env.NEXT_PUBLIC_CLIENT_URL || "emperabeauty.com"}/
              </span>
              <span className="text-white text-sm whitespace-nowrap">
                {userData?.user?.username}
              </span>
            </div>
            <Button
              variant="glass"
              size="rg"
              borderRadius="rounded-[12px]"
              className="font-medium text-[14px]"
              onClick={() => {
                copyToClipboard(
                  getFullProfileUrl(userData?.user?.username ?? ""),
                  "The profile link is copied to clipboard"
                );
                handleCTA(); // Dismiss on copy? Or just let them copy and manual click close?
                // User request: "once submit it will also start to disappear"
                // "submit" usually refers to the action. Clicking copy is the action here.
                // So we dismiss on copy.
              }}
            >
              Copy
            </Button>
          </div>
        ) : (
          /* CTA Button */
          <Button
            onClick={handleCTA}
            size="rg"
            borderRadius="rounded-[14px]"
            className="font-medium text-[14px]"
          >
            {currentConfig.ctaText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

