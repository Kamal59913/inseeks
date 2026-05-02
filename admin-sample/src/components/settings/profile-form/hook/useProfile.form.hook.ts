// useProfile.form.hook.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateValidation } from "../validation/profile.update.validator";
import { useEffect } from "react";

export const useProfileForm = (userData?: any) => {
  const formMethods = useForm({
    shouldFocusError: false,
    defaultValues: {
      firsName: "",
      lastName: "",
      userName: "",
      email: "",
      phone: "",
      phoneData: {
        fullPhone: "",
        countryCode: "+1",
        phoneNumber: "",
      },
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ProfileUpdateValidation() as any),
  });

  useEffect(() => {
    if (userData) {
      const countryCode = userData?.user?.country_code || "+1";
      const phoneNumber = userData?.user?.phone || "";
      const fullPhone =
        countryCode && phoneNumber
          ? `${countryCode.replace("+", "")}${phoneNumber}`
          : "";

      formMethods.reset({
        firsName: userData?.user?.first_name || "",
        lastName: userData?.user?.last_name || "",
        userName: userData?.user?.username || "",
        email: userData?.user?.email || "",
        phone: fullPhone,
        phoneData: {
          fullPhone: fullPhone,
          countryCode: countryCode,
          phoneNumber: phoneNumber,
        },
      });
    }
  }, [userData, formMethods]);

  return formMethods;
};
