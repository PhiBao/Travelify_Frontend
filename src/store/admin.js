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
      const username = admin.data.list[index].username;
      admin.data.list[index] = { ...user, username };
      toast.success("Update user info successfully");
    },
    userCreated: (admin, action) => {
      const { user } = action.payload;
      admin.data.list.unshift(user);
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
    tourCreated: (tours, action) => {
      const { tour } = action.payload;
      const { tags } = tour;
      tours.tags = _.unionBy(tours.tags, tags, "value");
      toast.success("The tour has been created successfully!");
    },
    tourDeleted: (admin, action) => {
      const { id } = action.payload;
      const index = admin.data.list.findIndex((tour) => tour.id === id);
      admin.data.list.splice(index, 1);
      toast.success("Delete tour successfully");
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
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/admin";
const users_url = "/users";
const tours_url = "/tours";

export const loadDashboard = () => (dispatch) => {
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
      url: users_url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: userUpdated.type,
      headers: { "Content-Type": "multipart/form-data" },
      skipLoading: true,
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
      url,
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

// Selector

export const getUser = (userId) =>
  createSelector(
    (state) => state.entities.admin.data.list,
    (list) => {
      const index = list.findIndex((item) => (item.id ^ userId) === 0);
      return list[index];
    }
  );
