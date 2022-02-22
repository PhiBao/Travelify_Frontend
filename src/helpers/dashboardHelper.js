import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import Chip from "@mui/material/Chip";
import _ from "lodash";

export const arrow = (cur, last) => {
  if (parseFloat(cur) < parseFloat(last)) {
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
  const res =
    (parseFloat(cur) > parseFloat(last)
      ? parseFloat(cur) / parseFloat(last)
      : parseFloat(last) / parseFloat(cur)) * 100;
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
  } else
    return (
      <Chip sx={{ backgroundColor: "#fff0f1", color: "#d95087" }} label="No" />
    );
};

export const tourKind = (kind) => {
  switch (kind) {
    case "fixed":
      return (
        <Chip
          sx={{ backgroundColor: "#ffe0b2", color: "#f57c00" }}
          label="Fixed"
        />
      );
    case "single":
      return (
        <Chip
          sx={{ backgroundColor: "#b3e5fc", color: "#0288d1" }}
          label="Single"
        />
      );
    default:
      return;
  }
};

export const toDataURL = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

export function dataURLtoFile(dataUrl, filename) {
  var arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const transactionStatus = [
  { value: "paid", label: "Paid" },
  { value: "confirming", label: "Confirming" },
  { value: "canceled", label: "Canceled" },
];

export const dataFormatter = (data, total) => {
  const travellerAttributes = _.pick(data, [
    "name",
    "phoneNumber",
    "email",
    "note",
  ]);
  const rest = _.pick(data, ["adults", "children", "departureDate"]);

  return {
    booking: {
      ...rest,
      tourId: data.tour.value,
      total,
      status: data.status.value,
      travellerAttributes,
    },
  };
};

export const typeReport = (type) => {
  switch (type) {
    case "Review":
      return (
        <Chip
          sx={{ backgroundColor: "#ffee58", color: "#000" }}
          icon={<ReviewsIcon />}
          label="Review"
        />
      );
    case "Comment":
      return (
        <Chip
          sx={{ backgroundColor: "#b3e5fc", color: "#000" }}
          icon={<ModeCommentIcon />}
          label="Comment"
        />
      );
    default:
      return "";
  }
};
