import { Button } from "@repo/ui/index";
import { Ban, Lock } from "lucide-react";
import React from "react";
import { useModalStore } from "@/store/useModalStore";

const DeactivateSettings = () => {
  const { openModal } = useModalStore();

  return (
    <div className="px-3 border-gray-100 mt-4">
      <div className="bg-[#fcf7fe] p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="flex-1 bg-[#F3E8FF] text-[#AF52DE] hover:bg-[#F3E8FF]/80 flex items-center justify-center gap-2"
            size="sm"
            onClick={() => openModal("change-password")}
          >
            <Lock style={{ width: "16px", height: "16px" }} />
            Change Password
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-[#FFE5E5] text-[#FF4D4D] hover:bg-[#FFE5E5]/80 flex items-center justify-center gap-2"
            size="sm"
            onClick={() => openModal("deactivate-account")}
          >
            <Ban style={{ width: "16px", height: "16px" }} />
            Deactivate Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateSettings;
