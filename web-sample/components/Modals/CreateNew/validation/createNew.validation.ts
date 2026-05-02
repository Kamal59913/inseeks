import { z } from "zod";
import { validationUtils } from "@/lib/utilities/validation";

export const CreatePostValidation = (isFromFeedPage: boolean) =>
  z.object({
    content: validationUtils.customOptional("post content", 1, 2000),
    communityId: validationUtils.customOptional("community", 1, 1000),
    feedId: isFromFeedPage
      ? validationUtils.customField("feed", 1, 1000)
      : validationUtils.optionalString(),
    type: z.enum(["text", "photo", "video"]),
  });

export type CreatePostValidationType = z.infer<
  ReturnType<typeof CreatePostValidation>
>;

export const CreateFeedValidation = z.object({
  title: validationUtils.customField("feed title", 1, 100),
  mainPost: validationUtils.customOptional("main post", 1, 200),
  communityId: validationUtils.customOptional("community", 1, 1000),
});
export type CreateFeedValidationType = z.infer<typeof CreateFeedValidation>;

// import { z } from "zod";
// import { validationUtils } from "@/lib/utilities/validation";

// export const CreatePostValidation = z.object({
//   content: validationUtils
//     .customField("post content", 1)
//     .optional()
//     .or(z.literal("")),
//   communityId: validationUtils.customFieldSelect("community", 1),
//   type: z.enum(["text", "photo", "video"]),
// });

// export const CreateFeedValidation = z.object({
//   title: validationUtils.customField("feed title", 1, 100),
//   mainPost: validationUtils
//     .customField("main post", 1)
//     .optional()
//     .or(z.literal("")),
//   communityId: validationUtils.customFieldSelect("community", 1),
// });

// export type CreatePostValidationType = z.infer<typeof CreatePostValidation>;
// export type CreateFeedValidationType = z.infer<typeof CreateFeedValidation>;
