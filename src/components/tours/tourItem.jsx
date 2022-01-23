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
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ButtonGroup from "@mui/material/ButtonGroup";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Tooltip from "@mui/material/Tooltip";
import { Link, useNavigate } from "react-router-dom";
import StyledRating from "../common/rating";
import { vehicles as vh, departureFormatter } from "../../helpers/tourHelper";
import CardMedia from "@mui/material/CardMedia";
import { timeSentence } from "../../helpers/timeHelper";

const useStyles = makeStyles((theme) => ({
  card: {
    height: 600,
    [theme.breakpoints.down("701")]: {
      height: 650,
    },
  },
  img: {
    height: 250,
    [theme.breakpoints.down("701")]: {
      height: 300,
    },
  },
  price: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
}));

const TourItem = ({ item, markTour }) => {
  const classes = useStyles();
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
  } = item;

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));

  const handleMark = async (e) => {
    e.preventDefault();
    await markTour(id);
  };

  return (
    <Card className={classes.card} sx={{ mr: 2 }}>
      <CardHeader
        sx={{
          "& .css-et1ao3-MuiTypography-root": {
            fontWeight: 500,
            fontSize: "14px",
          },
          "& .MuiCardHeader-title": {
            lineHeight: "1.5em",
            height: "3em",
            overflow: "hidden",
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
          <IconButton aria-label="mark" size="large" onClick={handleMark}>
            {marked ? (
              <BookmarkRemoveIcon fontSize="inherit" />
            ) : (
              <BookmarkAddIcon fontSize="inherit" />
            )}
          </IconButton>
        }
        title={<Link to={`/tours/${id}`}>{name}</Link>}
        subheader={
          <Typography noWrap>{timeSentence(kind, details)}</Typography>
        }
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
          <LocationOnIcon sx={{ pr: 1 }} />
          <Box component="span" sx={{ paddingLeft: "5px", fontWeight: "bold" }}>
            {departureFormatter(departure)?.label}
          </Box>
        </Typography>
        <Stack direction="column" gap={1} sx={{ mt: 1 }}>
          <ButtonGroup disableElevation variant="contained">
            {tags.map((tag) => (
              <Button
                onClick={() => navigate(`/tours?type=tags&uid=${tag.id}`)}
                key={tag.id}
                variant="outlined"
                sx={{ fontSize: { xs: "10px", sm: "12px" } }}
                startIcon={<CheckCircleOutlineIcon />}
              >
                {tag.name}
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
            getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
            precision={0.5}
            max={10}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
          />
        </Typography>
        <Typography variant="h6" component="div" className={classes.price}>
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
  );
};

export default TourItem;
