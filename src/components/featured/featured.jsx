import React from "react";
import { connect } from "react-redux";

const Featured = () => {
  return (
    <div className="featured">
      <img
        src={`${process.env.PUBLIC_URL}/assets/images/夏夜の晨曦.jpg`}
        alt="featured images"
      />
      <div className="info">
        <h1 className="title"> Tour XXXXXXXXXXXXXXX</h1>
        <span className="desc">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit
          pariatur soluta, expedita facilis magnam, excepturi numquam
          dignissimos voluptates laudantium ratione animi. Itaque molestiae in
          repellat perferendis? Repellat sequi vitae deserunt?
        </span>
        <div className="buttons">
          <button className="mark">
            <span>Mark</span>
          </button>
          <button className="more">
            <span>More</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Featured;
