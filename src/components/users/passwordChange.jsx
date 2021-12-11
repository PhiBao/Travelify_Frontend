import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Input, Button } from "../common/form";
import { changePassword } from "../../store/users";

const schema = Yup.object().shape({
  current_password: Yup.string().min(8).required(),
  new_password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/,
      "minimum eight characters, at least one letter and one number"
    )
    .required(),
  password_confirmation: Yup.string().oneOf(
    [Yup.ref("new_password"), null],
    "Confirmation password for new password don't mash"
  ),
});

export const PasswordChange = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onChangePassword = async (data, e) => {
    e.preventDefault();
    await props.changePassword({ data });
    reset();
  };

  return (
    <div className="col-md-8 col-lg-8 col-sm-12">
      <form className="mt-4 px-4" onSubmit={handleSubmit(onChangePassword)}>
        <Input
          register={register}
          name="current_password"
          label="Current password"
          spacingClass="mb-4 pb-4"
          error={errors.current_password}
          type="password"
        />
        <Input
          register={register}
          name="new_password"
          label="New password"
          spacingClass="mb-5"
          error={errors.new_password}
          type="password"
        />
        <Input
          register={register}
          name="password_confirmation"
          label="Password confirmation"
          spacingClass="mb-5"
          error={errors.password_confirmation}
          type="password"
        />

        <Button
          label="Change"
          alignClass="d-flex justify-content-center mb-3"
          styleClass="btn-success text-white"
        />
      </form>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changePassword: (data) => dispatch(changePassword(data)),
});

export default connect(null, mapDispatchToProps)(PasswordChange);
