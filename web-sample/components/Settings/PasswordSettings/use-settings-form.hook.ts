import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import passwordUpdateValidation from "./passwordSettings.validation";
import { z } from "zod";

export type PasswordUpdateFormData = z.infer<typeof passwordUpdateValidation>;

export const usePasswordChangeForm = () => {
  const formMethods = useForm<PasswordUpdateFormData>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(passwordUpdateValidation),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return formMethods;
};
