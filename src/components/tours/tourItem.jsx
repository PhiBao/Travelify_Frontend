import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red, blue } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { makeStyles } from "@material-ui/core";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import StyledRating from "../common/rating";
import { vehicles as vh } from "../../helpers/tour_helper";
import CardMedia from "@mui/material/CardMedia";
import { timeSentence } from "../../helpers/tour_helper";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 600,
    [theme.breakpoints.down("768")]: {
      height: 700,
    },
    [theme.breakpoints.down("465")]: {
      height: 600,
    },
  },
  img: {
    height: 280,
    [theme.breakpoints.down("1281")]: {
      height: 250,
    },
    [theme.breakpoints.down("768")]: {
      height: 330,
    },
    [theme.breakpoints.down("466")]: {
      height: 220,
    },
  },
  price: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
}));

const TourItem = ({ item }) => {
  const classes = useStyles();
  const { id, name, kind, details, price, departure, vehicles, tags, images } =
    item;

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));

  return (
    <Card className={classes.card} sx={{ mr: 2 }}>
      <CardHeader
        sx={{
          "& .css-et1ao3-MuiTypography-root": {
            fontWeight: 500,
            fontSize: "1rem",
          },
        }}
        avatar={
          <Tooltip
            title={kind === "fixed" ? "Fixed tour" : "Single tour"}
            placement="top"
          >
            <Avatar
              sx={{ bgcolor: kind === "fixed" ? red[500] : blue[500] }}
              aria-label="recipe"
            >
              {kind === "fixed" ? "F" : "S"}
            </Avatar>
          </Tooltip>
        }
        action={
          <IconButton aria-label="settings">
            <BookmarkAddIcon />
          </IconButton>
        }
        title={<Link to={`/tours/${id}`}>{name}</Link>}
        subheader={timeSentence(kind, details)}
      />
      <CardMedia
        component="img"
        className={classes.img}
        image={images?.[0]}
        alt="Tour image"
      />
      <CardContent>
        <Typography
          sx={{
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            overFlow: "hidden",
          }}
          color="text.secondary"
          gutterBottom
        >
          <TripOriginIcon sx={{ pr: 1 }} />{" "}
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Departure from
          </Box>
          <span style={{ paddingLeft: "5px", fontWeight: "bold" }}>
            {departure}
          </span>
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
        <Typography variant="h6" className={classes.price}>
          <AttachMoneyIcon />
          {price}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
};

export default TourItem;
