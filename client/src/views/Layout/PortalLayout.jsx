import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Header/Header";
import Footer2 from "./Footer/Footer2";
import BouncingLoader from "../spinners/BouncingLoader";
import Header2 from "./Header/Header2";
import SubHeader from "./Header/SubHeader";
import ScrollToTop from "@src/ScrollToTop";

const PortalLayout = ({ auth: { isAuthenticated, loading, user }, alerts }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setIsAuthChecked(true);
    }
  }, [loading]);

  useEffect(() => {
    if (!user) return;
  }, [user]);

  const createAlertNotification = (type, message) => {
    switch (type) {
      case "info":
        return toast.info(message);
      case "success":
        return toast.success(message);
      case "warning":
        return toast.warning(message);
      case "danger":
        return toast.error(message);
    }
  };

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      alerts.forEach((alert) => {
        createAlertNotification(`${alert.alertType}`, alert.msg);
      });
    }
  }, [alerts]);

  if (loading || !isAuthChecked) {
    return <BouncingLoader minHeight="500px" />;
  }

  return isAuthenticated ? (
    <HelmetProvider>
      <ScrollToTop />
      <ToastContainer />
      <div className="d-flex flex-column min-vh-100">
        {user?._id ? (
          <>
            <Header2 />
            <SubHeader />
          </>
        ) : (
          <Header />
        )}
        <div className="">
          <div className="adminScroll">
            <Outlet />
          </div>
        </div>

        <Footer2 />
      </div>
    </HelmetProvider>
  ) : (
    <Navigate to="/login" />
  );
};

PortalLayout.propTypes = {
  auth: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});

export default connect(mapStateToProps)(PortalLayout);
