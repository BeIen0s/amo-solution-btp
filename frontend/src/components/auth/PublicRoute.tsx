import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  // Pour l'instant, on simule un utilisateur non connecté
  // Dans la vraie version, on vérifiera le token JWT
  const isAuthenticated = false; // Changera avec le store auth

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;