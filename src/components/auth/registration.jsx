import React from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { createSession } from "../../store/session";
import { Input, Button } from "../common/form";
import Loading from "../layout/loading";
import "../common/form.css";

const schema = Yup.object().shape({
  firstName: Yup.string().max(20),
  lastName: Yup.string().max(20),
  email: Yup.string().required().email(),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/,
      "minimum eight characters, at least one letter and one number"
    )
    .required(),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "password confirmation doesn't match password"
  ),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9)
    .max(11),
  address: Yup.string().max(100),
  birthday: Yup.string()
    .matches(
      /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
      "Date of Birth is invalid"
    )
    .test("birthday", "Please choose a valid date of birth", (value) => {
      const age = moment().diff(moment(value), "years");
      return age >= 16 && age <= 120;
    }),
});

export const Registration = (props) => {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await props.createSession({ user });
  };

  const { errors } = formState;

  if (props.session.user._id) return <Navigate to="/" replace />;

  return (
    <section className="vh-100 pt-5">
      {props.session.loading && <Loading />}
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Create an account
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-6">
                        <Input
                          register={register}
                          name="firstName"
                          spacingClass="mb-5"
                          label="First name"
                          error={errors.firstName}
                        />
                      </div>
                      <div className="col-md-6 ">
                        <Input
                          register={register}
                          spacingClass="mb-5"
                          name="lastName"
                          label="Last name"
                          error={errors.lastName}
                        />
                      </div>
                    </div>
                    <Input
                      register={register}
                      name="email"
                      label="Email"
                      spacingClass="mb-5"
                      error={errors.email}
                    />
                    <Input
                      register={register}
                      name="address"
                      label="Address"
                      spacingClass="mb-5"
                      error={errors.address}
                    />
                    <Input
                      register={register}
                      name="phoneNumber"
                      label="Phone number"
                      spacingClass="mb-5"
                      error={errors.phoneNumber}
                    />
                    <Input
                      register={register}
                      name="birthday"
                      label="Date of Birth"
                      spacingClass="mb-5"
                      error={errors.birthday}
                      type="date"
                      value="2000-01-01"
                    />
                    <Input
                      register={register}
                      name="password"
                      label="Password"
                      type="password"
                      spacingClass="mb-5"
                      error={errors.password}
                    />
                    <Input
                      register={register}
                      name="passwordConfirmation"
                      label="Password confirmation"
                      type="password"
                      spacingClass="mb-5"
                      error={errors.passwordConfirmation}
                    />

                    <Button
                      label="Register"
                      alignClass="d-flex justify-content-center"
                      styleClass="btn-success text-body"
                    />

                    <p className="text-center text-muted mt-2 mb-0">
                      Have already an account?{" "}
                      <Link to="/login" className="fw-bold text-body">
                        <u>Login here</u>
                      </Link>
                    </p>
                  </form>
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
  createSession: (data) => dispatch(createSession(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
