"use client";

import React from "react";
import { LoginForm } from "@/components/Authentication/login";
import { PublicRoute } from "@/components/Authentication/wrappers/public-route";

export default function RootPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
