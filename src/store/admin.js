import { createSlice } from "@reduxjs/toolkit";
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

export const { dashboardLoaded, revenuesSearched } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/admin";

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

// Selector
