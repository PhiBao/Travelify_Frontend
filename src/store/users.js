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
    currentUser: {
      id: 0,
      avatar: {
        byte_size: 0,
        url: "",
        name: "",
      },
      first_name: "",
      last_name: "",
      address: "",
      phone_number: "",
      birthday: "",
      email: "",
      activated: false,
      admin: false,
      created_at: "",
    },
    list: [],
    loading: false,
  },
  reducers: {
    currentUserGotten: (users, action) => {
      const { user } = action.payload;
      users.currentUser = user;
    },
    userUpdated: (users, action) => {
      const { user } = action.payload;
      users.currentUser = user;
      toast.success("Update user info successfully");
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

export const { currentUserGotten, userUpdated } = slice.actions;

export default slice.reducer;

// Action Creators

const url = "/users";

export const getCurrentUser = () => (dispatch, getState) => {
  const { _id } = getState().entities.session.user;
  if (_id) {
    return dispatch(
      apiCallBegan({
        url: url + `/${_id}`,
        method: "GET",
        onSuccess: currentUserGotten.type,
      })
    );
  } else return;
};

export const updateUser = (data) => (dispatch, getState) => {
  const { id } = getState().entities.users.currentUser;
  return dispatch(
    apiCallBegan({
      url: url + `/${id}`,
      method: "PUT",
      data,
      onSuccess: userUpdated.type,
    })
  );
};

// Selector
