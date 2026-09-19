import React, { Fragment } from "react";
import spinner from "@assets/spinner.gif";

export default ({ width }) => (
  <Fragment>
    <img
      src={spinner}
      alt="Loading..."
      style={{
        width: width ? width : "200px",
        margin: "auto",
        display: "block",
      }}
    />
  </Fragment>
);
