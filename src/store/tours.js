import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";

const slice = createSlice({
  name: "tours",
  initialState: {
    list: [],
    currentPage: 1,
    order: ["createAt"],
    loading: false,
  },
  reducers: {
    toursLoaded: (tours, action) => {},
    tourCreated: () => {
      toast.success("The tour has been created successfully!");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (tours) => {
        tours.loading = true;
      })
      .addCase(apiCallSuccess, (tours) => {
        tours.loading = false;
      })
      .addCase(apiCallFailed, (tours) => {
        tours.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

export const { toursLoaded, tourCreated } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/tours";

export const loadTours = (params) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "GET",
      params,
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

// Selector
