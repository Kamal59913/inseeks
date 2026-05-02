import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { ProfileValidationInformation } from "../validations/profile-information.validation";

export const useProfileFormInformation = (data?: any) => {
    const isInitialMount = useRef(true);

  const formMethods = useForm({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      profileUrl: "",
      bio: ""
    },
    resolver: zodResolver(ProfileValidationInformation()),
  });

  useEffect(() => {
    if (data) {
      formMethods.reset({
        firstName: data?.user?.first_name || "",
        lastName: data?.user?.last_name || "",
        profileUrl: data?.user?.username || "",
        bio: data?.additional_info?.bio || ""
      });
    }
    
    // After first mount, set to false
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [data?.user?.first_name, data?.user?.last_name, data?.additional_info?.bio, formMethods]);


  return formMethods;
};

