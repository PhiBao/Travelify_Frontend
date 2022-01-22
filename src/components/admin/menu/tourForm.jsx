import { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { makeStyles } from "@mui/styles";
import _ from "lodash";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTour, updateTour, getTour } from "../../../store/admin";
import {
  TextInputField,
  Select,
  DateTimePickerField,
  Creatable,
  RichText,
} from "../../common/form";
import { DEFAULT_DATE } from "../../../helpers/timeHelper";
import { toDataURL, dataURLtoFile } from "../../../helpers/dashboardHelper";
import {
  cities,
  kinds,
  kindFormatter,
  departureFormatter,
} from "../../../helpers/tourHelper";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const schema = Yup.object().shape({
  name: Yup.string().max(255).required(),
  description: Yup.mixed().nullable(),
  price: Yup.number().typeError("Must specify a number").required().positive(),
  kind: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
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
    })
    .test(
      "length",
      "The tour has at least one images and max nine images",
      (value) => {
        return value.length >= 1;
      }
    ),
  departure: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
  vehicles: Yup.array().min(1, "The tour must have at least one vehicle"),
  tags: Yup.array().max(4).nullable(),
});

const useStyles = makeStyles((theme) => ({
  images: {
    position: "relative",
    minHeight: 200,
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px !important",
    padding: theme.spacing(3),
  },
}));

export const TourForm = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  useDocumentTitle(`${id === "new" ? "Admin: New tour" : "Admin: Edit tour"}`);
  const tour = useSelector(getTour(id));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    clearErrors,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      departure: "",
      kind: "",
      vehicles: [],
      beginDate: DEFAULT_DATE,
      returnDate: DEFAULT_DATE,
      price: 0,
      limit: 0,
      description: "",
      name: "",
      time: "",
      images: [],
      tags: [],
    },
    resolver: yupResolver(schema),
  });

  const { data, createTour, updateTour } = props;
  const { vehicles, tags } = data;
  const [images, setImages] = useState([]);
  const [imagesChange, setImagesChange] = useState(false);
  const [kind, setKind] = useState("");

  useEffect(() => {
    if (tour) {
      const fields = [
        "name",
        "beginDate",
        "returnDate",
        "limit",
        "time",
        "description",
        "price",
        "vehicles",
        "tags",
      ];

      fields.forEach((field) => {
        if (tour[field]) setValue(field, tour[field]);
      });
      setImages(tour["images"]);
      setKind(tour["kind"]);
      setValue("kind", kindFormatter(tour["kind"]));
      setValue("departure", departureFormatter(tour["departure"]));

      let curImages = [];
      const length = tour.images.length;
      for (let i = 0; i < length; i++) {
        toDataURL(tour["images"][0]).then((dataUrl) => {
          var fileData = dataURLtoFile(dataUrl, `imageName${i}.jpg`);
          curImages.push(fileData);
        });
      }
      setValue("images", curImages);
    }
  }, [tour]);

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
      setImagesChange(true);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    if (data.kind.value === "fixed") {
      const time = moment(data.returnDate).diff(
        moment(data.beginDate),
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
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("kind", data.kind.value);
    formData.append("departure", data.departure.value);
    if (data.kind.value === "fixed") {
      formData.append("limit", data.limit);
      formData.append("begin_date", data.beginDate);
      formData.append("return_date", data.returnDate);
    }
    if (data.kind.value === "single") formData.append("time", data.time);
    formData.append("price", data.price);
    if (id === "new" || imagesChange === true) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images[]", data.images[i]);
      }
    }

    if (id === "new") {
      const tVA = data.vehicles.map((item) => ({ vehicle_id: item.value }));
      formData.append("vehicles", JSON.stringify(tVA));
      const tTA = data.tags.map((item) => {
        if (item.__isNew__) return { tag_attributes: { name: item.value } };
        else return { tag_id: item.value };
      });
      formData.append("tags", JSON.stringify(tTA));
      await createTour(formData);
      navigate("../tours");
    } else {
      let tVA = _.unionBy(data.vehicles, tour.vehicles, "value");
      tVA = tVA.map((item) => {
        if (!data.vehicles.includes(item))
          return { vehicle_id: item.value, _destroy: 1 };
        else return { vehicle_id: item.value };
      });
      formData.append("vehicles", JSON.stringify(tVA));
      let tTA = _.unionBy(data.tags, tour.tags, "value");
      tTA = tTA.map((item) => {
        if (item.__isNew__) return { tag_attributes: { name: item.value } };
        if (!data.tags.includes(item))
          return { tag_id: item.value, _destroy: 1 };
        else return { tag_id: item.value };
      });
      formData.append("tags", JSON.stringify(tTA));
      await updateTour(formData, id);
    }
  };

  const imagesField = register("images");

  if ((id !== "new" && !tour) || (id === "new" && !vehicles))
    return <Navigate to="../tours" replace />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        mx: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Card className={classes.card}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h3" gutterBottom component="div" mt={5}>
              {`${id === "new" ? "Create" : "Update"} a tour`}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 800,
              border: 1,
              p: 2,
              mb: 2,
              borderRadius: "15px",
              bgcolor: "#fffde7",
            }}
          >
            <Box
              component="form"
              autoComplete="off"
              p={2}
              sx={{ width: "100%" }}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Box className={classes.images}>
                {images.length === 0 ? (
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="body2"
                    component="div"
                  >
                    Images will be displayed here
                  </Typography>
                ) : (
                  <ImageList sx={{ maxWidth: 800 }} cols={3}>
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
                {errors.images && (
                  <Alert severity="error">{errors.images.message}</Alert>
                )}
              </Box>
              <TextInputField control={control} name="name" label="Name" />
              <RichText
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
                {id === "new" ? "Create" : "Update"}
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  createTour: (data) => dispatch(createTour(data)),
  updateTour: (data, id) => dispatch(updateTour(data, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TourForm);
