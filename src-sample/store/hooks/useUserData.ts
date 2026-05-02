import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setUserData, setAuthenticated } from "../slices/authSlice";
import { setAuthLoading } from "../slices/globalSlice";
import { UserProfileData } from "@/types/api/auth.types";

export const useUserData = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const globalState = useSelector((state: RootState) => state.global);
  const dispatch: AppDispatch = useDispatch();

  return {
    userData: authState.userData,
    isAuthenticated: authState.isAuthenticated,
    authLoader: globalState.authLoading,
    setUserData: (value: UserProfileData | null) =>
      dispatch(setUserData(value)),
    setAuthenticated: (value: boolean) => dispatch(setAuthenticated(value)),
    setAuthLoader: (value: boolean) => dispatch(setAuthLoading(value)),
  };
};
