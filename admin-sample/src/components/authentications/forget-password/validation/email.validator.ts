import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const forgetPasswordValidation = () => {
  return z.object({
    email: validationUtils?.email("")
  });
};

export type ForgetPasswordValidationType = z.infer<ReturnType<typeof forgetPasswordValidation>>;
