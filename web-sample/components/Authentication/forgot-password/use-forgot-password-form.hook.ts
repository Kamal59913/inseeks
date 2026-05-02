import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordValidation,
  ForgotPasswordValidationType,
} from "./forgot-password.validation";

export const useForgotPasswordForm = () => {
  const formMethods = useForm<ForgotPasswordValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ForgotPasswordValidation),
    defaultValues: {
      email: "",
    },
  });

  return formMethods;
};
