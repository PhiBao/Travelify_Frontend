import React from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiedPiperAlt } from "@fortawesome/free-brands-svg-icons";
import {
  faSignInAlt,
  faUserPlus,
  faSignOutAlt,
  faUserCog,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import "./navBar.scss";

const NavBar = (props) => {
  const { currentUser } = props;

  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <Link className="navbar-brand d-none d-lg-block" to="/">
            <FontAwesomeIcon icon={faPiedPiperAlt} fixedWidth />
            Travelify
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/tours">
                Tours
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right elements*/}

        <div className="d-flex align-items-center">
          {currentUser.id === 0 && (
            <React.Fragment>
              <NavLink className="nav-link" to="/login">
                Login <FontAwesomeIcon icon={faSignInAlt} fixedWidth />
              </NavLink>

              <NavLink className="nav-link" to="/register">
                Register <FontAwesomeIcon icon={faUserPlus} fixedWidth />
              </NavLink>
            </React.Fragment>
          )}
          {currentUser.id !== 0 && (
            <>
              {/* Notifications */}
              <Link
                className="text-reset me-3 dropdown-toggle hidden-arrow"
                id="navbarNotifications"
                role="button"
                to="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faBell} fixedWidth />
                <span className="badge rounded-pill badge-notification bg-danger">
                  1
                </span>
              </Link>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarNotifications"
              >
                <li className="nav-item">
                  <NavLink className="nav-link" to="#">
                    Some news
                  </NavLink>
                </li>
              </ul>

              {/* User actions */}
              <Link
                className="d-flex align-items-center dropdown-toggle hidden-arrow"
                id="navbarUserActions"
                role="button"
                to="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={
                    currentUser.avatar?.url ||
                    `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                  }
                  alt="avatar"
                  height="25"
                  className="rounded-circle"
                />
              </Link>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarUserActions"
              >
                <li className="nav-item">
                  <NavLink className="nav-link" to="/settings">
                    <FontAwesomeIcon icon={faUserCog} fixedWidth /> Settings
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    <FontAwesomeIcon icon={faSignOutAlt} fixedWidth /> Logout
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

export default connect(mapStateToProps, null)(NavBar);
