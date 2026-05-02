"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Form } from "@repo/ui/index";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useVerifyOtpForm } from "./use-verify-otp-form.hook";
import { VerifyOtpValidationType } from "./verify-otp.validation";
import authService from "@/lib/api/services/authService";
import { AuthLayout } from "../../Layout/auth-layout";
import { ToastService } from "@/lib/utilities/toastService";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useSignupStore } from "@/store/useSignupStore";

/** Returns remaining seconds until the given Unix timestamp (ms). */
function getRemainingSeconds(expiresAt: number | null): number {
  if (!expiresAt) return 0;
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}

/** Formats total seconds as MM:SS */
function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const { buttonLoaders } = useGlobalStore();
  const loading = buttonLoaders["verify-otp"] || false;
  const resendLoading = buttonLoaders["send-otp"] || false;

  const { payload, otpExpiresAt, saveSignupAttempt, clear } = useSignupStore();

  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    getRemainingSeconds(otpExpiresAt),
  );

  const form = useVerifyOtpForm();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tick down every second based on the absolute expiry timestamp
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(otpExpiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt, secondsLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);
    form.setValue("otp", newOtpValues.join(""));
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: VerifyOtpValidationType) => {
    const response = await authService.verifyRegisterOtp({
      phone: phone.replace(/\+/g, ""),
      otp: data.otp,
    });

    if (response?.status === 200 || response?.status === 201) {
      ToastService.success("Registration successful!");
      clear();
      router.push("/");
    } else {
      ToastService.error(response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (!payload) {
      ToastService.error("Session expired. Please sign up again.");
      router.push("/signup");
      return;
    }

    const response = await authService.sendRegisterOtp(payload as any);
    const status = response?.status || response?.data?.status;

    if (status === 201 || status === 200) {
      const responseData = response?.data?.data || response?.data || {};
      const expiresInSeconds = responseData.expires_in_seconds ?? 1200;
      const userId = responseData.user_id ?? 0;
      saveSignupAttempt(payload, expiresInSeconds, userId);
      setSecondsLeft(expiresInSeconds);
      // Reset OTP inputs
      setOtpValues(["", "", "", "", "", ""]);
      form.setValue("otp", "");
      ToastService.success("OTP resent successfully!");
    } else {
      ToastService.error(
        response?.data?.message || "Failed to resend OTP. Please try again.",
      );
    }
  };

  const canResend = secondsLeft <= 0 && !resendLoading;

  return (
    <AuthLayout
      maxWidth="max-w-md"
      backButton={
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-8 relative w-48 h-48">
          <img
            src="/otp_illustration.png"
            alt="OTP Verification"
            className="w-full h-full object-contain"
          />
        </div>

        <h3 className="text-[32px] font-medium text-gray-900 mb-2">
          Enter 6-digit code
        </h3>
        <p className="text-gray-500 text-[14px] font-[400] mb-8 px-4">
          We are sending the OTP on the Nensapp Registered mobile number{" "}
          <span className="text-[#D16DF2]">{phone}</span>
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="flex justify-center gap-2 mb-8">
              {otpValues.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:border-[#D16DF2] focus:ring-1 focus:ring-[#D16DF2] outline-none transition-all"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full mb-6"
              loadingState={loading}
              disabled={form.getValues("otp").length !== 6}
            >
              Submit
            </Button>

            {/* Countdown */}
            {secondsLeft > 0 && (
              <div className="mt-2 text-[16px] font-medium text-red-500">
                {formatCountdown(secondsLeft)}
              </div>
            )}

            {/* Resend */}
            <div className="text-sm mt-4">
              <span className="text-gray-500">Didn't receive the code? </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`text-[#D16DF2] font-semibold hover:underline ${
                  !canResend ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {resendLoading ? "Sending..." : "Resend"}
              </button>
            </div>

            {/* Back to sign in */}
            <div className="text-sm mt-3 text-gray-500">
              Back to{" "}
              <Link href="/" className="font-semibold text-primary hover:text-gray-800 transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
