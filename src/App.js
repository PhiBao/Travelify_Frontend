import React from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginForm from "./components/auth/loginForm";
import Tours from "./components/tours/tours";
import NavBar from "./components/navBar/navBar";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Logout from "./components/auth/logout";

function App() {
  return (
    <Router>
      <NavBar />
      <main className="container-fluid">
        <ToastContainer theme="dark" className="mt-5" />
        <Routes>
          <Route path="/" element={<Tours />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
