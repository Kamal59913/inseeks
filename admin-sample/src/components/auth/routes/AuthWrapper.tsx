import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { fetchCurrentUser } from "../../../redux/slices/authSlice";
import { useUserData } from "../../../redux/hooks/useUserData";
import { AppDispatch } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../../utils/getToken";
import Loader from "../../ui/loader/loader";
import { useGlobalStates } from "../../../redux/hooks/useGlobalStates";
import { fetchCurrentUser } from "@/redux/authThunk";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userData, authLoader } = useUserData();
  const { stopButtonLoading } = useGlobalStates();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // First effect: Handle initial auth check and dispatch fetchCurrentUser
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      stopButtonLoading("login");
      setIsCheckingAuth(false);
      setHasToken(false);
      navigate("/");
      return;
    }

    setHasToken(true);

    if (!userData && !authLoader) {
      dispatch(fetchCurrentUser());
    } else if (userData) {
      stopButtonLoading("login");
      setIsCheckingAuth(false);
    }
  }, [dispatch, userData, authLoader, navigate, stopButtonLoading]);

  // Second effect: Handle the response after fetch completes
  useEffect(() => {
    if (hasToken && userData) {
      setIsCheckingAuth(false);
    }
  }, [hasToken, userData]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (!hasToken) {
    return null;
  }

  return <>{children}</>;
};
