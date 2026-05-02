"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";

interface ConfirmationModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

interface ConfirmationData {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => Promise<void> | void;
}

const ConfirmationModal = ({ modal, onClose }: ConfirmationModalProps) => {
  const data = modal.data as ConfirmationData;
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (data.onConfirm) {
      try {
        setIsLoading(true);
        await data.onConfirm();
        onClose();
      } catch (error) {
        console.error("Confirmation action failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] px-6 py-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden items-center z-[100]">
        <DialogTitle className="sr-only">{data.title || "Confirm Action"}</DialogTitle>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-[22px] font-[500] text-gray-900 mb-2">
              {data.title || "Are you sure?"}
            </h3>
            {data.description && (
              <p className="text-gray-500 text-[15px]">
                {data.description}
              </p>
            )}
          </div>

          <div className="flex flex-col w-full pt-2 justify-center gap-2">
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6 text-white font-semibold transition-all active:scale-[0.98] rounded-lg w-full"
              loadingState={isLoading}
           >
              {data.confirmLabel || "Confirm"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 font-semibold transition-all active:scale-[0.98] rounded-lg w-full"
            >
              {data.cancelLabel || "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
