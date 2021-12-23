import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import _ from "lodash";
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
    vehicles: [],
    tags: [],
  },
  reducers: {
    toursLoaded: (tours, action) => {},
    tourCreated: (tours, action) => {
      const { tour } = action.payload;
      const { tags } = tour;
      tours.tags = _.unionBy(tours.tags, tags, "value");
      toast.success("The tour has been created successfully!");
    },
    helpersLoaded: (tours, action) => {
      const { vehicles, tags } = action.payload;
      tours.vehicles = vehicles;
      tours.tags = tags;
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

export const { toursLoaded, tourCreated, helpersLoaded } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/tours";
const helpers_url = "/helpers";

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

export const loadHelpers = (dispatch, getState) => {
  const vehicles = getState().entities.tours.vehicles;
  if (vehicles.length > 0) return;

  return dispatch(
    apiCallBegan({
      url: helpers_url,
      method: "GET",
      onSuccess: helpersLoaded.type,
    })
  );
};

// Selector
