import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";    

export const ForgetPasswordValidation = z.object({
  email: validationUtils?.email(""),
});

export type ForgetPasswordValidationType = z.infer<typeof ForgetPasswordValidation>;

