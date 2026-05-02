import { validationUtils } from "@/utils/validation";
import { z } from "zod";

export const FreelanceServicesValidation = (isProductSelection: boolean) => {
  return z.object({
    product_name: validationUtils?.customField("product name", 1, 50),
    product_description: validationUtils?.customField(
      "product description",
      1,
      50
    ),
    product_category: validationUtils?.customFieldSelect(
      "product category",
      1,
      50
    ),
    initial_product_duration: !isProductSelection
      ? validationUtils?.customFieldSelect("product duration", 1, 5)
      : validationUtils?.optionalString(),
    initial_product_price: !isProductSelection
      ? validationUtils?.customFieldNonZero("product price", 1, 5)
      : validationUtils?.optionalString(),
    initial_product_payout: validationUtils?.optionalString(),
    is_product_options: validationUtils.boolean(),
    product_options: z
      .array(
        z.object({
          id: z.number(),
          product_name: isProductSelection
            ? validationUtils?.customField("product name", 1, 50)
            : validationUtils?.optionalString(),
          product_duration: isProductSelection
            ? validationUtils?.customFieldSelect("product duration", 1, 5)
            : validationUtils?.optionalString(),
          product_price: isProductSelection
            ? validationUtils?.customFieldNonZero("product price", 1, 5)
            : validationUtils?.optionalString(),
          product_payout: validationUtils?.optionalString(),
        })
      )
      .optional(),
  });
};

export type FreelanceServicesValidationType = z.infer<
  ReturnType<typeof FreelanceServicesValidation>
>;
