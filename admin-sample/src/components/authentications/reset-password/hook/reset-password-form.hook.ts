import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordResetValidation, PasswordResetValidationType } from "../validation/reset-password.validator";


export const useResetPasswordForm = () => {
  const formMethods = useForm<PasswordResetValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(PasswordResetValidation as any),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });


  return formMethods;
};