import React from "react";

export default ({ minHeight = "100px", display = "flex" }) => (
  <React.Fragment>
    <div
      className="loader-outer"
      style={{ minHeight: minHeight, display: display }}
    >
      <div className="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </React.Fragment>
);
