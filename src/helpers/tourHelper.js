import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export const cities = [
  { value: "Hanoi", label: "Hà Nội" },
  { value: "HCMC", label: "Tp.Hồ Chí Minh" },
  { value: "Danang", label: "Đà Nẵng" },
  { value: "Cantho", label: "Cần Thơ" },
  { value: "Haiphong", label: "Hải Phòng" },
  { value: "Quangninh", label: "Quảng Ninh" },
];

export const kinds = [
  { value: "single", label: "Single" },
  { value: "fixed", label: "Fixed" },
];

export const vehicles = [
  { icon: <FlightTakeoffIcon key="airplane" />, key: "airplane" },
  { icon: <DirectionsBoatIcon key="boat" />, key: "boat" },
  { icon: <DirectionsBusIcon key="bus" />, key: "bus" },
];

export const timeFormatter = (time) => {
  if (time === undefined) return "";
  const arr = time.split("-");
  return `${arr[0]} Days - ${arr[1]} Nights`;
};

export const state = (kind, details) => {
  if (kind === "single") {
    return "Contact";
  } else {
    if ((details?.quantity ^ details?.limit) === 0) return "Full";
    else return `${details?.quantity}/${details?.limit}`;
  }
};

export const reportOptions = [
  "Negative words",
  "Offensive content",
  "Contempt for others",
  "Contempt for religion, politics",
  "Something else",
];
