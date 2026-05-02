import React, { useState } from "react";
import { useModalData } from "../../store/hooks";
import AppModal from "./AppModal";
import Button from "../Common/Button";

interface ConfirmationModalProps {
  modalId: string;
  data: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "destructive";
    onConfirm?: () => Promise<void> | void;
    action?: () => void; // Support legacy action prop
  };
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  modalId,
  data,
}) => {
  const { close } = useModalData();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (data?.onConfirm) {
      try {
        setIsLoading(true);
        await data.onConfirm();
        close();
      } catch (error) {
        console.error("Confirmation action failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (data?.action) {
      data.action();
      close();
    } else {
      close();
    }
  };

  return (
    <AppModal onClose={() => close()} contentClassName="max-w-sm mx-auto">
      <div className="text-center p-8 bg-[#090e1a] rounded-xl border border-[#1f2e47]">
        <div className="mb-6">
          <h4 className="text-2xl font-bold text-white mb-2">
            {data?.title || "Are you sure?"}
          </h4>
          <p className="text-slate-400 text-sm">
            {data?.description || "Please confirm your action to proceed."}
          </p>
        </div>

        <div className="flex flex-col gap-3 justify-center w-full">
          <Button
            variant="custom"
            onClick={handleConfirm}
            loadingState={isLoading}
            className={`w-full font-bold py-3 px-6 rounded-xl transition-all ${
              data?.variant === "destructive" || !data?.variant
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
            }`}
          >
            {data?.confirmLabel || "Confirm"}
          </Button>
          <Button
            variant="custom"
            onClick={() => close()}
            disabled={isLoading}
            className="w-full bg-[#1a2540] hover:bg-[#1e2d4a] text-slate-300 font-bold py-3 px-6 rounded-xl transition-all"
          >
            {data?.cancelLabel || "Cancel"}
          </Button>
        </div>
      </div>
    </AppModal>
  );
};

export default ConfirmationModal;
