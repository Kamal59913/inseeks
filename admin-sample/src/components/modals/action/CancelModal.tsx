import { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import { useModalData } from "../../../redux/hooks/useModal";

interface Props {
  modalId: string;
  data?: any;
}

const CancelModal: React.FC<Props> = ({ data }) => {
  const { isButtonLoading } = useGlobalStates();
  const { close } = useModalData();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (data?.validationRequired && !reason.trim()) {
      setError(data?.validationError || "Reason is required");
      return;
    }
    data.action(reason);
  };

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[600px] m-4"
      outsideClick={false}
    >
      <div className="text-center no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-11">
        
        {/* Heading */}
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white/90">
            {data?.title}
          </h4>
        </div>

        {/* Body */}
        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
          <div>
            <div className="grid grid-cols-1 gap-y-5">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {data?.inputLabel || "Cancellation Reason"}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
                    error
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 dark:border-gray-600"
                  }`}
                  rows={4}
                  placeholder={
                    data?.inputPlaceholder || "Enter reason for cancellation..."
                  }
                />
                {error && (
                  <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 px-2 mt-6 justify-center">
          <Button
            variant="dark"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            Close
          </Button>

          <Button
            type="submit"
            loadingState={isButtonLoading("confirm-delete")}
            onClick={handleConfirm}
          >
            {data?.confirmText || "Confirm Cancel"}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default CancelModal;