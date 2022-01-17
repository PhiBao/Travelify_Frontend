import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { loadBookings, deleteBooking } from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import { shortDateFormatter } from "../../../helpers/timeHelper";
import { state } from "../../../helpers/dashboardHelper";
import ConfirmDialog from "../common/confirmDialog";

const Bookings = (props) => {
  useDocumentTitle("Admin - Transactions");
  const { data, loadBookings, deleteBooking } = props;
  const { list = [] } = data;
  const [open, setOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(0);

  useEffect(async () => {
    await loadBookings();
  });

  const handleDelete = (id) => {
    setDeletedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    await deleteBooking(deletedId);
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "customer",
      headerName: "Customer",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                alginItems: "center",
                position: "relative",
              }}
            >
              <Avatar
                alt={params.row.customer?.username}
                src={
                  params.row.customer?.avatarUrl ||
                  `${process.env.PUBLIC_URL}/assets/images/unknown.png`
                }
              />
              <Typography
                sx={{ pl: 1, pt: 1 }}
                variant="subtitle2"
                component="div"
              >
                {params.row.customer?.username}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "tourName",
      headerName: "Tour",
      width: 200,
      renderCell: (params) => {
        return params.row.tour?.name;
      },
    },
    {
      field: "customer.phoneNumber",
      headerName: "Phone number",
      width: 180,
      renderCell: (params) => {
        return params.row.customer?.phoneNumber;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 180,
      renderCell: (params) => {
        return params.row.customer?.email;
      },
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Booked at",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return state(params.value);
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="update"
              component={Link}
              to={`${params.row.id}`}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              aria-label="delete"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
    {
      field: "departureDate",
      headerName: "Departure date",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
      },
    },
    {
      field: "adults",
      headerName: "Adults",
      width: 70,
    },
    {
      field: "children",
      headerName: "Children",
      width: 100,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mt: 10,
        mx: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography variant="h4" component="h4">
            Transactions List
          </Typography>
          <Button
            sx={{ color: "#eee !important" }}
            component={Link}
            to="new"
            variant="contained"
          >
            New transaction
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          height: 860,
        }}
      >
        <DataGrid
          rows={list}
          columns={columns}
          pageSize={14}
          rowsPerPageOptions={[14]}
          checkboxSelection
        />
      </Box>
      <ConfirmDialog
        open={open}
        handleClose={handleClose}
        handleOk={handleOk}
      />
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadBookings: () => dispatch(loadBookings()),
  deleteBooking: (id) => dispatch(deleteBooking(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
