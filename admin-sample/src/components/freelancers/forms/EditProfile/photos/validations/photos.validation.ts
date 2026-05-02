import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const PhotosValidation = () => {
  return z.object({
    image_url: validationUtils?.requiredString("image", "Please add an image"),
    thumbnail_url: validationUtils?.customOptional("thumbnail url", 0, 5000),
    caption: validationUtils?.customOptional("caption", 0, 150),
    status: validationUtils.boolean() || undefined,
    is_primary: validationUtils.boolean() || undefined,
    db_id: z.any().optional(),
  });
};

export type PhotosValidationType = z.infer<ReturnType<typeof PhotosValidation>>;
