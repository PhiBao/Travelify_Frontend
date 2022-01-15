import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    justifyContent: "around",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer>
      <Box bgcolor="text.secondary" color="white" sx={{ mt: 5, pt: 5 }}>
        <Grid container spacing={5} className={classes.wrapper}>
          <Grid item xs={12} sm={4}>
            <Box className={classes.column}>
              <Typography component="div" variant="h5" sx={{ mb: 2 }}>
                Help
              </Typography>
              <Box
                component={Link}
                sx={{ color: "white !important", mb: 1 }}
                to="/"
              >
                Contact
              </Box>
              <Box component={Link} sx={{ color: "white !important" }} to="/">
                Support
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className={classes.column}>
              <Typography component="div" variant="h5" sx={{ mb: 2 }}>
                Rules
              </Typography>
              <Box
                component={Link}
                sx={{ color: "white !important", mb: 1 }}
                to="/"
              >
                Term of use
              </Box>
              <Box component={Link} sx={{ color: "white !important" }} to="/">
                Privacy Policy
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box className={classes.column}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                More
              </Typography>
              <Box
                component={Link}
                sx={{ color: "white !important", mb: 1 }}
                to="/"
              >
                Backup
              </Box>
              <Box component={Link} sx={{ color: "white !important" }} to="/">
                History
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box textAlign="center" py={5}>
          Travelify &reg; {new Date().getFullYear()}
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
