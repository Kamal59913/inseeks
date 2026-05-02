import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

const passwordUpdateValidation = z
  .object({
    currentPassword: validationUtils.simplePassword(8),
    newPassword: validationUtils.password("new"),
    confirmPassword: validationUtils.confirmPasswd("confirm"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default passwordUpdateValidation;
