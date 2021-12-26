import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import moment from "moment";

export const cities = [
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Tp.Hồ Chí Minh", label: "Tp.Hồ Chí Minh" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
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

export const timeSentence = (kind, details) => {
  if (kind === "single") {
    const { time = "" } = details;
    const arr = time.split("-");
    return `${arr[0]} Days - ${arr[1]} Nights`;
  } else {
    return `Depart at ${moment(details?.beginDate)
      .add(process.env.REACT_APP_TIME_ZONE_DIFF, "hours")
      .format("H:mm, dddd, D-MM-gg")}`;
  }
};
