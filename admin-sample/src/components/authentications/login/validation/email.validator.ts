import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const loginValidation = () => {
  return z.object({
    username: validationUtils?.customField("your username", 1, 50),

    password: z
      .string()
      .min(1, "Please enter your password")
      .min(6, "Password must be at least 6"),
  });
};

export type LoginValidationType = z.infer<ReturnType<typeof loginValidation>>;
