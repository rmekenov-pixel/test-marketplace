// src/shared/lib/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../entities/user/model/authStore';
import type { UserRole } from '../../../entities/user/model/types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedUserRole = (role || 'client').toString().toLowerCase();
    const hasAllowedRole = allowedRoles.some(
      (r) => r.toString().toLowerCase() === normalizedUserRole
    );

    if (!hasAllowedRole) {
      return <Navigate to="/403" replace />;
    }
  }

  return <>{children}</>;
};
