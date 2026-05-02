import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const PaymentSettingsValidation = (isGenerateInvoice: boolean) =>
  z.object({
    generateInvoices: z.boolean(),

    billingName: isGenerateInvoice
      ? validationUtils?.customField("username", 3, 50)
      : validationUtils.optionalString(),

    address1: isGenerateInvoice
      ? validationUtils?.customField("address", 3, 300)
      : validationUtils.optionalString(),

    address2: validationUtils.optionalString(),

    postcode: isGenerateInvoice
      ? validationUtils?.customField("postcode", 3, 12)
      : validationUtils.optionalString(),

    city: isGenerateInvoice
      ? validationUtils?.customField("city", 2, 50)
      : validationUtils.optionalString(),

    vatNumber: validationUtils.optionalString(),
  });

export type PaymentSettingsValidationType = z.infer<
  ReturnType<typeof PaymentSettingsValidation>
>;

