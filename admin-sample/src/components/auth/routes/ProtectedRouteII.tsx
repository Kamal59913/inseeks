import { Navigate, useLocation } from 'react-router-dom';
import { AppPermissions, AppRoles } from '../../../types/permissions';
import { useRoles } from '../../../redux/hooks/usRoles';
import { useAppSelector } from '../../../redux/hooks';
import { usePermissions } from '../../../redux/hooks/userPermissions';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRoles?: AppRoles[];
  requiredPermissions?: AppPermissions[];
};

export const ProtectedRoute = ({                
  children,
  requiredRoles = [],
  requiredPermissions = []
}: ProtectedRouteProps) => {

  const { hasRole } = useRoles();
  const { hasPermission } = usePermissions();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const roleCheck = requiredRoles.length === 0 || hasRole(requiredRoles);
  const permissionCheck = requiredPermissions.length === 0 || hasPermission(requiredPermissions);

  if (!roleCheck || !permissionCheck) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};


// sample use:
// <ProtectedRoute requiredRoles={['admin'] requiredPermissions={['view:dashboard']}>
// <AdminPage />
// </ProtectedRoute>