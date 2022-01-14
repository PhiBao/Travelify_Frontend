import Box from "@mui/material/Box";
import Loading from "../layout/loading";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import SideBar from "../layout/sideBar";
import TourForm from "../tours/tourForm";
import AdminHome from "./dashboard/adminHome";
import Analytics from "./dashboard/analytics";
import Revenues from "./dashboard/revenues";
import Users from "./menu/users";
import User from "./menu/user";
import NewUser from "./menu/newUser";

const Admin = (props) => {
  const { loading } = props;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: "100%",
      }}
    >
      {loading && <Loading />}
      <Box
        sx={{
          width: 300,
          minHeight: "100%",
          bgcolor: "background.paper",
        }}
      >
        <SideBar />
      </Box>
      <Box flex="1">
        <Routes>
          <Route path="tours/new" element={<TourForm />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="revenues" element={<Revenues />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<NewUser />} />
          <Route path="users/:id" element={<User />} />
          <Route path="" element={<AdminHome />} />
        </Routes>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  loading: state.entities.admin.loading,
});

export default connect(mapStateToProps, null)(Admin);
