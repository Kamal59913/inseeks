"use client";
import { useLoginForm } from "./hook/login-form.hook";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/services/authService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useRouter } from "next/navigation";
import Label from "@/components/ui/form/label";
import { PasswordInput } from "@/components/ui/form/PasswordInput";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/Input";
import { LoginValidationType } from "./validations/login.validation";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { resetSteps } from "@/store/slices/onboardingStepTwoSlice";
import { loadDismissedPagesFromAPI } from "@/store/slices/nonRestrictiveTutorialSlice";

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useLoginForm();
  const { isButtonLoading } = useGlobalStates();

  const handleFormSubmit = async (data: LoginValidationType, e: React.BaseSyntheticEvent | undefined) => {
    e?.preventDefault();

    const response = await authService?.login(data);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
      
      const dismissedModules = response?.data?.data?.user?.metadata?.dismissed_pages || [];
      
      if (Array.isArray(dismissedModules)) {
        dispatch(loadDismissedPagesFromAPI(dismissedModules));
      }

      const isTemporaryPassword = response?.data?.data?.user?.is_temp_password;
      if (isTemporaryPassword) {
        // Reset onboarding step to 0 for a fresh start on this device
        dispatch(resetSteps());
        if (typeof window !== "undefined") {
          localStorage.setItem(
            process.env.NEXT_PUBLIC_STEP_TWO_STORAGE_KEY!,
            "0"
          );
          // Optional: clear form data if you want a blank slate
          // localStorage.removeItem(process.env.NEXT_PUBLIC_FORM_STORAGE_PART_SEC_KEY!);
        }
        router.replace("/signup/freelancer-complete-profile");
      } else {
        router.replace("/profile/information");
      }
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
    }
  };

  return (
    <div className="mt-[26vh]">
      <form
        className="flex flex-col"
        onSubmit={formMethods?.handleSubmit(handleFormSubmit)}
      >
        <div className="mb-6">
          <Label isRequired={true}>Username or email</Label>
          <Input
            register={formMethods?.register}
            registerOptions={"username"}
            type="text"
            placeholder="Username or email"
            errors={formMethods?.formState?.errors}
            noOfSpaceAllowed={0}
            autoFocus={true}
            maxLength={51}
          />
        </div>

        <div className="mb-6">
          <Label isRequired={true}>Password</Label>
          <PasswordInput
            register={formMethods?.register}
            registerOptions="password"
            errors={formMethods?.formState?.errors}
            placeholder="Password"
          />
        </div>
        <p
          className="mb-4 hover:underline cursor-pointer"
          onClick={() => router.push("/forget-password/freelancer")}
        >
          Forgot Password?
        </p>
        <Button
          size="rg"
          className="font-semibold"
          type="submit"
          loadingState={isButtonLoading("login")}
        >
          Log In
        </Button>
        <Button
          size="rg"
          className="mt-4 text-sm"
          variant="dark"
          onClick={() => router.push("/signup/freelancer")}
        >
          Not Registered? Create your account
        </Button>
        {/* <p
          className="mb-4 hover:underline cursor-pointer"
          onClick={() => router.push("/signup/freelancer")}
        >
          Not registered? Create your account
        </p> */}
      </form>

      {/* <div className="absolute bottom-5 right-5">
        <button className="cursor-pointer bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div> */}
    </div>
  );
}

