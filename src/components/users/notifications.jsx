import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { readNotification, readAllNotifications } from "../../store/session";
import { fromNow } from "../../helpers/timeHelper";
import paginate from "../../utils/paginate";

const Notifications = (props) => {
  const {
    id,
    notifications: { list = [], total, unread },
    readNotification,
    readAllNotifications,
  } = props;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [dummyList, setDummyList] = useState([]);

  useEffect(() => {
    setDummyList(list);
  }, [id]);

  const handleRead = async (status, id, tourId) => {
    if (status === "unread") await readNotification(id);
    if (tourId === 0) navigate("/admin/transactions");
    else navigate(`/tours/${tourId}`);
  };

  const handlePageChange = async (e, value) => {
    e.preventDefault();
    setPage(value);
    if (value === 1) {
      setDummyList(list);
      return;
    }
    await axios
      .get(`users/${id}/notifications?page=${value}`)
      .then((response) => {
        setDummyList(response?.data?.list);
      });
  };

  const handleReadAll = async (e) => {
    e.preventDefault();
    await readAllNotifications(id);
  };

  return (
    <Box bgcolor="background.paper" p={2} borderRadius="15px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{`${unread} unread notification${
          unread > 1 ? "s" : ""
        }`}</Typography>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          startIcon={<DoneAllIcon />}
          onClick={handleReadAll}
        >
          Read all
        </Button>
      </Box>
      {paginate(dummyList, 1, 10).map((notification) => (
        <Box
          sx={{
            display: "flex",
            alginItems: "center",
            p: 1,
            mb: 1,
            bgcolor: `${
              notification.status === "unread" ? "#f5f5f5" : "backgroud.paper"
            }`,
            cursor: "pointer",
          }}
          key={`notification-${notification.id}`}
          onClick={() =>
            handleRead(
              notification.status,
              notification.id,
              notification.tourId
            )
          }
        >
          <Avatar
            alt={notification.user?.username}
            src={
              notification.user?.avatarUrl ||
              `${process.env.PUBLIC_URL}/assets/images/unknown.png`
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#757575", fontStyle: "italic" }}
            >
              {fromNow(notification.updatedAt)}
            </Typography>
            {notification.action === "booked" ? (
              <Typography variant="body1">
                There is a new transaction
              </Typography>
            ) : (
              <Typography variant="body1">
                <b>{notification.user?.username}</b>
                {` ${
                  notification.others === 0
                    ? ""
                    : `and ${notification.others} other${
                        notification.others > 1 ? "s" : ""
                      }`
                } ${notification.action} ${
                  notification.action === "reported" ? "a" : "your"
                } ${notification.notifiableType}`}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
      {Math.ceil(total / 10) > 1 && (
        <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 3,
          }}
          count={Math.ceil(total / 10)}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Box>
  );
};

const mapStateToProps = (state) => ({
  id: state.entities.session.currentUser.id,
  notifications: state.entities.session.notifications,
});

const mapDispatchToProps = (dispatch) => ({
  readNotification: (id) => dispatch(readNotification(id)),
  readAllNotifications: (id) => dispatch(readAllNotifications(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
