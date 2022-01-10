import { combineReducers } from "redux";
import sessionReducer from "./session";
import tourReducer from "./tours";
import homeReducer from "./home";
import adminReducer from "./admin";

export default combineReducers({
  session: sessionReducer,
  tours: tourReducer,
  home: homeReducer,
  admin: adminReducer,
});
