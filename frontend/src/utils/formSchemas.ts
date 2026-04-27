import { z } from "zod";
import { validationUtils } from "./formValidation";

export const FORM_LIMITS = {
  about: 280,
  comment: 280,
  email: 150,
  envDescription: 500,
  envName: 80,
  fullName: 80,
  password: 64,
  postDescription: 500,
  postTitle: 120,
  username: 40,
} as const;

export const loginSchema = z.object({
  identifier: validationUtils.stringField("email or username", {
    min: 3,
    max: FORM_LIMITS.email,
  }),
  password: validationUtils.passwordField("password"),
});

export const signUpSchema = z.object({
  fullname: validationUtils.stringField("full name", {
    min: 2,
    max: FORM_LIMITS.fullName,
  }),
  username: validationUtils.stringField("username", {
    min: 3,
    max: FORM_LIMITS.username,
    pattern: /^[a-z0-9._]+$/i,
    patternMessage:
      "Username can only contain letters, numbers, dots, and underscores",
  }),
  email: validationUtils.emailField(),
  password: validationUtils.passwordField("password"),
});

export const profileSettingsSchema = z.object({
  fullname: validationUtils.stringField("full name", {
    min: 2,
    max: FORM_LIMITS.fullName,
  }),
  username: validationUtils.stringField("username", {
    min: 3,
    max: FORM_LIMITS.username,
    pattern: /^[a-z0-9._]+$/i,
    patternMessage:
      "Username can only contain letters, numbers, dots, and underscores",
  }),
  email: validationUtils.emailField(),
  about: validationUtils.stringField("about", {
    min: 2,
    max: FORM_LIMITS.about,
  }),
});

export const postAnythingSchema = z.object({
  envname: validationUtils.stringField("space", {
    min: 1,
    max: FORM_LIMITS.envName,
  }),
  title: validationUtils.stringField("post title", {
    min: 2,
    max: FORM_LIMITS.postTitle,
  }),
  description: validationUtils.stringField("description", {
    min: 2,
    max: FORM_LIMITS.postDescription,
  }),
  attachments: validationUtils.filesField("attachments", { required: false, min: 0 }),
});

export const postQuestionSchema = postAnythingSchema;

export const postImageSchema = z.object({
  title: validationUtils.stringField("description", {
    min: 2,
    max: FORM_LIMITS.postDescription,
  }),
  images: validationUtils.filesField("images"),
});

export const postVideoSchema = z.object({
  description: validationUtils.stringField("description", {
    min: 2,
    max: FORM_LIMITS.postDescription,
  }),
  video: validationUtils.fileField("a video", { required: true }),
});

export const createEnvSchema = z.object({
  envName: validationUtils.stringField("environment name", {
    min: 2,
    max: FORM_LIMITS.envName,
  }),
  EnvDescription: validationUtils.stringField("environment description", {
    min: 2,
    max: FORM_LIMITS.envDescription,
  }),
  envCoverImage: validationUtils.fileField("an environment cover image", {
    required: true,
  }),
});

export const replaceAvatarSchema = z.object({
  avatar: validationUtils.fileField("an avatar image", { required: true }),
});

export const deleteAvatarSchema = z.object({});

export const commentSchema = z.object({
  comment: validationUtils.optionalStringField("comment", {
    max: FORM_LIMITS.comment,
  }),
});

// Inferred form value types
export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type PostAnythingValues = z.infer<typeof postAnythingSchema>;
export type PostQuestionValues = z.infer<typeof postQuestionSchema>;
export type PostImageValues = z.infer<typeof postImageSchema>;
export type PostVideoValues = z.infer<typeof postVideoSchema>;
export type CreateEnvValues = z.infer<typeof createEnvSchema>;
export type ReplaceAvatarValues = z.infer<typeof replaceAvatarSchema>;
export type CommentValues = z.infer<typeof commentSchema>;
