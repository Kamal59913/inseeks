import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupValidation, SignupValidationType } from "./signup.validation";

export const useSignupForm = () => {
  const formMethods = useForm<SignupValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SignupValidation as any),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
      phone: "",
      phoneData: {
        fullPhone: "",
        countryCode: "+1",
        phoneNumber: "",
      },
      account_of: "",
      birthday: undefined,
    },
  });

  return formMethods;
};
