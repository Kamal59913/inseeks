"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/lib/api/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/utilities/tokenManagement";

interface ReactivateModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const ReactivateModal = ({ modal, onClose }: ReactivateModalProps) => {
  const { buttonLoaders } = useGlobalStore();
  const router = useRouter();

  const { username, password, reactivate_before } = (modal.data || {}) as {
    username: string;
    password: string;
    reactivate_before: string;
  };

  const isLoading = buttonLoaders["reactivate-account"] || false;

  const handleReactivate = async () => {
    const reactivateRes = await authService.reactivateAccount({
      username,
      password,
    });

    if (
      reactivateRes?.status === 200 ||
      reactivateRes?.status === 201
    ) {
      // Reactivated — now log in automatically
      const loginRes = await authService.login({ username, password });

      if (loginRes?.status === 200 || loginRes?.status === 201) {
        ToastService.success("Account reactivated! Welcome back.");
        onClose();
        router.push("/home");
      } else {
        ToastService.success("Account reactivated! Please log in.");
        onClose();
      }
    } else {
      const msg =
        reactivateRes?.data?.detail?.message ||
        reactivateRes?.data?.message ||
        "Failed to reactivate account.";
      ToastService.error(msg);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[380px] px-6 py-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden items-center z-[100]">
        <DialogTitle className="sr-only">Reactivate Account</DialogTitle>
        <div className="flex flex-col items-center text-center space-y-6 w-full">
          {/* Icon */}
          <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-[22px] font-[500] text-gray-900">
              Account Deactivated
            </h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Your account is deactivated and will be permanently deleted on{" "}
              <span className="font-semibold text-red-500">
                {reactivate_before}
              </span>
              . Would you like to reactivate it?
            </p>
          </div>

          <div className="flex flex-col w-full pt-2 justify-center gap-2">
            <Button
              onClick={handleReactivate}
              className="px-6 text-white font-semibold transition-all active:scale-[0.98] rounded-lg"
              loadingState={isLoading}
              disabled={isLoading}
            >
              Yes, Reactivate
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 font-semibold transition-all active:scale-[0.98] rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReactivateModal;
