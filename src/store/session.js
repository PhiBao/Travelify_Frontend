import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import auth from "../services/authService";
import { toast } from "react-toastify";

const slice = createSlice({
  name: "session",
  initialState: {
    user: {},
  },
  reducers: {
    sessionReceived: (session, action) => {
      const { status, token, message, ...rest } = action.payload;
      if (status === 200) {
        auth.loginWithJwt(token);
        session.user = rest;
        toast.success("Welcome to Travelify!");
      } else {
        toast.error(message);
      }
    },
    sessionDestroyed: (session, action) => {
      auth.logout();
      session.user = null;
    },
  },
});

export const { sessionReceived, sessionDestroyed } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/sessions";

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

// Selector

export const getSession = () =>
  createSelector((state) => state.entities.session);
