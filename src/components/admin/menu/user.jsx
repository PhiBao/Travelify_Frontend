import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../../../store/admin";
import UserProfile from "../../users/userProfile";
import { updateUser } from "../../../store/admin";

const User = (props) => {
  const { id } = useParams();
  const { updateUser } = props;
  const user = useSelector(getUser(id));

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
            flexDirection: "column",
            ml: 3,
            mb: 2,
            p: 3,
            flex: 1,
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
        ></Box>
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
