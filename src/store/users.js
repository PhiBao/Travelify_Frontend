import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  apiCallBegan,
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
  reducers: {
    passwordChanged: () => {
      toast.success("Your password has been changed!");
    },
  },
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

export const { passwordChanged } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/users";

export const changePassword = (data) => (dispatch, getState) => {
  const { id } = getState().entities.session.currentUser;
  return dispatch(
    apiCallBegan({
      url: url + `/${id}/change_password`,
      method: "PUT",
      data,
      onSuccess: passwordChanged.type,
    })
  );
};

// Selector
