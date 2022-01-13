import * as React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import auth from "../../services/authService";

const PrivateRoute = () => {
  const location = useLocation();
  const user = auth.getCurrentUser();

  return user.admin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;
