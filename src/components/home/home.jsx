import Grid from "@mui/material/Grid";
import MobileDetect from "mobile-detect";
import Featured from "../featured/featured";
import TourList from "../tours/tourList";

const Home = () => {
  return (
    <Grid
      sx={{
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      <Grid item xs={12}>
        <Featured />
      </Grid>
      <Grid item xs={12}>
        <TourList title="Popular Tours" />
      </Grid>
      <Grid item xs={12}>
        <TourList title="New Tours" />
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

export default Home;
