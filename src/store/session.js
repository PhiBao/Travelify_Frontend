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
    bookings: {
      List: [],
      total: 0,
    },
    notifications: {
      list: [],
      unread: 0,
      total: 0,
    },
    loading: false,
  },
  reducers: {
    sessionReceived: (session, action) => {
      const { token, user, rememberMe, list, unread, all } = action.payload;
      auth.loginWithJwt(token);
      session.currentUser = user;
      session.notifications.list = list;
      session.notifications.unread = unread;
      session.notifications.total = all;
      if (rememberMe === true) auth.rememberMe(token);
      toast.success("Welcome to Travelify!");
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
      const { user, list, unread, all } = action.payload;
      session.currentUser = user;
      session.notifications.list = list;
      session.notifications.unread = unread;
      session.notifications.total = all;
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
      const { token, user, list, unread, all } = action.payload;
      auth.loginWithJwt(token);
      session.currentUser = user;
      session.notifications.list = list;
      session.notifications.unread = unread;
      session.notifications.total = all;
      toast.success("Welcome to Travelify!");
    },
    bookingsLoaded: (session, action) => {
      const { list, meta } = action.payload;
      session.bookings.list = list;
      session.bookings.total = meta.total;
    },
    reviewCreated: (session, action) => {
      const { body, hearts, id } = action.payload;
      const index = session.bookings.list.findIndex((item) => item.id === id);
      session.bookings.list[index].review = { body, hearts };
    },
    notificationUpdated: (session, action) => {
      const { notification } = action.payload;
      const index = session.notifications.list.findIndex(
        (item) => item.id === notification.id
      );
      if (index > -1) {
        if (session.notifications.list[index].status === "watched")
          session.notifications.unread++;
        session.notifications.list[index] = notification;
      } else {
        session.notifications.list.unshift(notification);
        if (session.notifications.list.length > 10)
          session.notifications.list.pop();
        session.notifications.unread++;
        session.notifications.total++;
      }
      if (notification.tourId === 0)
        toast.info("There is a new transaction", {
          position: "bottom-left",
        });
      else
        toast.info(
          `${notification.user?.username} ${
            notification.others === 0
              ? ""
              : `and ${notification.others} other${
                  notification.others > 1 ? "s" : ""
                }`
          } ${notification.action} ${
            notification.action === "reported" ? "a" : "your"
          } ${notification.notifiableType}`,
          {
            position: "bottom-left",
          }
        );
    },
    notificationsLoaded: (session, action) => {
      const { list } = action.payload;
      session.notifications.list = session.notifications.list.concat(list);
    },
    notificationRead: (session, action) => {
      const { id } = action.payload;
      const index = session.notifications.list.findIndex(
        (notification) => (notification.id ^ id) === 0
      );
      session.notifications.list[index].status = "watched";
      session.notifications.unread--;
    },
    notificationsReadAll: (session) => {
      session.notifications.list.map(
        (notification) => (notification.status = "watched")
      );
      session.notifications.unread = 0;
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
  sessionCreated,
  passwordForgotten,
  passwordReset,
  currentUserGotten,
  userUpdated,
  userConfirmed,
  socialLoggedIn,
  bookingsLoaded,
  reviewCreated,
  notificationUpdated,
  notificationsLoaded,
  notificationRead,
  notificationsReadAll,
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

export const getCurrentUser = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + `/${id}`,
      method: "GET",
      onSuccess: currentUserGotten.type,
    })
  );
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
      skipLoading: true,
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

export const loadBookings = (id, params) => (dispatch) => {
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

export const addNotification = (data) => (dispatch) => {
  return dispatch({
    type: notificationUpdated.type,
    payload: data,
  });
};

export const loadNotifications = (id, params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + `/${id}/notifications`,
      method: "GET",
      params,
      onSuccess: notificationsLoaded.type,
      skipLoading: true,
    })
  );
};

export const readNotification = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `notifications/${id}`,
      method: "PUT",
      onSuccess: notificationRead.type,
      skipLoading: true,
    })
  );
};

export const readAllNotifications = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: users_url + `/${id}/read_all`,
      method: "PUT",
      onSuccess: notificationsReadAll.type,
      skipLoading: true,
    })
  );
};

// Selector
