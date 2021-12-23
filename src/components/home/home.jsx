import Grid from "@mui/material/Grid";
import Featured from "../featured/featured";

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
    </Grid>
  );
};

export default Home;
