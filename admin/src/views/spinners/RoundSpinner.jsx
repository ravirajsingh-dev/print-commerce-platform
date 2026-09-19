import React from "react";

export default ({ variant, size }) => (
  <React.Fragment>
    <div className="tab-pane show active m-auto" id="colored-spinner-preview">
      <div
        className={`spinner-border text-${variant ? variant : "primary"} ${
          size ? `avatar-${size}` : ""
        }`}
      ></div>
    </div>
  </React.Fragment>
);
