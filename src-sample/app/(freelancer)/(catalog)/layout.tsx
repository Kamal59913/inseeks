"use client";

import CatalogLayout from "@/components/layouts/catalogLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogLayout>{children}</CatalogLayout>;
}

