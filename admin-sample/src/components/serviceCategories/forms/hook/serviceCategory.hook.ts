import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ServiceCategoryValidation,
  ServiceCategoryValidationType,
} from "../validation/servceCategory.validation";
import { useEffect } from "react";

export const useServiceCategoryForm = (
  role: string,
  serviceCategory?: ServiceCategoryValidationType
) => {
  const formMethods = useForm<ServiceCategoryValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ServiceCategoryValidation() as any),
    defaultValues: {
      name: "",
      description: "",
      status: false,
    },
  });

  useEffect(() => {
    if (role == "edit" && serviceCategory) {
      formMethods.reset({
        name: serviceCategory?.name || "",
        description: serviceCategory?.description || "",
        status: serviceCategory?.status || false,
      });
    }
  }, [serviceCategory, role]);

  return formMethods;
};
