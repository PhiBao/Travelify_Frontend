import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { toast } from "react-toastify";
import axios from "axios";
import { TextInputField } from "../common/form";

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
  const { control, handleSubmit, reset } = useForm({
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
    axios
      .put(`/users/${props.id}/change_password`, data)
      .then(() => {
        toast.success("Password has changed");
        reset();
      })
      .catch(() => toast.error("An unexpected error occurred"));
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
        type="submit"
        variant="contained"
        component={Button}
      >
        Change
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  id: state.entities.session.currentUser.id,
});

export default connect(mapStateToProps, null)(PasswordChange);
