"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";

interface NensAppModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const NensAppModal = ({ modal, onClose }: NensAppModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[700px] p-8 gap-0 bg-white border-0 shadow-xl rounded-3xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Download NensApp</DialogTitle>
        <div className="flex flex-col items-center text-center space-y-7">
          {/* Hero Image */}
          <div className="w-full relative px-4">
            <img
              src="/download-hero-image.png"
              alt="Download NensApp"
              className="w-[311px] h-[304.58px] object-contain mx-auto"
            />
          </div>

          {/* Description */}
          <div className="space-y-6 px-2">
            <p className="text-[#646464] text-[12px] leading-[1.6]">
              Nensapp is a powerful platform for private messaging, group chats,
              media sharing, and broadcast channels — designed for seamless,
              secure communication.
            </p>

            <div className="bg-white p-3 rounded-[20px] text-center border border-[#E5E5E5] shadow-sm">
              <p className="text-[#E94A4A] font-semibold text-[12px]">Please Note</p>
              <p className="text-[#333333] text-[12px] leading-[1.5]">
                To register for the AvowSocial app, you must first sign up on
                our Nensapp platform. Once registered, you can access and use
                the AvowSocial app seamlessly.
              </p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-2">
            <img
              src="/app-store.png"
              alt="Download on App Store"
              className="h-[40px] w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
            <img
              src="/google-play.png"
              alt="Get it on Google Play"
              className="h-[40px] w-auto cursor-pointer hover:opacity-90 transition-opacity"
            />
          </div>

          {/* Back to Login */}
          <p className="text-[#888888] text-[14px]">
            Back to{" "}
            <span
              className="text-[#D16DF2] font-medium cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Sign Up
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NensAppModal;