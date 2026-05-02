"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, JSX } from "react";
import { useDispatch } from "react-redux";
import Loader from "@/components/ui/loader/loader";
import { useUserData } from "@/store/hooks/useUserData";
import { getAuthToken } from "@/lib/utilities/tokenManagement";
import { AppDispatch } from "@/store/store";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { useTutorial } from "@/store/hooks/useTutorials";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const { isAuthenticated, authLoader, userData } = useUserData();
  const dispatch = useDispatch<AppDispatch>();
  const [hasSyncedTutorial, setHasSyncedTutorial] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);
  const { setTutorialStep } = useTutorial();

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setIsCheckingAuth(false);
      setShouldRenderChildren(true);
      return;
    }

    if (!isAuthenticated && !authLoader) {
      dispatch(fetchCurrentUser());
    } else if (isAuthenticated && !authLoader) {
      setShouldRenderChildren(false);
      setIsCheckingAuth(false);
      if (userData?.user?.is_temp_password) {
        router.replace("/signup/freelancer-complete-profile");
      } else {
        const step = userData?.user?.tutorial_step;
        if (typeof step === 'number' && !hasSyncedTutorial) {
          setTutorialStep(step);
          setHasSyncedTutorial(true);
        }
        router.replace("/profile/information");
      }
    }
  }, [isAuthenticated, authLoader, dispatch, router, userData, hasSyncedTutorial, setTutorialStep]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return null;
  }

  if (!shouldRenderChildren) {
    return null;
  }

  return children;
};
