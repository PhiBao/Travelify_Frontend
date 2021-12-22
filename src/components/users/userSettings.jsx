import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { connect } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Loading from "../layout/loading";
import UserProfile from "./userProfile";
import PasswordChange from "./passwordChange";

export const UserSettings = (props) => {
  const { loading } = props;

  return (
    <Grid
      container
      mt={6}
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      {loading && <Loading />}
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={4}
          mt={2}
          borderColor="primary.main"
          sx={{
            bgcolor: "background.paper",
            width: { sm: "100%" },
            borderRadius: "15px",
          }}
        >
          <List
            component="nav"
            aria-labelledby="list-subheader"
            subheader={
              <ListSubheader component="div" id="list-subheader">
                User Settings
              </ListSubheader>
            }
          >
            <ListItemButton component={Link} to="general">
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="General" />
            </ListItemButton>
            <ListItemButton component={Link} to="change_password">
              <ListItemIcon>
                <ChangeCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Change password" />
            </ListItemButton>
            <ListItemButton component={Link} to="notifications">
              <ListItemIcon>
                <CircleNotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </List>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Routes>
            <Route path="general" element={<UserProfile />} />
            <Route path="change_password" element={<PasswordChange />} />
            <Route path="/" element={<UserProfile />} />
          </Routes>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.users.loading,
});

export default connect(mapStateToProps, null)(UserSettings);
