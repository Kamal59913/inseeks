import { useCallback } from 'react';
import { useAppDispatch } from '.';
import { setAuthenticated } from '../slices/authSlice';

export const useSetAuthenticated = () => {
  const dispatch = useAppDispatch();

  const setAuthStatus = useCallback((status: boolean) => {
    dispatch(setAuthenticated(status));
  }, [dispatch]);

  return setAuthStatus;
};
