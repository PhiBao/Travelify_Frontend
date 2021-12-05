import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const tokenKey = "token";

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function rememberMe(jwt) {
  Cookies.set(tokenKey, jwt);
}

function logout() {
  localStorage.removeItem(tokenKey);
  Cookies.remove(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey) || Cookies.get(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey) || Cookies.get(tokenKey);
}

const auth = {
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
  rememberMe,
};

export default auth;
