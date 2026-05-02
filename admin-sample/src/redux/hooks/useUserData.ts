import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { setUserData } from "../slices/authSlice";
import { setAuthenticated } from "../slices/authSlice";
import { setAuthLoader } from "../slices/authSlice";
export const useUserData = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  return {
    userData: authState.userData,
    isAuthenticated: authState.isAuthenticated,
    authLoader: authState.authLoader,
    setUserData: (value: any) => dispatch(setUserData(value)),
    setAuthenticated: (value: boolean) => dispatch(setAuthenticated(value)),
    setAuthLoader: (value: boolean) => dispatch(setAuthLoader(value)),
  };
};