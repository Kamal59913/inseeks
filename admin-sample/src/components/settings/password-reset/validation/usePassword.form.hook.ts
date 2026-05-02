import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import passwordUpdateValidation from "./password.update.validator";

export const usePasswordForm = () => {
  const formMethods = useForm({
    shouldFocusError: false,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(passwordUpdateValidation as any),
  });

  return formMethods;
};
