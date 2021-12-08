import axios from "axios";
import { toast } from "react-toastify";
import * as actions from "../api";
import auth from "../../services/authService";

axios.defaults.baseURL = "http://localhost:3900";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    toast.error("An unexpected error occurred");
  }
  return Promise.reject(error);
});

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onSuccess, onError, params } = action.payload;

    dispatch(actions.apiCallPrepare());

    next(action);

    axios.defaults.headers.common["Authenticate"] = auth.getJwt();

    try {
      const response = await axios.request({
        url,
        params,
        method,
        data,
      });
      // Specific
      if (onSuccess)
        dispatch({
          type: onSuccess,
          payload: response.data,
        });
      // General
      dispatch(actions.apiCallSuccess(response.data));
    } catch (error) {
      // General
      dispatch(actions.apiCallFailed(error.message));
      // Specific
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
