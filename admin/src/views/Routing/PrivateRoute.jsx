import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import BouncingLoader from "@views/spinners/BouncingLoader";

const PrivateRoute = ({
  component,
  auth: { isAuthenticated, loading, user },
  ...rest
}) => {
  return loading || !isAuthenticated ? (
    <div className="center-loader">
      <BouncingLoader />
    </div>
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
