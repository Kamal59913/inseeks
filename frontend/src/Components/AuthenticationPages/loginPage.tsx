import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignUpPage from "./signUpPage";
import { FormField } from "../Common/FormFields";
import { PasswordField } from "../Common/PasswordField";
import { useAppForm } from "../../hooks/useAppForm";
import { loginSchema } from "../../utils/formSchemas";
import { preprocessTrimmedFormData } from "../../utils/formValidation";
import { authService } from "../../services/auth.service";
import { useAppDispatch } from "../../store/hooks";
import { fetchCurrentUser } from "../../store/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { control, handleSubmit } = useAppForm({
    schema: loginSchema,
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleLogin = (values: Record<string, unknown>) => {
    setLoading(true);
    setError("");
    const { identifier, password } = preprocessTrimmedFormData(values);
    const normalizedIdentifier = (identifier as string).toLowerCase();

    authService
      .login({
        username: normalizedIdentifier.includes("@")
          ? ""
          : normalizedIdentifier,
        email: normalizedIdentifier.includes("@") ? normalizedIdentifier : "",
        password: password as string,
      })
      .then(async (res) => {
        if (res.data.statusCode === 200 && res.data.success) {
          await dispatch(fetchCurrentUser()).unwrap();
          navigate("/home");
        } else setError("Invalid credentials. Please try again.");
      })
      .catch(() => setError("Login failed. Check your credentials."))
      .finally(() => setLoading(false));
  };

  if (toggle) return <SignUpPage togglepage={() => setToggle(false)} />;

  return (
    <div className="min-h-screen bg-[#090e1a] flex">
      {/* Left Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        {/* Gradient BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-[#0f172a] to-[#090e1a]"></div>
        {/* Decorative blobs */}
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
            Connect. Create.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Inspire.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            A next-generation social platform for professionals, creators, and
            communities to share ideas and grow together.
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
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 mt-2 text-sm">
              Sign in to continue your journey
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <FormField
              control={control}
              name="identifier"
              label="Email or Username"
              placeholder="you@example.com or username"
              maxLength={150}
              disabled={loading}
            />

            <div className="space-y-1.5">
              <PasswordField
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                maxLength={64}
                disabled={loading}
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Signing
                  in…
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fa-solid fa-arrow-right text-sm"></i>
                </>
              )}
            </button>
          </form>

          {/* Social login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full "></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#090e1a] px-4 text-slate-500">
                or continue with
              </span>
            </div>
          </div>

          <p className="text-centertext-sm text-slate-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setToggle(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create a free account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
