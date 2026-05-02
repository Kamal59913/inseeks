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
import { useForgotPasswordForm } from "./use-forgot-password-form.hook";
import authService from "@/lib/api/services/authService";
import Link from "next/link";
import { AuthLayout } from "../../Layout/auth-layout";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const { buttonLoaders } = useGlobalStore();
  const loading = buttonLoaders["forgot-password"] || false;
  const form = useForgotPasswordForm();
  const router = useRouter();

  const onSubmit = async (data: { email: string }) => {
    const response = await authService.forgotPassword(data);
    if (response?.status === 200 || response?.status === 201) {
      if (response.data.message === "Email not registered") {
        ToastService.error(
          response?.data?.message || "Email not registered!",
        );
      } else {
        ToastService.success(
          `${response?.data?.message || "Temporary password sent successfully to your email."} Use that password to log in, then update your password from settings.`,
        );
      }
    } else {
      ToastService.error(
        response?.data?.message || "Failed to send reset link",
      );
    }
  };

  const secondaryLinkCard = (
    <p className="text-sm">
      Back to{" "}
      <Link href="/" className="text-primary font-semibold">
        Login
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email to regain access to your account"
      secondaryLinkCard={secondaryLinkCard}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      type="email"
                      placeholder="Email"
                      autoFocus={true}
                      maxLength={151}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
