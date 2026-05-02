import { Link } from "react-router";
import Label from "@shared/common/components/ui/form/Label.tsx";
import { Toaster } from "react-hot-toast";
import EmailInput from "@shared/common/components/ui/form/input/EmailInputField.tsx";
import { useGlobalStates } from "@/redux/hooks/useGlobalStates";
import authService from "@/api/services/authService";
import { ToastService } from "@/utils/toastService";
import Button from "@shared/common/components/ui/button/Button.js";
import { useForgetPasswordForm } from "./hook/forgetPassword.hook";

export default function ForgetPasswordForm() {
  const { isButtonLoading } = useGlobalStates();
  const formMethods = useForgetPasswordForm();

 const handleFormSubmit = async (data: any, e: any) => {
    e.preventDefault();
    
    const response: any = await authService?.forgetPassword(data)
    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
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
              Forget Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to rechieve password reset link.
            </p>
          </div>
          <div>
            <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <EmailInput
                    type="text"
                    placeholder="Enter your email"
                    registerOptions="email"
                    register={formMethods.register}
                    errors={formMethods?.formState?.errors}
                    maxLength={151}
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
                    loadingState={isButtonLoading("forget-password")}
                    type="submit"
                  >
                    Send Link
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
