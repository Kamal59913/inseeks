"use client";
import { getLayoutForPath } from "@/lib/config/layoutConfig";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const Layout = getLayoutForPath(pathname);

    return <Layout>{children}</Layout>;

}
