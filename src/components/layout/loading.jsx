import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    backgroundColor: "white",
    opacity: 0.8,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const Loading = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Loader type="ThreeDots" color="#000" height={100} width={100} />
    </div>
  );
};

export default Loading;
