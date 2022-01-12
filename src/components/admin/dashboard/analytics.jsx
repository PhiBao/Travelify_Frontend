import { useEffect } from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { loadAnalytics } from "../../../store/admin";
import SimpleRadarChart from "../charts/simpleRadarChart";
import SimpleBarChart from "../charts/simpleBarChart";

const dummyData = [{ name: "Dummy", value1: 0, value2: 0 }];

const Analytics = (props) => {
  const { data, loadAnalytics } = props;
  const {
    trendTopics = dummyData,
    trendTours = [],
    trendDeparture = [],
  } = data;

  useEffect(async () => {
    await loadAnalytics();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            margin: 3,
            padding: 3,
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography variant="h4" component="div" mb={3}>
            Topic Analytics
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <SimpleRadarChart
              data={trendTopics}
              dataKey="value1"
              name="bookers"
            />
            <SimpleRadarChart
              data={trendTopics}
              dataKey="value2"
              name="tours"
              color="#82ca9d"
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "100%" }}>
        <SimpleBarChart
          data={trendTours}
          name="bookers"
          grid
          title="Tour Analytics"
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <SimpleBarChart
          data={trendDeparture}
          name="bookers"
          color="#b22a00"
          grid
          title="Departure Analytics"
        />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadAnalytics: () => dispatch(loadAnalytics()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
