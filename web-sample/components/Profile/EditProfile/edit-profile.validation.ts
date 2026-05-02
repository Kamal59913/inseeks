import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const EditProfileValidation = z.object({
  name: validationUtils.customField("your name", 3, 64),
  bio: validationUtils.customOptional("your bio", 0, 1000),
  birthday: validationUtils.birthdayRequired("your date of birth"),
  status: z.enum(["single", "married"]).optional().nullable(),
  account_of: validationUtils.customOptional("your account of", 0, 100),
});

export type EditProfileValidationType = z.infer<typeof EditProfileValidation>;
