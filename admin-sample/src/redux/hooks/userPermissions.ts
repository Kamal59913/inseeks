import { useAppSelector } from ".";
import { AppPermissions } from "../../types/permissions";


export const usePermissions = () => {
  const permissions = useAppSelector(
    (state) => state.auth.userData?.permissions || []
  ) as AppPermissions[];

  const hasPermission = (requiredPermissions: AppPermissions[]): boolean => {
    return requiredPermissions.every(perm => permissions.includes(perm));
  };

  return {
    permissions,
    hasPermission,
  };
};