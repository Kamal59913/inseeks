import { z } from "zod";
import { validationUtils } from "../validationUtils";

export const createEnvSchema = z.object({
  envName: validationUtils.customField("Space Name", 3, 80),
  EnvDescription: validationUtils.customField("Space Description", 5, 500),
});

export const postQuestionSchema = z.object({
  envname: validationUtils.requiredString("Space"),
  title: validationUtils.customField("Title", 5, 120),
  description: validationUtils.customField("Description", 5, 500),
});

export const imagePostSchema = z.object({
  envname: validationUtils.requiredString(
    "Space",
    "Selecting a space is required",
  ),
  title: validationUtils.customField("Title", 5, 120),
  images: z
    .array(
      z.custom<File>(
        (file) => typeof File !== "undefined" && file instanceof File,
        "Please select a valid image file",
      ),
    )
    .min(1, "Please upload at least one image")
    .max(8, "You can upload up to 8 images")
    .superRefine((files, ctx) => {
      files.forEach((file, index) => {
        if (!file.type.startsWith("image/")) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Only image files are supported",
            path: [index],
          });
        }
      });
    }),
});

export const commentSchema = z.object({
  comment: validationUtils.customOptional("Comment", 0, 1000),
});
