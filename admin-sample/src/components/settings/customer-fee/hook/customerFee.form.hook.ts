import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CustomerFeeValidation } from "../validation/customerFee.update.validator";

export const useCustomerFeeForm = (customerFee?: number) => {
  const formMethods = useForm({
    shouldFocusError: false,
    defaultValues: {
      customerFee: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(CustomerFeeValidation() as any),
  });

  useEffect(() => {
    if (customerFee !== undefined && customerFee !== null) {
      formMethods.reset({
        customerFee: customerFee.toString(),
      });
    }
  }, [customerFee, formMethods]);

  return formMethods;
};
