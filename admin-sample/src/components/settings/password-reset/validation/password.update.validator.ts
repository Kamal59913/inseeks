import { z } from "zod";

const passwordUpdateValidation = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Please add your current password")
      .max(64, "Password cannot exceed 64 characters"),

    newPassword: z
      .string()
      .min(1, "Please add your new password")
      .min(8, "Please use at least 8 characters for your password")
      .max(64, "Password cannot exceed 64 characters")

      .refine((val) => /[A-Z]/.test(val), {
        message:
          "Please include at least one uppercase letter in your password",
      })
      .refine((val) => /[a-z]/.test(val), {
        message:
          "Please include at least one lowercase letter in your password",
      })
      .refine((val) => /\d/.test(val), {
        message: "Please include at least one number in your password",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message:
          "Please include at least one special character in your password",
      }),

    confirmPassword: z
      .string()
      .min(1, "Please add your new password")
      .max(64, "Password cannot exceed 64 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default passwordUpdateValidation;
