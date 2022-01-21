import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
import HelpIcon from "@mui/icons-material/Help";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import { loadBookings } from "../../store/session";
import Booking from "../booking/booking";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const UserHistory = (props) => {
  const {
    id,
    bookings: { list = [], total },
    loadBookings,
  } = props;
  const [searchParams] = useSearchParams();
  const [info, setInfo] = useState("");
  const [value, setValue] = useState("confirming");
  const [page, setPage] = useState(1);
  const [openHelp, setOpenHelp] = useState(false);
  const handleCloseHelp = () => setOpenHelp(false);
  const handleOpenHelp = () => setOpenHelp(true);

  const handleChange = (e, newValue) => {
    e.preventDefault();
    setValue(newValue);
  };

  const handlePageChange = async (e, data) => {
    e.preventDefault();
    await loadBookings(id, { page: data, status: value });
    setPage(data);
  };

  useEffect(async () => {
    if (id !== 0) await loadBookings(id, { status: value });
  }, [id, value]);

  useEffect(() => {
    if (
      searchParams.get("payment_intent") &&
      searchParams.get("payment_intent_client_secret") &&
      searchParams.get("redirect_status")
    ) {
      switch (searchParams.get("redirect_status")) {
        case "succeeded":
          setInfo("Payment succeeded!");
          setValue("paid");
          break;
        case "processing":
          setInfo("Your payment is processing.");
          break;
        case "requires_payment_method":
          setInfo("Your payment was not successful, please try again.");
          break;
        default:
          setInfo("Something went wrong.");
          break;
      }
    }
  }, [searchParams]);

  return (
    <Box
      sx={{ position: "relative" }}
      bgcolor="background.paper"
      p={2}
      borderRadius="15px"
    >
      {info && (
        <Alert
          sx={{ mb: 1 }}
          severity="info"
          onClose={() => {
            setInfo("");
          }}
        >
          {info}
        </Alert>
      )}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            variant="fullWidth"
            aria-label="booking tags"
          >
            <Tab
              icon={<HourglassBottomIcon />}
              label="WAITING"
              value="confirming"
            />
            <Tab icon={<DoneIcon />} label="PAID" value="paid" />
            <Tab icon={<CancelIcon />} label="CANCELED" value="canceled" />
          </TabList>
        </Box>
        <TabPanel value={value}>
          {list
            .filter((item) => item.status === value)
            .map((booking) => (
              <Booking key={booking.id} booking={booking} />
            ))}
          {Math.ceil(total / 5) > 1 && (
            <Pagination
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pt: 3,
              }}
              count={Math.ceil(total / 5)}
              page={page}
              onChange={handlePageChange}
            />
          )}
        </TabPanel>
      </TabContext>
      <IconButton
        sx={{ position: "absolute", top: 0, right: 0 }}
        onClick={handleOpenHelp}
        aria-label="help"
      >
        <HelpIcon />
      </IconButton>
      <Modal
        open={openHelp}
        onClose={handleCloseHelp}
        aria-labelledby="modal-helper-title"
        aria-describedby="modal-helper-description"
      >
        <Box sx={style}>
          <Typography id="modal-helper-title" variant="h6" component="h2">
            Rules
          </Typography>
          <Typography
            id="modal-helper-description"
            variant="body2"
            sx={{ mt: 2, fontSize: "18px", fontWeight: 500, lineHeight: 2 }}
          >
            You can only review when paid successfully.
            <br />
            Evaluation period is 30 days from the date of departure
            <br />
            If you want to cancel the tour, please contact us via{" "}
            <i>022999999</i>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  id: state.entities.session.currentUser.id,
  bookings: state.entities.session.bookings,
});

const mapDispatchToProps = (dispatch) => ({
  loadBookings: (id, params) => dispatch(loadBookings(id, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserHistory);
