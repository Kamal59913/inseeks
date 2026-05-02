import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

export const CustomerValidationContact = () => {
  return z.object({
    first_name: validationUtils?.customField("first name", 2, 50),
    last_name: validationUtils?.customField("last name", 2, 50),
    country_code: z.string().optional(),
    phone: validationUtils?.customField("phone", 8, 18),
    email: validationUtils?.email(""),
    enable_newsletter: z.boolean().optional(),
  });
};

export type CustomerValidationContactType = z.infer<
  ReturnType<typeof CustomerValidationContact>
>;

