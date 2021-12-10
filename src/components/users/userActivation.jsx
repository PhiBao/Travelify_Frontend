import { useEffect } from "react";
import { connect } from "react-redux";
import { Navigate, useSearchParams } from "react-router-dom";
import { confirmUser } from "../../store/users";

export const UserActivation = (props) => {
  const [q] = useSearchParams();

  useEffect(() => {
    props.confirmUser(q.get("token"), q.get("email"));
  });

  return <Navigate to="/settings" replace />;
};

const mapDispatchToProps = (dispatch) => ({
  confirmUser: (token, email) => dispatch(confirmUser(token, email)),
});

export default connect(null, mapDispatchToProps)(UserActivation);
