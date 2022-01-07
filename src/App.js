import { useEffect } from "react";
import { Container } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core";
import Login from "./components/auth/login";
import NavBar from "./components/layout/navBar";
import Logout from "./components/auth/logout";
import Registration from "./components/auth/registration";
import ForgottenPassword from "./components/auth/forgottenPassword";
import ResetPassword from "./components/auth/resetPassword";
import TourForm from "./components/tours/tourForm";
import Home from "./components/home/home";
import Footer from "./components/layout/footer";
import ProtectedRoute from "./components/common/protectedRoute";
import UserSettings from "./components/users/userSettings";
import UserActivation from "./components/users/userActivation";
import TourDetail from "./components/tours/tourDetail";
import ToursList from "./components/tours/toursList";
import { getSession } from "./store/session";
import { getCurrentUser } from "./store/session";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles({
  toast: {
    marginTop: "36px",
  },
});

const App = (props) => {
  const { currentUser, getSession, getCurrentUser } = props;
  const classes = useStyles();
  const getPrepareData = async () => {
    if (currentUser.id === 0) {
      await getSession();
      await getCurrentUser();
    }
  };

  useEffect(() => {
    getPrepareData();
  }, []);

  return (
    <Router>
      <NavBar />
      <Container maxWidth={false} disableGutters={true}>
        <ToastContainer theme="dark" className={classes.toast} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgotten_password" element={<ForgottenPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/activate_account" element={<UserActivation />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/settings/*" element={<UserSettings />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/tours" element={<ToursList />} />
          <Route path="/tours/hot" element={<ToursList />} />
          <Route path="/tours/new" element={<TourForm />} />
          <Route path="/tours/:id" element={<TourDetail />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  getSession: () => dispatch(getSession()),
  getCurrentUser: () => dispatch(getCurrentUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
