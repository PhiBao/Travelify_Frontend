import { combineReducers } from "redux";
import sessionReducer from "./session";
import tourReducer from "./tours";
import homeReducer from "./home";

export default combineReducers({
  session: sessionReducer,
  tours: tourReducer,
  home: homeReducer,
});
