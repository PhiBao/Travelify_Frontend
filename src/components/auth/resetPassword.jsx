import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, useSearchParams, useNavigate } from "react-router-dom";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core";
import { resetPassword } from "../../store/session";
import { TextInputField } from "../common/form";
import Loading from "../layout/loading";
import auth from "../../services/authService";
import useDocumentTitle from "../../utils/useDocumentTitle";

const schema = Yup.object().shape({
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
});

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px !important",
    padding: theme.spacing(3),
    maxWidth: 800,
  },
}));

export const ResetPassword = (props) => {
  useDocumentTitle("Reset password");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const classes = useStyles();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    mode: "onBlur",
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

  const { loading, resetPassword } = props;

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await resetPassword(
      { user: { ...data, email: searchParams.get("email") } },
      searchParams.get("token")
    );
    navigate("/login", { replace: true });
  };

  if (auth.getCurrentUser()) return <Navigate to="/" replace />;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}

      <Card className={classes.card}>
        <Typography variant="h3">Reset your password</Typography>

        <Box
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            sx={{ mt: 2 }}
            component={Button}
            type="submit"
            variant="contained"
            style={{
              backgroundColor: "#26c6da",
              color: "#212121",
              fontWeight: 700,
            }}
            fullWidth
          >
            Reset password
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
  resetPassword: (data, token) => dispatch(resetPassword(data, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
