import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const CustomerFeeValidation = () => {
  return z.object({
    customerFee: validationUtils?.percentage("service fee", 0, 100),
  });
};

export type CustomerFeeValidationType = z.infer<
  ReturnType<typeof CustomerFeeValidation>
>;
