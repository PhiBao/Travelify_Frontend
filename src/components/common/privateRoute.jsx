import * as React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = ({ admin }) => {
  const location = useLocation();

  return admin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const mapStateToProps = (state) => ({
  admin: state.entities.session.currentUser.admin,
});

export default connect(mapStateToProps, null)(PrivateRoute);
