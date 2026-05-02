import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

export const PhotosValidation = () => {
  return z.object({
    image_url: validationUtils?.customField("image url", 1, 5000),
    thumbnail_url: validationUtils?.customOptional("thumbnail url", 0, 5000),
    image_caption: validationUtils?.customOptional("caption", 0, 150),
    status: validationUtils.boolean() || undefined,
    is_primary: validationUtils.boolean() || undefined,
  });
};

export type PhotosValidationType = z.infer<
  ReturnType<typeof PhotosValidation>
>;

