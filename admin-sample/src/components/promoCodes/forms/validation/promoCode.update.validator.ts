import { z } from "zod";
import { validationUtils } from "@/utils/validation";

export const PromoCodeFormValidation = () => {
  return z.object({
    code: validationUtils.customField("promo code", 1, 10),
    discount_percent: validationUtils.percentage("discount percent", 0, 100),
    expires_at: validationUtils.customDate("promo code exipration", {
      allowPast: false, // promo codes must expire in the future
      allowFuture: true,
      allowNull: true,
    }),
    max_uses: validationUtils.customField("maximum uses", 1, 5),
    active: validationUtils.boolean(),
    discount_type: validationUtils?.customField("discount type", 1, 50),
  });
};

export type PromoCodeFormValidationType = z.infer<
  ReturnType<typeof PromoCodeFormValidation>
>;
