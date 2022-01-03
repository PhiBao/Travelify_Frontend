import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@material-ui/core";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import Button from "@mui/material/Button";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import Box from "@material-ui/core/Box";
import { TextInputField, FormCheckbox } from "../common/form";
import Loading from "../layout/loading";
import { receiveSession, loginSocial } from "../../store/session";

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().min(8).required(),
  rememberMe: Yup.boolean(),
});

const useStyles = makeStyles((theme) => ({
  rightCard: {
    display: "flex",
    flexDirection: "column",
    margin: "auto 20px",
  },
  loginHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  boxOption: {
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  facebookLogin: {
    textAlign: "center",
    width: "100%",
    display: "block",
    color: "white",
    backgroundColor: "#3b5998",
    fontSize: "25px",
    padding: theme.spacing(1),
    borderRadius: "10px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  googleLogin: {
    textAlign: "center",
    width: "100%",
    display: "block",
    color: "white",
    backgroundColor: "#ea4335",
    fontSize: "25px",
    padding: theme.spacing(1),
    borderRadius: "10px",
    marginBottom: "20px",
    cursor: "pointer",
  },
  icons: {
    paddingRight: theme.spacing(1),
  },
}));

export const Login = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { session, receiveSession, loginSocial } = props;
  const { currentUser, loading } = session;

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await receiveSession({ user });

    navigate(location.state?.from.pathname || "/");
  };

  if (currentUser.id !== 0) return <Navigate to="/" place />;

  const responseFacebook = async (response) => {
    const data = {
      provider: response.graphDomain,
      uid: response.id,
      id_token: response.accessToken,
      info: {
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
        avatar: response.picture.data.url,
      },
    };
    const headers = {
      Authorization: `Bearer ${response.accessToken}`,
      access_token: `${response.accessToken}`,
    };

    await loginSocial(data, headers);
    navigate(location.state?.from.pathname || "/");
  };

  const responseGoogle = async (response) => {
    const data = {
      provider: "Google",
      uid: response.Ba,
      id_token: response.tokenId,
      info: {
        email: response.profileObj.email,
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
        avatar: response.profileObj.imageUrl,
      },
    };
    const headers = {
      Authorization: `Bearer ${response.accessToken}`,
      access_token: `${response.accessToken}`,
    };

    await loginSocial(data, headers);
    navigate(location.state?.from.pathname || "/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}

      <Card sx={{ display: "flex", borderRadius: "15px" }}>
        <CardMedia
          component="img"
          image={`${process.env.PUBLIC_URL}/assets/images/sora.jpg`}
          alt="Welcome to Travelify"
          sx={{ maxWidth: 450, display: { xs: "none", md: "flex" } }}
        />
        <Box
          className={classes.rightCard}
          component="form"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.loginHeader}>
            <CardTravelIcon
              style={{
                color: "#ff6219",
                fontSize: 60,
                marginRight: 10,
              }}
            />
            <Typography variant="h3" component="span">
              Welcome to Travelify
            </Typography>
          </div>
          <Typography variant="h5" component="h5">
            Sign into your account
          </Typography>

          <TextInputField control={control} name="email" label="Email" />

          <TextInputField
            control={control}
            name="password"
            label="Password"
            type="password"
          />

          <Box className={classes.boxOption}>
            <FormCheckbox
              label="Remember me"
              control={control}
              name="rememberMe"
            />
            <Link
              style={{ fontWeight: 500, fontStyle: "italic" }}
              to="/forgotten_password"
            >
              Forgot password?
            </Link>
          </Box>

          <Box
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
            LOG IN
          </Box>

          <Divider sx={{ my: 2 }}>
            <Chip label="OR" />
          </Divider>

          <FacebookLogin
            cssClass={classes.facebookLogin}
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="first_name,last_name,email,picture"
            scope="public_profile,email"
            callback={responseFacebook}
            icon={<FacebookIcon className={classes.icons} />}
          />

          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_APP_ID}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={(renderProps) => (
              <button
                className={classes.googleLogin}
                onClick={renderProps.onClick}
              >
                <GoogleIcon className={classes.icons} />
                Login with Google
              </button>
            )}
            cookiePolicy={"single_host_origin"}
          />
        </Box>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  session: state.entities.session,
});

const mapDispatchToProps = (dispatch) => ({
  receiveSession: (data) => dispatch(receiveSession(data)),
  loginSocial: (data, headers) => dispatch(loginSocial(data, headers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
