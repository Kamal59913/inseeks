import { z } from "zod";
import { validationUtils } from "@/utils/validation";

export const PartialRefundValidation = (
  refundType: "percentage" | "amount",
  bookingAmount: number,
) => {
  const max = refundType === "percentage" ? 100 : bookingAmount;
  const label = refundType === "percentage" ? "percentage" : "amount";

  return z.object({
    refund_type: z.enum(["percentage", "amount"]),
    amount: validationUtils.percentage(label, 0.01, max),
  });
};

export type PartialRefundFormValues = {
  refund_type: "percentage" | "amount";
  amount: string;
};
