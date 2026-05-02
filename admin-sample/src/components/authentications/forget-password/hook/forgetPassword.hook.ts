import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordValidation, ForgetPasswordValidationType } from "../validation/email.validator";

export const useForgetPasswordForm = () => {
  const formMethods = useForm<ForgetPasswordValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(forgetPasswordValidation() as any),
    defaultValues: {
      email: "",
    },
  });
  return formMethods;
};

