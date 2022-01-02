import { createSlice } from "@reduxjs/toolkit";
import {
  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";

const slice = createSlice({
  name: "home",
  initialState: {
    list: [],
    hotTours: [],
    newTours: [],
    hotTags: [],
    featured: [],
    loading: false,
  },
  reducers: {
    homeLoaded: (home, action) => {
      const { data } = action.payload;
      const { list, hotTours, newTours, hotTags, featured } = data;
      home.list = list;
      home.hotTours = hotTours;
      home.newTours = newTours;
      home.hotTags = hotTags;
      home.featured = featured;
    },
    tourMarked: (home, action) => {
      const { id } = action.payload;
      const index = home.list.findIndex((tour) => tour.id === id);
      home.list[index].marked = !home.list[index].marked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (home) => {
        home.loading = true;
      })
      .addCase(apiCallSuccess, (home) => {
        home.loading = false;
      })
      .addCase(apiCallFailed, (home) => {
        home.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

export const { homeLoaded, tourMarked } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/";

export const loadHome = () => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url,
      method: "GET",
      onSuccess: homeLoaded.type,
    })
  );
};

export const markTour = (id) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `/tours/${id}/mark`,
      method: "GET",
      onSuccess: tourMarked.type,
      skipLoading: true,
    })
  );
};

// Selector
