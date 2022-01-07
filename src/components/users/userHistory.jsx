import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Loading from "../layout/loading";
import { getSession } from "../../store/session";

export const UserHistory = (props) => {
  const { currentUser, loading } = props;
  const [searchParams] = useSearchParams();
  const [info, setInfo] = useState("");

  const getPrepareData = async () => {
    if (currentUser.id === 0) {
      await getSession();
    }
  };

  useEffect(() => {
    getPrepareData();
    if (
      searchParams.get("payment_intent") &&
      searchParams.get("payment_intent_client_secret") &&
      searchParams.get("redirect_status")
    ) {
      switch (searchParams.get("redirect_status")) {
        case "succeeded":
          setInfo("Payment succeeded!");
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
  }, []);

  return (
    <Box bgcolor="background.paper" p={2} borderRadius="15px">
      {loading && <Loading />}
      {info && (
        <Alert sx={{ mb: 1 }} severity="info" onClose={() => {}}>
          {info}
        </Alert>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => ({
  getSession: () => dispatch(getSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserHistory);
