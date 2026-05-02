"use client";
import ProfileLayout from "@/components/layouts/profileLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <ProfileLayout>{children}</ProfileLayout>
  );
}

