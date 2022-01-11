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

export const { dashboardLoaded, analyticsLoaded } = slice.actions;

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

// Selector
