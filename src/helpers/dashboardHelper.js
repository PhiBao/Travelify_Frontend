import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export const arrow = (cur, last) => {
  if (cur < last) {
    return <ArrowDropDownIcon color="error" />;
  } else {
    return <ArrowDropUpIcon color="success" />;
  }
};
