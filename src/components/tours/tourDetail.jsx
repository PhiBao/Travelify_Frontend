import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Slider from "react-slick";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StyledRating from "../common/rating";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as Yup from "yup";
import Pagination from "@mui/material/Pagination";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Chip from "@mui/material/Chip";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Button from "@mui/material/Button";
import moment from "moment";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import Stack from "@mui/material/Stack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import { makeStyles } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import paginate from "../../utils/paginate";
import Loading from "../layout/loading";
import CheckoutForm from "../common/checkoutForm";
import Review from "../review/review";
import { vehicles as vh } from "../../helpers/tour_helper";
import {
  getTour,
  requestBookingTour,
  markTour,
  loadReviews,
} from "../../store/tours";
import { dateFormatter, state, timeFormatter } from "../../helpers/tour_helper";
import TourItem from "./tourItem";
import { getRecentlyWatched } from "../../services/tourService";
import { TextInputField, DatePickerField } from "../common/form";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const booking_schema = Yup.object().shape({
  departureDate: Yup.date()
    .min(new Date(), "Departure date must be later than today.")
    .required(),
  adults: Yup.number().min(1).required(),
  children: Yup.number().min(0).nullable(),
});

const guest_schema = Yup.object().shape({
  name: Yup.string().max(50),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9)
    .max(11),
  email: Yup.string().required().email(),
  note: Yup.string().max(500),
});

const useStyles = makeStyles((theme) => ({
  stack: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "start",
    [theme.breakpoints.down(900)]: {
      flexDirection: "column",
      "& .MuiPaper-root": {
        width: "100% !important",
        height: "730px !important",
      },
      "& img": {
        height: "400px !important",
      },
    },
    [theme.breakpoints.down(567)]: {
      "& .MuiPaper-root": {
        height: "630px !important",
      },
      "& img": {
        height: "300px !important",
      },
    },
  },
  sidebar: {
    backgroundColor: "#e6ee9c",
    borderRadius: "5px",
    padding: theme.spacing(1),
  },

  rating: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fffde7",
    padding: theme.spacing(1),
  },
}));

const settings = {
  autoplay: true,
  speed: 1500,
  autoplaySpeed: 3000,
  fade: true,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  pauseOnHover: true,
};

const modal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "100%", sm: 500 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TourDetail = (props) => {
  const location = useLocation();
  const classes = useStyles();
  const { id } = useParams();
  const {
    list,
    current: { self, related, recently },
    loading,
    currentUser,
    getTour,
    requestBookingTour,
    loadReviews,
  } = props;

  const [clientSecret, setClientSecret] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openCollapse, setOpenCollapse] = useState(false);
  const [dataRequest, setDataRequest] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState("");
  const [mark, setMark] = useState(false);
  const [page, setPage] = useState(1);

  const handleCloseModal = () => setOpenModal(false);
  const handleClosePayment = () => setOpenPayment(false);
  const handleClickOpenForm = () => {
    setOpenForm(true);
    setOpenModal(false);
  };
  const handleCloseForm = () => setOpenForm(false);
  const handleCloseAlert = () => setOpenAlert(false);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departureDate: moment().add(1, "days"),
      adults: 2,
      children: 0,
    },
    resolver: yupResolver(booking_schema),
  });

  const { control: control2, handleSubmit: handleSubmit2 } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      note: "",
    },
    resolver: yupResolver(guest_schema),
  });

  const {
    name,
    description,
    kind,
    details,
    price,
    departure,
    vehicles,
    tags,
    images,
    rate,
    marked,
    reviews,
    size,
  } = self;

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));
  const validTour =
    kind === "single" ||
    (moment(details?.beginDate) > moment() &&
      details?.limit > details?.quantity);
  const validPayment = currentUser?.activated && kind === "fixed" && validTour;

  useEffect(async () => {
    await getTour(id, getRecentlyWatched());
  }, [id]);

  useEffect(() => {
    if (kind === "fixed") setValue("departureDate", moment(details?.beginDate));
    setTotal(price * 2);
    setMark(marked);
    setDate(getValues("departureDate"));
  }, [details?.beginDate, price, marked]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handleClickPayButton = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    const data = {
      checkout: {
        ...dataRequest,
        tourId: id,
        userId: currentUser?.id,
        total: total,
      },
    };
    const res = await axios.post("/checkout", data);
    setClientSecret(res.data.clientSecret);
    setOpenPayment(true);
  };

  const onSubmit = (data, e) => {
    e.preventDefault();
    if (data.adults + data.children / 2 > details?.limit - details?.quantity) {
      setError("adults", {
        type: "manual",
        message: "There is not enough space left in this tour",
      });
      return;
    }
    setOpenModal(true);
    setDataRequest(data);
  };

  const onSubmitInfo = async (data, e) => {
    e.preventDefault();
    const submitData = {
      ...dataRequest,
      travellerAttributes: data,
      tourId: id,
      status: "confirming",
      total: total,
    };
    setOpenForm(false);
    await requestBookingTour({ booking: submitData });
    setDisabled(true);
  };

  const handleLoggedInRequest = async (e) => {
    e.preventDefault();
    if (currentUser.phoneNumber && currentUser.email) {
      const submitData = {
        ...dataRequest,
        user_id: currentUser.id,
        tourId: id,
        status: "confirming",
        total: total,
      };
      setOpenModal(false);
      await requestBookingTour({ booking: submitData });
      setDisabled(true);
    } else {
      setOpenModal(false);
      setOpenAlert(true);
    }
  };

  const handleMark = async (e) => {
    e.preventDefault();
    await axios.get(`/tours/${id}/mark`);
    setMark(!mark);
  };

  const handleNumChange = (e) => {
    if (e.target.name === "adults")
      setTotal(
        Math.round(
          (total + (e.target.value - getValues("adults")) * price) * 100.0
        ) / 100.0
      );
    else
      setTotal(
        Math.round(
          (total + (e.target.value - getValues("children")) * (price / 2)) *
            100.0
        ) / 100.0
      );
  };

  const handlePageChange = async (e, value) => {
    e.preventDefault();
    if (reviews.length < (value - 1) * 10 + 1)
      await loadReviews(id, { page: value });
    setPage(value);
  };

  return (
    <Container>
      <Grid
        container
        mt={10}
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="start"
        style={{ minHeight: "100vh" }}
      >
        {loading && <Loading />}
        <Grid item xs={12} sx={{ mb: 3 }}>
          <Typography variant="h3" component="div">
            {name}
          </Typography>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} md={8}>
            <Box>
              <Slider {...settings}>
                {images.map((image, index) => {
                  return (
                    <img
                      key={`image-${index}`}
                      src={image}
                      alt="description images"
                    />
                  );
                })}
              </Slider>
            </Box>
            <Box
              sx={{
                bgcolor: "#e0e0e0",
                padding: 1,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-around"
                alignItems="center"
                spacing={1}
              >
                <Box
                  component={Typography}
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
                  <Box
                    component="span"
                    sx={{ paddingLeft: "5px", fontWeight: "bold" }}
                  >
                    {departure}
                  </Box>
                </Box>
                <Box
                  sx={{
                    ml: 3,
                    display: "flex",
                    alignItems: "center",
                    overFlow: "hidden",
                  }}
                  component={Typography}
                  variant="h6"
                >
                  <Box component="span" mr={1}>
                    Vehicles:
                  </Box>{" "}
                  {vehicleIcons.map((vehicle) => vehicle.icon)}
                </Box>
                <Box
                  sx={{
                    ml: 3,
                    display: "flex",
                    alignItems: "center",
                    overFlow: "hidden",
                  }}
                  component="div"
                >
                  <Box component="span" sx={{ mr: 1, fontWeight: "bold" }}>
                    Kind:
                  </Box>
                  {kind === "fixed" ? (
                    <Tooltip title="Pre-determined schedule" placement="top">
                      <Chip
                        icon={<SyncDisabledIcon />}
                        label="Fixed tour"
                        variant="outlined"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title="Guest can pick specify departure date"
                      placement="top"
                    >
                      <Chip
                        icon={<EventAvailableIcon />}
                        label="Single tour"
                        variant="outlined"
                      />
                    </Tooltip>
                  )}
                </Box>
              </Stack>
            </Box>
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 2,
                lineHeight: 2,
                fontSize: "18px",
              }}
              component={Typography}
              variant="body1"
            >
              {description}
            </Box>
            <Box component={Paper}>
              <Typography ml={2} variant="h6" component="div">
                Departure Schedule
              </Typography>
              <TableContainer>
                <Table aria-label="departure schedule table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Begin date</TableCell>
                      <TableCell align="left">
                        {kind === "fixed" ? "Return date" : "Time"}
                      </TableCell>
                      <TableCell align="left">State</TableCell>
                      <TableCell align="left">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell align="left">
                        {kind === "fixed"
                          ? dateFormatter(details?.beginDate)
                          : dateFormatter(date)}
                      </TableCell>
                      <TableCell align="left">
                        {kind === "fixed"
                          ? dateFormatter(details?.returnDate)
                          : timeFormatter(details?.time)}
                      </TableCell>
                      <TableCell align="left">{state(kind, details)}</TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                        align="left"
                      >
                        <AttachMoneyIcon />
                        {price}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box className={classes.rating}>
              <Box>
                <Chip
                  sx={{ bgcolor: "#f4511e", fontWeight: 800, color: "#fff" }}
                  label={`${rate === 0 ? 7 : rate}/10.0`}
                />
              </Box>
              <Box mt={1} component={Typography} variant="body2">
                <StyledRating
                  name="customized-color"
                  value={rate === 0 ? 7 : rate}
                  getLabelText={(value) =>
                    `${value} Heart${value !== 1 ? "s" : ""}`
                  }
                  readOnly={true}
                  precision={0.5}
                  max={10}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
                />
              </Box>
              <Box
                component={IconButton}
                aria-label="mark"
                size="large"
                onClick={handleMark}
              >
                {mark ? (
                  <BookmarkRemoveIcon fontSize="inherit" />
                ) : (
                  <BookmarkAddIcon fontSize="inherit" />
                )}
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 2,
                fontStyle: "italic",
              }}
              component={Typography}
              variant="body2"
            >
              Tags:&nbsp;
              {tags.map((tag) => (
                <Chip
                  sx={{ cursor: "pointer" }}
                  key={tag}
                  variant="outlined"
                  label={tag}
                  component={Link}
                  to="/"
                ></Chip>
              ))}
            </Box>
            <Box
              sx={{
                bgcolor: "background.paper",
              }}
            >
              <Box pl={2} component={Typography} variant="h6">
                {size} Reviews{" "}
                <IconButton
                  aria-label="expand reviews"
                  size="small"
                  onClick={() => setOpenCollapse(!openCollapse)}
                >
                  {openCollapse ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                {paginate(reviews, page, 10).map((review) => (
                  <Review key={`review-${review.id}`} review={review} />
                ))}
                {Math.ceil(size / 10) > 1 && (
                  <Pagination
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                    count={Math.ceil(size / 10)}
                    page={page}
                    onChange={handlePageChange}
                  />
                )}
              </Collapse>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              component="form"
              id="bookingForm"
              autoComplete="off"
              className={classes.sidebar}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography
                variant="body2"
                component="div"
                sx={{ fontWeight: 600 }}
              >
                Booking now. Or calling (099) 900099{" "}
              </Typography>
              <DatePickerField
                control={control}
                name="departureDate"
                label="Departure date"
                disabled={kind === "fixed"}
                handleChange={(e) => setDate(e)}
                error={errors.departureDate}
              />
              <TextInputField
                control={control}
                type="number"
                name="adults"
                handleChange={handleNumChange}
                label={`Adults (x${price})`}
              />
              <TextInputField
                control={control}
                type="number"
                name="children"
                handleChange={handleNumChange}
                label={`Children (x${price / 2})`}
              />
              <Box component="div" sx={{ fontSize: 10, fontStyle: "italic" }}>
                *Persons under the age of twelve*
              </Box>
              <Box
                component={Typography}
                variant="h6"
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <AttachMoneyIcon />
                {total}
              </Box>
              <Box
                sx={{
                  mt: 2,
                }}
              >
                <Button
                  style={{ backgroundColor: "#ffa726" }}
                  disabled={validTour ? disabled : true}
                  fullWidth
                  type="submit"
                  variant="contained"
                >
                  {validTour ? "Request booking" : "Not available now!"}
                </Button>
              </Box>
            </Box>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modal}>
                {currentUser.id === 0 ? (
                  <Box>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      We need your information!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Please{" "}
                      <Box
                        sx={{ fontWeight: 600, fontStyle: "italic" }}
                        component={Link}
                        to="/login"
                        state={{
                          from: location,
                        }}
                      >
                        login
                      </Box>
                      . If you are new here, you can{" "}
                      <Box
                        sx={{ fontWeight: 600, fontStyle: "italic" }}
                        component={Link}
                        to="/register"
                        state={{
                          from: location,
                        }}
                      >
                        register
                      </Box>
                      . Or you can provider{" "}
                      <Button variant="text" onClick={handleClickOpenForm}>
                        your information
                      </Button>
                      .
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      We need your information!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      If you want us to contact you with your account
                      information. Please click
                      <Button
                        sx={{ marginBottom: "1px" }}
                        variant="text"
                        onClick={handleLoggedInRequest}
                      >
                        here
                      </Button>
                      <br /> Or you can provide
                      <Button variant="text" onClick={handleClickOpenForm}>
                        other information
                      </Button>
                      <br />
                      {validPayment && (
                        <Box component="span">
                          If you satisfied with this tour. You can{" "}
                          <Button onClick={handleClickPayButton}>Pay</Button>{" "}
                          for it.
                        </Box>
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Modal>
            <Dialog open={openForm} onClose={handleCloseForm}>
              <Box
                id="guestForm"
                component="form"
                onSubmit={handleSubmit2(onSubmitInfo)}
                autoComplete="off"
              >
                <DialogTitle>Request booking Tour</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please type your information below. Travelify will contact
                    you after a few minutes
                  </DialogContentText>

                  <TextInputField control={control2} name="name" label="Name" />
                  <TextInputField
                    control={control2}
                    name="phoneNumber"
                    label="Phone number"
                  />
                  <TextInputField
                    control={control2}
                    name="email"
                    label="Email"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseForm}>Cancel</Button>
                  <Button type="submit">Send request</Button>
                </DialogActions>
              </Box>
            </Dialog>
            <Dialog
              open={openAlert}
              onClose={handleCloseAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Your account doesn't have enough information
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  We need your phone number and email address. Please add those
                  fields!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAlert}>Cancel</Button>
                <Button component={Link} to="/settings" autoFocus>
                  Go to settings page
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={openPayment} onClose={handleClosePayment}>
              <DialogContent>
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box mt={3} component={Paper}>
          <Typography
            sx={{ mb: 2, pl: 2, bgcolor: "action.hover" }}
            variant="h6"
            component="div"
          >
            Related tours
          </Typography>
          <Box className={classes.stack}>
            {list
              .filter((item) => related.includes(item.id))
              .map((tour) => {
                return (
                  <TourItem key={tour.id} item={tour} markTour={markTour} />
                );
              })}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box mt={3} component={Paper}>
          <Typography
            sx={{ mb: 2, pl: 2, bgcolor: "action.hover" }}
            variant="h6"
            component="div"
          >
            You have watched tours recently
          </Typography>
          <Box className={classes.stack}>
            {list
              .filter((item) => recently.includes(item.id))
              .map((tour) => {
                return <TourItem key={tour.id} item={tour} />;
              })}
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  list: state.entities.tours.list,
  current: state.entities.tours.current,
  loading: state.entities.tours.loading,
  currentUser: state.entities.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  getTour: (id, data) => dispatch(getTour(id, data)),
  requestBookingTour: (data) => dispatch(requestBookingTour(data)),
  loadReviews: (id, params) => dispatch(loadReviews(id, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourDetail);
