import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlateFormFeeValidation } from "../validation/platefromFee.update.validator";
import { useEffect } from "react";

export const usePlateformFeeForm = (plateformFee?: number) => {
  const formMethods = useForm({
    shouldFocusError: false,
    defaultValues: {
      plateformFee: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(PlateFormFeeValidation() as any),
  });

  useEffect(() => {
    if (plateformFee !== undefined && plateformFee !== null) {
      formMethods.reset({
        plateformFee: plateformFee.toString(),
      });
    }
  }, [plateformFee, formMethods]);

  return formMethods;
};
