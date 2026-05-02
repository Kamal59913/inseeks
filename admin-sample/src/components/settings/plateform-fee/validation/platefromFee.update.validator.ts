import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const PlateFormFeeValidation = () => {
  return z.object({
    plateformFee: validationUtils?.percentage("platform fee", 0, 100),
  });
};

export type PlateFormFeeValidationType = z.infer<
  ReturnType<typeof PlateFormFeeValidation>
>;
