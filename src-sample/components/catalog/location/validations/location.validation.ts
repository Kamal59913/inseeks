import { validationUtils } from "@/lib/utilities/validation";
import { WORKZONE_NAMES } from "@/types/constants/constants";
import { z } from "zod";

export const LocationValidation = (isEditing: boolean = false) => {
  return z.object({
    freelancerPostalCode: isEditing
      ? validationUtils?.customField("postal code", 3, 9)
      : validationUtils?.optionalString(),

    freelancerAddress: isEditing
      ? validationUtils?.customField(
          "Please select at least one address",
          3,
          300,
        )
      : validationUtils?.optionalString(),

    isInternationBooking: validationUtils?.boolean(),

    localTravelFee: validationUtils.optionalString(),

    serviceRadius: z
      .number()
      .min(1, "Radius must be at least 1 km")
      .max(100, "Radius cannot exceed 100 km"),

    serviceLocation: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
  });
};

export type LocationValidationType = z.infer<
  ReturnType<typeof LocationValidation>
>;

