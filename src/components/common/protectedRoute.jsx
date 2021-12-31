import * as React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import auth from "../../services/authService";

const ProtectedRoute = () => {
  const location = useLocation();

  return auth.getCurrentUser() ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedRoute;
