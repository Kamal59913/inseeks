import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  EditProfileValidation,
  EditProfileValidationType,
} from "./edit-profile.validation";

export const useEditProfileForm = (userData?: any) => {
  const formMethods = useForm<EditProfileValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(EditProfileValidation as any),
    defaultValues: {
      name: "",
      bio: "",
      birthday: undefined,
      status: undefined,
      account_of: "",
    },
  });

  useEffect(() => {
    if (userData) {
      formMethods.reset({
        name: userData?.full_name || "",
        bio: userData?.bio || "",
        birthday: userData?.birthday ? new Date(userData.birthday) : undefined,
        status:
          userData?.status === "married"
            ? "married"
            : userData?.status === "single"
              ? "single"
              : undefined,
        account_of: userData?.account_of || "",
      });
    }
  }, [userData, formMethods]);

  return formMethods;
};
