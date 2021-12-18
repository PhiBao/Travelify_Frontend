import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGooglePlus } from "@fortawesome/free-brands-svg-icons";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { receiveSession, loginSocial } from "../../store/session";
import { Input, Button, Checkbox } from "../common/form";
import Loading from "../layout/loading";
import "../common/form.scss";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().min(8).required(),
  rememberMe: Yup.boolean(),
});

export const LoginForm = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { session, receiveSession, loginSocial } = props;
  const { currentUser, loading } = session;

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await receiveSession({ user });

    navigate(location.state?.from.pathname || "/");
  };

  if (currentUser.id !== 0) return <Navigate to="/" place />;

  const responseFacebook = async (response) => {
    const data = {
      provider: response.graphDomain,
      uid: response.id,
      id_token: response.accessToken,
      info: {
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
        avatar: response.picture.data.url,
      },
    };
    const headers = {
      Authorization: `Bearer ${response.accessToken}`,
      access_token: `${response.accessToken}`,
    };

    await loginSocial(data, headers);
  };

  const responseGoogle = async (response) => {
    const data = {
      provider: "Google",
      uid: response.Ba,
      id_token: response.tokenId,
      info: {
        email: response.profileObj.email,
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        avatar: response.profileObj.imageUrl,
      },
    };
    const headers = {
      Authorization: `Bearer ${response.accessToken}`,
      access_token: `${response.accessToken}`,
    };

    await loginSocial(data, headers);
  };

  return (
    <section className="vh-100">
      {loading && <Loading />}
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

                      <FacebookLogin
                        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields="first_name,last_name,email,picture"
                        scope="public_profile,email"
                        callback={responseFacebook}
                        icon={
                          <FontAwesomeIcon
                            icon={faFacebookF}
                            className="me-2"
                          />
                        }
                        style={{ backgroundColor: "#3b5998" }}
                        cssClass="btn btn-facebook btn-lg btn-block form-control text-center mt-2"
                      />

                      <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_APP_ID}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        render={(renderProps) => (
                          <button
                            className="btn btn-google btn-lg btn-block form-control mt-2"
                            onClick={renderProps.onClick}
                          >
                            <FontAwesomeIcon
                              icon={faGooglePlus}
                              className="me-2"
                            />
                            Login with Google
                          </button>
                        )}
                        cookiePolicy={"single_host_origin"}
                      />
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
  loginSocial: (data, headers) => dispatch(loginSocial(data, headers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
