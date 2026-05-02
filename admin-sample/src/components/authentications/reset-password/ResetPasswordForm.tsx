import { Link } from "react-router";
import Label from "@shared/common/components/ui/form/Label.tsx";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "@shared/common/components/ui/button/Button.js";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";
import authService from "@/api/services/authService";
import { ToastService } from "@/utils/toastService";
import { useResetPasswordForm } from "./hook/reset-password-form.hook";
import { PasswordInput } from "@shared/common/components/ui/form/input/PasswordInput.js";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();


  const { isButtonLoading } = useGlobalStates();

  const formMethods = useResetPasswordForm();

  const handleFormSubmit = async (data: any, e: any) => {
    e.preventDefault();
    const payload = {
      newPassword: data.password,
      token,
    };
    const response = await authService?.resetPassword(payload);

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
      navigate("/");
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Toaster />
      <div className="w-full max-w-md pt-10 mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-black text-title-sm dark:text-white/90 sm:text-title-md">
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please reset your password.
            </p>
          </div>
          <div>
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
               
                  <PasswordInput
                    register={formMethods?.register}
                    registerOptions="password"
                    errors={formMethods.formState.errors}
                    placeholder="Enter your password"
                    maxLength={65}
                  />
                </div>
                <div>
                  <Label>
                    Confirm Password{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                 
                  <PasswordInput
                    register={formMethods?.register}
                    registerOptions="confirm_password"
                    errors={formMethods.formState.errors}
                    placeholder="Enter your password"
                    maxLength={65}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="text-sm text-primary dark:text-white hover:dark:text-gray-200 hover:text-primary-dark"
                  >
                    Go to sign in page !
                  </Link>
                </div>
                <div>
                  <Button
                    className="w-full"
                    loadingState={isButtonLoading("reset-password")}
                    type="submit"
                  >
                    Submit
                    {/* {loading ? "loading" : ""} */}
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary-dark"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
