import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { connect } from "react-redux";
import LoginForm from "./components/auth/loginForm";
import Tours from "./components/tours/tours";
import NavBar from "./components/layout/navBar";
import Logout from "./components/auth/logout";
import Registration from "./components/auth/registration";
import ForgottenPassword from "./components/auth/forgottenPassword";
import ResetPassword from "./components/auth/resetPassword";
import UserSettings from "./components/users/userSettings";
import { getSession } from "./store/session";
import ProtectedRoute from "./components/common/protectedRoute";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = (props) => {
  useEffect(() => {
    props.getSession();
  });

  return (
    <Router>
      <NavBar />
      <main className="container-fluid">
        <ToastContainer theme="dark" className="mt-5" />
        <Routes>
          <Route path="/" element={<Tours />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgotten_password" element={<ForgottenPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<UserSettings />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getSession: () => dispatch(getSession()),
});

export default connect(null, mapDispatchToProps)(App);
