import moment from "moment";
import _ from "lodash";

export const dateFormatter = (date) => {
  return moment(date).format("llll");
};

export const shortDateFormatter = (date) => {
  if (!date) return "";
  return moment(date).format("lll");
};

export const noTimeFormatter = (date = "") => {
  if (!date) return "";
  return moment(date).format("ll");
};

export const fromNow = (date) => {
  return moment(date).fromNow();
};

export const DEFAULT_DATE = moment().add(1, "days");

export const reviewStatus = (departureDate, status, review) => {
  if (!_.isEmpty(review)) return "Rated";

  const diff = moment().diff(moment(departureDate), "days");

  if (diff < 7 && status === "paid") return "Can rate";

  return "Can't rate";
};

export const timeSentence = (kind, details) => {
  if (kind === "single") {
    const { time = "" } = details;
    const arr = time.split("-");
    return `${arr[0]} Days - ${arr[1]} Nights`;
  } else {
    return `${moment(details?.beginDate).format("llll")}`;
  }
};
