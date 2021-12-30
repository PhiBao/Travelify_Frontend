import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";
import { setRecentlyWatched } from "../services/tourService";

const slice = createSlice({
  name: "tours",
  initialState: {
    list: [],
    vehicles: [],
    tags: [],
    current: {
      self: {},
      related: [],
      recently: [],
    },
    loading: false,
  },
  reducers: {
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
    tourGotten: (tours, action) => {
      const { self, related, recently } = action.payload;
      tours.current.self = self;
      tours.current.related = related;
      tours.current.recently = recently;
      setRecentlyWatched(self.id);
    },
    tourRequestBooking: () => {
      toast.success("Please wait a moment, Travelify will contact you soon");
    },
    tourPaid: () => {
      toast.success("Paid successfully! Thank you for your support.");
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

export const {
  tourCreated,
  helpersLoaded,
  tourGotten,
  tourRequestBooking,
  tourPaid,
} = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/tours";
const helpers_url = "/helpers";
const bookings_url = "/bookings";
const checkout_url = "/checkout";

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
  const { vehicles } = getState().entities.tours;
  if (vehicles.length > 0) return;

  return dispatch(
    apiCallBegan({
      url: helpers_url,
      method: "GET",
      onSuccess: helpersLoaded.type,
    })
  );
};

export const getTour = (tourId, data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: url + `/${tourId}`,
      method: "GET",
      params: data,
      onSuccess: tourGotten.type,
    })
  );
};

export const requestBookingTour = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: bookings_url,
      method: "POST",
      data,
      onSuccess: tourRequestBooking.type,
    })
  );
};

export const payTour = (data) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: checkout_url,
      method: "POST",
      data,
      onSuccess: tourPaid.type,
    })
  );
};

// Selector
