import { z } from "zod";
import { PASSWORD_POLICY_CONFIG } from "../config/config";

export const validationUtils = {
  name: (fieldName: string) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter ${fieldName} name`,
        });
        return;
      }

      if (/^\d+$/.test(trimmedVal)) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter a valid ${fieldName} name which contains characters`,
        });
        return;
      }

      if (trimmedVal.length < 3) {
        ctx.addIssue({
          code: "too_small",
          minimum: 3,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} name with at least 3 characters`,
        });
      }

      if (trimmedVal.length > 100) {
        ctx.addIssue({
          code: "too_big",
          maximum: 100,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} name with no more than 100 characters`,
        });
      }
    }),

  customName: (fieldName: string, minLength: number, maxLength: number) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter ${fieldName} name`,
        });
        return;
      }

      if (/^\d+$/.test(trimmedVal)) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter a valid ${fieldName} name which contains characters`,
        });
        return;
      }

      if (trimmedVal.length < minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: minLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} name with at least ${minLength} characters`,
        });
      }

      if (trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} name with no more than ${maxLength} characters`,
        });
      }
    }),

  customField: (fieldName: string, minLength: number, maxLength?: number) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter ${fieldName}`,
        });
        return;
      }

      if (trimmedVal.length < minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: minLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with at least ${minLength} characters`,
        });
      }

      if (maxLength && maxLength > 0 && trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with no more than ${maxLength} characters`,
        });
      }
    }),

  customFieldNonZero: (
    fieldName: string,
    minLength: number,
    maxLength?: number,
  ) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter ${fieldName}`,
        });
        return;
      }

      if (trimmedVal.startsWith("0")) {
        ctx.addIssue({
          code: "custom",
          message: `${fieldName} cannot start with 0`,
        });
        return;
      }

      if (trimmedVal.length < minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: minLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with at least ${minLength} characters`,
        });
      }

      if (maxLength && maxLength > 0 && trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with no more than ${maxLength} characters`,
        });
      }
    }),

  customFieldSelect: (
    fieldName: string,
    minLength: number,
    maxLength?: number,
  ) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please select a ${fieldName}`,
        });
        return;
      }

      if (trimmedVal.length < minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: minLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with at least ${minLength} characters`,
        });
      }

      if (maxLength && maxLength > 0 && trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} with no more than ${maxLength} characters`,
        });
      }
    }),

  email: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} email`)
      .max(150, "Please enter an email with no more than 150 characters")
      .email(`Please enter a valid ${fieldName} email`)
      .refine(
        (email) => {
          const disposableDomains = [
            "tempmail.com",
            "throwaway.com",
            "mailinator.com",
          ];
          const domain = email.split("@")[1] || "";
          return !disposableDomains.includes(domain);
        },
        { message: `Please use a non-disposable ${fieldName} email address` },
      )
      .refine(
        (email) => {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          return emailRegex.test(email);
        },
        { message: `${fieldName} email format is invalid` },
      )
      .transform((email) => email.toLowerCase().trim()),

  emailOptional: (fieldName: string) =>
    z
      .string()
      .superRefine((val, ctx) => {
        const trimmedVal = val.trim();

        if (!trimmedVal) {
          return;
        }

        if (trimmedVal.length > 150) {
          ctx.addIssue({
            code: "too_big",
            maximum: 150,
            type: "string",
            inclusive: true,
            origin: "string",
            message: "Please enter an email with no more than 150 characters",
          });
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmedVal)) {
          ctx.addIssue({
            code: "custom",
            message: `Please enter a valid ${fieldName} email`,
          });
          return;
        }

        const disposableDomains = [
          "tempmail.com",
          "throwaway.com",
          "mailinator.com",
        ];
        const domain = trimmedVal.split("@")[1] || "";
        if (disposableDomains.includes(domain)) {
          ctx.addIssue({
            code: "custom",
            message: `Please use a non-disposable ${fieldName} email address`,
          });
          return;
        }
      })
      .transform((val) => {
        return val ? val.toLowerCase().trim() : val;
      })
      .optional(),

  phone: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} phone number`)
      .refine(
        (val) => {
          return /^\+?[\d\s\-()]+$/.test(val);
        },
        {
          message: `${fieldName} phone number can only contain digits, spaces, dashes, parentheses, and an optional + at the beginning`,
        },
      )
      .refine(
        (val) => {
          const plusCount = (val.match(/\+/g) || []).length;
          return plusCount === 0 || (plusCount === 1 && val.startsWith("+"));
        },
        {
          message: `The + symbol can only appear at the beginning of the ${fieldName} phone number`,
        },
      )
      .refine(
        (val) => {
          const digitsOnly = val.replace(/\D/g, "");
          return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        },
        {
          message: `${fieldName} phone number must contain between 7 and 15 digits`,
        },
      )
      .transform((val) => {
        const startsWithPlus = val.startsWith("+");
        const digitsOnly = val.replace(/\D/g, "");
        return startsWithPlus ? `+${digitsOnly}` : digitsOnly;
      }),

  password: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName} password`)
      .min(8, `${fieldName} password must be at least 8 characters`)
      .max(
        PASSWORD_POLICY_CONFIG.MAX_LENGTH,
        `${fieldName} password must not exceed ${PASSWORD_POLICY_CONFIG.MAX_LENGTH} characters`,
      )
      .refine((val) => /[A-Z]/.test(val), {
        message: `${fieldName} password must include at least one uppercase letter`,
      })
      .refine((val) => /[a-z]/.test(val), {
        message: `${fieldName} password must include at least one lowercase letter`,
      })
      .refine((val) => /\d/.test(val), {
        message: `${fieldName} password must include at least one number`,
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: `${fieldName} password must include at least one special character`,
      }),
  date: (fieldName: string) =>
    z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        `${fieldName} date format is invalid, use YYYY-MM-DD`,
      ),

  uuid: (fieldName: string) =>
    z.string().uuid(`${fieldName} UUID format is invalid`),

  requiredString: (
    fieldName: string,
    errorMessage: string = `Please enter ${fieldName}`,
  ) => z.string().min(1, errorMessage),

  dateOfBirth: (
    name: string,
    options: {
      isFutureDateAllowed?: boolean;
      isPastDateAllowed?: boolean;
      minAge?: number;
      maxAge?: number;
    } = {},
  ) => {
    const {
      isFutureDateAllowed = false,
      isPastDateAllowed = true,
      minAge = 0,
      maxAge = 110,
    } = options;

    return z.preprocess(
      (val) =>
        val === null || val === undefined ? null : new Date(val as string),
      z
        .date()
        .nullable()
        .superRefine((val, ctx) => {
          if (val === null || isNaN(val.getTime())) {
            ctx.addIssue({
              code: "custom",
              message: `Please enter a valid date of birth for ${name}`,
            });
            return;
          }

          if (!isFutureDateAllowed && val > new Date()) {
            ctx.addIssue({
              code: "custom",
              message: `Please ensure date of birth is not in the future for ${name}`,
            });
          }

          if (minAge > 0 || maxAge < Infinity) {
            const today = new Date();
            let age = today.getFullYear() - val.getFullYear();
            const monthDiff = today.getMonth() - val.getMonth();

            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < val.getDate())
            ) {
              age--;
            }

            const isAboveMinAge = minAge <= 0 || age >= minAge;
            const isBelowMaxAge = maxAge >= Infinity || age <= maxAge;

            if (!isAboveMinAge || !isBelowMaxAge) {
              ctx.addIssue({
                code: "custom",
                message:
                  minAge > 0 && maxAge < Infinity
                    ? `Please ensure ${name} is between ${minAge} and ${maxAge} years old`
                    : minAge > 0
                      ? `Please ensure ${name} is at least ${minAge} years old`
                      : `Please ensure ${name} is not older than ${maxAge} years old`,
              });
            }
          }

          if (!isPastDateAllowed) {
            const currentDate = new Date();
            const minDate = new Date();
            minDate.setFullYear(currentDate.getFullYear() - maxAge);

            if (val < minDate) {
              ctx.addIssue({
                code: "custom",
                message: `Please ensure date of birth is not earlier than ${minDate.getFullYear()} for ${name}`,
              });
            }
          }
        }),
    );
  },

  customOptional: (fieldName: string, minLength: number, maxLength: number) =>
    z
      .string()
      .superRefine((val, ctx) => {
        const trimmedVal = val.trim();

        if (!trimmedVal) {
          return;
        }

        if (minLength > 0 && trimmedVal.length < minLength) {
          ctx.addIssue({
            code: "too_small",
            minimum: minLength,
            type: "string",
            inclusive: true,
            origin: "string",
            message: `Please enter ${fieldName} with at least ${minLength} characters`,
          });
        }

        if (maxLength > 0 && trimmedVal.length > maxLength) {
          ctx.addIssue({
            code: "too_big",
            maximum: maxLength,
            type: "string",
            inclusive: true,
            origin: "string",
            message: `Please enter ${fieldName} with no more than ${maxLength} characters`,
          });
        }
      })
      .optional(),

  website: (
    fieldName: string,
    isOptional: boolean = true,
    minLength: number = 0,
    maxLength: number = 255,
  ) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        if (!isOptional) {
          ctx.addIssue({
            code: "custom",
            message: `Please enter ${fieldName} URL`,
          });
        }
        return;
      }

      const urlValidation = z.string().url().safeParse(trimmedVal);
      if (!urlValidation.success) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter a valid ${fieldName} URL`,
        });
      }

      if (minLength > 0 && trimmedVal.length < minLength) {
        ctx.addIssue({
          code: "too_small",
          minimum: minLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} URL with at least ${minLength} characters`,
        });
      }

      if (maxLength > 0 && trimmedVal.length > maxLength) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxLength,
          type: "string",
          inclusive: true,
          origin: "string",
          message: `Please enter a ${fieldName} URL with no more than ${maxLength} characters`,
        });
      }
    }),

  websiteCustomOptional: (
    fieldName: string,
    minLength: number = 10,
    maxLength: number = 255,
  ) =>
    z
      .string()
      .superRefine((val, ctx) => {
        const trimmedVal = val.trim();

        if (!trimmedVal) {
          return;
        }

        const urlValidation = z.string().url().safeParse(trimmedVal);
        if (!urlValidation.success) {
          ctx.addIssue({
            code: "custom",
            message: `Please enter a valid ${fieldName} URL`,
          });
          return;
        }

        if (minLength > 0 && trimmedVal.length < minLength) {
          ctx.addIssue({
            code: "too_small",
            minimum: minLength,
            type: "string",
            inclusive: true,
            origin: "string",
            message: `Please enter a ${fieldName} URL with at least ${minLength} characters`,
          });
        }

        if (maxLength > 0 && trimmedVal.length > maxLength) {
          ctx.addIssue({
            code: "too_big",
            maximum: maxLength,
            type: "string",
            inclusive: true,
            origin: "string",
            message: `Please enter a ${fieldName} URL with no more than ${maxLength} characters`,
          });
        }
      })
      .optional(),

  optionalString: () => z.string().optional(),
  optionalNumber: () => z.number().optional(),
  optionalObject: () => z.object({}).optional(),
  boolean: () => z.boolean().default(false),

  passwordCustom: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName}`)
      .superRefine((val, ctx) => {
        if (val.length > PASSWORD_POLICY_CONFIG.MAX_LENGTH) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} must not exceed ${PASSWORD_POLICY_CONFIG.MAX_LENGTH} characters`,
          });
        }

        if (val.length < 8) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} must be at least 8 characters`,
          });
        }

        if (!/[a-zA-Z]/.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} must include at least one letter`,
          });
        }

        if (!/\d/.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} must include at least one number`,
          });
        }

        if (!/[A-Z]/.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: `${fieldName} must include at least one uppercase letter`,
          });
        }
      }),

  simplePassword: (minLength: number = 6) =>
    z
      .string()
      .min(1, "Please enter your password")
      .min(minLength, `Password must be at least ${minLength} characters`)
      .max(
        PASSWORD_POLICY_CONFIG.MAX_LENGTH,
        `Password cannot exceed ${PASSWORD_POLICY_CONFIG.MAX_LENGTH} characters`,
      ),

  birthdayRequired: (fieldName: string = "date of birth") =>
    z
      .preprocess(
        (val) => {
          if (!val) return null;
          const date = new Date(val as string);
          return isNaN(date.getTime()) ? null : date;
        },
        z.date({ message: `please select your ${fieldName}` }).nullable(),
      )
      .refine((val) => val !== null, {
        message: `please select your ${fieldName}`,
      }) as any,

  confirmPasswd: (fieldName: string = "confirm") =>
    z
      .string()
      .min(1, `Please add your ${fieldName} password`)
      .max(
        PASSWORD_POLICY_CONFIG.MAX_LENGTH,
        `Password cannot exceed ${PASSWORD_POLICY_CONFIG.MAX_LENGTH} characters`,
      ),
};
