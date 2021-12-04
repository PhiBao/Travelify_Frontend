import { combineReducers } from "redux";
import usersReducer from "./users";
import sessionReducer from "./session"

export default combineReducers({
  users: usersReducer,
  session: sessionReducer
});
