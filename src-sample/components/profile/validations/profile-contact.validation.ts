import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

interface ContactConfig {
  isWhatsAppEnabled?: boolean;
  isEmailEnabled?: boolean;
  isTextEnabled?: boolean;
}

export const ProfileValidationContact = (config: ContactConfig = {}) => {
  return z.object({
    additional_email: config.isEmailEnabled
      ? validationUtils?.email("additional")
      : validationUtils?.optionalString(),

    whatsappCountryCode: validationUtils?.optionalString(),
    whatsapp: config.isWhatsAppEnabled
      ? validationUtils?.customField("WhatsApp number", 8, 18)
      : validationUtils?.customOptional("WhatsApp number", 8, 18),

    textCountryCode: validationUtils?.optionalString(),
    text: config.isTextEnabled
      ? validationUtils?.customField("Text number", 8, 18)
      : validationUtils?.customOptional("Text number", 8, 18),

    isWhatsAppEnabled: validationUtils.boolean() || undefined,
    isEmailEnabled: validationUtils.boolean() || undefined,
    isTextEnabled: validationUtils.boolean() || undefined,
  });
};

export type ProfileValidationContactType = z.infer<
  ReturnType<typeof ProfileValidationContact>
>;

