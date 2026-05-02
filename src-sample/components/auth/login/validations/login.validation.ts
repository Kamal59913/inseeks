import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

export const LoginValidation = z.object({
  username: validationUtils?.customField("your username", 1, 50),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(6, "Password must be at least 6"),
});

export type LoginValidationType = z.infer<typeof LoginValidation>;

