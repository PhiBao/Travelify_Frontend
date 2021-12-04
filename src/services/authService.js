import jwtDecode from "jwt-decode";

const tokenKey = "token";

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

const auth = {
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt,
};

export default auth;
