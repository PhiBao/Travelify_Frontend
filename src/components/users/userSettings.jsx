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
  id: Yup.number().required(),
  first_name: Yup.string().max(20),
  last_name: Yup.string().max(20),
  email: Yup.string().required().email(),
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
    resolver: yupResolver(schema),
  });

  const fields = [
    "id",
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
    if (_.isEqual(user, _.omit(currentUser, "admin", "created_at"))) return;
    await props.updateUser({ user });
  };

  const { errors } = formState;

  return (
    <section className="vh-100">
      {loading && <Loading />}
      <div className="container py-5 h-100">
        <div className="row my-5 d-flex align-items-start justify-content-center h-100">
          <div className="col col-xl-10">
            <h4 className="font-weight-bold py-3 mb-4">Account settings</h4>
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
                <div className="col-md-8 col-lg-8 d-flex align-items-top">
                  <div className="card-body px-lg-4 text-black">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                      <Button
                        label="Update"
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
