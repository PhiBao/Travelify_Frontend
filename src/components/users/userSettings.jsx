import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Routes, Route, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { connect } from "react-redux";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import HistoryIcon from "@mui/icons-material/History";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import UserProfile from "./userProfile";
import UserHistory from "./userHistory";
import Notifications from "./notifications";
import PasswordChange from "./passwordChange";
import useDocumentTitle from "../../utils/useDocumentTitle";
import { updateUser } from "../../store/session";
import Loading from "../layout/loading";

export const UserSettings = (props) => {
  useDocumentTitle("User settings");
  const { currentUser, updateUser, loading } = props;

  return (
    <Container>
      <Grid
        container
        mt={10}
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
              <ListItemButton component={Link} to="">
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
              <ListItemButton component={Link} to="history">
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText primary="History" />
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
              <Route path="notifications" element={<Notifications />} />
              <Route path="change_password" element={<PasswordChange />} />
              <Route path="history" element={<UserHistory />} />
              <Route
                path=""
                element={
                  <UserProfile
                    currentUser={currentUser}
                    updateUser={updateUser}
                  />
                }
              />
            </Routes>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data, id) => dispatch(updateUser(data, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
