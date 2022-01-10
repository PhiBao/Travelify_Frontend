import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { makeStyles } from "@material-ui/core";
import { arrow } from "../../../helpers/dashboardHelper";

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

const FeaturedInfo = ({ data }) => {
  const {
    curRevenues,
    lastRevenues,
    lastReviews,
    curReviews,
    lastComments,
    curComments,
    curLikes,
    lastLikes,
  } = data;
  const classes = useStyles();

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

  return (
    <Box className={classes.wrapper}>
      {item(
        "Revenues",
        curRevenues,
        <AttachMoneyIcon />,
        arrow(curRevenues, lastRevenues),
        Math.abs(curRevenues / lastRevenues).toFixed(2)
      )}
      {item(
        "Reviews",
        curReviews,
        <RateReviewIcon color="primary" />,
        arrow(curReviews, lastReviews),
        Math.abs(curReviews / lastReviews).toFixed(2)
      )}
      {item(
        "Comments",
        curComments,
        <ChatBubbleIcon />,
        arrow(curComments, lastComments),
        Math.abs(curComments / lastComments).toFixed(2)
      )}
      {item(
        "Likes",
        curLikes,
        <ThumbUpIcon />,
        arrow(curLikes, lastLikes),
        Math.abs(curLikes / lastLikes).toFixed(2)
      )}
    </Box>
  );
};

export default FeaturedInfo;
