import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Input, Button } from "../common/form";
import { changePassword } from "../../store/users";

const schema = Yup.object().shape({
  currentPassword: Yup.string().min(8).required(),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/,
      "minimum eight characters, at least one letter and one number"
    )
    .required(),
  passwordConfirmation: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
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
          name="currentPassword"
          label="Current password"
          spacingClass="mb-4 pb-4"
          error={errors.currentPassword}
          type="password"
        />
        <Input
          register={register}
          name="newPassword"
          label="New password"
          spacingClass="mb-5"
          error={errors.newPassword}
          type="password"
        />
        <Input
          register={register}
          name="passwordConfirmation"
          label="Password confirmation"
          spacingClass="mb-5"
          error={errors.passwordConfirmation}
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
