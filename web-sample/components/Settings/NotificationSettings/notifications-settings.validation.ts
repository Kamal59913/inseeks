import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const NotificationsSettingsValidation = z.object({
  pause_all: validationUtils.boolean(),
  is_enable_likes: validationUtils.boolean(),
  is_enable_comments: validationUtils.boolean(),
  is_enable_follows: validationUtils.boolean(),
  is_enable_system: validationUtils.boolean(),
  is_enable_reposts: validationUtils.boolean(),
});

export type NotificationsSettingsValidationType = z.infer<
  typeof NotificationsSettingsValidation
>;
