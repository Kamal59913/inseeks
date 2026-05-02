import { z } from "zod";

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
          const domain = email.split("@")[1];
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
        const domain = trimmedVal.split("@")[1];
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
      .min(7, `${fieldName} password must be at least 7 characters`)
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
  customDate: (
    name: string,
    options: {
      allowPast?: boolean;
      allowFuture?: boolean;
      allowNull?: boolean;
    } = {},
  ) => {
    const {
      allowPast = false,
      allowFuture = true,
      allowNull = false,
    } = options;

    return z.preprocess(
      (val) => {
        if (val === null || val === undefined) return null;
        return new Date(val as string);
      },
      z
        .date()
        .nullable()
        .superRefine((val, ctx) => {
          if (val === null) {
            if (!allowNull) {
              ctx.addIssue({
                code: "custom",
                message: `Please select a valid ${name}`,
              });
            }
            return;
          }

          if (isNaN(val.getTime())) {
            ctx.addIssue({
              code: "custom",
              message: `Please enter a valid ${name}`,
            });
            return;
          }

          const now = new Date();

          if (!allowPast && val < now) {
            ctx.addIssue({
              code: "custom",
              message: `${name} cannot be in the past`,
            });
          }

          if (!allowFuture && val > now) {
            ctx.addIssue({
              code: "custom",
              message: `${name} cannot be in the future`,
            });
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
  // Add this to your validationUtils object in validation.ts

  percentage: (fieldName: string, min: number = 0, max: number = 100) =>
    z.string().superRefine((val, ctx) => {
      const trimmedVal = val.trim();

      if (!trimmedVal) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter ${fieldName}`,
        });
        return;
      }

      // Check if it's a valid number
      const numValue = parseFloat(trimmedVal);
      if (isNaN(numValue)) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter a number`,
        });
        return;
      }

      // Check range
      if (numValue < min || numValue > max) {
        ctx.addIssue({
          code: "custom",
          message: `Please enter a ${fieldName} between ${min} and ${max}`,
        });
        return;
      }
    }),

  optionalString: () => z.string().optional(),
  optionalNumber: () => z.number().optional(),
  optionalObject: () => z.object({}).optional(),
  boolean: () => z.boolean(),
  optionalAny: () => z.any().optional(),

  passwordCustom: (fieldName: string) =>
    z
      .string()
      .min(1, `Please enter ${fieldName}`)
      .superRefine((val, ctx) => {
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

  passwordCustomOptional: (fieldName: string) =>
    z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // Allow empty
          return val.length >= 8;
        },
        {
          message: `${fieldName} must be at least 8 characters`,
        },
      )
      .refine(
        (val) => {
          if (!val) return true;
          return /[a-zA-Z]/.test(val) && /\d/.test(val);
        },
        {
          message: `${fieldName} must include both letters and numbers`,
        },
      )
      .refine(
        (val) => {
          if (!val) return true;
          return /[A-Z]/.test(val);
        },
        {
          message: `${fieldName} must include at least one uppercase letter`,
        },
      ),
};
