import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PrivacySettingsValidation,
  PrivacySettingsValidationType,
} from "./privacy-settings.validation";

export const usePrivacySettingsForm = (initialData?: any) => {
  const formMethods = useForm<PrivacySettingsValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(PrivacySettingsValidation as any),
    defaultValues: {
      privateAccount: initialData?.private_account || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      formMethods.reset({
        privateAccount: initialData?.private_account || false,
      });
    }
  }, [initialData]);

  return formMethods;
};
