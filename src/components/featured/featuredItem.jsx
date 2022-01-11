import Box from "@mui/material/Box";
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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useDispatch } from "react-redux";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import StyledRating from "../common/rating";
import { Link, useNavigate } from "react-router-dom";
import { vehicles as vh } from "../../helpers/tourHelper";
import { timeSentence } from "../../helpers/timeHelper";
import { markTour } from "../../store/home";

const useStyles = makeStyles((theme) => ({
  featured: {
    height: "90vh",
    position: "relative",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    boxShadow: "0 10px 8px #bdbdbd",
  },
  card: {
    position: "absolute",
    bottom: 100,
    left: 100,
    width: 500,
    opacity: 0.8,
    [theme.breakpoints.down("sm")]: {
      left: 20,
      width: "auto",
      bottom: 50,
    },
  },
  price: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
}));

const FeaturedItem = ({ tour }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    id,
    name,
    kind,
    details,
    price,
    departure,
    vehicles,
    tags,
    images,
    rate,
    marked,
  } = tour;

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));

  const handleMark = async (e) => {
    e.preventDefault();
    await dispatch(markTour(id));
  };

  return (
    <Box className={classes.featured}>
      <img className={classes.img} src={images?.[0]} alt="featured images" />
      <Card className={classes.card}>
        <CardHeader
          sx={{
            "& .css-et1ao3-MuiTypography-root": {
              fontWeight: 500,
              fontSize: "1rem",
            },
            display: "flex",
            justifyContent: "flex-start",
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
            <IconButton aria-label="mark" size="large" onClick={handleMark}>
              {marked ? (
                <BookmarkRemoveIcon fontSize="inherit" />
              ) : (
                <BookmarkAddIcon fontSize="inherit" />
              )}
            </IconButton>
          }
          title={<Link to={`/tours/${id ? id : ""}`}>{name}</Link>}
          subheader={timeSentence(kind, details)}
        />
        <CardContent>
          <Typography
            sx={{ fontSize: 18, display: "flex", alignItems: "center" }}
            color="text.secondary"
            gutterBottom
          >
            <LocationOnIcon sx={{ pr: 1 }} />
            <Box
              component="span"
              sx={{ paddingLeft: "5px", fontWeight: "bold" }}
            >
              {departure}
            </Box>
          </Typography>
          <Stack direction="column" gap={1} sx={{ mt: 1 }}>
            <ButtonGroup disableElevation variant="contained">
              {tags.map((tag) => (
                <Button
                  key={tag.value}
                  variant="outlined"
                  onClick={() => navigate(`/tours?type=tags&uid=${tag.value}`)}
                  sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  {tag.label}
                </Button>
              ))}
            </ButtonGroup>
          </Stack>
          <Stack direction="row" gap={1} sx={{ my: 1 }}>
            {vehicleIcons.map((vehicle) => vehicle.icon)}
          </Stack>
          <Typography variant="body2">
            <StyledRating
              name="customized-color"
              value={rate === 0 ? 7 : rate}
              readOnly={true}
              getLabelText={(value) =>
                `${value} Heart${value !== 1 ? "s" : ""}`
              }
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
          <Button onClick={() => navigate(`/tours/${id}`)} size="small">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FeaturedItem;
