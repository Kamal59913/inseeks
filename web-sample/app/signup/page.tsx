"use client";

import React from "react";
import { SignupForm } from "@/components/Authentication/signup";
import { PublicRoute } from "@/components/Authentication/wrappers/public-route";

export default function SignupPage() {
  return (
    <PublicRoute>
      <SignupForm />
    </PublicRoute>
  );
}
