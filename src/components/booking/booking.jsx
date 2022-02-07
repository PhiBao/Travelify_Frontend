import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  shortDateFormatter,
  noTimeFormatter,
  reviewStatus,
} from "../../helpers/timeHelper";
import Rate from "./rate";
import { createReview } from "../../store/session";

const Booking = ({ booking }) => {
  const dispatch = useDispatch();
  const {
    id,
    total,
    tourImage,
    tourName,
    tourId,
    adults,
    children,
    departureDate,
    createdAt,
    status,
    review,
  } = booking;

  const [openRate, setOpenRate] = useState(false);
  const handleOpenRate = () => {
    setOpenRate(true);
  };
  const handleCloseRate = () => {
    setOpenRate(false);
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await dispatch(createReview(id, data));
    setOpenRate(false);
  };

  const rateable = reviewStatus(departureDate, status, review);
  return (
    <Card
      sx={{
        display: "flex",
        my: 1,
        position: "relative",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 150 }}
        image={tourImage}
        alt="Live from space album cover"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Box sx={{ lineHeight: "1.5em", height: "3em", overflow: "hidden" }}>
            <Typography
              component={Link}
              to={`/tours/${tourId}`}
              variant="div"
              sx={{ fontSize: "16px", fontWeight: 500 }}
            >
              {tourName}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "14px" }} component="div" variant="body2">
            {`${adults} Adults - ${children} Children`}
          </Typography>
          <Typography sx={{ fontSize: "14px" }} component="div" variant="body2">
            {`Booked at:  ${shortDateFormatter(createdAt)}`}
          </Typography>
        </CardContent>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
          bgcolor: "action.hover",
        }}
      >
        <Typography
          sx={{ fontSize: "14px" }}
          component="div"
          variant="body2"
          noWrap
        >
          {`Depart: ${
            status === "paid"
              ? shortDateFormatter(departureDate)
              : noTimeFormatter(departureDate)
          }`}
        </Typography>
        <Typography
          sx={{ display: "flex", justifyContent: "center" }}
          variant="subtitle1"
          component="div"
        >
          <AttachMoneyIcon sx={{ mr: -1 }} />
          {total}
        </Typography>
      </Box>
      <Button
        sx={{ fontSize: "10px", position: "absolute", top: 0, right: 0 }}
        variant="contained"
        disabled={rateable === "Can't rate"}
        size="small"
        color="secondary"
        onClick={handleOpenRate}
      >
        {rateable}
      </Button>
      <Rate
        review={review}
        open={openRate}
        handleClose={handleCloseRate}
        onSubmit={onSubmit}
      />
    </Card>
  );
};

export default Booking;
