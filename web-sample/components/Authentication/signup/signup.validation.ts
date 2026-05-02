import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

// validationUtils now integrated
export const SignupValidation = z.object({
  username: validationUtils.customField("your username", 1, 64),
  email: validationUtils.email("your"),
  full_name: validationUtils.customField("your full name", 1, 100),
  password: validationUtils.password("your"),
  phone: validationUtils.phone("your"),
  phoneData: z
    .object({
      fullPhone: z.string(),
      countryCode: z.string(),
      phoneNumber: z.string(),
    })
    .optional(),
  account_of: validationUtils.customField("account of", 1, 100),
  birthday: validationUtils.birthdayRequired("date of birth"),
});

export type SignupValidationType = z.infer<typeof SignupValidation>;
