import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { destroySession } from "../../store/session";

export const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(destroySession());
    window.location = "/";
  });

  return null;
};

export default Logout;
