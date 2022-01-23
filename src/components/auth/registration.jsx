import { connect } from "react-redux";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { createSession } from "../../store/session";
import Loading from "../layout/loading";
import auth from "../../services/authService";
import useDocumentTitle from "../../utils/useDocumentTitle";
import UserForm from "../common/userForm";

export const Registration = (props) => {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, createSession } = props;
  const onSubmit = async (user, e) => {
    e.preventDefault();
    await createSession({ user });
    navigate(location.state?.from.pathname || "/");
  };

  if (auth.getCurrentUser()) return <Navigate to="/" replace />;

  return (
    <Box
      mt={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "15px",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" gutterBottom component="div" mt={5}>
            Create an account
          </Typography>
        </Box>
        <UserForm onSubmit={onSubmit} title="Register" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 3,
          }}
        >
          <p>
            Have already an account?{" "}
            <Link to="/login" className="fw-bold text-body">
              <u>Login here</u>
            </Link>
          </p>
        </Box>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (data) => dispatch(createSession(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
