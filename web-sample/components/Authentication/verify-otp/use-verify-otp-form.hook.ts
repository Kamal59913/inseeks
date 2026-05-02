import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VerifyOtpValidation,
  VerifyOtpValidationType,
} from "./verify-otp.validation";

export const useVerifyOtpForm = () => {
  const formMethods = useForm<VerifyOtpValidationType>({
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(VerifyOtpValidation),
    defaultValues: {
      otp: "",
    },
  });

  return formMethods;
};
