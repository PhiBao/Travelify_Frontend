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
import Login from "./components/auth/login";
import NavBar from "./components/layout/navBar";
import Logout from "./components/auth/logout";
import Registration from "./components/auth/registration";
import ForgottenPassword from "./components/auth/forgottenPassword";
import ResetPassword from "./components/auth/resetPassword";
import Home from "./components/home/home";
import Footer from "./components/layout/footer";
import ProtectedRoute from "./components/common/protectedRoute";
import UserSettings from "./components/users/userSettings";
import UserActivation from "./components/users/userActivation";
import TourDetail from "./components/tours/tourDetail";
import ToursList from "./components/tours/toursList";
import PrivateRoute from "./components/common/privateRoute";
import Admin from "./components/admin/admin";
import { getCurrentUser } from "./store/session";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";

const App = (props) => {
  const { getCurrentUser } = props;

  useEffect(async () => {
    const user = auth.getCurrentUser();
    if (user) await getCurrentUser(user.id);
  }, []);

  return (
    <Router>
      <NavBar />
      <Container maxWidth={false} disableGutters={true}>
        <ToastContainer theme="dark" style={{ marginTop: "36px" }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgotten_password" element={<ForgottenPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route path="/activate_account" element={<UserActivation />} />
          <Route path="/tours" element={<ToursList />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/settings/*" element={<UserSettings />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: (id) => dispatch(getCurrentUser(id)),
});

export default connect(null, mapDispatchToProps)(App);
