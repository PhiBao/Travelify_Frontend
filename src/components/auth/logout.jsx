import { useEffect } from "react";
import { connect } from "react-redux";
import { destroySession } from "../../store/session";

export const Logout = (props) => {
  useEffect(() => {
    props.destroySession();
    window.location = "/";
  });

  return null;
};

const mapDispatchToProps = (dispatch) => ({
  destroySession: () => dispatch(destroySession()),
});

export default connect(null, mapDispatchToProps)(Logout);
