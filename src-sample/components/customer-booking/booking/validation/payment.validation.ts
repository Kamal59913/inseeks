import { z } from "zod";

export const PaymentValidationSchema = () => {
  return z.object({
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    country: z.string().min(1, { message: "Please select a billing country" }),
    postal: z
      .string()
      .min(4, { message: "Please enter a valid postal code" })
      .max(10, { message: "Please enter a valid postal code" }),
    promo: z.string().optional(),
    // Apple Pay fields
    paymentMethod: z.string().optional(),
    paymentMethodId: z.string().optional(),
    clientSecret: z.string().optional(),
  });
};

export type PaymentValidationType = z.infer<
  ReturnType<typeof PaymentValidationSchema>
>;

