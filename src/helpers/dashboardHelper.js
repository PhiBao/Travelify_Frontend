import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Chip from "@mui/material/Chip";
import _ from "lodash";

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

export const percent = (cur, last) => {
  if (last === 0 || last === "0.0") return "No data";
  const res = ((cur > last ? cur / last : last / cur) - 1) * 100;
  return Math.abs(res).toFixed(2);
};

export const months = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

export const years = _.range(2018, new Date().getFullYear() + 1).map((y) => ({
  value: y,
  label: y,
}));

export const activate = (activated) => {
  if (activated === true) {
    return (
      <Chip sx={{ backgroundColor: "#e5faf2", color: "#3bb077" }} label="Yes" />
    );
  }

  return (
    <Chip sx={{ backgroundColor: "#fff0f1", color: "#d95087" }} label="No" />
  );
};
