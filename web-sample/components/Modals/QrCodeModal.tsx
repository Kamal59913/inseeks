"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { QRCodeSVG } from "qrcode.react";
import { copyToClipboard } from "@/lib/utilities/clipboardUtils";
import { Copy, User } from "lucide-react";

interface QrCodeModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const QrCodeModal = ({ modal, onClose }: QrCodeModalProps) => {
  const { userData } = (modal.data as any) || {};

  // Corrected URL: /u/username (as per implementation plan)
  const profileUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/u/${userData?.username}`
      : "";

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData?.full_name}'s Profile`,
          text: `Check out ${userData?.full_name}'s profile on Avom!`,
          url: profileUrl,
        });
        return;
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Error sharing, falling back to copy:", error);
      }
    }

    await copyToClipboard(profileUrl, "Profile link copied!");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-8 bg-white border-0 shadow-xl rounded-[32px] overflow-hidden">
        <DialogTitle className="sr-only">Your QR Code</DialogTitle>
        <div className="flex flex-col items-center space-y-8">
          {/* Profile Card */}
          <div className="w-full flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Avatar className="w-12 h-12 mr-3">
              <AvatarImage
                src={userData?.profile_photo_url}
                alt={userData?.full_name}
              />
              <AvatarFallback>
                <User className="w-4.5 h-4.5 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {userData?.full_name}
              </span>
              <span className="text-sm text-gray-500">
                @{userData?.username}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-inner">
            <QRCodeSVG
              value={profileUrl}
              size={200}
              level="H"
              includeMargin={false}
              fgColor="#333333"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-2">
            <Button
              onClick={handleShare}
              className="px-6 text-white font-semibold transition-all active:scale-[0.98] rounded-lg"
            >
              Share QR Code
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void copyToClipboard(profileUrl, "Link copied!");
              }}
              className="px-6 font-semibold transition-all active:scale-[0.98] rounded-lg"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
