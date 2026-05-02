import { Navigate, useLocation } from "react-router-dom";
import { useUserData } from "../../../redux/hooks/useUserData";
import { getAuthToken } from "../../../utils/getToken";
import { JSX, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import Loader from "../../ui/loader/loader";
import { fetchCurrentUser } from "@/redux/authThunk";

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, authLoader } = useUserData();
  const token = getAuthToken();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token && !isAuthenticated && !authLoader) {
      dispatch(fetchCurrentUser());
    }
  }, [token, isAuthenticated, authLoader, dispatch]);

  if (authLoader) {
    return <Loader />;
  }

  if (token && isAuthenticated) {
    return <Navigate to="/waiting-list-customers" state={{ from: location }} replace />;
  }

  return children;
};