import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const ForgotPasswordValidation = z.object({
  email: validationUtils.email("your"),
});

export type ForgotPasswordValidationType = z.infer<
  typeof ForgotPasswordValidation
>;
