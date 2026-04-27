import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchCurrentUser } from '../../../store/authSlice';
import Loader from '../../Common/Loader';
import { getAccessToken } from '../../../utils/tokenStorage';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, authLoader } = useAppSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setIsCheckingAuth(false);
      setShouldRenderChildren(true);
      return;
    }

    if (!isAuthenticated && !authLoader) {
      dispatch(fetchCurrentUser()).finally(() => setIsCheckingAuth(false));
    } else if (isAuthenticated && !authLoader) {
      setShouldRenderChildren(false);
      setIsCheckingAuth(false);
    }
  }, [dispatch, isAuthenticated, authLoader]);

  if (isCheckingAuth || authLoader) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (!shouldRenderChildren) {
    return null;
  }

  return <>{children}</>;
};
