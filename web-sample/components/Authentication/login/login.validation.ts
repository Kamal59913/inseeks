import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

// validationUtils now integrated
export const LoginValidation = z.object({
  username: validationUtils.customField("your username", 1, 64),
  password: validationUtils.simplePassword(6),
});

export type LoginValidationType = z.infer<typeof LoginValidation>;
