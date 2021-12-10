import React, { useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import _ from "lodash";
import { getCurrentUser, updateUser } from "../../store/users";
import Loading from "../layout/loading";
import { Input, Button } from "../common/form";
import "./userSettings.css";

const schema = Yup.object().shape({
  first_name: Yup.string().max(20),
  last_name: Yup.string().max(20),
  email: Yup.string().email().required(),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9)
    .max(11),
  address: Yup.string().max(100),
  activated: Yup.boolean(),
  birthday: Yup.string()
    .matches(
      /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
      "Date of Birth is invalid"
    )
    .test("birthday", "Please choose a valid date of birth", (value) => {
      const age = moment().diff(moment(value), "years");
      return age >= 16 && age <= 120;
    }),
  avatar: Yup.mixed()
    .test("fileSize", "The file is too large", (value) => {
      return value.length > 0 ? value[0].size <= 5242880 : true;
    })
    .test("type", "We support png, jpg, gif file", (value) => {
      return value.length > 0
        ? ["image/png", "image/jpg", "image/gif"].includes(value[0].type)
        : true;
    }),
});

export const UserSettings = (props) => {
  const { currentUser, loading } = props.users;
  useEffect(() => {
    const getCurrentUser = async () => {
      await props.getCurrentUser();
    };
    if (currentUser.id === 0) {
      getCurrentUser();
    }
  });

  const { register, handleSubmit, setValue, formState } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const fields = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "address",
    "birthday",
    "activated",
  ];
  fields.forEach((field) => setValue(field, currentUser[field]));

  const onSubmit = async (user, e) => {
    e.preventDefault();

    if (
      _.isEqual(
        _.omit(user, "avatar"),
        _.omit(currentUser, "id", "admin", "created_at", "avatar")
      ) &&
      user.avatar.length === 0
    )
      return;
    const formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("email", user.email);
    formData.append("phone_number", user.phone_number);
    formData.append("address", user.address);
    formData.append("birthday", user.birthday);
    if (user.avatar.length > 0) formData.append("avatar", user.avatar[0]);
    await props.updateUser(formData);
  };

  const { errors } = formState;

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
                    <a
                      className="list-group-item"
                      data-toggle="list"
                      href="#account-general"
                    >
                      General
                    </a>
                    <a
                      className="list-group-item"
                      data-toggle="list"
                      href="#account-change-password"
                    >
                      Change password
                    </a>
                    <a
                      className="list-group-item"
                      data-toggle="list"
                      href="#account-notifications"
                    >
                      Notifications
                    </a>
                  </div>
                </div>
                <div className="col-md-8 col-lg-8 col-sm-auto d-flex align-items-top">
                  <div className="row px-3">
                    <div className="d-flex align-items-start my-3 px-sm-5 px-md-4 px-lg-5 px-3">
                      <img
                        src={
                          currentUser.avatar?.url ||
                          "https://bootdey.com/img/Content/avatar/avatar1.png"
                        }
                        alt=""
                        className="img mt-2"
                      />
                      <div className="ps-sm-4 ps-2">
                        {" "}
                        <b>Profile Avatar</b>
                        <br />
                        <input
                          {...register("avatar")}
                          className="btn button border"
                          type="file"
                          name="avatar"
                        />
                        <p className="text-muted">
                          Allowed JPG, GIF or PNG. Max size of 5MB
                        </p>
                        {errors.avatar && (
                          <div className="alert text-danger px-0 mb-0 fade show">
                            errors.avatar.message
                          </div>
                        )}
                      </div>
                    </div>
                    <form
                      className="mt-4 mx-lg-2 me-md-5 pe-md-5 px-sm-4 "
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <Input
                            register={register}
                            name="first_name"
                            spacingClass="mb-5"
                            label="First name"
                            error={errors.first_name}
                          />
                        </div>
                        <div className="col-md-6 ">
                          <Input
                            register={register}
                            spacingClass="mb-5"
                            name="last_name"
                            label="Last name"
                            error={errors.last_name}
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
                        name="phone_number"
                        label="Phone number"
                        spacingClass="mb-5"
                        error={errors.phone_number}
                      />
                      <Input
                        register={register}
                        name="birthday"
                        label="Date of Birth"
                        spacingClass="mb-5"
                        error={errors.birthday}
                        type="date"
                      />
                      {currentUser.activated === false && (
                        <div className="alert alert-warning mt-3">
                          Your email is not confirmed. Please check your inbox.
                          <br />
                          <button className="btn btn-dark btn-block mt-1">
                            Resend confirmation
                          </button>
                        </div>
                      )}
                      <Button
                        label="Update"
                        alignClass="d-flex justify-content-center mb-3"
                        styleClass="btn-success text-white"
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
  users: state.entities.users,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: () => dispatch(getCurrentUser()),
  updateUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
