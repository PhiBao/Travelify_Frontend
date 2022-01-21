import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import PreviewIcon from "@mui/icons-material/Preview";
import {
  loadReports,
  deleteReportable,
  toggleReportable,
  skipReport,
} from "../../../store/admin";
import useDocumentTitle from "../../../utils/useDocumentTitle";
import { shortDateFormatter } from "../../../helpers/timeHelper";
import { typeReport } from "../../../helpers/dashboardHelper";
import ConfirmDialog from "../common/confirmDialog";
import ContentModal from "../common/contentModal";

const Reports = (props) => {
  useDocumentTitle("Admin - Reports");
  const { data, loadReports, deleteReportable, toggleReportable, skipReport } =
    props;
  const { list = [] } = data;
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState({ id: 0, type: "" });
  const [view, setView] = useState(false);
  const [body, setBody] = useState("");

  useEffect(async () => {
    await loadReports();
  }, []);

  const handleDelete = (type, id) => {
    setTarget({ type, id });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenView = (data) => {
    setBody(data);
    setView(true);
  };

  const handleCloseView = (e) => {
    e.preventDefault();
    setView(false);
  };

  const handleOk = async () => {
    await deleteReportable(target.type, target.id);
    setOpen(false);
  };

  const handleToggle = async (type, id) => {
    await toggleReportable(type, id);
  };

  const handleSkip = async (id) => {
    await skipReport(id);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "notifiableType",
      headerName: "Type",
      width: 250,
      renderCell: (params) => {
        return typeReport(params.value);
      },
    },
    {
      field: "body",
      headerName: "Body",
      width: 100,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => handleOpenView(params.value)}
            aria-label="view"
            color="info"
          >
            <PreviewIcon />
          </IconButton>
        );
      },
    },
    {
      field: "size",
      headerName: "Report number",
      width: 125,
    },
    {
      field: "updatedAt",
      headerName: "Last active",
      width: 200,
      valueFormatter: (params) => {
        return shortDateFormatter(params.value);
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
              aria-label="status"
              onClick={() =>
                handleToggle(params.row.notifiableType, params.row.notifiableId)
              }
              color="info"
            >
              {params.row.state === "appear" ? (
                <VisibilityOffIcon />
              ) : (
                <VisibilityIcon />
              )}
            </IconButton>
            <IconButton
              aria-label="next"
              onClick={() => handleSkip(params.row.id)}
              color="warning"
            >
              <NextPlanIcon />
            </IconButton>
            <IconButton
              onClick={() =>
                handleDelete(params.row.notifiableType, params.row.notifiableId)
              }
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
            Reports List
          </Typography>
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
      <ContentModal open={view} handleClose={handleCloseView} body={body} />
    </Box>
  );
};

const mapStateToProps = (state) => ({
  data: state.entities.admin.data,
});

const mapDispatchToProps = (dispatch) => ({
  loadReports: () => dispatch(loadReports()),
  deleteReportable: (type, id) => dispatch(deleteReportable(type, id)),
  toggleReportable: (type, id) => dispatch(toggleReportable(type, id)),
  skipReport: (id) => dispatch(skipReport(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
