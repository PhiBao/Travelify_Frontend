import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StyledRating from "../common/rating";
import { vehicles as vh } from "../../helpers/tour_helper";
import CardMedia from "@mui/material/CardMedia";

const useStyles = makeStyles((theme) => ({
  img: {
    width: "100%",
    height: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "auto",
    },
  },
  card: {
    width: 500,
    [theme.breakpoints.down(1430)]: {
      width: 600,
    },
    [theme.breakpoints.down(1110)]: {
      width: 420,
    },
    [theme.breakpoints.down(960)]: {
      width: "auto",
    },
  },
}));

const TourItem = () => {
  const classes = useStyles();

  const tags = ["Romantics", "Discover", "Relax", "Selfie"];
  const vehicles = ["boat", "airplane"];

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));

  return (
    <Card className={classes.card}>
      <CardHeader
        sx={{
          "& .css-et1ao3-MuiTypography-root": {
            fontWeight: 500,
            fontSize: "1rem",
          },
        }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            F
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <BookmarkAddIcon />
          </IconButton>
        }
        title="Tour Hà Nội - Quảng Ning - Đà Nẵng"
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        className={classes.img}
        image={`${process.env.PUBLIC_URL}/assets/images/夏夜の晨曦.jpg`}
        alt="Paella dish"
      />
      <CardContent>
        <Typography
          sx={{ fontSize: 18, display: "flex", alignItems: "center" }}
          color="text.secondary"
          gutterBottom
        >
          <TripOriginIcon sx={{ pr: 1 }} /> Departure from
          <b style={{ paddingLeft: "5px" }}>Tp. Hồ Chí Minh</b>
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={1} sx={{ mt: 1 }}>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant="outlined"
              startIcon={<CheckCircleOutlineIcon />}
            >
              {tag}
            </Button>
          ))}
        </Stack>
        <Stack direction="row" gap={1} sx={{ my: 1 }}>
          {vehicleIcons.map((vehicle) => vehicle.icon)}
        </Stack>
        <Typography variant="body2">
          <StyledRating
            name="customized-color"
            defaultValue={2}
            getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
            precision={0.5}
            max={10}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
          />
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default TourItem;
