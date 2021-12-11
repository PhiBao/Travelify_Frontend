import React from "react";
import * as Yup from "yup";
import moment from "moment";
import _ from "lodash";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Input, Button } from "../common/form";
import { updateUser, activateUser } from "../../store/users";

const schema = Yup.object().shape({
  first_name: Yup.string().max(20).nullable(),
  last_name: Yup.string().max(20).nullable(),
  email: Yup.string().email().required(),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9)
    .max(11)
    .nullable(),
  address: Yup.string().max(100).nullable(),
  activated: Yup.boolean().nullable(),
  birthday: Yup.string()
    .nullable()
    .matches(
      /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
      "Date of Birth is invalid"
    )
    .test("birthday", "Please choose a valid date of birth", (value) => {
      if (value) {
        const age = moment().diff(moment(value), "years");
        return age >= 16 && age <= 120;
      } else return true;
    })
    .nullable(),
  avatar: Yup.mixed()
    .test("fileSize", "The file is too large", (value) => {
      return value.length > 0 ? value[0].size <= 5242880 : true;
    })
    .test("type", "We support png, jpg, gif file", (value) => {
      return value.length > 0
        ? ["image/png", "image/jpg", "image/gif"].includes(value[0].type)
        : true;
    })
    .nullable(),
});

export const UserProfile = (props) => {
  const { currentUser } = props.users;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
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

  const onEditProfile = async (user, e) => {
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
    await props.updateUser(formData, currentUser.id);
  };

  return (
    <div className="col-md-8 col-lg-8 col-sm-auto">
      <div className="d-flex align-items-start my-3 px-sm-5 px-md-4 px-lg-5 px-3">
        <img
          src={
            currentUser.avatar?.url ||
            `${process.env.PUBLIC_URL}/assets/images/unknown.png`
          }
          alt=""
          className="img mt-3"
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
          <p className="text-muted">Allowed JPG, GIF or PNG. Max size of 5MB</p>
          {errors.avatar && (
            <div className="alert text-danger px-0 mb-0 fade show">
              errors.avatar.message
            </div>
          )}
        </div>
      </div>

      <form
        className="mt-4 mx-lg-2 px-4"
        onSubmit={handleSubmit(onEditProfile)}
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
            <button
              type="button"
              onClick={async () => {
                await activateUser(currentUser.id);
              }}
              className="btn btn-dark btn-block mt-1"
            >
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
  );
};

const mapStateToProps = (state) => ({
  users: state.entities.users,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data, id) => dispatch(updateUser(data, id)),
  activateUser: (id) => dispatch(activateUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
