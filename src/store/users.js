import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
import {
  //  apiCallBegan,
  apiCallSuccess,
  apiCallFailed,
  apiCallPrepare,
} from "./api";

const slice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(apiCallPrepare, (users) => {
        users.loading = true;
      })
      .addCase(apiCallSuccess, (users) => {
        users.loading = false;
      })
      .addCase(apiCallFailed, (users) => {
        users.loading = false;
      })
      .addDefaultCase(() => {});
  },
});

// export const {} = slice.actions;

export default slice.reducer;

// Action Creators

// Selector
