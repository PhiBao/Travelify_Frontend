import { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeStyles } from "@material-ui/core";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTour, loadHelpers } from "../../store/tours";
import {
  TextInputField,
  Select,
  DateTimePickerField,
  Creatable,
} from "../common/form";
import { cities, kinds } from "../../helpers/tour_helper";
import Loading from "../layout/loading";

const schema = Yup.object().shape({
  name: Yup.string().max(255).required(),
  description: Yup.string().max(500).nullable(),
  price: Yup.number()
    .typeError("Must specify a number")
    .required()
    .positive()
    .integer(),
  kind: Yup.object().nullable().required("Kind is a required field"),
  limit: Yup.number().when("kind.value", {
    is: "fixed",
    then: Yup.number()
      .typeError("Must specify a number")
      .required("Fixed tour must has a limit")
      .positive()
      .integer(),
    otherwise: Yup.number().typeError("Must specify a number").nullable(),
  }),
  beginDate: Yup.date().when("kind.value", {
    is: "fixed",
    then: Yup.date().required("Fixed tour must has departure date"),
    otherwise: Yup.date().nullable(),
  }),
  returnDate: Yup.date().when("kind.value", {
    is: "fixed",
    then: Yup.date().required("Fixed tour must has terminal date"),
    otherwise: Yup.date().nullable(),
  }),
  time: Yup.string().when("kind.value", {
    is: "single",
    then: Yup.string()
      .required("Single tour must has a time")
      .matches(
        /\d+-\d+/,
        "Time has format: {Number of days}-{Numbers of nights}"
      ),
    otherwise: Yup.string().nullable(),
  }),
  images: Yup.mixed()
    .required()
    .test("fileSize", "The file is too large", (value) => {
      for (let i = 0; i < value.length; i++) {
        if (value[i] > 5242880) return false;
      }
      return true;
    })
    .test("type", "We support png, jpg, gif file", (value) => {
      for (let i = 0; i < value.length; i++) {
        if (!["image/png", "image/jpeg", "image/gif"].includes(value[i].type))
          return false;
      }
      return true;
    }),
  departure: Yup.object().nullable().required(),
  vehicles: Yup.array().min(1, "The tour must have at least one vehicle"),
  tags: Yup.array().max(4).nullable(),
});

const useStyles = makeStyles((theme) => ({
  images: {
    position: "relative",
  },
  upload: {
    position: "absolute",
    right: -25,
    bottom: -25,
  },
  fileInput: {
    display: "none",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px !important",
    padding: theme.spacing(3),
    maxWidth: "md",
  },
}));

export const TourForm = (props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      departure: "",
      kind: "",
      vehicles: [],
      beginDate: null,
      returnDate: null,
      price: 0,
      limit: 0,
      description: "",
      name: "",
      time: "",
      images: [],
      tags: [],
    },
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const classes = useStyles();
  const { loading, vehicles, tags, createTour, loadHelpers } = props;
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [kind, setKind] = useState("");

  useEffect(async () => {
    await loadHelpers();
  }, []);

  const handleKindChange = (e) => {
    switch (e.value) {
      case "fixed":
        resetField("time");
        break;
      case "single":
        resetField("beginDate");
        resetField("returnDate");
        resetField("limit");
        break;
      default:
        return;
    }
    clearErrors();
    setKind(e.value);
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let newImages = [];
    const length = e.target?.files?.length;
    for (let i = 0; i < length; i++) {
      newImages.push(URL.createObjectURL(e.target.files[i]));
    }

    if (newImages.length > 0) {
      setImages(newImages);
    }
  };

  const onSubmit = async (tour, e) => {
    e.preventDefault();
    if (tour.kind.value === "fixed") {
      const time = moment(tour.returnDate).diff(
        moment(tour.beginDate),
        "hours"
      );
      if (time < 6) {
        setError("returnDate", {
          type: "manual",
          message:
            "Terminal date must be after at least six hours departure date",
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", tour.name);
    formData.append("description", tour.description);
    formData.append("kind", tour.kind.value);
    formData.append("departure", tour.departure.value);
    if (tour.kind.value === "fixed") {
      formData.append("limit", tour.limit);
      formData.append("begin_date", tour.beginDate);
      formData.append("return_date", tour.returnDate);
    }
    if (tour.kind.value === "single") formData.append("time", tour.time);
    formData.append("price", tour.price);
    for (let i = 0; i < tour.images.length; i++) {
      formData.append("images[]", tour.images[i]);
    }
    const tVA = tour.vehicles.map((item) => ({ vehicle_id: item.value }));
    formData.append("vehicles", JSON.stringify(tVA));
    const tTA = tour.tags.map((item) => {
      if (item.__isNew__) return { tag_attributes: { name: item.value } };
      else return { tag_id: item.value };
    });
    formData.append("tags", JSON.stringify(tTA));

    await createTour(formData);
    navigate("/tours");
  };

  const imagesField = register("images");

  return (
    <Box
      my={10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      {loading && <Loading />}
      <Card className={classes.card}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h3" gutterBottom component="div" mt={5}>
            Create a tour
          </Typography>
        </Box>
        <Box
          component="form"
          autoComplete="off"
          p={2}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box className={classes.images}>
            {images.length === 0 ? (
              <Typography
                sx={{ display: { xs: "none", sm: "inline" } }}
                variant="body2"
                component="div"
              >
                Images will be displayed here
              </Typography>
            ) : (
              <ImageList sx={{ maxWidth: 800, maxHeight: 450 }} cols={3}>
                {images.map((item, index) => (
                  <ImageListItem key={item}>
                    <img
                      src={item}
                      srcSet={item}
                      alt={`images-${index}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            <Box className={classes.upload}>
              <label htmlFor="icon-button-file">
                <input
                  {...imagesField}
                  onChange={(e) => {
                    imagesField.onChange(e);
                    handleImageChange(e);
                  }}
                  className={classes.fileInput}
                  multiple
                  id="icon-button-file"
                  type="file"
                  name="images"
                  accept=".jpg, .gif, .png"
                />
                <IconButton
                  color="primary"
                  aria-label="upload avatar"
                  component="span"
                >
                  <PhotoCamera sx={{ width: 64, height: 64 }} />
                </IconButton>
              </label>
            </Box>
          </Box>
          <TextInputField control={control} name="name" label="Name" />
          <TextInputField
            control={control}
            name="description"
            label="Description"
          />
          <Select
            control={control}
            name="kind"
            label="Kind"
            options={kinds}
            placeholder="Select a kind of this tour"
            handleChange={handleKindChange}
            error={errors.kind}
          />
          <Select
            control={control}
            name="departure"
            label="Departure"
            options={cities}
            placeholder="Select a departure of this tour"
            error={errors.departure}
          />
          {kind === "fixed" && (
            <>
              <TextInputField
                control={control}
                name="limit"
                label="Limit"
                type="number"
              />
              <DateTimePickerField
                control={control}
                name="beginDate"
                label="Begin date"
                error={errors.beginDate}
              />
              <DateTimePickerField
                control={control}
                name="returnDate"
                label="Return date"
                error={errors.returnDate}
              />
            </>
          )}
          {kind === "single" && (
            <TextInputField control={control} name="time" label="Time" />
          )}
          <TextInputField
            control={control}
            name="price"
            label="Price"
            type="number"
          />
          <Select
            control={control}
            name="vehicles"
            label="Vehicles"
            options={vehicles}
            placeholder="Select vehicles of this tour"
            error={errors.vehicles}
            isMulti={true}
            isClearable={true}
          />
          <Creatable
            control={control}
            name="tags"
            label="Tags"
            options={tags}
            placeholder="Select tags of this tour"
            error={errors.tags}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 2,
            }}
            fullWidth
            type="submit"
            style={{
              backgroundColor: "#26c6da",
              color: "#212121",
              fontWeight: 700,
            }}
            variant="contained"
            component={Button}
          >
            Create
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.tours.loading,
  vehicles: state.entities.tours.vehicles,
  tags: state.entities.tours.tags,
});

const mapDispatchToProps = (dispatch) => ({
  loadHelpers: () => dispatch(loadHelpers),
  createTour: (data) => dispatch(createTour(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourForm);
