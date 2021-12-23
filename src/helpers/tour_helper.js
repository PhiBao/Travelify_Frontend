import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

export const cities = [
  { value: "Hanoi", label: "Hà Nội" },
  { value: "Tp.HCM", label: "Tp.Hồ Chí Minh" },
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
  { icon: <FlightTakeoffIcon />, key: "airplane" },
  { icon: <DirectionsBoatIcon />, key: "boat" },
  { icon: <DirectionsBusIcon />, key: "bus" },
];
