import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { forgottenPassword } from "../../store/session";
import { Input, Button } from "../common/form";
import Loading from "../layout/loading";
import ".././common/form.css";
import "./forgottenPassword.css";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
});

export const ForgottenPassword = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { session, forgottenPassword } = props;
  const { currentUser, loading } = session;

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await forgottenPassword(data);
  };

  if (currentUser.id !== 0) return <Navigate to="/" replace />;

  return (
    <section className="vh-100">
      {loading && <Loading />}
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                {currentUser.reset_email_sent === true ? (
                  <section className="mail-success">
                    <div className="container">
                      <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-12">
                          <div className="success-inner">
                            <h1>
                              <FontAwesomeIcon icon={faEnvelope} />
                              <span>Your Mail Sent Successfully!</span>
                            </h1>
                            <p>
                              Please check your email. The email will be active
                              within two hours from the time we send it
                            </p>

                            <p className="text-center text-muted mb-0">
                              Have you not received the email yet?{" "}
                              <button
                                type="button"
                                className="btn btn-link text-primary mt-0 pt-0"
                                onClick={() => {
                                  props.forgottenPassword({
                                    email: currentUser.email,
                                  });
                                }}
                              >
                                Resend the email
                              </button>
                            </p>

                            <button
                              onClick={() => {
                                window.location.href = "/login";
                              }}
                              className="btn btn-primary btn-lg my-4"
                            >
                              Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <div className="card-body p-5">
                    <h2 className="text-uppercase text-center mb-5">
                      Forgot password
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Input
                        register={register}
                        name="email"
                        label="Enter your email address"
                        spacingClass="mb-5 pb-1"
                        error={errors.email}
                      />
                      <Button
                        label="Reset"
                        alignClass="d-flex justify-content-center"
                        styleClass="btn-success text-white"
                      />

                      <p className="text-center text-muted mt-3 mb-0">
                        Have you not had an account yet?{" "}
                        <Link to="/login" className="fw-bold text-body">
                          <u>Register here</u>
                        </Link>
                      </p>
                    </form>
                  </div>
                )}
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
  forgottenPassword: (data) => dispatch(forgottenPassword(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgottenPassword);
