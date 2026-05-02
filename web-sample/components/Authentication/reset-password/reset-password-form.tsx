"use client";

import React from "react";
import {
  Button,
  FieldGroup,
  Field,
  FieldError,
  InputGroupInput,
  Form,
  FormField,
  FormItem,
} from "@repo/ui/index";
import { useResetPasswordForm } from "./use-reset-password-form.hook";
import { ResetPasswordValidationType } from "./reset-password.validation";
import authService from "@/lib/api/services/authService";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "../../Layout/auth-layout";
import { ToastService } from "@/lib/utilities/toastService";

import { useGlobalStore } from "@/store/useGlobalStore";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

export function ResetPasswordForm() {
  const { buttonLoaders } = useGlobalStore();
  const loading = buttonLoaders["reset-password"] || false;
  const form = useResetPasswordForm();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const onSubmit = async (data: ResetPasswordValidationType) => {
    const response = await authService.resetPassword({
      email,
      otp,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
    if (response?.status === 200 || response?.status === 201) {
      ToastService.success("Password reset successfully!");
    } else {
      ToastService.error(
        response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <AuthLayout 
      title="Finalize Reset" 
      description="Enter your new password to regain access"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      type="password"
                      placeholder="New Password"
                      autoFocus={true}
                      maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      type="password"
                      placeholder="Confirm Password"
                      maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </FormItem>
              )}
            />
          </FieldGroup>

          <Button 
            type="submit" 
            className="w-full text-white font-semibold mt-2" 
            loadingState={loading}
          >
            Submit
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
