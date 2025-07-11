import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location as state
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "ADMIN") {
    // Redirect to home if user doesn't have admin role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
