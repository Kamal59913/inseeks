"use client";
import { MessageCircle } from "lucide-react";
import { ToastService } from "@/lib/utilities/toastService";
import authService from "@/services/authService";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { useRouter, useSearchParams } from "next/navigation";
import Label from "@/components/ui/form/label";
import { PasswordInput } from "@/components/ui/form/PasswordInput";
import Button from "@/components/ui/button/Button";
import { useResetPasswordForm } from "./hook/reset-password-form.hook";
import { queryClient } from "@/lib/utilities/queryClient";
import { clearAuthToken } from "@/lib/utilities/tokenManagement";
import { useUserData } from "@/store/hooks/useUserData";
import { PasswordResetValidationType } from "./validations/reset-password.validation";

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formMethods = useResetPasswordForm();
  const { isButtonLoading } = useGlobalStates();
  const token = searchParams.get("token");
  const { setUserData, setAuthenticated } = useUserData();

  const logout = async () => {
    try {
      queryClient.clear();
      clearAuthToken();
      setUserData(null);
      setAuthenticated(false);
      // ToastService.success("Logged Out Successfully");
      router.push("/login/freelancer");
    } catch (error) {
      console.error("Sign out error:", error);
      ToastService.error("Sign out failed");
    }
  };

  const handleFormSubmit = async (data: PasswordResetValidationType, e: React.BaseSyntheticEvent | undefined) => {
    e?.preventDefault();
    const payload = {
      newPassword: data.password,
      token,
    };
    const response = await authService?.passwordUpdateLink(payload);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
      await logout();
      router.replace("/login/freelancer");
    } else {
      if (response?.status !== 401) {
        ToastService.error(
          response.data.message || "Sign in failed",
          "sign-in-fail"
        );
      }
    }
  };

  return (
    <div className="mt-[30vh]">
      <form
        className="flex flex-col"
        onSubmit={formMethods?.handleSubmit(handleFormSubmit)}
      >
        <div className="mb-6">
          <Label isRequired={true}>Password</Label>
          <PasswordInput
            register={formMethods?.register}
            registerOptions="password"
            errors={formMethods?.formState?.errors}
            placeholder="Password"
          />
        </div>

        <div className="mb-6">
          <Label isRequired={true}>Confirm password</Label>
          <PasswordInput
            register={formMethods?.register}
            registerOptions="confirm_password"
            errors={formMethods?.formState?.errors}
            placeholder="Confirm Password"
          />
        </div>
        <p
          className="mb-4 hover:underline cursor-pointer"
          onClick={() => router.push("/profile/information")}
        >
          Go to profile page !
        </p>
        <Button 
          size="rg"
          className="font-semibold"
          type="submit"
          loadingState={isButtonLoading("reset-password")}
        >
          Submit
        </Button>
      </form>
      {/* <div className="absolute bottom-5 right-5">
        <button className="cursor-pointer bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div> */}
    </div>
  );
}

