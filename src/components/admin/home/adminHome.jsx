import { useEffect } from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import FeaturedInfo from "./featuredInfo";
import { loadDashboard } from "../../../store/admin";

const AdminHome = (props) => {
  const { data, loadDashboard } = props;

  useEffect(async () => {
    await loadDashboard();
  }, []);

  const { featured = {} } = data;

  return (
    <Box display="flex" mt={10} justifyContent="center" alignItems="center">
      <FeaturedInfo data={featured} />
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadDashboard: () => dispatch(loadDashboard()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminHome);
