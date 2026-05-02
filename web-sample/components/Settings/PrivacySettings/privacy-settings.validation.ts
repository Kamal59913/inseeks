import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const PrivacySettingsValidation = z.object({
  privateAccount: validationUtils.boolean(),
});

export type PrivacySettingsValidationType = z.infer<
  typeof PrivacySettingsValidation
>;
