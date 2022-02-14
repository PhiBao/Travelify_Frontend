import { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { TextInputField, DatePickerField } from "./form";

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
    .nullable()
    .matches(
      /^[0-9]{9,11}|^$/,
      "Must be only digits and have length from 9 to 11"
    ),
  address: Yup.string().max(100),
  birthday: Yup.date().test(
    "birthday",
    "Please choose a valid date of birth",
    (value) => {
      const age = moment().diff(moment(value), "years");
      return age >= 16 && age <= 120;
    }
  ),
});

export const UserForm = (props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      birthday: "2000-01-01",
      password: "",
      passwordConfirmation: "",
      lastName: "",
      firstName: "",
      phoneNumber: "",
      address: "",
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    confirm: false,
  });

  const handleClickShowPassword = (type) => {
    type === "password"
      ? setShowPassword({
          ...showPassword,
          current: !showPassword.current,
        })
      : setShowPassword({
          ...showPassword,
          confirm: !showPassword.confirm,
        });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { title, onSubmit } = props;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextInputField control={control} name="firstName" label="First name" />

        <TextInputField control={control} name="lastName" label="Last name" />
      </Box>
      <TextInputField control={control} name="email" label="Email" />
      <TextInputField control={control} name="address" label="Address" />
      <TextInputField
        control={control}
        name="phoneNumber"
        label="Phone number"
      />
      <DatePickerField
        control={control}
        name="birthday"
        label="Date of Birth"
        error={errors.birthday}
      />
      <TextInputField
        control={control}
        name="password"
        label="Password"
        type={showPassword.current ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("password")}
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
        name="passwordConfirmation"
        label="Password confirmation"
        type={showPassword.confirm ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => handleClickShowPassword("passwordConfirmation")}
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
        type="submit"
        variant="contained"
        component={Button}
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 3,
        }}
        style={{
          backgroundColor: "#26c6da",
          color: "#212121",
          fontWeight: 700,
        }}
        fullWidth
      >
        {title}
      </Box>
    </Box>
  );
};

export default UserForm;
