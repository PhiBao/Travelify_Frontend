import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import Button from "@mui/material/Button";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import Box from "@mui/material/Box";
import { TextInputField, FormCheckbox } from "../common/form";
import Loading from "../layout/loading";
import { receiveSession, loginSocial } from "../../store/session";
import useDocumentTitle from "../../utils/useDocumentTitle";
import auth from "../../services/authService";

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
    display: "flex",
    margin: "10px 0",
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
  useDocumentTitle("Login");
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    resolver: yupResolver(schema),
  });

  const { loading, receiveSession, loginSocial } = props;

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await receiveSession({ user });

    navigate(location.state?.from.pathname || "/");
  };

  if (auth.getCurrentUser()) return <Navigate to="/" replace />;

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
          <Box component="div" className={classes.loginHeader}>
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
          </Box>
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
            <Box>
              <FormCheckbox
                control={control}
                name="rememberMe"
                label="Remember Me"
              />
            </Box>
            <Box
              component={Link}
              to="/forgotten_password"
              sx={{ fontWeight: 500, fontStyle: "italic" }}
            >
              Forgot password?
            </Box>
          </Box>

          <Box
            component={Button}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#26c6da",
              color: "#212121",
              fontWeight: 700,
              p: "5px",
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
              <Box
                component="button"
                className={classes.googleLogin}
                onClick={renderProps.onClick}
              >
                <GoogleIcon className={classes.icons} />
                Login with Google
              </Box>
            )}
            cookiePolicy={"single_host_origin"}
          />
        </Box>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  receiveSession: (data) => dispatch(receiveSession(data)),
  loginSocial: (data, headers) => dispatch(loginSocial(data, headers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
