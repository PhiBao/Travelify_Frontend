import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Chip from "@mui/material/Chip";

export const arrow = (cur, last) => {
  if (cur < last) {
    return <ArrowDropDownIcon color="error" />;
  } else {
    return <ArrowDropUpIcon color="success" />;
  }
};

export const state = (status) => {
  switch (status) {
    case "confirming":
      return (
        <Chip
          sx={{ backgroundColor: "#ebf1fe", color: "#2a7ade" }}
          label="Confirming"
        />
      );

    case "paid":
      return (
        <Chip
          sx={{ backgroundColor: "#e5faf2", color: "#3bb077" }}
          label="Paid"
        />
      );

    default:
      return (
        <Chip
          sx={{ backgroundColor: "#fff0f1", color: "#d95087" }}
          label="Canceled"
        />
      );
  }
};
