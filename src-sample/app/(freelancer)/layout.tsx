"use client";
import { ProtectedRoute } from "@/components/auth/wrapper/protected";
import FreelancerLayout from "@/components/layouts/freelancerLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <FreelancerLayout>{children}</FreelancerLayout>
    </ProtectedRoute>
  );
}

