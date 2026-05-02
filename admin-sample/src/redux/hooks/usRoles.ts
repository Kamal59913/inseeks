import { useAppSelector } from ".";
import { AppRoles } from "../../types/permissions";


export const useRoles = () => {
  const roles = useAppSelector(
    (state) => state.auth.userData?.roles || []
  ) as AppRoles[];

  const hasRole = (requiredRoles: AppRoles[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  return {
    roles,
    hasRole,
  };
};