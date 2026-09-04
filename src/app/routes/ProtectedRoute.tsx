import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../entities/user';
import type { UserRole } from '../../entities/user';
import { ROUTES } from '../../shared/config/routes';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.CLIENT.CATALOG}
        replace
      />
    );
  }

  return <>{children}</>;
};
