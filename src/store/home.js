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
    featured: 0,
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

export const { homeLoaded } = slice.actions;

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

// Selector
