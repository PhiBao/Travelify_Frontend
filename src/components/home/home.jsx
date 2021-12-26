import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import MobileDetect from "mobile-detect";
import Featured from "../featured/featured";
import TourList from "../tours/tourList";
import HotTags from "./hotTags";
import { loadHome } from "../../store/home";

const Home = (props) => {
  const { home, loadHome } = props;

  useEffect(async () => {
    await loadHome();
  }, []);

  const { hotTours, newTours, hotTags, featured } = home;
  return (
    <Grid
      sx={{
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      <Grid item xs={12}>
        <Featured tour={featured} />
      </Grid>
      <Grid item xs={12}>
        <TourList title="Popular Tours" list={hotTours} />
      </Grid>
      <Grid item xs={12}>
        <TourList title="New Tours" list={newTours} />
      </Grid>
      <Grid item xs={12}>
        <HotTags list={hotTags} />
      </Grid>
    </Grid>
  );
};

TourList.getInitialProps = ({ req }) => {
  let userAgent;
  let deviceType;
  if (req) {
    userAgent = req.headers["user-agent"];
  } else {
    userAgent = navigator.userAgent;
  }
  const md = new MobileDetect(userAgent);
  if (md.tablet()) {
    deviceType = "tablet";
  } else if (md.mobile()) {
    deviceType = "mobile";
  } else {
    deviceType = "desktop";
  }
  return { deviceType };
};

const mapStateToProps = (state) => ({
  home: state.entities.home,
});

const mapDispatchToProps = (dispatch) => ({
  loadHome: () => dispatch(loadHome()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
