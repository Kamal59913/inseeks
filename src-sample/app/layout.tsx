import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/store/provider";
import { ThemeProvider } from "@/context/ThemeContext";
import satoshi from "./fonts";
import "mapbox-gl/dist/mapbox-gl.css";
import { Suspense } from "react";
import ModalContainer from "@/compmanager/modalContainer";
import QueryProviders from "@/lib/utilities/QueryProvider/QueryProvider";
import { LoaderLayout } from "@/components/layouts/LoaderLayout";
import Loader from "@/components/ui/loader/loader";

export const metadata: Metadata = {
  title: "Empera | Your Lifestyle, Your Way",
  description: "Connect with the best freelancers and services in your area.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon_empera.ico",
    apple: "/favicon_empera.ico",
  },
  openGraph: {
    title: "Empera",
    description: "Connect with the best freelancers and services in your area.",
    url: "https://empera.app",
    siteName: "Empera",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark`} suppressHydrationWarning>
      <link rel="icon" type="image/x-icon" href="/favicon_empera.ico" />

      <body className={`${satoshi.className}`} suppressHydrationWarning>
        <ThemeProvider>
          <Toaster position="top-center" containerStyle={{ zIndex: 100000 }} />
          <StoreProvider>
            <QueryProviders>
              <LoaderLayout />
              <ModalContainer />
              <Suspense fallback={<Loader />}>{children}</Suspense>
            </QueryProviders>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
