import { validationUtils } from "@/lib/utilities/validation";
import { WORKZONE_NAMES } from "@/types/constants/constants";
import { z } from "zod";

export const SignUpValidation = (
  userRole: string,
  isBehalfCompanyState: boolean,
  workZone: string[] = [],
) => {
  return z.object({
    userName: validationUtils?.customField("username", 3, 50),
    freelancerPostalCode: validationUtils?.customField("postal code", 3, 9),
    // Used for the actual selected address string
    // freelancerAddress removed as we only want postcode now
    // workZone removed or made optional since step is gone
    workZone: validationUtils?.optionalString().array(),

    password: validationUtils?.passwordCustomV2("password"),

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

    isEmailVerified: validationUtils?.boolean(),

    isManualAddressFreelancer: validationUtils?.boolean(),
  });
};

export type SignUpValidationType = z.infer<ReturnType<typeof SignUpValidation>>;

