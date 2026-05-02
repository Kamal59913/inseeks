"use client";

import React from "react";
import { ForgotPasswordForm } from "@/components/Authentication/forgot-password";
import { PublicRoute } from "@/components/Authentication/wrappers/public-route";

export default function ForgotPasswordPage() {
  return (
    <PublicRoute>
      <ForgotPasswordForm />
    </PublicRoute>
  );
}
