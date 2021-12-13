import * as React from "react";
import { connect } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const ProtectedRoute = (props) => {
  const location = useLocation();

  return props.session.currentUser.id !== 0 ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

const mapStateToProps = (state) => ({
  session: state.entities.session,
});

export default connect(mapStateToProps, null)(ProtectedRoute);
