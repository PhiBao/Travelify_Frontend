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
    currentUser: {
      id: 0,
      avatarUrl: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      birthday: "",
      email: "",
      activated: false,
      admin: false,
      createdAt: "",
    },
    bookingList: [],
    meta: {
      total: 0,
    },
    loading: false,
  },
  reducers: {
    sessionReceived: (session, action) => {
      const { token, user, remember_me } = action.payload;
      auth.loginWithJwt(token);
      session.currentUser = user;
      if (remember_me === true) auth.rememberMe(token);
      toast.success("Welcome to Travelify!");
    },
    sessionDestroyed: () => {
      auth.logout();
    },
    sessionGotten: (session) => {
      const user = auth.getCurrentUser();
      if (user) {
        session.currentUser.id = user.id;
      }
    },
    sessionCreated: (session, action) => {
      const { user, token } = action.payload;
      auth.loginWithJwt(token);
      session.currentUser = user;
      toast.success("Welcome to Travelify!");
      toast.success("Please check your email to confirm your account");
    },
    passwordForgotten: (session, action) => {
      const { email } = action.payload;
      session.currentUser.email = email;
      if (session.currentUser.resetEmailSent === true)
        toast.success("Reset email successfully");
      session.currentUser.resetEmailSent = true;
    },
    passwordReset: (session) => {
      session.currentUser.reset = true;
      toast.success("Reset password successfully");
    },
    currentUserGotten: (session, action) => {
      const { user } = action.payload;
      session.currentUser = user;
    },
    userUpdated: (session, action) => {
      const { user } = action.payload;
      session.currentUser = user;
      toast.success("Update user info successfully");
    },
    userConfirmed: (session) => {
      session.currentUser.activated = true;
      toast.success("Congratulation! your account has been activated");
    },
    socialLoggedIn: (session, action) => {
      const { token, user } = action.payload;
      auth.loginWithJwt(token);
      session.currentUser = user;
      toast.success("Welcome to Travelify!");
    },
    bookingsLoaded: (session, action) => {
      const { list, meta } = action.payload;
      session.bookingList = list;
      session.meta.total = meta.total;
    },
    reviewCreated: (session, action) => {
      const { body, hearts, id } = action.payload;
      const index = session.bookingList.findIndex((item) => item.id === id);
      session.bookingList[index].review = { body, hearts };
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
  currentUserGotten,
  userUpdated,
  userConfirmed,
  socialLoggedIn,
  bookingsLoaded,
  reviewCreated,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/sessions";
const users_url = "/users";
const activate_url = "/activation";

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

export const getCurrentUser = () => (dispatch, getState) => {
  const { id } = getState().entities.session.currentUser;
  if (id) {
    return dispatch(
      apiCallBegan({
        url: users_url + `/${id}`,
        method: "GET",
        onSuccess: currentUserGotten.type,
      })
    );
  } else return;
};

export const updateUser = (data, id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: userUpdated.type,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const confirmUser = (token, email) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: activate_url + `/${token}`,
      method: "PUT",
      data: { user: { email } },
      onSuccess: userConfirmed.type,
    })
  );
};

export const loginSocial = (data, headers) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + `/social_auth/callback`,
      method: "POST",
      data,
      headers,
      onSuccess: socialLoggedIn.type,
    })
  );
};

export const loadBookings = (id, params) => (dispatch, getState) => {
  if (id === 0) return;

  return dispatch(
    apiCallBegan({
      url: users_url + `/${id}/bookings`,
      params,
      method: "GET",
      onSuccess: bookingsLoaded.type,
    })
  );
};

export const createReview = (id, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `bookings/${id}/review`,
      method: "POST",
      data,
      onSuccess: reviewCreated.type,
    })
  );
};

// Selector
