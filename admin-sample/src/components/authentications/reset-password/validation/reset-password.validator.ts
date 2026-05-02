import { z } from "zod";

export const PasswordResetValidation = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
      })
      .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "Password must include at least one special character",
      }),
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
