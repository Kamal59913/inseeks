import { usePermissions } from '../../../redux/hooks/userPermissions';
import { AppPermissions } from '../../../types/permissions';

export const PermissionGuard = ({
  children,
  required,
  fallback = null,
}: {
  children: React.ReactNode;
  required: AppPermissions[];
  fallback?: React.ReactNode;
}) => {
  const { hasPermission } = usePermissions();
  return hasPermission(required) ? <>{children}</> : fallback;
};

//sample usase
// // Usage
// <PermissionGuard required={['update:post']}>
//   <EditButton />
// </PermissionGuard>