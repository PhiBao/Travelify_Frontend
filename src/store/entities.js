import { combineReducers } from "redux";
import usersReducer from "./users";
import sessionReducer from "./session";
import tourReducer from "./tours";

export default combineReducers({
  users: usersReducer,
  session: sessionReducer,
  tours: tourReducer,
});
