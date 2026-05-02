import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  SettingsValidation,
  SettingsValidationType,
} from "./settings.validation";

export const useSettingsForm = (userData?: any) => {
  const formMethods = useForm<SettingsValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SettingsValidation),
    defaultValues: {
      username: "",
      phone: "",
      phoneData: {
        fullPhone: "",
        countryCode: "91",
        phoneNumber: "",
      },
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData) {
      const countryCode = userData?.country_code || "91";
      const phoneNumber = userData?.phone || "";
      const fullPhone =
        countryCode && phoneNumber
          ? `${countryCode.replace("+", "")}${phoneNumber}`
          : phoneNumber;

      formMethods.reset({
        username: userData?.username || "",
        phone: fullPhone,
        phoneData: {
          fullPhone: fullPhone,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        },
        email: userData?.email || "",
        password: "", // Don't pre-populate password
      });
    }
  }, [userData, formMethods]);

  return formMethods;
};
