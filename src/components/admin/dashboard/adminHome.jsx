import { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { makeStyles } from "@mui/styles";
import { arrow, state, percent } from "../../../helpers/dashboardHelper";
import { loadDashboard } from "../../../store/admin";
import SimpleLineChart from "../charts/simpleLineChart";
import { dateFormatter } from "../../../helpers/timeHelper";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#fff",
    flex: 1,
    boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
    borderRadius: "15px",
    padding: theme.spacing(3),
    margin: "0 20px",
  },
  data: {
    marginLeft: theme.spacing(2),
    display: "flex",
    alignItems: "center",
  },
}));

const AdminHome = (props) => {
  useDocumentTitle("Admin - Home");
  const classes = useStyles();
  const { data, loadDashboard } = props;

  const {
    curRevenues,
    lastRevenues,
    lastReviews,
    curReviews,
    lastComments,
    curComments,
    curLikes,
    lastLikes,
    users = [],
    list = [],
    lastBookings = [],
  } = data;

  const item = (label, sum, icon, arrow, percent) => (
    <Box className={classes.item}>
      <Typography
        sx={{ fontSize: "20px", color: "#9e9e9e" }}
        variant="subtitle1"
        component="div"
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="span">
          {sum} {icon}
        </Typography>
        <Box className={classes.data} component="span">
          {arrow} {percent}
        </Box>
      </Box>
      <Typography
        sx={{ fontSize: "18px", color: "#757575" }}
        variant="subtitle1"
        component="div"
      >
        Compared to last month
      </Typography>
    </Box>
  );

  useEffect(async () => {
    await loadDashboard();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box className={classes.wrapper}>
        {item(
          "Revenues",
          curRevenues,
          <AttachMoneyIcon />,
          arrow(curRevenues, lastRevenues),
          percent(curRevenues, lastRevenues)
        )}
        {item(
          "Reviews",
          curReviews,
          <RateReviewIcon color="primary" />,
          arrow(curReviews, lastReviews),
          percent(curReviews, lastReviews)
        )}
        {item(
          "Comments",
          curComments,
          <ChatBubbleIcon />,
          arrow(curComments, lastComments),
          percent(curComments, lastComments)
        )}
        {item(
          "Likes",
          curLikes,
          <ThumbUpIcon color="primary" />,
          arrow(curLikes, lastLikes),
          percent(curLikes, lastLikes)
        )}
      </Box>
      <Box sx={{ width: "100%" }}>
        <SimpleLineChart
          title="User Analytics"
          data={users}
          grid
          name="New members"
        />
      </Box>
      <Box sx={{ display: "flex", width: "100%", m: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
            mr: 1,
            p: 3,
            flex: 1,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography mb={2} component="h3" variant="h4">
            New Join Members
          </Typography>
          {list.map((user) => (
            <Box
              key={user.id}
              sx={{
                display: "flex",
                alginItems: "center",
                mb: 1,
                p: 1,
              }}
            >
              <Box>
                <Avatar
                  alt={user.username}
                  src={
                    user.avatarUrl ||
                    `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                  }
                />
              </Box>
              <Box
                sx={{
                  px: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  flex: 2,
                }}
              >
                <Typography variant="subtitle2" component="div">
                  {user.username}
                </Typography>
                <Typography
                  sx={{ color: "#757575" }}
                  variant="subtitle1"
                  component="div"
                >
                  {user.email}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  component={Link}
                  to={`users/${user.id}`}
                >
                  Display
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            bgcolor: "background.paper",
            mr: 3,
            ml: 1,
            flex: 2,
            p: 3,
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography mb={2} component="h3" variant="h4">
            Last transactions
          </Typography>
          <TableContainer>
            <Table aria-label="last transactions table">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell align="left">Customer</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Total</TableCell>
                  <TableCell align="left">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lastBookings.map((booking) => (
                  <TableRow key={booking.customer.id}>
                    <TableCell align="left">
                      <Box
                        sx={{
                          display: "flex",
                          alginItems: "center",
                        }}
                      >
                        <Avatar
                          alt={booking.customer.username}
                          src={
                            booking.customer.avatarUrl ||
                            `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                          }
                        />
                        <Typography
                          sx={{ pl: 1, pt: 1 }}
                          variant="subtitle2"
                          component="div"
                        >
                          {booking.customer.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      {dateFormatter(booking.createdAt)}
                    </TableCell>
                    <TableCell align="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <AttachMoneyIcon />
                        {booking.total}
                      </Box>
                    </TableCell>
                    <TableCell align="left">{state(booking.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadDashboard: () => dispatch(loadDashboard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);
