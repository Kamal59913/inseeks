import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { FormField } from "../Common/FormFields";
import { PasswordField } from "../Common/PasswordField";
import Button from "../Common/Button";
import { useAppForm } from "../../hooks/useAppForm";
import {
  requestOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../../validations/schemas/auth.schema";
import { PASSWORD_POLICY_CONFIG } from "../../config/config";
type Step = "email" | "otp" | "reset";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const emailForm = useAppForm({
    schema: requestOtpSchema,
    defaultValues: { email: "" },
  });
  const otpForm = useAppForm({
    schema: verifyOtpSchema,
    defaultValues: { otp: "" },
  });
  const resetForm = useAppForm({
    schema: resetPasswordSchema,
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleRequestOtp = async (values: Record<string, unknown>) => {
    const currentEmail = values.email as string;
    setEmail(currentEmail);
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await authService.forgotPassword(currentEmail);
      if (res.data.success) {
        setStep("otp");
        setSuccessMsg("OTP sent to your email.");
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values: Record<string, unknown>) => {
    const currentOtp = values.otp as string;
    setOtp(currentOtp);
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await authService.verifyOTP(email, currentOtp);
      if (res.data.success) {
        setStep("reset");
        setSuccessMsg("OTP verified. Please enter your new password.");
      } else {
        setError("Invalid OTP.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: Record<string, unknown>) => {
    const { password } = values;
    setLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await authService.resetPassword({
        email,
        otp,
        newPassword: password as string,
      });
      if (res.data.success) {
        setSuccessMsg("Password reset successfully. Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Failed to reset password.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090e1a] flex">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-[#0f172a] to-[#090e1a]"></div>
        <div className="absolute top-1/4 -left-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 h-60 w-60 rounded-full bg-purple-600/15 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Inseeks
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Secure your
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Account.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Follow the steps to reset your password and get back into your
            account securely.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-600">
          © 2024 Inseeks. All rights reserved.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <i className="fa-solid fa-seedling text-white text-sm"></i>
            </div>
            <span className="text-white font-bold text-xl">Inseeks</span>
          </div>

          <div>
            <Button
              variant="custom"
              size="none"
              borderRadius=""
              onClick={() => navigate("/")}
              className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-2 mb-4"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to login
            </Button>
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="text-slate-400 mt-2 text-sm">
              {step === "email" && "Enter your email to receive an OTP"}
              {step === "otp" && `Enter the 6-digit OTP sent to ${email}`}
              {step === "reset" && "Enter your new password below"}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-check-circle text-emerald-400 text-sm"></i>
              <p className="text-emerald-400 text-sm">{successMsg}</p>
            </div>
          )}

          {step === "email" && (
            <form
              onSubmit={emailForm.handleSubmit(handleRequestOtp)}
              className="space-y-5"
            >
              <FormField
                control={emailForm.control}
                name="email"
                label="Email"
                placeholder="you@example.com"
                maxLength={151}
                disabled={loading}
              />

              <Button
                type="submit"
                loadingState={loading}
                className="w-full py-3"
                endIcon={<i className="fa-solid fa-arrow-right text-sm"></i>}
              >
                Send OTP
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form
              onSubmit={otpForm.handleSubmit(handleVerifyOtp)}
              className="space-y-5"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                label="OTP Code"
                placeholder="123456"
                maxLength={7}
                disabled={loading}
              />

              <Button
                type="submit"
                loadingState={loading}
                className="w-full py-3"
                endIcon={<i className="fa-solid fa-arrow-right text-sm"></i>}
              >
                Verify OTP
              </Button>
            </form>
          )}

          {step === "reset" && (
            <form
              onSubmit={resetForm.handleSubmit(handleResetPassword)}
              className="space-y-5"
            >
              <PasswordField
                control={resetForm.control}
                name="password"
                label="New Password"
                placeholder="Enter new password"
                maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                disabled={loading}
              />

              <PasswordField
                control={resetForm.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                maxLength={PASSWORD_POLICY_CONFIG.INPUT_MAX_LENGTH}
                disabled={loading}
              />

              <Button
                type="submit"
                loadingState={loading}
                className="w-full py-3"
                endIcon={<i className="fa-solid fa-check text-sm"></i>}
              >
                Reset Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
