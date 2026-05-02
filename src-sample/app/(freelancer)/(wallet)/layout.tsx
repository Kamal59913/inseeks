"use client";
import WalletLayout from "@/components/layouts/WalletLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletLayout>{children}</WalletLayout>;
}

