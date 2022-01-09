import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import TimelineIcon from "@mui/icons-material/Timeline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TourIcon from "@mui/icons-material/Tour";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import StyleIcon from "@mui/icons-material/Style";
import ReportIcon from "@mui/icons-material/Report";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "sticky",
    top: 0,
    display: {
      xs: "none",
      sm: "flex",
    },
  },
}));

const SideBar = () => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper} elevation={3}>
      <Toolbar />
      <Divider />
      <List
        component="nav"
        aria-labelledby="dashboard-list"
        subheader={
          <ListSubheader component="div" id="dashboard-list">
            Dashboard
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <LineStyleIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Analytics" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Revenues" />
        </ListItemButton>
      </List>
      <Divider />
      <List
        component="nav"
        aria-labelledby="quick-list"
        subheader={
          <ListSubheader component="div" id="quick-list">
            Quick menu
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <PersonOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton component={Link} to="tours/new">
          <ListItemIcon>
            <TourIcon />
          </ListItemIcon>
          <ListItemText primary="Tours" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <StyleIcon />
          </ListItemIcon>
          <ListItemText primary="Tags" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary="Statistics" />
        </ListItemButton>
      </List>
      <Divider />
      <List
        component="nav"
        aria-labelledby="notifications-list"
        subheader={
          <ListSubheader component="div" id="notifications-list">
            Notifications
          </ListSubheader>
        }
      >
        <ListItemButton>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default SideBar;
