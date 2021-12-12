import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { receiveSession } from "../../store/session";
import { Input, Button, Checkbox } from "../common/form";
import Loading from "../layout/loading";
import "../common/form.css";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().min(8).required(),
  rememberMe: Yup.boolean(),
});

export const LoginForm = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await props.receiveSession({ user });

    navigate(location.state?.from.pathname || "/");
  };

  const { errors } = formState;

  if (props.session.user._id) return <Navigate to="/" place />;

  return (
    <section className="vh-100">
      {props.session.loading && <Loading />}
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
                      <Input
                        register={register}
                        name="email"
                        label="Email"
                        spacingClass="mb-5"
                        error={errors.email}
                      />

                      <Input
                        register={register}
                        name="password"
                        label="Password"
                        spacingClass="mb-4 pb-4"
                        type="password"
                        error={errors.password}
                      />

                      <div className="d-flex justify-content-around align-items-center mb-4">
                        <Checkbox
                          label="Remember me"
                          register={register}
                          name={"rememberMe"}
                        />
                        <Link
                          to="/forgotten_password"
                          className="fw-bold text-info"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <Button
                        label="Log in"
                        alignClass="mb-4"
                        styleClass="btn-dark form-control"
                      />
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

const mapStateToProps = (state) => ({
  session: state.entities.session,
});

const mapDispatchToProps = (dispatch) => ({
  receiveSession: (data) => dispatch(receiveSession(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
