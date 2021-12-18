import React from "react";

const Home = () => {
  return (
    <div>
      <img
        src={`${process.env.PUBLIC_URL}/assets/images/.png`}
        alt="avatar"
        width="100%"
        className="rounded-circle"
      />
    </div>
  );
};

export default Home;
