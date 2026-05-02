import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordValidation,
  ResetPasswordValidationType,
} from "./reset-password.validation";

export const useResetPasswordForm = () => {
  const formMethods = useForm<ResetPasswordValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  return formMethods;
};
