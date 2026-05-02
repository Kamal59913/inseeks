import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentSettingsValidation,
  PaymentSettingsValidationType,
} from "../validation/payment-settngs.validation";

export const usePaymentSettings = (
  initialData?: any,
  isGenerateInvoice?: boolean
) => {
  const formMethods = useForm<PaymentSettingsValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(PaymentSettingsValidation(isGenerateInvoice ?? true)),
    defaultValues: {
      generateInvoices: false,
      billingName: "",
      address1: "",
      address2: "",
      postcode: "",
      city: "",
      vatNumber: "",
    },
  });

  // Reset when sheet opens
  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        generateInvoices: initialData?.generateInvoices ?? false,
        billingName: initialData?.billingName || "",
        address1: initialData?.address1 || "",
        address2: initialData?.address2 || "",
        postcode: initialData?.postcode || "",
        city: initialData?.city || "",
        vatNumber: initialData?.vatNumber || "",
      });
    }
  }, [initialData]);

  return formMethods;
};

