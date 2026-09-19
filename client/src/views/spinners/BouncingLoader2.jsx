import React from "react";

export default ({ minHeight = "100px" }) => (
  <React.Fragment>
    <div
      className="loader-outer d-flex justify-content-center align-items-center"
      style={{ minHeight: minHeight }}
    >
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </React.Fragment>
);
