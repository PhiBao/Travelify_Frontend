import React from "react";
import { connect } from "react-redux";

export const Tours = (props) => {
  return (
    <div className="mt-5">
      <h1>Tours</h1>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Tours);
