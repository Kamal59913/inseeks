import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignUpValidation,
  SignUpValidationType,
} from "../validations/signup.validation";
import { useEffect } from "react";

const FORM_STORAGE_KEY = "customer_onboarding_form_data";

export const useSignUpForm = () => {
  const savedForm =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || "null")
      : null;

  const formMethods = useForm<SignUpValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SignUpValidation()),
    defaultValues: savedForm || {
      firstName: "",
      lastName: "",
      email: "",
      customerType: "",
      companyName: "",
      companyPosition: "",
      countryCode: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  return formMethods;
};
