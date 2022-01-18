import Box from "@mui/material/Box";
import Loading from "../layout/loading";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import SideBar from "../layout/sideBar";
import TourForm from "./menu/tourForm";
import AdminHome from "./dashboard/adminHome";
import Analytics from "./dashboard/analytics";
import Revenues from "./dashboard/revenues";
import Users from "./menu/users";
import User from "./menu/user";
import NewUser from "./menu/newUser";
import Tours from "./menu/tours";
import Transactions from "./menu/transactions";
import TransactionForm from "./menu/transactionForm";
import NewTransaction from "./menu/newTransaction";
import Tags from "./menu/tags";
import TagForm from "./menu/tagForm";

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
          <Route path="analytics" element={<Analytics />} />
          <Route path="revenues" element={<Revenues />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new" element={<NewUser />} />
          <Route path="users/:id" element={<User />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tours/:id" element={<TourForm />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/new" element={<NewTransaction />} />
          <Route path="transactions/:id" element={<TransactionForm />} />
          <Route path="tags" element={<Tags />} />
          <Route path="tags/:id" element={<TagForm />} />
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
