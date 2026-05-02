import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation, LoginValidationType } from "../validation/email.validator";


export const useLoginForm = () => {
  const formMethods = useForm<LoginValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(loginValidation() as any),
    defaultValues: {
      username: "",
      password: ""
    },
  });
  return formMethods;
};

