"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Button,
  FieldGroup,
  Field,
  FieldError,
  InputGroupInput,
  Form,
  FormField,
  FormItem,
  PhoneInput,
  DatePicker,
} from "@repo/ui/index";
import { useSignupForm } from "./use-signup-form.hook";
import { SignupValidationType } from "./signup.validation";
import authService from "@/lib/api/services/authService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../../Layout/auth-layout";
import { SocialLoginButtons } from "../../Layout/social-login-buttons";
import { ToastService } from "@/lib/utilities/toastService";
import { useModalStore } from "@/store/useModalStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useSignupStore } from "@/store/useSignupStore";
import { PASSWORD_POLICY_CONFIG } from "@/lib/config/config";

export function SignupForm() {
  const router = useRouter();
  const form = useSignupForm();
  const { openModal } = useModalStore();
  const { buttonLoaders} = useGlobalStore();
  const loading = buttonLoaders["send-otp"] || false;

  // Calculate maxDate (12 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);


  const onSubmit = async (data: SignupValidationType) => {
    const response = await authService.sendRegisterOtp(data as any);
    console.log("SendRegisterOtp response:", response);

    const status = response?.status || response?.data?.status;
    const message = response?.data?.message || "";
    
    if (status === 201 || status === 200) {
      ToastService.success("OTP sent successfully!");
      const responseData = response?.data?.data || response?.data || {};
      const expiresInSeconds = responseData.expires_in_seconds ?? 1200;
      const userId = responseData.user_id ?? 0;
      useSignupStore.getState().saveSignupAttempt(data as any, expiresInSeconds, userId);
      const phone = data.phoneData?.phoneNumber || data.phone || "";
      router.push(`/signup/verify-otp?phone=${encodeURIComponent(phone)}`);
    } else if ((status === 400 || status === "400") && message.toLowerCase().includes("not registered")) {
      ToastService.error(message || "Failed to send OTP");
      openModal("nensapp");
    } else {
      ToastService.error(message || "Failed to send OTP");
    }
  };

  const secondaryLinkCard = (
    <>
      <SocialLoginButtons />
      <p className="text-sm">
        Have an account?{" "}
        <Link href="/" className="text-primary font-semibold">
          Log in
        </Link>
      </p>
    </>
  );

  return (
    <AuthLayout
      title="Sign Up"
      description="Register your account with Avowsocial"
      secondaryLinkCard={secondaryLinkCard}
      maxWidth="max-w-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)}>
          <FieldGroup className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      placeholder="Username"
                      noOfSpaceAllowed={0}
                      autoFocus={true}
                      maxLength={65}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      placeholder="Email"
                      noOfSpaceAllowed={0}
                      maxLength={151}
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      placeholder="Full Name"
                      maxLength={101}
                      noOfSpaceAllowed={1}
                      isSpaceAtStart={false}
                      isSpaceAtEnd={true}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field: { onChange, value }, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <PhoneInput
                      containerClass="w-full"
                      inputClass="!w-full !h-[40px]"
                      country="in"
                      value={value}
                      onChange={(phone: string, country: any) => {
                        // Store both phone and country data
                        form.setValue("phoneData", {
                          fullPhone: phone,
                          countryCode: `+${country.dialCode}`,
                          phoneNumber: phone.replace(country.dialCode, ""),
                        });
                        onChange(phone);
                      }}
                      placeholder="1 (800) 123-4567"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_of"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <InputGroupInput
                      {...field}
                      placeholder="Account Of"
                      maxLength={101}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field: { value, onChange }, fieldState }) => (
                <FormItem>
                  <Field data-invalid={fieldState.invalid}>
                    <DatePicker
                      id="signup-birthday"
                      defaultDate={value}
                      onChange={(selectedDates) => onChange(selectedDates[0])}
                      placeholder="Date of birth"
                      maxDate={maxDate}
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
            Sign Up
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
