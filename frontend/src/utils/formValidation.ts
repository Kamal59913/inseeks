import { z } from "zod";

const trimValue = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

interface StringFieldOptions {
  required?: boolean;
  min?: number;
  max?: number;
  type?: string;
  allowEmpty?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
}

const buildLengthMessage = (label: string, type: string): string =>
  `Please enter ${type === "select" ? "a valid" : ""} ${label}`
    .replace(/\s+/g, " ")
    .trim();

const stringField = (
  label: string,
  {
    required = true,
    min = 0,
    max,
    type = "text",
    allowEmpty = false,
    pattern,
    patternMessage,
  }: StringFieldOptions = {},
) =>
  z.string().superRefine((value, ctx) => {
    const trimmed = trimValue(value);

    if (!trimmed) {
      if (required && !allowEmpty) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            type === "select" ? `Please select ${label}` : `Please enter ${label}`,
        });
      }
      return;
    }

    if (min > 0 && trimmed.length < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: min,
        inclusive: true,
        type: "string",
        origin: "string",
        message: `${buildLengthMessage(label, type)} with at least ${min} characters`,
      });
    }

    if (typeof max === "number" && trimmed.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: max,
        inclusive: true,
        type: "string",
        origin: "string",
        message: `${buildLengthMessage(label, type)} with no more than ${max} characters`,
      });
    }

    if (pattern && !pattern.test(trimmed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: patternMessage || `Please enter a valid ${label}`,
      });
    }
  });

interface FileFieldOptions {
  required?: boolean;
}

const fileField = (label: string, { required = true }: FileFieldOptions = {}) =>
  z.any().superRefine((value, ctx) => {
    if (!required && !value) return;
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please select ${label}`,
      });
    }
  });

interface FilesFieldOptions {
  required?: boolean;
  min?: number;
}

const filesField = (
  label: string,
  { required = true, min = 1 }: FilesFieldOptions = {},
) =>
  z.array(z.any()).superRefine((value, ctx) => {
    if (!required && value.length === 0) return;
    if (value.length < min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please select at least ${min} ${label}`,
      });
    }
  });

interface PasswordFieldOptions {
  min?: number;
  max?: number;
}

const emailField = (label = "email") =>
  z
    .string()
    .trim()
    .min(1, `Please enter ${label}`)
    .max(150, "Please enter an email with no more than 150 characters")
    .email(`Please enter a valid ${label}`)
    .transform((value) => value.toLowerCase());

const passwordField = (
  label = "password",
  { min = 6, max = 64 }: PasswordFieldOptions = {},
) =>
  z
    .string()
    .min(1, `Please enter ${label}`)
    .min(
      min,
      `${label.charAt(0).toUpperCase() + label.slice(1)} must be at least ${min} characters`,
    )
    .max(
      max,
      `${label.charAt(0).toUpperCase() + label.slice(1)} must be no more than ${max} characters`,
    );

export const validationUtils = {
  stringField,
  optionalStringField: (label: string, options: StringFieldOptions = {}) =>
    stringField(label, { ...options, required: false }),
  emailField,
  passwordField,
  fileField,
  filesField,
};

export const preprocessTrimmedFormData = (
  values: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      typeof value === "string" ? value.trim() : value,
    ]),
  );
