import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { connect } from "react-redux";
import StyledRating from "../common/rating";
import { dateFormatter } from "../../helpers/tour_helper";

const Review = (props) => {
  const { review, currentUser } = props;
  const {
    user: { username, avatarUrl },
    id,
    body,
    hearts,
    createAt,
    liked = false,
    likes = 0,
  } = review;

  const disabled = currentUser.id === 0;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [like, setLike] = useState(liked);
  const [numLikes, setNumLikes] = useState(likes);
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
            <MenuItem>{currentUser.admin ? "hide" : "report"}</MenuItem>
            {currentUser.admin && <MenuItem>delete</MenuItem>}
          </Menu>
        </Stack>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.entities.session.currentUser,
});

export default connect(mapStateToProps, null)(Review);
