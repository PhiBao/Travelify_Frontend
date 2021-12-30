import axios from "axios";
import humps from "humps";
import { toast } from "react-toastify";
import * as actions from "../api";
import auth from "../../services/authService";

axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;

axios.interceptors.response.use((response) => {
  response.data = humps.camelizeKeys(response.data);
  return response;
});

axios.interceptors.request.use((request) => {
  if (request.headers["Content-Type"] === "multipart/form-data") return request;
  request.data = humps.decamelizeKeys(request.data);
  return request;
});

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

    const { url, method, data, onSuccess, onError, params, headers } =
      action.payload;

    dispatch(actions.apiCallPrepare());

    next(action);

    axios.defaults.headers.common["Authenticate"] = auth.getJwt();

    try {
      const response = await axios.request({
        url,
        params,
        method,
        data,
        headers,
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

      if (error.response && error.response.data.messages) {
        error.response.data.messages.map((message) => toast.error(message));
      }

      return Promise.reject(error);
    }
  };

export default api;
