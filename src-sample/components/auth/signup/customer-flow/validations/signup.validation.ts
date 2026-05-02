import { validationUtils } from "@/lib/utilities/validation";
import { z } from "zod";

export const SignUpValidation = () => {
  return z
    .object({
      firstName: validationUtils?.customField("first name", 1, 50),
      lastName: validationUtils?.customField("last name", 1, 50),
      email: validationUtils?.email(""),
      customerType: z.string().min(1, "Please select how you will use Empera"),
      companyName: validationUtils?.customOptional("company name", 1, 50),
      companyPosition: validationUtils?.customOptional(
        "company position",
        1,
        50
      ),
      countryCode: z.string().min(1, "Country code is required"),
      phoneNumber: validationUtils?.customField("phone", 8, 15),
    })
    .superRefine((data, ctx) => {
      if (
        data.customerType === "professional" ||
        data.customerType === "both"
      ) {
        if (!data.companyName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter company name",
            path: ["companyName"],
          });
        }
        if (!data.companyPosition) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter company position",
            path: ["companyPosition"],
          });
        }
      }
    });
};

export type SignUpValidationType = z.infer<ReturnType<typeof SignUpValidation>>;

