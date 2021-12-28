import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Carousel } from "react-responsive-carousel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Chip from "@mui/material/Chip";
import moment from "moment";
import Stack from "@mui/material/Stack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Loading from "../layout/loading";
import { vehicles as vh } from "../../helpers/tour_helper";
import { getTour } from "../../store/tours";
import { dateFormatter, state } from "../../helpers/tour_helper";
import TourItem from "./tourItem";
import { getRecentlyWatched } from "../../services/tourService";
import { TextInputField, FormButton, DatePickerField } from "../common/form";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const schema = Yup.object().shape({
  departureDate: Yup.date()
    .min(new Date(), "Departure date must be later than today.")
    .required(),
  adults: Yup.number().min(1).required(),
  children: Yup.number().min(0).nullable(),
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
}));

const TourDetail = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const {
    current: { self, related, recently },
    loading,
    getTour,
  } = props;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      departureDate: moment().add(1, "days"),
      adults: 2,
      children: 0,
    },
    resolver: yupResolver(schema),
  });

  const {
    name,
    description,
    kind,
    details,
    price,
    departure,
    vehicles = [],
    tags = [],
    images = [],
  } = self || {};

  const vehicleIcons = vh.filter((icon) => vehicles.includes(icon.key));
  const [total, setTotal] = useState(0);

  useEffect(async () => {
    await getTour(id, getRecentlyWatched());
  }, [id]);

  useEffect(() => {
    if (kind === "fixed") setValue("departureDate", moment(details?.beginDate));
    setTotal(price * 2);
  }, [details?.beginDate, price]);

  const onSubmit = (data, e) => {
    e.preventDefault();
    console.log(data);
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
              <Carousel>
                {images.map((image, index) => {
                  return (
                    <img
                      key={`image-${index}`}
                      src={image}
                      alt="description images"
                    />
                  );
                })}
              </Carousel>
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
                      <TableCell align="left">Return date</TableCell>
                      <TableCell align="left">State</TableCell>
                      <TableCell align="left">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell align="left">
                        {dateFormatter(details?.beginDate)}
                      </TableCell>
                      <TableCell align="left">
                        {dateFormatter(details?.returnDate)}
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
            <Box
              sx={{
                bgcolor: "background.paper",
                pl: 2,
                pt: 3,
                pb: 1,
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
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              component="form"
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
                {kind === "fixed" && moment(details?.beginDate) < moment() ? (
                  <FormButton
                    style={{ backgroundColor: "#ffa726" }}
                    label="This tour is invalid now!"
                    disabled={true}
                    fullWidth
                  />
                ) : (
                  <FormButton
                    style={{ backgroundColor: "#ffa726" }}
                    label="Request booking"
                    fullWidth
                  />
                )}
              </Box>
            </Box>
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
            {related.map((tour) => {
              return <TourItem key={tour.id} item={tour} />;
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
            {recently.map((tour) => {
              return <TourItem key={tour.id} item={tour} />;
            })}
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  current: state.entities.tours.current,
  loading: state.entities.tours.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getTour: (id, data) => dispatch(getTour(id, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourDetail);
