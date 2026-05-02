import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginValidation, LoginValidationType } from "./login.validation";

export const useLoginForm = () => {
  const formMethods = useForm<LoginValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return formMethods;
};
