import { useState, useEffect } from "react";
import * as Yup from "yup";
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
import { makeStyles } from "@mui/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTag, updateTag, getTag } from "../../../store/admin";
import { TextInputField } from "../../common/form";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const schema = Yup.object().shape({
  name: Yup.string().max(255).required(),
  illustration: Yup.mixed()
    .test("type", "We support png, jpg, gif file", (value) => {
      return value.length > 0
        ? ["image/png", "image/jpeg", "image/gif"].includes(value[0].type)
        : true;
    })
    .test("fileSize", "The file is too large", (value) => {
      return value.length > 0 ? value[0].size <= 5242880 : true;
    })
    .nullable(),
});

const useStyles = makeStyles((theme) => ({
  image: {
    position: "relative",
    minHeight: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

export const TagForm = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();
  useDocumentTitle(`${id === "new" ? "Admin: New tag" : "Admin: Edit tag"}`);
  const tag = useSelector(getTag(id));

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      illustration: [],
    },
    resolver: yupResolver(schema),
  });

  const { createTag, updateTag } = props;
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (tag) {
      setValue("name", tag.name);
      setImage(tag.illustrationUrl);
    }
  }, [tag]);

  const handleImageChange = (e) => {
    e.preventDefault();

    const newImage = e.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    if (data.illustration.length > 0)
      formData.append("illustration", data.illustration[0]);

    if (id === "new") {
      await createTag(formData);
      navigate("../tags");
    } else {
      await updateTag(formData, id);
    }
  };

  const illustrationField = register("illustration");

  if (id !== "new" && !tag) return <Navigate to="../tags" replace />;

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
              {`${id === "new" ? "Create" : "Update"} a tag`}
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
              <Box className={classes.image}>
                {image ? (
                  <img
                    src={image}
                    srcSet={image}
                    width={360}
                    height={248}
                    alt="illustration"
                    loading="lazy"
                  />
                ) : (
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    variant="body2"
                    component="div"
                  >
                    Illustration will be displayed here
                  </Typography>
                )}
                <Box className={classes.upload}>
                  <label htmlFor="icon-button-file">
                    <input
                      {...illustrationField}
                      onChange={(e) => {
                        illustrationField.onChange(e);
                        handleImageChange(e);
                      }}
                      className={classes.fileInput}
                      id="icon-button-file"
                      type="file"
                      name="illustration"
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
                {errors.illustration && (
                  <Alert severity="error">{errors.illustration.message}</Alert>
                )}
              </Box>
              <TextInputField control={control} name="name" label="Name" />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  my: 2,
                }}
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

const mapDispatchToProps = (dispatch) => ({
  createTag: (data) => dispatch(createTag(data)),
  updateTag: (data, id) => dispatch(updateTag(data, id)),
});

export default connect(null, mapDispatchToProps)(TagForm);
