import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const SettingsValidation = z.object({
  username: validationUtils.customField("username", 3, 50),
  phone: validationUtils.phone("phone"),
  phoneData: z
    .object({
      fullPhone: z.string(),
      countryCode: z.string(),
      phoneNumber: z.string(),
    })
    .optional(),
  email: validationUtils.email("email"),
  password: z.string().optional(),
});

export type SettingsValidationType = z.infer<typeof SettingsValidation>;
