import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { createUser } from "../../../store/admin";
import UserForm from "../../common/userForm";

export const NewUser = (props) => {
  const navigate = useNavigate();
  const { createUser } = props;

  const onSubmit = async (user, e) => {
    e.preventDefault();
    await createUser({ user });
    navigate("../users");
  };

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
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h3" gutterBottom component="div" mt={5}>
              New user
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: 800,
              border: 1,
              p: 2,
              mb: 2,
              borderRadius: "15px",
              bgcolor: "#fffde7",
            }}
          >
            <UserForm onSubmit={onSubmit} title="Create" />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  createUser: (data) => dispatch(createUser(data)),
});

export default connect(null, mapDispatchToProps)(NewUser);
