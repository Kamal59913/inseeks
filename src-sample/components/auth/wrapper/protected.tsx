"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGlobalStates } from "@/store/hooks/useGlobalStates";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import { useUserData } from "@/store/hooks/useUserData";
import { AppDispatch } from "@/store/store";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/components/ui/loader/loader";
import { useTutorial } from "@/store/hooks/useTutorials";
import { loadDismissedPagesFromAPI } from "@/store/slices/nonRestrictiveTutorialSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { userData, authLoader } = useUserData();
  const { stopButtonLoading } = useGlobalStates();
  const { setTutorialStep } = useTutorial();
  
  const [hasSyncedTutorial, setHasSyncedTutorial] = useState(false);
  const [hasSyncedTutorialModules, setHasSyncedTutorialModules] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    
    if (!token) {
      stopButtonLoading('login');
      setIsCheckingAuth(false);
      setHasToken(false);
      router.push("/");
      return;
    }

    setHasToken(true);

    if (!userData && !authLoader) {
      dispatch(fetchCurrentUser());
    } else if (userData) {
      stopButtonLoading('login');
      const step = userData?.user?.tutorial_step;
      if (typeof step === 'number' && !hasSyncedTutorial) {
        setTutorialStep(step);
        setHasSyncedTutorial(true);
      }
      
      // Load dismissed tutorial modules from user meta
      const dismissedModules = userData?.user?.metadata?.dismissed_pages || [];
      
      // We don't want to use useSelector inside useEffect if we can avoid it, 
      // but here we need to know if we already initialized to avoid overwriting optimistic updates.
      if (Array.isArray(dismissedModules) && !hasSyncedTutorialModules) {
        dispatch(loadDismissedPagesFromAPI(dismissedModules));
        setHasSyncedTutorialModules(true);
      }
      
      if (userData?.user?.is_temp_password && pathname !== "/signup/freelancer-complete-profile") {
        router.replace("/signup/freelancer-complete-profile");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [dispatch, userData, authLoader, router, stopButtonLoading, pathname, hasSyncedTutorial, setTutorialStep, hasSyncedTutorialModules]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (!hasToken) {
    return null;
  }

  return <>{children}</>;
};
