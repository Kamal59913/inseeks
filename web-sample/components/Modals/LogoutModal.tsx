"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@repo/ui/index";
import { ModalEntry } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ToastService } from "@/lib/utilities/toastService";

interface LogoutModalProps {
  modal: ModalEntry;
  onClose: () => void;
}

const LogoutModal = ({ modal, onClose }: LogoutModalProps) => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    onClose();
    ToastService.success("Logged out successfully");
    router.push("/");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] px-6 py-8 bg-white border-0 shadow-xl rounded-3xl overflow-hidden items-center z-[100]">
        <DialogTitle className="sr-only">Confirm Logout</DialogTitle>
        <div className="flex flex-col items-center text-center space-y-6">
          {/* <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div> */}

          <div className="space-y-2">
            <h3 className="text-[22px] font-[500] text-gray-900 mb-2">
              Confirm Log Out?
            </h3>
            <p className="text-gray-500 text-[15px]">
              Are you sure you want to Sign Out?
            </p>
          </div>

          <div className="flex flex-col w-full pt-2 justify-center gap-2">
          {/* <div className="flex flex-row w-full pt-2 justify-center gap-2"> */}
            <Button
              onClick={handleLogout}
              className="px-6 text-white font-semibold transition-all active:scale-[0.98] rounded-lg"
            >
              Logout
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 font-semibold transition-all active:scale-[0.98] rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;
