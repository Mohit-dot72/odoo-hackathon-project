import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute w-full h-full border-4 border-brand-teal/20 rounded-full"></div>
          <div className="absolute w-full h-full border-4 border-t-brand-teal rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Save original location for redirect after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Unauthorized: send back to safe dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
