import { BaseActionModal } from "../../ui/modals/BaseActionModal";
import { useState } from "react";

interface Props {
  modalId: string;
  data?: any;
}

const BookingActionModal: React.FC<Props> = ({ data }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (data?.type === "decline") {
      if (!reason.trim()) {
        setError("Reason is required");
        return;
      }
      data.action(reason);
    } else {
      data.action();
    }
  };

  return (
    <BaseActionModal
      title={data?.title}
      description={data?.description}
      containerClassName="p-4 lg:p-6"
      titleClassName="text-[16px] font-bold mt-3 max-w-[220px]"
      modalWidth="max-w-[353px]"
      descriptionClassName="text-black dark:text-white/90 text-[12px] font-bold max-w-[260px] mx-auto leading-relaxed"
      icon={<img src={"/exclamation_sign.svg"} className="mx-auto" />}
      actionLabel={data?.type === "decline" ? "Decline Booking" : "Accept Booking"}
      cancelLabel="Back"
      actionId="confirm-delete"
      onAction={handleConfirm}
      variant="none"
      cancelClassName="w-full font-bold text-[14px] rounded-lg h-[50px] border border-white/10
  bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%),rgba(255,255,255,0.10)]
  shadow-[inset_0_4px_4px_0_rgba(77,77,77,0.25)]
  backdrop-blur-[82px]"
      actionClassName={`w-full font-bold text-[14px] rounded-lg h-[50px] border border-[rgba(123,91,218,0.34)]
  bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%),#fff]
  backdrop-blur-[82px] ${
    data?.type === "decline" ? "text-red-500" : "text-green-500"
  }`}
    >
      {data?.type === "decline" && (
        <div className="text-left w-full mx-auto mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
            Cancellation Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            className={`w-full px-3 py-2 border-[0.5px] rounded-md focus:outline-none focus:ring-1 bg-transparent text-sm dark:text-white ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-white/40 focus:border-[#7B5BDA] focus:ring-[#7B5BDA]"
            }`}
            rows={4}
            maxLength={300}
            placeholder="Enter reason for cancellation..."
            autoFocus={true}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
      )}
    </BaseActionModal>
  );
};

export default BookingActionModal;

