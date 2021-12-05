import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { apiCallBegan } from "./api";
import auth from "../services/authService";

const slice = createSlice({
  name: "session",
  initialState: {
    user: {},
  },
  reducers: {
    sessionReceived: (session, action) => {
      const { status, token, message, user, remember_me } = action.payload;
      if (status === 200) {
        auth.loginWithJwt(token);
        session.user = user;
        if (remember_me === true) auth.rememberMe(token);
        toast.success("Welcome to Travelify!");
      } else {
        toast.error(message);
      }
    },
    sessionDestroyed: (session, action) => {
      auth.logout();
      session.user = null;
    },
    sessionGotten: (session, action) => {
      const currentUser = auth.getCurrentUser();
      if (currentUser) {
        session.user = currentUser;
      }
    },
    sessionCreated: (session, action) => {
      const { user, token, status, messages } = action.payload;
      if (status === 201) {
        const { id, first_name } = user;
        auth.loginWithJwt(token);
        session.user = { _id: id, username: first_name };
        toast.success("Welcome to Travelify!");
      } else {
        messages.map((message) => toast.error(message));
      }
    },
  },
});

export const {
  sessionReceived,
  sessionDestroyed,
  sessionGotten,
  sessionCreated,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/sessions";
const users_url = "/users";

export const receiveSession = (user) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "POST",
      data: user,
      onSuccess: sessionReceived.type,
    })
  );
};

export const destroySession = () => (dispatch) => {
  return dispatch(sessionDestroyed());
};

export const getSession = () => (dispatch) => {
  return dispatch(sessionGotten());
};

export const createSession = (user) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url,
      method: "POST",
      data: user,
      onSuccess: sessionCreated.type,
    })
  );
};

// Selector
