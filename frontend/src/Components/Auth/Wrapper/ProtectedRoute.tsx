import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCurrentUser } from '../../../store/authSlice';
import Loader from '../../Common/Loader';
import { getAccessToken } from '../../../utils/tokenStorage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { userData, authLoader } = useAppSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setHasToken(false);
      setIsCheckingAuth(false);
      return;
    }

    setHasToken(true);

    if (!userData && !authLoader) {
      dispatch(fetchCurrentUser()).finally(() => setIsCheckingAuth(false));
    } else if (userData) {
      setIsCheckingAuth(false);
    }
  }, [dispatch, userData, authLoader]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (!hasToken) {
    return <Navigate to="/" replace />;
  }

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
