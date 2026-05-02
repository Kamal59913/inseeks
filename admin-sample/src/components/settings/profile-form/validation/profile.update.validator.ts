// profile.update.validator.ts
import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const ProfileUpdateValidation = () => {
  return z.object({
    firsName: validationUtils?.customField("your first name", 3, 50),
    lastName: validationUtils?.customField("your last name", 3, 50),
    userName: validationUtils?.customField("your username", 3, 50),
    email: validationUtils?.email("your"),
    phone: validationUtils?.customField("your phone", 10, 15),
    phoneData: z.object({
      fullPhone: z.string(),
      countryCode: z.string(),
      phoneNumber: z.string()
    }).optional()
  });
};

export type ProfileUpdateValidationType = z.infer<
  ReturnType<typeof ProfileUpdateValidation>
>;