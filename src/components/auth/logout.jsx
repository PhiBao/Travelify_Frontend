import { useEffect } from "react";
import auth from "../../services/authService";

export const Logout = () => {
  useEffect(() => {
    auth.logout();
    window.location = "/";
  }, []);

  return null;
};

export default Logout;
