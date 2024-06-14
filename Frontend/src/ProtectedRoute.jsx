import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './utils/keycloak';

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
