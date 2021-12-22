import { useState } from "react";
import { connect } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Container from "@mui/material/Container";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { settings } from "../../helpers/navbar_helper";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.info.main, 0.55),
  "&:hover": {
    backgroundColor: alpha(theme.palette.info.main, 0.75),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
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
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const isNavOpen = Boolean(anchorElNav);
  const isUserOpen = Boolean(anchorElUser);
  const { currentUser } = props;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
            <Link to="/">Travelify</Link>
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
                key="tours"
                onClick={handleCloseNavMenu}
                component={Link}
                to="/tours"
              >
                <Typography textAlign="center">Tours</Typography>
              </MenuItem>
              {currentUser.id === 0 && (
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
              key="tours"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Tours
            </Button>
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
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {currentUser.id === 0 ? (
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
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{ display: { xs: "none", sm: "inline" } }}
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon sx={{ color: "black" }} />
                  </Badge>
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      src={
                        currentUser.avatar?.url ||
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
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.label}
                      onClick={handleCloseNavMenu}
                      component={Link}
                      to={setting.route}
                      sx={{ my: 0.5 }}
                    >
                      <ListItemIcon>{setting.icon}</ListItemIcon>
                      <ListItemText primary={setting.label} />
                    </MenuItem>
                  ))}
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
});

export default connect(mapStateToProps, null)(NavBar);
