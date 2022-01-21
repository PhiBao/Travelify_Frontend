import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ContentModal = (props) => {
  const { open, handleClose, body, title } = props;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-helper-title"
      aria-describedby="modal-helper-description"
    >
      <Box sx={style}>
        <Typography id="modal-helper-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box
          id="modal-helper-description"
          sx={{
            p: 2,
            lineHeight: 2,
            fontSize: "18px",
          }}
          component="div"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </Box>
    </Modal>
  );
};

export default ContentModal;
