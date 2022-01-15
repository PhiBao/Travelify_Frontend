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
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import { loadTours, deleteTour } from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import { vehicles as vh } from "../../../helpers/tourHelper";
import { shortDateFormatter } from "../../../helpers/timeHelper";
import { tourKind } from "../../../helpers/dashboardHelper";
import ConfirmDialog from "../common/confirmDialog";

const Tours = (props) => {
  useDocumentTitle("Admin - Tours");
  const { data, loadTours, deleteTour } = props;
  const { list = [] } = data;
  const [open, setOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(0);

  useEffect(async () => {
    await loadTours();
  });

  const handleDelete = (id) => {
    setDeletedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    await deleteTour(deletedId);
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "tour",
      headerName: "Tour",
      width: 250,
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
                params.row.images?.[0] ||
                `${process.env.PUBLIC_URL}/assets/images/flowers.jpg`
              }
            />
            <Typography
              sx={{ pl: 1, pt: 1 }}
              variant="subtitle2"
              component="div"
            >
              {params.row.name}
            </Typography>
          </Box>
        );
      },
    },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "departure",
      headerName: "Departure",
      width: 150,
    },
    {
      field: "kind",
      headerName: "Kind",
      width: 100,
      renderCell: (params) => {
        return tourKind(params.value);
      },
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Create at",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
      },
    },
    {
      field: "vehicles",
      headerName: "Vehicles",
      width: 150,
      renderCell: (params) => {
        const vehicleIcons = vh.filter((icon) =>
          params.value?.includes(icon.key)
        );
        return (
          <Stack direction="row" gap={1}>
            {vehicleIcons.map((vehicle) => vehicle.icon)}
          </Stack>
        );
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
    {
      field: "limit",
      headerName: "Limit",
      width: 100,
    },
    {
      field: "time",
      headerName: "Time",
      width: 100,
    },
    {
      field: "beginDate",
      headerName: "Begin date",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
      },
    },
    {
      field: "returnDate",
      headerName: "Return date",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 300,
      renderCell: (params) => {
        return params.value.map((tag) => (
          <Chip key={tag.value} variant="outlined" label={tag.label} />
        ));
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
            Tours List
          </Typography>
          <Button
            sx={{ color: "#eee !important" }}
            component={Link}
            to="new"
            variant="contained"
          >
            New tours
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
  loadTours: () => dispatch(loadTours()),
  deleteTour: (id) => dispatch(deleteTour(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tours);
