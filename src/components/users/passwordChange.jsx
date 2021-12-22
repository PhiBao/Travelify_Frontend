import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import { TextInputField, FormButton } from "../common/form";
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
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      passwordConfirmation: "",
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleClickShowPassword = (type) => {
    switch (type) {
      case "current":
        setShowPassword({
          ...showPassword,
          current: !showPassword.current,
        });
        break;
      case "new":
        setShowPassword({
          ...showPassword,
          new: !showPassword.new,
        });
        break;
      case "confirm":
        setShowPassword({
          ...showPassword,
          confirm: !showPassword.confirm,
        });
        break;
      default:
        return;
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangePassword = async (data, e) => {
    e.preventDefault();
    await props.changePassword({ data });
    reset();
  };

  return (
    <Box
      bgcolor="background.paper"
      p={2}
      borderRadius="15px"
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onChangePassword)}
    >
      <TextInputField
        control={control}
        name="currentPassword"
        label="Current password"
        type={showPassword.current ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("current")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword.current ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextInputField
        control={control}
        name="newPassword"
        label="New password"
        type={showPassword.new ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("new")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword.new ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextInputField
        control={control}
        name="passwordConfirmation"
        label="Password confirmation"
        type={showPassword.confirm ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("confirm")}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 1,
        }}
      >
        <FormButton label="Change" disabled={!isDirty || !isValid} />
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  changePassword: (data) => dispatch(changePassword(data)),
});

export default connect(null, mapDispatchToProps)(PasswordChange);
