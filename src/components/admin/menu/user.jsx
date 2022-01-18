import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Filter1Icon from "@mui/icons-material/Filter1";
import Filter2Icon from "@mui/icons-material/Filter2";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { connect } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserProfile from "../../users/userProfile";
import { updateUser, getUser } from "../../../store/admin";
import { noTimeFormatter } from "../../../helpers/timeHelper";
import useDocumentTitle from "../../../utils/useDocumentTitle";

const User = (props) => {
  useDocumentTitle("Admin: Edit user");
  const { id } = useParams();
  const { updateUser } = props;
  const user = useSelector(getUser(id));

  if (!user) return <Navigate to="../users" replace />;

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
            ml: 3,
            mb: 2,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Typography variant="h4" component="h4">
            Edit User
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
            mr: 1,
            p: 3,
            flex: 1,
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alginItems: "center",
            }}
          >
            <Avatar
              alt={user.username}
              src={
                user.avatarUrl ||
                `${process.env.PUBLIC_URL}/assets/images/unknown.png`
              }
            />
            <Typography
              sx={{ pl: 1, pt: 1 }}
              variant="subtitle2"
              component="div"
            >
              {user.username}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", my: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", my: 1 }}
              variant="subtitle2"
              component="div"
            >
              Account Details
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", p: 2 }}
              component="div"
            >
              <Filter1Icon sx={{ mr: 1 }} color="info" />
              <Box component="span">{user.firstName}</Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", pl: 2 }}
              component="div"
            >
              <Filter2Icon sx={{ mr: 1 }} color="info" />
              <Box component="span">{user.lastName}</Box>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", p: 2 }}
              component="div"
            >
              <CalendarTodayIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{noTimeFormatter(user.birthday)}</Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
            <Typography
              sx={{ fontSize: "18px", color: "#9e9e9e", my: 1 }}
              variant="subtitle2"
              component="div"
            >
              Contact Details
            </Typography>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <PhoneIphoneIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{user.phoneNumber}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", pl: 2 }}
            >
              <MailOutlineIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{user.email}</Box>
            </Box>
            <Box
              component="div"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <MyLocationIcon sx={{ mr: 1 }} color="info" />
              <Box component="span">{user.address}</Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 2,
          }}
        >
          <UserProfile currentUser={user} updateUser={updateUser} />
        </Box>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data, id) => dispatch(updateUser(data, id)),
});

export default connect(null, mapDispatchToProps)(User);
