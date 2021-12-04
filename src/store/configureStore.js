import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const store = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api),
  });
};

export default store;
