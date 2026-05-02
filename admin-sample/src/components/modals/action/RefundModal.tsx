import { useState } from "react";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import { useModalData } from "../../../redux/hooks/useModal";

interface Props {
  modalId: string;
  data?: any;
}

const RefundModal: React.FC<Props> = ({ data }) => {
  const { isButtonLoading } = useGlobalStates();
  const { close } = useModalData();
  const [percentage, setPercentage] = useState<number>(100);
  const [error, setError] = useState<string | null>(null);

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
            {data?.title || "Process Refund"}
          </h4>
        </div>
     <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
          <div>
            <div className="grid grid-cols-1 gap-y-5">
              <div className="text-black dark:text-white/90">
                {data?.description}
              </div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
          <div>
            <div className="grid grid-cols-1 gap-y-5">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refund Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (val > 100) return;
                      
                      setPercentage(val);
                      if (val <= 0 || isNaN(val)) {
                          setError("Refund percentage must be greater than 0");
                      } else {
                          setError(null);
                      }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter percentage (1-100)"
                />
                 {error && (
                  <p className="text-xs text-red-500 mt-1">
                    {error}
                  </p>
                )}
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the percentage amount to refund (1-100).
                </p>
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
            disabled={percentage <= 0 || !!error || isNaN(percentage)}
            loadingState={isButtonLoading("confirm-refund")}
            onClick={() => data.action(percentage)}
          >
            Confirm Refund
          </Button>
        </div>

      </div>
    </Modal>
  );
};

export default RefundModal;
