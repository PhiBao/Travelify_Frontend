import React from "react";
import { connect } from "react-redux";
import { Routes, Route, NavLink } from "react-router-dom";
import Loading from "../layout/loading";
import UserProfile from "./userProfile";
import PasswordChange from "./passwordChange";
import "../common/form.css";
import "./userSettings.css";

export const UserSettings = (props) => {
  const { loading } = props;

  return (
    <section className="vh-100">
      {loading && <Loading />}
      <div className="container py-5 h-100">
        <div className="row my-3 d-flex align-items-start justify-content-center h-100">
          <div className="col col-xl-10">
            <h4 className="font-weight-bold py-2 mb-2">Account settings</h4>
            <div className="row">
              <h6>&rarr;Setting&rarr;General</h6>
            </div>
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-4 col-lg-4 d-md-block">
                  <div className="list-group pt-3 ps-3">
                    <NavLink to="general" className="list-group-item">
                      General
                    </NavLink>
                    <NavLink to="change_password" className="list-group-item">
                      Change password
                    </NavLink>
                    <NavLink to="notifications" className="list-group-item">
                      Notifications
                    </NavLink>
                  </div>
                </div>
                <Routes>
                  <Route path="general" element={<UserProfile />} />
                  <Route path="change_password" element={<PasswordChange />} />
                  <Route path="/" element={<UserProfile />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.users.loading,
});

export default connect(mapStateToProps, null)(UserSettings);
