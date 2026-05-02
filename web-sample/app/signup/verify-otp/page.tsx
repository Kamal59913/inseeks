"use client";
import React from "react";
import { VerifyOtpForm } from "@/components/Authentication/verify-otp/verify-otp-form";
import { PublicRoute } from "@/components/Authentication/wrappers/public-route";

export default function VerifyOtpPage() {
  return (
      <PublicRoute>
        <VerifyOtpForm />
      </PublicRoute>
  );
} 
