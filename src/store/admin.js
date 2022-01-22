import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";

const slice = createSlice({
  name: "admin",
  initialState: {
    data: {},
    loading: false,
  },
  reducers: {
    dashboardLoaded: (admin, action) => {
      const { data } = action.payload;
      admin.data = data;
    },
    revenuesSearched: (admin, action) => {
      const { data } = action.payload;
      admin.data.other = data;
    },
    usersLoaded: (admin, action) => {
      const { users } = action.payload;
      admin.data = users;
    },
    userUpdated: (admin, action) => {
      const { user } = action.payload;
      const index = admin.data.list.findIndex(
        (item) => (item.id ^ user.id) === 0
      );
      admin.data.list[index] = user;
      toast.success("Update user info successfully");
    },
    userCreated: (admin, action) => {
      const { user } = action.payload;
      admin.data.list?.unshift(user);
      toast.success("Create user successfully");
    },
    userDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex((user) => user.id === id);
      admin.data.list.splice(index, 1);
      toast.success("Delete user successfully");
    },
    toursLoaded: (admin, action) => {
      const { tours } = action.payload;
      admin.data = tours;
    },
    tourCreated: (admin, action) => {
      const { tour } = action.payload;
      const { tags } = tour;
      admin.data.tags = _.unionBy(admin.data.tags, tags, "value");
      admin.data.list?.unshift(tour);
      toast.success("The tour has been created successfully!");
    },
    tourDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex((tour) => tour.id === id);
      admin.data.list.splice(index, 1);
      toast.success("Delete tour successfully");
    },
    tourUpdated: (admin, action) => {
      const { tour } = action.payload;
      const { tags } = tour;
      admin.data.tags = _.unionBy(admin.data.tags, tags, "value");
      const index = admin.data.list.findIndex(
        (item) => (item.id ^ tour.id) === 0
      );
      admin.data.list[index] = tour;
      toast.success("Update tour info successfully");
    },
    bookingsLoaded: (admin, action) => {
      const { data } = action.payload;
      admin.data = data;
    },
    bookingDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex(
        (transaction) => transaction.id === id
      );
      admin.data.list.splice(index, 1);
      toast.success("Delete transaction successfully");
    },
    bookingUpdated: (admin, action) => {
      const { booking } = action.payload;
      const index = admin.data.list.findIndex(
        (item) => (item.id ^ booking.id) === 0
      );
      admin.data.list[index] = booking;
      toast.success("Update transaction info successfully");
    },
    helpersLoaded: (admin, action) => {
      const { data } = action.payload;
      admin.data = { ...admin.data, tours: data };
    },
    bookingCreated: (admin, action) => {
      const { booking } = action.payload;
      admin.data.list?.unshift(booking);
      toast.success("The transaction has been created successfully!");
    },
    tagsLoaded: (admin, action) => {
      const { data } = action.payload;
      admin.data = data;
    },
    tagDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex((tag) => tag.id === id);
      admin.data.list.splice(index, 1);
      toast.success("Delete tag successfully");
    },
    tagUpdated: (admin, action) => {
      const { tag } = action.payload;
      const index = admin.data.list.findIndex(
        (item) => (item.id ^ tag.id) === 0
      );
      admin.data.list[index] = tag;
      toast.success("Update tag info successfully");
    },
    tagCreated: (admin, action) => {
      const { tag } = action.payload;
      admin.data.list?.unshift(tag);
      toast.success("The tag has been created successfully!");
    },
    reportsLoaded: (admin, action) => {
      const { reports } = action.payload;
      admin.data = reports;
    },
    reportableDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex(
        (report) => report.notifiableId === id
      );
      admin.data.list.splice(index, 1);
      toast.success("Delete object successfully");
    },
    reportableToggled: (admin, action) => {
      const { id, state } = action.payload;
      const index = admin.data.list.findIndex(
        (report) => report.notifiableId === id
      );
      admin.data.list[index].state = state;
    },
    reportSkipped: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex((report) => report.id === id);
      admin.data.list.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (admin) => {
        admin.loading = true;
      })
      .addCase(apiCallSuccess, (admin) => {
        admin.loading = false;
      })
      .addCase(apiCallFailed, (admin) => {
        admin.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

export const {
  dashboardLoaded,
  revenuesSearched,
  usersLoaded,
  userUpdated,
  userCreated,
  userDeleted,
  toursLoaded,
  tourCreated,
  tourDeleted,
  tourUpdated,
  bookingsLoaded,
  bookingDeleted,
  bookingUpdated,
  helpersLoaded,
  bookingCreated,
  tagsLoaded,
  tagDeleted,
  tagUpdated,
  tagCreated,
  reportsLoaded,
  reportableDeleted,
  reportableToggled,
  reportSkipped,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/admin";
const users_url = "/users";
const tours_url = "/tours";
const bookings_url = "/bookings";
const tags_url = "/tags";
const notifications_url = "/notifications";

export const loadDashboard = () => (dispatch, getState) => {
  const { type = "" } = getState().entities.admin.data;
  if (type === "home") return;
  return dispatch(
    apiCallBegan({
      url: url + "/dashboard",
      method: "GET",
      onSuccess: dashboardLoaded.type,
    })
  );
};

export const loadAnalytics = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + "/dashboard/analytics",
      method: "GET",
      onSuccess: dashboardLoaded.type,
    })
  );
};

export const loadRevenues = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + "/dashboard/revenues",
      method: "GET",
      onSuccess: dashboardLoaded.type,
    })
  );
};

export const searchRevenues = (params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + "/dashboard/search",
      method: "GET",
      params,
      onSuccess: revenuesSearched.type,
      skipLoading: true,
    })
  );
};

export const loadUsers = () => (dispatch, getState) => {
  const { type = "" } = getState().entities.admin.data;
  if (type === "users") return;
  else
    return dispatch(
      apiCallBegan({
        url: url + users_url,
        method: "GET",
        onSuccess: usersLoaded.type,
      })
    );
};

export const updateUser = (data, id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + users_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: userUpdated.type,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const createUser = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + users_url,
      method: "POST",
      data,
      onSuccess: userCreated.type,
      skipLoading: true,
    })
  );
};

export const deleteUser = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + users_url + `/${id}`,
      method: "DELETE",
      onSuccess: userDeleted.type,
      skipLoading: true,
    })
  );
};

export const loadTours = () => (dispatch, getState) => {
  const { type = "" } = getState().entities.admin.data;
  if (type === "tours") return;
  else
    return dispatch(
      apiCallBegan({
        url: url + tours_url,
        method: "GET",
        onSuccess: toursLoaded.type,
      })
    );
};

export const createTour = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tours_url,
      method: "POST",
      data,
      onSuccess: tourCreated.type,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const deleteTour = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tours_url + `/${id}`,
      method: "DELETE",
      onSuccess: tourDeleted.type,
      skipLoading: true,
    })
  );
};

export const updateTour = (data, id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tours_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: tourUpdated.type,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const loadBookings = () => (dispatch, getState) => {
  const { type = "" } = getState().entities.admin.data;
  if (type === "bookings") return;
  else
    return dispatch(
      apiCallBegan({
        url: url + bookings_url,
        method: "GET",
        onSuccess: bookingsLoaded.type,
      })
    );
};

export const deleteBooking = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + bookings_url + `/${id}`,
      method: "DELETE",
      onSuccess: bookingDeleted.type,
      skipLoading: true,
    })
  );
};

export const createBooking = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + bookings_url,
      method: "POST",
      data,
      onSuccess: bookingCreated.type,
      skipLoading: true,
    })
  );
};

export const updateBooking = (data, id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + bookings_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: bookingUpdated.type,
      skipLoading: true,
    })
  );
};

export const loadHelpers = () => (dispatch, getState) => {
  const { tours } = getState().entities.admin.data;
  if (tours) return;
  return dispatch(
    apiCallBegan({
      url: url + bookings_url + "/helpers",
      method: "GET",
      onSuccess: helpersLoaded.type,
      skipLoading: true,
    })
  );
};

export const loadTags = () => (dispatch, getState) => {
  const { type = "" } = getState().entities.admin.data;
  if (type === "tags") return;
  else
    return dispatch(
      apiCallBegan({
        url: url + tags_url,
        method: "GET",
        onSuccess: tagsLoaded.type,
      })
    );
};

export const deleteTag = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tags_url + `/${id}`,
      method: "DELETE",
      onSuccess: tagDeleted.type,
      skipLoading: true,
    })
  );
};

export const createTag = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tags_url,
      method: "POST",
      data,
      onSuccess: tagCreated.type,
      headers: { "Content-Type": "multipart/form-data" },
      skipLoading: true,
    })
  );
};

export const updateTag = (data, id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + tags_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: tagUpdated.type,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
};

export const loadReports = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: notifications_url,
      method: "GET",
      onSuccess: reportsLoaded.type,
    })
  );
};

export const deleteReportable = (type, id) => (dispatch) => {
  const dynUrl = type === "Review" ? "/reviews" : "/comments";

  return dispatch(
    apiCallBegan({
      url: dynUrl + `/${id}`,
      method: "DELETE",
      onSuccess: reportableDeleted.type,
      skipLoading: true,
    })
  );
};

export const toggleReportable = (type, id) => (dispatch) => {
  const dynUrl = type === "Review" ? "/reviews" : "/comments";

  return dispatch(
    apiCallBegan({
      url: dynUrl + `/${id}/toggle`,
      method: "PUT",
      onSuccess: reportableToggled.type,
      skipLoading: true,
    })
  );
};

export const skipReport = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: notifications_url + `/${id}`,
      method: "DELETE",
      onSuccess: reportSkipped.type,
      skipLoading: true,
    })
  );
};

// Selector

export const getUser = (userId) =>
  createSelector(
    (state) => state.entities.admin.data.list,
    (list) => {
      if (!list) return "";
      const index = list.findIndex((item) => (item.id ^ userId) === 0);
      return list[index];
    }
  );

export const getTour = (tourId) =>
  createSelector(
    (state) => state.entities.admin.data.list,
    (list) => {
      if (!list || tourId === "new") return "";
      const index = list.findIndex((item) => (item.id ^ tourId) === 0);
      return list[index];
    }
  );

export const getBooking = (bookingId) =>
  createSelector(
    (state) => state.entities.admin.data.list,
    (list) => {
      if (!list) return "";
      const index = list.findIndex((item) => (item.id ^ bookingId) === 0);
      return list[index];
    }
  );

export const getTag = (tagId) =>
  createSelector(
    (state) => state.entities.admin.data.list,
    (list) => {
      if (!list) return "";
      const index = list.findIndex((item) => (item.id ^ tagId) === 0);
      return list[index];
    }
  );
