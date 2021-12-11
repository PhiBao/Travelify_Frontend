import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../store/session";
import { Input, Button } from "../common/form";
import Loading from "../layout/loading";
import "../common/form.css";

const schema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/,
      "minimum eight characters, at least one letter and one number"
    )
    .required(),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "password confirmation doesn't match password"
  ),
});

export const ResetPassword = (props) => {
  const navigate = useNavigate();
  const [q] = useSearchParams();

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await props.resetPassword(
      { user: { ...data, email: q.get("email") } },
      q.get("token")
    );
    navigate("/login", { replace: true });
  };

  const { errors } = formState;

  if (props.session.user._id) return <Navigate to="/" replace />;

  return (
    <section className="vh-100">
      {props.session.loading && <Loading />}
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">
                    Reset your password
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      register={register}
                      name="password"
                      label="Password"
                      type="password"
                      spacingClass="mb-4 pb-3"
                      error={errors.password}
                    />
                    <Input
                      register={register}
                      name="password_confirmation"
                      label="Password confirmation"
                      type="password"
                      spacingClass="mb-4 pb-3"
                      error={errors.password_confirmation}
                    />

                    <Button
                      label="Reset password"
                      alignClass="d-flex justify-content-center"
                      styleClass="btn-success text-body"
                    />
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
  resetPassword: (data, token) => dispatch(resetPassword(data, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
