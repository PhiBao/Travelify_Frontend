import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const store = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["api/callBegan"],
        },
      }).concat(api),
  });
};

export default store;
