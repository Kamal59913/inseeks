import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/lib/utilities/QueryProvider";
import ModalRegistry from "@/components/Modals/ModalRegistry";
import NotificationProvider from "@/components/providers/NotificationProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Avow Social",
  description: "Avow Social - Connect and Share",
};

import { Suspense } from "react";
import { TooltipProvider } from "@repo/ui/index";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/logo_avow_social.svg" />

      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <Toaster position="top-center" containerStyle={{ zIndex: 2000 }} />{" "}
        <QueryProviders>
          <NotificationProvider />
          <TooltipProvider>
            <ModalRegistry />
            <Suspense>
              {children}
            </Suspense>
          </TooltipProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
