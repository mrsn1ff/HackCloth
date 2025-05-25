// src/components/UserProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface UserProtectedRouteProps {
  children: ReactNode;
}

const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({
  children,
}) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? <>{children}</> : <Navigate to="/profile" replace />;
};

export default UserProtectedRoute;
