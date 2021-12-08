import React from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export const Loading = () => {
  return (
    <div className="loading">
      <Loader type="ThreeDots" color="#000" height={100} width={100} />
    </div>
  );
};

export default Loading;
