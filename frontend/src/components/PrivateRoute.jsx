import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
