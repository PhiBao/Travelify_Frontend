import Grid from "@mui/material/Grid";
import Loading from "../layout/loading";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import SideBar from "../layout/sideBar";
import TourForm from "../tours/tourForm";

const Dashboard = (props) => {
  const { loading } = props;
  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      {loading && <Loading />}
      <Grid item xs={12} sm={1.5} bgcolor={"background.paper"}>
        <SideBar />
      </Grid>
      <Grid item xs={12} sm={10.5}>
        <Routes>
          <Route path="tours/new" element={<TourForm />} />
          <Route path="/" element={<TourForm />} />
        </Routes>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.session.loading,
});

const mapDispatchToProps = (dispatch) => {};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
