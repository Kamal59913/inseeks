import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const PasswordResetValidation = z
  .object({
    password: validationUtils.passwordCustom("Password"),
    confirm_password: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // Changed from "confirmPassword" to match your form field name
  });

export type PasswordResetValidationType = z.infer<
  typeof PasswordResetValidation
>;

