import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginForm from "./components/auth/loginForm";
import Tours from "./components/tours/tours";
import NavBar from "./components/navBar/navBar";
import Logout from "./components/auth/logout";
import Registration from "./components/auth/registration";
import { getSession } from "./store/session";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSession());
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
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
