import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { Navigate } from "react-router-dom";
import { receiveSession } from "../../store/session";
import "./loginForm.css";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().min(8).required(),
});

export const LoginForm = () => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.entities.session);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (user, e) => {
    e.preventDefault();
    dispatch(receiveSession({ user }));
    setUser({
      email: "",
      password: "",
    });
  };

  const { errors } = formState;

  if (session.user._id) return <Navigate to="/" />;

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/sora.jpg`}
                    className="img-fluid"
                    style={{
                      borderRadius: "1rem 0 0 1rem",
                      height: "100%",
                    }}
                    alt="Description"
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-top">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <FontAwesomeIcon
                          icon={faSuitcase}
                          className="me-3"
                          size="2x"
                          style={{ color: "#ff6219" }}
                        />
                        <span className="h1 fw-bold mb-0">
                          Welcome to Travelify
                        </span>
                      </div>
                      <h5
                        className="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Sign into your account
                      </h5>
                      <div className="form-outline mb-5">
                        <input
                          {...register("email")}
                          className="form-control form-control-lg form__input"
                          onChange={(e) => {
                            setUser({ ...user, email: e.target.value });
                          }}
                          value={user.email}
                          placeholder=" "
                          id="email"
                        />
                        <label
                          htmlFor="email"
                          className="form-label form__label"
                        >
                          Email
                        </label>
                      </div>
                      <div className="alert text-danger px-0 mb-0 fade show">
                        {errors.email?.message}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          {...register("password")}
                          className="form-control form-control-lg form__input"
                          onChange={(e) => {
                            setUser({ ...user, password: e.target.value });
                          }}
                          value={user.password}
                          type="password"
                          placeholder=" "
                          id="password"
                        />
                        <label
                          htmlFor="password"
                          className="form-label form__label"
                        >
                          Password
                        </label>
                      </div>
                      <div className="alert text-danger px-0 pt-4 mb-0 fade show">
                        {errors.password?.message}
                      </div>

                      <div className="d-flex justify-content-around align-items-center mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="rememberMe"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            {" "}
                            Remember me{" "}
                          </label>
                        </div>
                        <a href="#!">Forgot password?</a>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-dark btn-lg btn-block form-control"
                          type="submit"
                        >
                          Log in
                        </button>
                      </div>
                      <div className="divider d-flex align-items-center my-4">
                        <p className="text-center fw-bold mx-3 mb-0 text-muted">
                          OR
                        </p>
                      </div>

                      <a
                        className="btn btn-primary btn-lg btn-block form-control"
                        style={{ backgroundColor: "#3b5998" }}
                        href="#!"
                        role="button"
                      >
                        <FontAwesomeIcon icon={faFacebookF} className="me-2" />
                        Continue with Facebook
                      </a>
                      <a
                        className="btn btn-primary btn-lg btn-block form-control mt-2"
                        style={{ backgroundColor: "#55acee" }}
                        href="#!"
                        role="button"
                      >
                        <FontAwesomeIcon icon={faTwitter} className="me-2" />
                        Continue with Twitter
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
