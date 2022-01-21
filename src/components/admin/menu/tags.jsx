import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { loadTags, deleteTag } from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import ConfirmDialog from "../common/confirmDialog";

const Tags = (props) => {
  useDocumentTitle("Admin - Tags");
  const { data, loadTags, deleteTag } = props;
  const { list = [] } = data;

  const [open, setOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(0);

  useEffect(async () => {
    await loadTags();
  }, []);

  const handleDelete = (id) => {
    setDeletedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    await deleteTag(deletedId);
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "illustration",
      headerName: "Illustration",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Avatar
            alt={params.row.name}
            src={
              params.row.illustrationUrl ||
              `${process.env.PUBLIC_URL}/assets/images/flowers.jpg`
            }
          />
        );
      },
    },

    {
      field: "toursCount",
      headerName: "Tours count",
      width: 150,
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
            Tags List
          </Typography>
          <Button
            sx={{ color: "#eee !important" }}
            component={Link}
            to="new"
            variant="contained"
          >
            New tag
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "background.paper",
          width: "100%",
          height: 860,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box width={800} height="100%">
          <DataGrid
            rows={list}
            columns={columns}
            pageSize={14}
            rowsPerPageOptions={[14]}
            checkboxSelection
          />
        </Box>
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
  loadTags: () => dispatch(loadTags()),
  deleteTag: (id) => dispatch(deleteTag(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Tags);
