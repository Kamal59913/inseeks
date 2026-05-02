import { validationUtils } from "@/utils/validation";
import { z } from "zod";
import { DaySchema } from "./availibility.validation.utils";

export interface EditProfileConfig {
  isWhatsAppEnabled?: boolean;
  isEmailEnabled?: boolean;
  isTextEnabled?: boolean;
  skippedFields?: {
    instagramHandle?: boolean;
    chargingRates?: boolean;
    freelancerReferralDetails?: boolean;
  };
}

export const EditProfileValidation = (
  activeStep: string = "basic",
  config: EditProfileConfig = {},
) => {
  const isBasicStep = activeStep === "basic";
  const isContactStep = activeStep === "contact";
  const isRatesStep = activeStep === "rates";
  const isPortfolioStep = activeStep === "portfolio";
  const isAvailabilityStep = activeStep === "availability";
  const isServicesStep = activeStep === "services";
  const isTravelZoneStep = activeStep === "travel_zone";

  return z.object({
    firstName: isBasicStep
      ? validationUtils?.customField("first name", 1, 50)
      : validationUtils?.optionalAny(),
    lastName: isBasicStep
      ? validationUtils?.customField("last name", 1, 50)
      : validationUtils?.optionalAny(),
    email: isBasicStep
      ? validationUtils?.email("")
      : validationUtils?.optionalAny(),
    phone: isBasicStep
      ? z.string().min(5, "Phone number is required")
      : validationUtils?.optionalAny(),
    phoneData: z
      .object({
        fullPhone: z.string().optional(),
        countryCode: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
      .optional(),

    countryCode: validationUtils?.optionalAny(),
    phoneNumber: validationUtils?.optionalAny(),
    instagramHandle: validationUtils?.optionalString(),

    freelancerBio: isBasicStep
      ? validationUtils?.customField("freelancer bio", 1, 500)
      : validationUtils?.optionalAny(),
    glamAndGoMinRate: validationUtils?.optionalAny(),
    halfDayShootMinRate: validationUtils?.optionalAny(),
    fullDayShootMinRate: validationUtils?.optionalAny(),
    // freelancerReferralDetails: skippedFields?.freelancerReferralDetails
    //   ? validationUtils?.optionalString()
    //   : isBasicStep
    //     ? validationUtils?.customField("freelancer referral details", 1, 50)
    //     : validationUtils?.optionalAny(),
    freelancerPortfolioImages: isPortfolioStep
      ? z
          .array(
            z.object({
              image_url: z.string(),
              thumbnail_url: z.string(),
              caption: z.string().optional().or(z.literal("")),
              db_id: z.any().optional(),
              order_id: z.number().optional(),
            }),
          )
          .min(3, "Please upload at least 3 portfolio images")
      : validationUtils?.optionalAny(),

    // Step Two Fields (Still under 'basic' based on consolidation)
    userName: isBasicStep
      ? validationUtils?.customField("username", 3, 50)
      : validationUtils?.optionalAny(),
    password: validationUtils.passwordCustomOptional("password"),
    freelancerPostalCode: isBasicStep
      ? validationUtils?.customField("postal code", 3, 9)
      : validationUtils?.optionalAny(),
    isEmailVerified: validationUtils?.boolean(),

    // Contact Details ('contact')
    isWhatsAppEnabled: z.boolean().default(false),
    whatsapp: isContactStep
      ? config.isWhatsAppEnabled
        ? z.string().min(5, "WhatsApp number is required when enabled")
        : z.string().optional()
      : validationUtils?.optionalAny(),
    isEmailEnabled: z.boolean().default(false),
    additional_email: isContactStep
      ? config.isEmailEnabled
        ? z.string().email("Invalid email address")
        : z.string().email().optional().or(z.literal(""))
      : validationUtils?.optionalAny(),
    isTextEnabled: z.boolean().default(false),
    text: isContactStep
      ? config.isTextEnabled
        ? z.string().min(5, "Text number is required when enabled")
        : z.string().optional()
      : validationUtils?.optionalAny(),

    availability: isAvailabilityStep
      ? z.object({
          monday: DaySchema,
          tuesday: DaySchema,
          wednesday: DaySchema,
          thursday: DaySchema,
          friday: DaySchema,
          saturday: DaySchema,
          sunday: DaySchema,
        })
      : validationUtils?.optionalAny(),
    calendars: z
      .array(
        z.object({
          id: z.string(),
          email: z.string().email(),
        }),
      )
      .optional()
      .default([]),
    services: isServicesStep
      ? z.array(z.any()).optional().default([])
      : validationUtils?.optionalAny(),

    // New fields for Charging Rates (StepOne concept)
    service_categories: isRatesStep
      ? z
          .array(z.string())
          .min(1, "Please select at least one area of expertise")
      : validationUtils?.optionalAny(),
    category_rates: isRatesStep
      ? z.record(
          z.string(),
          z.object({
            hourly: validationUtils
              ?.customFieldSelect("rate", 1, 50)
              .optional()
              .or(z.literal(0)),
            half_day: validationUtils
              ?.customFieldSelect("rate", 1, 50)
              .optional()
              .or(z.literal(0)),
            full_day: validationUtils
              ?.customFieldSelect("rate", 1, 50)
              .optional()
              .or(z.literal(0)),
          }),
        )
      : validationUtils?.optionalAny(),

    // Travel Zone Fields
    serviceRadius: isTravelZoneStep
      ? z
          .number()
          .min(1, "Radius must be at least 1 km")
          .max(100, "Radius cannot exceed 100 km")
      : validationUtils?.optionalAny(),
    serviceLocation: isTravelZoneStep
      ? z.object({
          longitude: z.number(),
          latitude: z.number(),
        })
      : validationUtils?.optionalAny(),
    // localTravelFee: isTravelZoneStep
    //   ? validationUtils.optionalString()
    //   : validationUtils?.optionalAny(),
    isInternationBooking: validationUtils?.boolean().optional(),
  });
};

export type EditProfileValidationType = z.infer<
  ReturnType<typeof EditProfileValidation>
>;
