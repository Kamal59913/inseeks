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
import { useLoginForm } from "./use-login-form.hook";
import { LoginValidationType } from "./login.validation";
import authService from "@/lib/api/services/authService";
import Link from "next/link";
import { AuthLayout } from "../../Layout/auth-layout";
import { SocialLoginButtons } from "../../Layout/social-login-buttons";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useModalStore } from "@/store/useModalStore";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

export function LoginForm() {
  const form = useLoginForm();
  const { buttonLoaders } = useGlobalStore();
  const { openModal } = useModalStore();
  const loading = buttonLoaders["login"] || false;

  const onSubmit = async (data: LoginValidationType) => {
    const response = await authService.login(data);
    if (response?.status === 200 || response?.status === 201) {
      ToastService.success(
        response?.data?.detail || response?.data?.message || "Logged in Successfully"
      );
    } else {
      const detail = response?.data?.detail;
      // Backend returns is_deactivated flag when account is deactivated
      if (detail?.is_deactivated) {
        openModal("reactivate-account", {
          username: data.username,
          password: data.password,
          reactivate_before: detail.reactivate_before,
        });
      } else {
        ToastService.error(
          detail?.message || detail || response?.data?.message || "Invalid details"
        );
      }
    }
  };

  const secondaryLinkCard = (
    <>
      <SocialLoginButtons />
      <p className="text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary font-semibold">
          Sign up
        </Link>
      </p>
    </>
  );

  return (
    <AuthLayout 
      title="Login" 
      description="Please login to your account" 
      secondaryLinkCard={secondaryLinkCard}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      placeholder="Phone number, username, or email"
                      noOfSpaceAllowed={0}
                      autoFocus={true}
                      maxLength={65}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      type="password"
                      placeholder="Password"
                      maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                      noOfSpaceAllowed={0}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                </FormItem>
              )}
            />
          </FieldGroup>

          <Button type="submit" className="w-full text-white font-semibold mt-2" loadingState={loading}>
            Log in
          </Button>
        </form>
      </Form>

      <div className="text-right">
        <Link href="/forgot-password" title="Forgot Password?" className="text-xs text-primary font-semibold">
          Forgot password?
        </Link>
      </div>
    </AuthLayout>
  );
}
