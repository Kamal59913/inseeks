import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const ResetPasswordValidation = z
  .object({
    new_password: validationUtils.password("New"),
    confirm_password: validationUtils.confirmPasswd("Confirm"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type ResetPasswordValidationType = z.infer<
  typeof ResetPasswordValidation
>;
