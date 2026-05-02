"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import { Loader } from "@/components/ui/loader";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, authLoader, fetchCurrentUser } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsCheckingAuth(false);
      setShouldRenderChildren(true);
      return;
    }

    if (!isAuthenticated && !authLoader) {
      fetchCurrentUser();
    } else if (isAuthenticated && !authLoader) {
      setShouldRenderChildren(false);
      setIsCheckingAuth(false);
      router.replace("/home"); // Redirect to dashboard/home
    }
  }, [isAuthenticated, authLoader, fetchCurrentUser, router]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return null;
  }

  if (!shouldRenderChildren) {
    return null;
  }

  return <>{children}</>;
};
