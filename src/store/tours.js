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
    vehicles: [],
  },
  reducers: {
    toursLoaded: (tours, action) => {},
    tourCreated: () => {
      toast.success("The tour has been created successfully!");
    },
    vehiclesLoaded: (tours, action) => {
      tours.vehicles = action.payload;
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

export const { toursLoaded, tourCreated, vehiclesLoaded } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/tours";
const vehicles_url = "/vehicles";

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

export const loadVehicles = (dispatch, getState) => {
  const vehicles = getState().entities.tours.vehicles;
  if (vehicles.length > 0) return;

  return dispatch(
    apiCallBegan({
      url: vehicles_url,
      method: "GET",
      onSuccess: vehiclesLoaded.type,
    })
  );
};

// Selector
