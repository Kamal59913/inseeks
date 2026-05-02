import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

export const ProfileValidationInformation = () => {
  return z.object({
    firstName: validationUtils?.customField("first name", 1, 50),
    lastName: validationUtils?.customField("last name", 1, 50),
    profileUrl: validationUtils?.customField("profile url", 3, 50),
    bio: validationUtils?.customField("bio", 3, 500),
  });
};

export type ProfileValidationInformationType = z.infer<
  ReturnType<typeof ProfileValidationInformation>
>;
