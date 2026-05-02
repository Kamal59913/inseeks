import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";
import { getCategoryConfig } from "../utils/signupUtils";

export const SignUpValidation = (skippedFields?: {
  instagramHandle?: boolean;
  chargingRates?: boolean;
  freelancerReferralDetails?: boolean;
}) => {
  return z
    .object({
      firstName: validationUtils?.customField("first name", 1, 50),
      lastName: validationUtils?.customField("last name", 1, 50),
      email: validationUtils?.email(""),
      countryCode: z.string().min(1),
      phoneNumber: validationUtils?.customField("phone", 8, 15),
      instagramHandle: validationUtils?.optionalString(),
      freelancerBio: validationUtils?.customField("freelancer bio", 1, 1000),
      areasOfExpertise: z
        .array(z.string())
        .min(1, "Please select at least one area of expertise"),
      category_rates: z.record(
        z.string(),
        z.object({
          hourly: z.string().optional(),
          half_day: z.string().optional(),
          full_day: z.string().optional(),
        })
      ),
      freelancerReferralDetails: validationUtils?.optionalString(),
      freelancerPortfolioImages: z
        .array(
          z.object({
            image_url: z.string(),
            thumbnail_url: z.string(),
          })
        )
        .min(5, "Please upload at least 5 portfolio images"),
    })
    .superRefine((data, ctx) => {
      const selectedAreas = data.areasOfExpertise || [];
      selectedAreas.forEach((slug) => {
        const rates = data.category_rates?.[slug] || {};
        const config = getCategoryConfig("", slug);

        config.fields.forEach((field) => {
          const value = (rates as any)[field.key];
          if (!value || value.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Rate is required",
              path: ["category_rates", slug, field.key],
            });
          }
        });
      });
    });
};

export type SignUpValidationType = z.infer<ReturnType<typeof SignUpValidation>>;

