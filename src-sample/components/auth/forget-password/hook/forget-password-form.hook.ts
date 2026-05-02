import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetPasswordValidation, ForgetPasswordValidationType } from "../validations/forget-password.validation";


export const useForgetPasswordForm = () => {
  const formMethods = useForm<ForgetPasswordValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(ForgetPasswordValidation),
    defaultValues: {
      email: ""
    },
  });


  return formMethods;
};
