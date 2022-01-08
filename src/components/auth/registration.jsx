import { useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { TextInputField, DatePickerField } from "../common/form";
import { createSession } from "../../store/session";
import Loading from "../layout/loading";
import auth from "../../services/authService";

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
  birthday: Yup.date().test(
    "birthday",
    "Please choose a valid date of birth",
    (value) => {
      const age = moment().diff(moment(value), "years");
      return age >= 16 && age <= 120;
    }
  ),
});

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px !important",
    padding: theme.spacing(3),
  },
}));

export const Registration = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const classes = useStyles();

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

  const { loading, createSession } = props;
  const onSubmit = async (user, e) => {
    e.preventDefault();
    await createSession({ user });
    navigate(location.state?.from.pathname || "/");
  };

  if (auth.getCurrentUser()) return <Navigate to="/" replace />;

  return (
    <Box
      mt={5}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}
      <Card className={classes.card}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" gutterBottom component="div" mt={5}>
            Create an account
          </Typography>
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextInputField
              control={control}
              name="firstName"
              label="First name"
            />

            <TextInputField
              control={control}
              name="lastName"
              label="Last name"
            />
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
                    onClick={() =>
                      handleClickShowPassword("passwordConfirmation")
                    }
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
            Register
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 3,
            }}
          >
            <p>
              Have already an account?{" "}
              <Link to="/login" className="fw-bold text-body">
                <u>Login here</u>
              </Link>
            </p>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (data) => dispatch(createSession(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Registration);
