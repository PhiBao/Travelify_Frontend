import { useState, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Chip from "@mui/material/Chip";
import { createBooking, loadHelpers } from "../../../store/admin";
import { TextInputField, Select, DateTimePickerField } from "../../common/form";
import { DEFAULT_DATE } from "../../../helpers/timeHelper";
import {
  transactionStatus,
  tourKind,
  dataFormatter,
} from "../../../helpers/dashboardHelper";

const schema = Yup.object().shape({
  name: Yup.string().max(50),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(9)
    .max(11),
  email: Yup.string().required().email(),
  note: Yup.string().max(500),
  status: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
  departureDate: Yup.date().required(),
  adults: Yup.number().typeError("Must specify a number").min(1).required(),
  children: Yup.number().typeError("Must specify a number").min(0).nullable(),
  tour: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
});

export const NewTransaction = (props) => {
  const { createBooking, loadHelpers, tours = [] } = props;
  const navigate = useNavigate();

  useEffect(async () => {
    await loadHelpers();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    resetField,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      note: "",
      departureDate: DEFAULT_DATE,
      adults: 2,
      children: 0,
      status: transactionStatus[0],
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [kind, setKind] = useState("");

  const handleSelectTour = (e) => {
    setPrice(e.price);
    setKind(e.kind);
    setTotal(
      Math.round(
        (getValues("adults") / 1.0 + getValues("children") / 2.0) *
          e.price *
          100.0
      ) / 100.0
    );
    if (e.departureDate) setValue("departureDate", e.departureDate);
    else resetField("departureDate");
  };

  const handleNumChange = (e) => {
    e.preventDefault();
    setTotal(
      Math.round(
        (getValues("adults") / 1.0 + getValues("children") / 2.0) *
          price *
          100.0
      ) / 100.0
    );
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await createBooking(dataFormatter(data, total));
    navigate("../transactions");
  };

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
      component="form"
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            ml: 3,
            mb: 2,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography variant="h4" component="h4">
            Create a new transaction
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
            mr: 1,
            p: 3,
            flex: 1,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", my: 1 }}
              variant="subtitle2"
              component="div"
            >
              Contact Details
            </Typography>
            <TextInputField control={control} name="name" label="Name" />
            <TextInputField
              control={control}
              name="phoneNumber"
              label="Phone number"
            />
            <TextInputField control={control} name="email" label="Email" />
            <TextInputField control={control} name="note" label="Note" />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", mt: 2 }}
              variant="subtitle2"
              component="div"
            >
              Tour Information
            </Typography>
            <Select
              control={control}
              name="tour"
              label="Tour"
              options={tours}
              placeholder="Select a tour of this transaction"
              error={errors.tour}
              handleChange={handleSelectTour}
            />
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", my: 1 }}
            >
              <Chip sx={{ mr: 1 }} color="warning" label="Kind" />
              <Box component="span">{tourKind(kind)}</Box>
            </Box>
            <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
              <Chip sx={{ mr: 1 }} color="warning" label="Price" />
              <Box component="span">{price}</Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 2,
          }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "15px",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 800,
                height: "auto",
                border: 1,
                p: 2,
                mb: 2,
                borderRadius: "15px",
                bgcolor: "#fffde7",
              }}
            >
              <Box p={2} sx={{ width: "100%" }}>
                <DateTimePickerField
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
                <Select
                  control={control}
                  name="status"
                  label="Status"
                  options={transactionStatus}
                  placeholder="Select a status of this transaction"
                  error={errors.status}
                />
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
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
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
                  Create
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  tours: state.entities.admin.data.tours,
});

const mapDispatchToProps = (dispatch) => ({
  createBooking: (data, id) => dispatch(createBooking(data, id)),
  loadHelpers: () => dispatch(loadHelpers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTransaction);
