"use client"
import { MessageCircle } from 'lucide-react';
import { ToastService } from '@/lib/utilities/toastService';
import authService from '@/services/authService';
import { useGlobalStates } from '@/store/hooks/useGlobalStates';
import { useRouter } from 'next/navigation';
import Label from '@/components/ui/form/label';
import Button from '@/components/ui/button/Button';
import { useForgetPasswordForm } from './hook/forget-password-form.hook';
import EmailInput from '@/components/ui/form/EmailInput';
import { ForgetPasswordValidationType } from './validations/forget-password.validation';

import Image from 'next/image';

export default function ForgetPasswordScreen() {
  const router = useRouter()
  const formMethods = useForgetPasswordForm();
  const { isButtonLoading } = useGlobalStates()

  const handleFormSubmit = async (data: ForgetPasswordValidationType, e: React.BaseSyntheticEvent | undefined) => {
    e?.preventDefault();
    
    const response = await authService?.forgetPassword(data)

    if (response.status === 201) {
      ToastService.success(
        response.data.message || "Sign in success",
        "sign-in-success"
      );
      // router.replace("/dashboard");
    } else {
      ToastService.error(
        response.data.message || "Sign in failed",
        "sign-in-fail"
      );
    }

  };


  return (
    <>
      <div className="absolute top-14 left-4">
        <button
          type="button"
          className="text-gray-600 dark:text-white cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push("/login/freelancer")}
        >
          <Image
            src={"/left-icon.svg"}
            className="h-8 min-w-4 max-w-5 max-h-5"
            alt="Back"
            width={20}
            height={20}
          />
        </button>
      </div>
      <div className="mt-[30vh]">
        <form
          className="flex flex-col"
          onSubmit={formMethods?.handleSubmit(handleFormSubmit)}
        >
          <div className="mb-6">
            <Label isRequired={true}>Email</Label>
            <EmailInput
              register={formMethods?.register}
              registerOptions={"email"}
              type="text"
              placeholder="Email"
              errors={formMethods?.formState?.errors}
            />
          </div>

          <Button
            size="rg"
            className="font-semibold"
            type="submit"
            loadingState={isButtonLoading("forget-password")}
          >
            Send Link
          </Button>
        </form>
        {/* <div className="absolute bottom-5 right-5">
        <button className="cursor-pointer bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-6 h-6" />
        </button>
      </div> */}
      </div>
    </>
  );
}
