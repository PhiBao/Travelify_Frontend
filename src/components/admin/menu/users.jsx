import { useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { loadUsers } from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import { dateFormatter, noTimeFormatter } from "../../../helpers/timeHelper";
import { activate } from "../../../helpers/dashboardHelper";

const Users = (props) => {
  useDocumentTitle("Admin - Users");
  const { data, loadUsers } = props;
  const { list = [] } = data;

  useEffect(async () => {
    await loadUsers();
  });

  const handleDelete = (id) => {
    console.log(id);
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
          bgcolor: "background.paper",
          width: "100%",
          height: 850,
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
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadUsers: () => dispatch(loadUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
