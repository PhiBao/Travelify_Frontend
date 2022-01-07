import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import Featured from "../featured/featured";
import List from "./list";
import HotTags from "./hotTags";
import Loading from "../layout/loading";
import { loadHome } from "../../store/home";

const Home = (props) => {
  const { home, loadHome } = props;

  useEffect(async () => {
    await loadHome();
  }, []);

  const { list, hotTours, newTours, hotTags, featured, loading } = home;
  return (
    <Grid
      sx={{
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      {loading && <Loading />}
      <Grid item xs={12}>
        <Featured list={list.filter((tour) => featured.includes(tour.id))} />
      </Grid>
      <Grid item xs={12}>
        <List
          title="Popular Tours"
          link="tours?type=hot"
          list={list.filter((tour) => hotTours.includes(tour.id))}
        />
      </Grid>
      <Grid item xs={12}>
        <List
          title="New Tours"
          link="/tours"
          list={list.filter((tour) => newTours.includes(tour.id))}
        />
      </Grid>
      <Grid item xs={12}>
        <HotTags list={hotTags} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  home: state.entities.home,
});

const mapDispatchToProps = (dispatch) => ({
  loadHome: () => dispatch(loadHome()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
