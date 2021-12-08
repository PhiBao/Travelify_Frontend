import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";
import auth from "../services/authService";

const slice = createSlice({
  name: "session",
  initialState: {
    user: {},
    loading: false,
  },
  reducers: {
    sessionReceived: (session, action) => {
      const { status, token, message, user, remember_me } = action.payload;
      if (status === 200) {
        auth.loginWithJwt(token);
        session.user = user;
        if (remember_me === true) auth.rememberMe(token);
        toast.success("Welcome to Travelify!");
        session.loading = false;
      } else {
        toast.error(message);
      }
    },
    sessionDestroyed: (session) => {
      auth.logout();
      session.user = null;
    },
    sessionGotten: (session) => {
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
    passwordForgotten: (session, action) => {
      const { status, message, email } = action.payload;
      if (status === 200) {
        session.user = {
          ...session.user,
          reset_email_sent: true,
          email: email,
        };
      } else {
        toast.error(message);
      }
    },
    passwordReset: (session, action) => {
      const { status, message } = action.payload;
      if (status === 200) {
        session.user = { ...session.user, reset: true };
        toast.success("Reset password successfully");
      } else {
        toast.error(message);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (session) => {
        session.loading = true;
      })
      .addCase(apiCallSuccess, (session) => {
        session.loading = false;
      })
      .addCase(apiCallFailed, (session) => {
        session.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

export const {
  sessionReceived,
  sessionDestroyed,
  sessionGotten,
  sessionCreated,
  passwordForgotten,
  passwordReset,
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

export const forgottenPassword = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + "/forgotten_password",
      method: "GET",
      params: data,
      onSuccess: passwordForgotten.type,
    })
  );
};

export const resetPassword = (user, token) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + `/${token}/reset_password`,
      method: "PUT",
      data: user,
      onSuccess: passwordReset.type,
    })
  );
};

// Selector
