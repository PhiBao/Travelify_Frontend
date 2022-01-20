import { useState, useEffect } from "react";
import { connect } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Container from "@mui/material/Container";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import humps from "humps";
import Cable from "actioncable";
import { cities } from "../../helpers/tourHelper";
import { DEFAULT_DATE, fromNow } from "../../helpers/timeHelper";
import { Select, DatePickerField } from "../common/form";
import {
  getCurrentUser,
  addNotification,
  readNotification,
  loadNotifications,
} from "../../store/session";
import auth from "../../services/authService";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.info.main, 0.55),
  "&:hover": {
    backgroundColor: alpha(theme.palette.info.main, 0.75),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "auto",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "10ch",
    cursor: "pointer",
  },
}));

const schema = Yup.object().shape({
  date: Yup.date()
    .min(new Date(), "Departure date must be later than today.")
    .required(),
  departure: Yup.object().nullable(),
});

const NavBar = (props) => {
  const {
    currentUser: { id, avatarUrl, admin },
    notifications: { list = [], total, unread },
    getCurrentUser,
    addNotification,
    loadNotifications,
    readNotification,
  } = props;
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNot, setAnchorElNot] = useState(null);
  const isNavOpen = Boolean(anchorElNav);
  const isUserOpen = Boolean(anchorElUser);
  const isNotOpen = Boolean(anchorElNot);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(async () => {
    if (id === 0) {
      const user = auth.getCurrentUser();
      if (user) await getCurrentUser(user.id);
    } else {
      const cable = Cable.createConsumer(`ws://localhost:3900/cable?id=${id}`);
      cable.subscriptions.create("NotificationsChannel", {
        received: async (data) => {
          await addNotification(humps.camelizeKeys(data));
        },
      });
    }
  }, [id]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: DEFAULT_DATE,
      departure: {},
    },
    resolver: yupResolver(schema),
  });

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    reset();
  };

  const handleOpenNot = (e) => {
    if (list.length === 0) return;
    setAnchorElNot(e.currentTarget);
  };

  const handleCloseNot = () => {
    setAnchorElNot(null);
  };

  const handleSubmitSearch = (data, e) => {
    e.preventDefault();
    const q = {
      type: "search",
      date: data.date,
      departure: data.departure.value || "",
    };
    navigate({
      pathname: "/tours",
      search: `?${createSearchParams(q)}`,
    });
    setOpenSearch(false);
    reset();
  };

  const handleClickMore = async () => {
    const page = list.length / 10 + 1;
    await loadNotifications(id, { page });
  };

  const handleRead = async (status, id, tourId) => {
    if (status === "unread") await readNotification(id);
    setAnchorElNot(null);
    navigate(`/tours/${tourId}`);
  };

  return (
    <AppBar sx={{ backgroundColor: "background.paper" }} position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            <Link to="/">
              <img
                width="160px"
                height="59px"
                style={{ marginBottom: "-10px" }}
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                alt="featured images"
              />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ bgcolor: "primary.main" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={isNavOpen || false}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                key="home"
                onClick={handleCloseNavMenu}
                component={Link}
                to="/home"
              >
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              <MenuItem
                key="newest"
                onClick={handleCloseNavMenu}
                component={Link}
                to="/tours"
              >
                <Typography textAlign="center">Newest</Typography>
              </MenuItem>
              <MenuItem
                key="hot"
                onClick={handleCloseNavMenu}
                component={Link}
                to="/tours"
              >
                <Typography textAlign="center">Hot</Typography>
              </MenuItem>
              <MenuItem
                key="favorite"
                onClick={handleCloseNavMenu}
                component={Link}
                to="/tours"
              >
                <Typography textAlign="center">Favorite</Typography>
              </MenuItem>
              {id === 0 ? (
                <Box>
                  <MenuItem
                    key="register"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/register"
                  >
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                  <MenuItem
                    key="login"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/login"
                  >
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                </Box>
              ) : (
                <MenuItem
                  key="myMark"
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to="/tours?type=mark"
                >
                  <Typography textAlign="center">My Mark</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              component={Link}
              to="/home"
              key="home"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/tours"
              key="newest"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Newest
            </Button>
            <Button
              component={Link}
              to="/tours?type=hot"
              key="hot"
              onClick={handleCloseNavMenu}
              sx={{ mr: -2, my: 2, color: "white", display: "block" }}
            >
              Hot
            </Button>
            <Button
              component={Link}
              to="/tours?type=favorite"
              key="Favorite"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Favorite
            </Button>
            {id !== 0 && (
              <Button
                component={Link}
                to="/tours?type=mark"
                key="myMark"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                My mark
              </Button>
            )}
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: "flex",
            }}
          >
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onClick={handleOpenSearch}
                disabled
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Dialog
              fullWidth={true}
              maxWidth="sm"
              open={openSearch}
              onClose={handleCloseSearch}
            >
              <Box
                id="searchForm"
                component="form"
                onSubmit={handleSubmit(handleSubmitSearch)}
                autoComplete="off"
              >
                <DialogTitle>Search tour</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Where do you want to go?
                  </DialogContentText>
                  <Select
                    control={control}
                    name="departure"
                    label="Depart in"
                    options={cities}
                    placeholder="Select a departure"
                    error={errors.departure}
                  />
                  <DatePickerField
                    control={control}
                    name="date"
                    label="Depart at"
                    error={errors.date}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseSearch}>Cancel</Button>
                  <Button type="submit">Search</Button>
                </DialogActions>
              </Box>
            </Dialog>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {id === 0 ? (
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  component={Link}
                  to="/login"
                  key="login"
                  sx={{ my: 2, mr: 1, color: "white", display: "flex" }}
                  endIcon={<LoginIcon />}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  key="register"
                  sx={{ my: 2, color: "white", display: "flex" }}
                  endIcon={<PersonAddIcon />}
                >
                  Register
                </Button>
              </Box>
            ) : (
              <Box>
                <IconButton
                  size="large"
                  aria-label={`show all ${total} notifications`}
                  color="inherit"
                  onClick={handleOpenNot}
                >
                  <Badge badgeContent={unread} color="error">
                    <NotificationsIcon sx={{ color: "black" }} />
                  </Badge>
                </IconButton>
                <Menu
                  sx={{ mt: "45px", maxHeight: 800 }}
                  id="menu-appbar"
                  anchorEl={anchorElNot}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={isNotOpen || false}
                  onClose={handleCloseNot}
                >
                  {list.map((notification) => (
                    <MenuItem
                      key={`notification-${notification.id}`}
                      onClick={() =>
                        handleRead(
                          notification.status,
                          notification.id,
                          notification.tourId
                        )
                      }
                      sx={{
                        my: 0.5,
                        bgcolor: `${
                          notification.status === "unread"
                            ? "#f5f5f5"
                            : "backgroud.paper"
                        }`,
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          src={
                            notification.user?.avatarUrl ||
                            `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                          }
                          alt="avatar"
                          style={{ width: 24, height: 24 }}
                        />
                      </ListItemIcon>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "#757575", fontStyle: "italic" }}
                        >
                          {fromNow(notification.createdAt)}
                        </Typography>
                        <Typography variant="body1">
                          <b>{notification.user?.username}</b>
                          {` ${notification.action} your ${notification.notifiableType}`}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  {total > list.length && (
                    <Box
                      component={Button}
                      onClick={handleClickMore}
                      sx={{ ml: 1, color: "#424242" }}
                      variant="text"
                    >
                      Show more...
                    </Box>
                  )}
                </Menu>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      src={
                        avatarUrl ||
                        `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                      }
                      alt="avatar"
                      style={{ width: 24, height: 24 }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={isUserOpen || false}
                  onClose={handleCloseUserMenu}
                >
                  {admin && (
                    <MenuItem
                      key="dashboard"
                      onClick={handleCloseUserMenu}
                      component={Link}
                      to="/admin"
                      sx={{ my: 0.5 }}
                    >
                      <ListItemIcon>
                        <AdminPanelSettingsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Dashboard" />
                    </MenuItem>
                  )}

                  <MenuItem
                    key="settings"
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="/settings"
                    sx={{ my: 0.5 }}
                  >
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </MenuItem>
                  <MenuItem
                    key="logout"
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="/logout"
                    sx={{ my: 0.5 }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
  notifications: state.entities.session.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrentUser: (id) => dispatch(getCurrentUser(id)),
  addNotification: (data) => dispatch(addNotification(data)),
  loadNotifications: (id, params) => dispatch(loadNotifications(id, params)),
  readNotification: (id) => dispatch(readNotification(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
