import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModalData } from "@/redux/hooks/useModal";
import { usePartialRefund } from "./hook/usePartialRefund.hook";
import SingleSelectDropdown from "@/components/ui/dropdown/SingleSelectController";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";
import Input from "@shared/common/components/ui/form/input/InputField.tsx";

interface Props {
  modalId: string;
  data?: any;
}

const PartialRefundModal: React.FC<Props> = ({ data }) => {
  const { close } = useModalData();
  const { isButtonLoading } = useGlobalStates();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    onSubmit,
  } = usePartialRefund(data?.paymentId || 0, data?.bookingAmount || 0);

  const refundType = watch("refund_type");

  return (
    <Modal
      isOpen
      onClose={close}
      className="max-w-[500px] m-4"
      outsideClick={false}
    >
      <div className="text-center no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-black lg:p-8">
        <div className="px-2 mb-2">
          <h4 className="text-2xl font-semibold text-black dark:text-white/90">
            {data?.title || "Refund"}
          </h4>
        </div>
        <div className="custom-scrollbar overflow-y-auto px-2 mb-2">
          <div>
            <div className="grid grid-cols-1 gap-y-5">
              <div className="text-black dark:text-white/90">
                {data?.description ||
                  "Fill in the details to process a refund."}
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-5 text-left px-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refund Type
            </label>
            <SingleSelectDropdown
              title="Refund Type"
              options={[
                { value: "percentage", label: "Percentage (%)" },
                { value: "amount", label: "Amount (£)" },
              ]}
              value={refundType}
              onChange={(value) => setValue("refund_type", value as any)}
              placeholder="Select Refund Type"
              showSearch={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {refundType === "percentage" ? "Percentage (%)" : "Amount (£)"}
            </label>
            <Input
              type="number"
              step="any"
              register={register as any}
              registerOptions="amount"
              errors={errors}
              placeholder={`Enter ${
                refundType === "percentage" ? "percentage" : "amount"
              }`}
              showArrows={true}
              maxLength={refundType === "percentage" ? 3 : 10}
              className="h-[44px]"
            />
          </div>

          <div className="flex items-center gap-3 mt-8 justify-center">
            <Button
              variant="dark"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loadingState={isButtonLoading("partial-refund")}
            >
              Confirm Refund
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PartialRefundModal;
