import { useState, useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import NoteIcon from "@mui/icons-material/Note";
import { updateBooking, getBooking } from "../../../store/admin";
import { TextInputField, Select, DateTimePickerField } from "../../common/form";
import { DEFAULT_DATE } from "../../../helpers/timeHelper";
import { transactionStatus, tourKind } from "../../../helpers/dashboardHelper";

const schema = Yup.object().shape({
  status: Yup.object({
    value: Yup.string().required(),
    label: Yup.string().required(),
  }),
  departureDate: Yup.date().required(),
  adults: Yup.number().typeError("Must specify a number").min(1).required(),
  children: Yup.number().typeError("Must specify a number").min(0).nullable(),
});

export const TransactionForm = (props) => {
  const { id } = useParams();
  const transaction = useSelector(getBooking(id));

  const { customer = {}, tour = {} } = transaction;

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      departureDate: DEFAULT_DATE,
      adults: 2,
      children: 0,
      status: transactionStatus[0],
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { updateBooking } = props;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (transaction) {
      const fields = ["departureDate", "children", "adults"];

      fields.forEach((field) => {
        if (transaction[field]) setValue(field, transaction[field]);
      });
      const index = transactionStatus.findIndex(
        (x) => x.value === transaction["status"]
      );
      setValue("status", transactionStatus[index]);
      setTotal(transaction["total"]);
    }
  }, [transaction]);

  const handleNumChange = (e) => {
    e.preventDefault();
    setTotal(
      Math.round(
        (getValues("adults") / 1.0 + getValues("children") / 2.0) *
          tour.price *
          100.0
      ) / 100.0
    );
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await updateBooking({ ...data, total, status: data.status.value }, id);
  };

  if (!transaction) return <Navigate to="../transactions" replace />;

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
            Edit Transaction
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%", display: "flex" }}>
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
          <Box
            sx={{
              display: "flex",
              alginItems: "center",
            }}
          >
            <Avatar
              alt={customer.username}
              src={
                customer.avatarUrl ||
                `${process.env.PUBLIC_URL}/assets/images/unknown.png`
              }
            />
            <Typography
              sx={{ pl: 1, pt: 1 }}
              variant="subtitle2"
              component="div"
            >
              {customer.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", my: 1 }}
              variant="subtitle2"
              component="div"
            >
              Contact Details
            </Typography>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <PhoneIphoneIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{customer.phoneNumber}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", pl: 2 }}
            >
              <MailOutlineIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{customer.email}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <NoteIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{customer.note}</Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", my: 1 }}
              variant="subtitle2"
              component="div"
            >
              Tour Information
            </Typography>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Chip sx={{ mr: 1 }} color="info" label="Name" />
              <Box component="span">{tour.name}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", pl: 2 }}
            >
              <Chip sx={{ mr: 1 }} color="info" label="Kind" />
              <Box component="span">{tourKind(tour.kind)}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Chip sx={{ mr: 1 }} color="info" label="Price" />
              <Box component="span">{tour.price}</Box>
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
              p: 3,
            }}
          >
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
                <DateTimePickerField
                  control={control}
                  name="departureDate"
                  label="Departure date"
                  disabled={tour.kind === "fixed"}
                  error={errors.departureDate}
                />
                <TextInputField
                  control={control}
                  type="number"
                  name="adults"
                  handleChange={handleNumChange}
                  label={`Adults (x${tour.price})`}
                />
                <TextInputField
                  control={control}
                  type="number"
                  name="children"
                  handleChange={handleNumChange}
                  label={`Children (x${tour.price / 2})`}
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
                  Update
                </Box>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateBooking: (data, id) => dispatch(updateBooking(data, id)),
});

export default connect(null, mapDispatchToProps)(TransactionForm);
