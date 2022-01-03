import { useState, useRef, useEffect } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import StyledRating from "../common/rating";
import { dateFormatter } from "../../helpers/tour_helper";
import { deleteReview } from "../../store/tours";

const options = [
  "Negative words",
  "Offensive content",
  "Contempt for others",
  "Contempt for religion, politics",
  "Something else",
];

function ConfirmationDialogRaw(props) {
  const { onClose, value: valueProp, open, reviewId, ...other } = props;
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    await axios.post(`reviews/${reviewId}/report`, { content: value });
    onClose(value);
    toast.success(
      "Thank you for your report, it has been sent successfully, we will check soon!"
    );
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Phone Ringtone</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

const Review = (props) => {
  const { review, currentUser, deleteReview } = props;
  const {
    user: { username, avatarUrl },
    id,
    body,
    hearts,
    createAt,
    liked = false,
    likes = 0,
    state = "appear",
  } = review;

  const disabled = currentUser.id === 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [like, setLike] = useState(liked);
  const [numLikes, setNumLikes] = useState(likes);
  const [hidden, setHidden] = useState(state === "hide");
  const [confirm, setConfirm] = useState(false);
  const [report, setReport] = useState(false);
  const [value, setValue] = useState("Negative words");

  const handleCloseDialog = () => {
    setConfirm(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    await axios.get(`reviews/${id}/like`);
    like ? setNumLikes(numLikes - 1) : setNumLikes(numLikes + 1);
    setLike(!like);
  };

  const handleAction = async (type) => {
    switch (type) {
      case "report":
        setReport(true);
        setAnchorEl(null);
        break;
      case "delete":
        setConfirm(true);
        setAnchorEl(null);
        break;
      default:
        await axios.get(`reviews/${id}/${type}`);
        setAnchorEl(null);
        setHidden(!hidden);
    }
  };

  const handleConfirmDialog = async () => {
    setConfirm(false);
    await deleteReview(id);
  };

  const handleCloseReport = (newValue) => {
    setReport(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        mb: 2,
      }}
    >
      <Box mt={1} mr={2}>
        <Avatar
          alt={username}
          src={
            avatarUrl || `${process.env.PUBLIC_URL}/assets/images/unknown.png`
          }
        />
      </Box>
      <Box>
        <Typography variant="h6" component="div">
          {username}
        </Typography>
        <Typography variant="body2">
          <StyledRating
            name="customized-color"
            value={hearts}
            readOnly={true}
            getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
            precision={0.5}
            max={10}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" max={10} />}
          />
        </Typography>
        {hidden && (
          <Alert sx={{ mr: 2 }} variant="filled" severity="info">
            This review is hidden!
          </Alert>
        )}
        <Box
          sx={{
            py: 1,
            mr: 2,
            lineHeight: 1.5,
            fontSize: "18px",
          }}
          component={Typography}
          variant="body1"
        >
          {body}
        </Box>
        <Box
          component={Typography}
          sx={{ mr: 2, pb: 2, borderBottom: 1, color: "#757575" }}
          variant="body2"
        >
          {dateFormatter(createAt)}
        </Box>
        <Box
          component={Typography}
          sx={{ mr: 2, py: 1, borderBottom: 1, color: "#757575" }}
          variant="body2"
        >
          <Box
            component="span"
            sx={{ fontWeight: 700, fontSize: 16, color: "#111" }}
          >
            {numLikes}
          </Box>{" "}
          Likes
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <IconButton aria-label="comment">
            <ChatBubbleOutlineIcon />
          </IconButton>
          <IconButton
            aria-label="like"
            disabled={disabled}
            onClick={handleLike}
          >
            {like ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          </IconButton>
          <IconButton
            disabled={disabled}
            aria-label="more"
            id={`button-${id}`}
            aria-controls={open ? `menu-${id}` : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`menu-${id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": `button-${id}`,
            }}
          >
            {currentUser.admin ? (
              <Box>
                <MenuItem
                  onClick={() => handleAction(hidden ? "appear" : "hide")}
                >
                  {hidden ? "appear" : "hide"}
                </MenuItem>
                <MenuItem onClick={() => handleAction("delete")}>
                  delete
                </MenuItem>
              </Box>
            ) : (
              <MenuItem
                aria-haspopup="true"
                aria-controls="report-menu"
                aria-label="review report"
                onClick={() => handleAction("report")}
              >
                report
              </MenuItem>
            )}
          </Menu>
        </Stack>
        <ConfirmationDialogRaw
          id="report-menu"
          keepMounted
          open={report}
          onClose={handleCloseReport}
          value={value}
          reviewId={id}
        />
        <Dialog
          open={confirm}
          onClose={handleCloseDialog}
          aria-describedby="alert-dialog-description"
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Confirmable
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure about this action?.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDialog}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  deleteReview: (id) => dispatch(deleteReview(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Review);
