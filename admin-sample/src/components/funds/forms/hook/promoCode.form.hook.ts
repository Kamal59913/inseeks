import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PromoCodeFormValidation } from "../validation/promoCode.update.validator";
import { useEffect } from "react";

export const usePromoCodeForm = (initialData?: any) => {
  const formMethods = useForm({
    shouldFocusError: false,
    defaultValues: {
      code: "",
      discount_percent: "",
      expires_at: null,
      max_uses: "",
      active: true,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(PromoCodeFormValidation() as any),
  });

  // Prefill form if editing an existing promo code
  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        code: initialData.code ?? "",
        discount_percent: initialData.discount_percent?.toString() ?? "",
        expires_at: initialData.expires_at ?? null,
        max_uses: initialData.max_uses?.toString() ?? "",
        active: initialData.active ?? true,
      });
    }
  }, [initialData, formMethods]);

  return formMethods;
};
