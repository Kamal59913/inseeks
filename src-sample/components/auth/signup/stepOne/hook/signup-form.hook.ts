import { useForm } from "react-hook-form";
//@ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignUpValidation,
  SignUpValidationType,
} from "../validations/signup.validation";
import { useEffect } from "react";

const FORM_STORAGE_KEY = process.env.NEXT_PUBLIC_FORM_STORAGE_PART_ONE_KEY!;

export const INITIAL_VALUES_STEP_ONE: SignUpValidationType = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  countryCode: "",
  instagramHandle: "",
  freelancerBio: "",
  areasOfExpertise: [],
  category_rates: {},
  freelancerReferralDetails: "",
  freelancerPortfolioImages: [],
};

export const useSignUpForm = (skippedFields?: {
  instagramHandle?: boolean;
  chargingRates?: boolean;
  freelancerReferralDetails?: boolean;
}) => {
  const savedForm =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || "null")
      : null;

  const formMethods = useForm<SignUpValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(SignUpValidation(skippedFields)),
    defaultValues: savedForm || INITIAL_VALUES_STEP_ONE,
  });

  useEffect(() => {
    const subscription = formMethods.watch((values) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [formMethods]);

  return formMethods;
};

