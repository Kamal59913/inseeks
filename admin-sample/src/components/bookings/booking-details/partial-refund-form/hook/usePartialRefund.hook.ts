import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PartialRefundValidation,
  PartialRefundFormValues,
} from "../validation/partialRefund.validator";
import fundService from "@/api/services/fundsService";
import { ToastService } from "@/utils/toastService";
import { useModalData } from "@/redux/hooks/useModal";

export const usePartialRefund = (paymentId: number, bookingAmount: number) => {
  const { close } = useModalData();
  const formMethods = useForm<PartialRefundFormValues>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: (values, context, options) => {
      const schema = PartialRefundValidation(
        values.refund_type || "percentage",
        bookingAmount,
      );
      return (zodResolver(schema as any) as any)(values, context, options);
    },
    defaultValues: {
      refund_type: "percentage",
      amount: "",
    },
  });

  const onSubmit = async (values: PartialRefundFormValues) => {
    try {
      const response: any = await fundService.partialRefund({
        payment_id: paymentId,
        refund_type: values.refund_type,
        amount: parseFloat(values.amount),
      });

      if (response?.status === 200 || response?.status === 201) {
        ToastService.success(
          response.data.message || "Refund processed successfully",
          "partial-refund-success",
        );
        close();
      } else {
        ToastService.error(
          response?.response?.data?.message || "Failed to process refund",
          "partial-refund-error",
        );
      }
    } catch (error) {
      ToastService.error(
        "An error occurred while processing refund",
        "partial-refund-error",
      );
    }
  };

  return {
    ...formMethods,
    onSubmit: formMethods.handleSubmit(onSubmit),
  };
};
