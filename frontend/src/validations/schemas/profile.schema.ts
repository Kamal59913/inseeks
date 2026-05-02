import { z } from "zod";
import { validationUtils } from "../validationUtils";

export const profileSettingsSchema = z.object({
  fullname: validationUtils.name("Full name"),
  username: validationUtils.name("Username"),
  email: validationUtils.emailOptional("Account"),
  about: validationUtils.customOptional("About", 0, 280),
});

export const replaceAvatarSchema = z.object({
  avatar: z.any().refine((file) => file, "Image is required"),
});

export const deleteAvatarSchema = z.object({});
