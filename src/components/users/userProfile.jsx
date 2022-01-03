import { useState, useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { toast } from "react-toastify";
import { TextInputField, DatePickerField } from "../common/form";
import { updateUser } from "../../store/session";

const schema = Yup.object().shape({
  firstName: Yup.string().max(20).nullable(),
  lastName: Yup.string().max(20).nullable(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string()
    .nullable()
    .matches(
      /^[0-9]{9,11}|^$/,
      "Must be only digits and have length from 9 to 11"
    ),
  address: Yup.string().max(100).nullable(),
  activated: Yup.boolean().nullable(),
  birthday: Yup.date()
    .nullable()
    .test("birthday", "Please choose a valid date of birth", (value) => {
      if (value) {
        const age = moment().diff(moment(value), "years");
        return age >= 16 && age <= 120;
      } else return true;
    })
    .nullable(),
  avatar: Yup.mixed()
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

const useStyles = makeStyles({
  avatar: {
    position: "relative",
  },
  upload: {
    position: "absolute",
    left: 32,
    top: 36,
  },
  fileInput: {
    display: "none",
  },
});

export const UserProfile = (props) => {
  const { currentUser, updateUser } = props;
  const classes = useStyles();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      birthday: "2000-01-01",
      activated: "",
      avatar: [],
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(currentUser.avatarUrl);

    const fields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "address",
      "birthday",
      "activated",
    ];

    fields.forEach((field) => {
      if (currentUser[field]) setValue(field, currentUser[field]);
    });
  }, []);

  const handleImageChange = (e) => {
    e.preventDefault();
    const newImage = e.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));
    }
  };

  const onEditProfile = async (user, e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", user.firstName);
    formData.append("last_name", user.lastName);
    formData.append("email", user.email);
    formData.append("phone_number", user.phoneNumber);
    formData.append("address", user.address);
    formData.append("birthday", user.birthday);
    if (user.avatar.length > 0) formData.append("avatar", user.avatar[0]);
    await updateUser(formData, currentUser.id);
  };

  const avatarField = register("avatar");

  return (
    <Box
      bgcolor="background.paper"
      p={2}
      borderRadius="15px"
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onEditProfile)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box className={classes.avatar}>
          <Avatar
            src={image || `${process.env.PUBLIC_URL}/assets/images/unknown.png`}
            alt=""
            sx={{ width: "64px", height: "64px" }}
          />
          <Box className={classes.upload}>
            <label htmlFor="icon-button-file">
              <input
                {...avatarField}
                onChange={(e) => {
                  avatarField.onChange(e);
                  handleImageChange(e);
                }}
                className={classes.fileInput}
                id="icon-button-file"
                type="file"
                name="avatar"
                accept=".jpg, .gif, .png"
              />
              <IconButton
                color="primary"
                aria-label="upload avatar"
                component="span"
              >
                <PhotoCamera />
              </IconButton>
            </label>
          </Box>
        </Box>
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="body1"
            color="info.light"
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            Allowed JPG, GIF or PNG. Max size of 5MB
          </Typography>
          {errors.avatar && (
            <Typography variant="body1" color="error.main">
              {errors.avatar.message}
            </Typography>
          )}
        </Box>
      </Box>

      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextInputField
            control={control}
            name="firstName"
            label="First name"
          />

          <TextInputField control={control} name="lastName" label="Last name" />
        </Box>
        <TextInputField control={control} name="email" label="Email" />
        {currentUser.activated === false && (
          <Alert
            sx={{ mb: 1 }}
            severity="warning"
            action={
              <Button
                color="inherit"
                onClick={() => {
                  axios
                    .get(`/users?id=${currentUser.id}`)
                    .then(() =>
                      toast.success(
                        "We have just sent you a email, please check and confirm your account"
                      )
                    )
                    .catch(() => toast.error("An unexpected error occurred"));
                }}
                size="small"
                endIcon={<SendIcon />}
              >
                Resend
              </Button>
            }
          >
            Your email is not confirmed. Please check your inbox.
          </Alert>
        )}
        <TextInputField control={control} name="address" label="Address" />
        <TextInputField
          control={control}
          name="phoneNumber"
          label="Phone number"
        />
        <DatePickerField
          control={control}
          name="birthday"
          label="Date of Birth"
          error={errors.birthday}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 1,
          }}
          type="submit"
          variant="contained"
          component={Button}
        >
          Update
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data, id) => dispatch(updateUser(data, id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
