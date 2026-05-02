"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import { Loader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const { userData, authLoader, fetchCurrentUser } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsCheckingAuth(false);
      setHasToken(false);
      router.push("/"); // Redirect to login
      return;
    }

    setHasToken(true);

    if (!userData && !authLoader) {
      fetchCurrentUser().catch(() => {
        router.push("/");
      });
    } else if (userData) {
      setIsCheckingAuth(false);
    }
  }, [userData, authLoader, fetchCurrentUser, router]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (!hasToken) {
    return null;
  }

  return <>{children}</>;
};
