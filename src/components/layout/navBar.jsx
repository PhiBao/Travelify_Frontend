import React from "react";
import { Link, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPiedPiperAlt } from "@fortawesome/free-brands-svg-icons";

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
            {currentUser.id === 0 && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/tours">
                Tours
              </NavLink>
            </li>
          </ul>
        </div>
        {currentUser.id !== 0 && (
          <div className="d-flex align-items-center">
            <div
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
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
            </div>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li className="nav-item">
                <NavLink className="nav-link" to="/settings">
                  Settings
                </NavLink>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

export default connect(mapStateToProps, null)(NavBar);
