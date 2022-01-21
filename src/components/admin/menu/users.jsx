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
import { loadUsers, deleteUser } from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import { dateFormatter, noTimeFormatter } from "../../../helpers/timeHelper";
import { activate } from "../../../helpers/dashboardHelper";
import ConfirmDialog from "../common/confirmDialog";

const Users = (props) => {
  useDocumentTitle("Admin - Users");
  const { data, loadUsers, deleteUser } = props;
  const { list = [] } = data;

  const [open, setOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(0);

  useEffect(async () => {
    await loadUsers();
  }, []);

  const handleDelete = (id) => {
    setDeletedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    await deleteUser(deletedId);
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              alginItems: "center",
            }}
          >
            <Avatar
              alt={params.row.username}
              src={
                params.row.avatarUrl ||
                `${process.env.PUBLIC_URL}/assets/images/unknown.png`
              }
            />
            <Typography
              sx={{ pl: 1, pt: 1 }}
              variant="subtitle2"
              component="div"
            >
              {params.row.username}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 150,
    },
    {
      field: "birthday",
      headerName: "Date of birth",
      width: 150,
      valueFormatter: (params) => {
        return noTimeFormatter(params.value);
      },
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
    },
    {
      field: "createdAt",
      headerName: "Joined date",
      width: 200,
      valueFormatter: (params) => {
        return dateFormatter(params.value);
      },
    },
    {
      field: "activated",
      headerName: "Activated",
      width: 90,
      renderCell: (params) => {
        return activate(params.value);
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
            Users List
          </Typography>
          <Button
            sx={{ color: "#eee !important" }}
            component={Link}
            to="new"
            variant="contained"
          >
            New user
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
  loadUsers: () => dispatch(loadUsers()),
  deleteUser: (id) => dispatch(deleteUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
