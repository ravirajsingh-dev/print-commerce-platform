import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setRouter } from "@src/utils/routerService";
import { removeAllErrors } from "@src/actions/commonActions";
import Header from "./Header/Header";
import Header2 from "./Header/Header2";
import Footer from "./Footer/Footer";
import SubHeader from "./Header/SubHeader";
import ScrollToTop from "@src/ScrollToTop";

const Publicayout = ({ auth: { user }, alerts, removeAllErrors }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setRouter(navigate);
  }, [navigate]);

  useEffect(() => {
    // Clear alerts when URL changes
    removeAllErrors();
  }, [location.pathname, removeAllErrors]);

  const createAlertNotification = (type, message) => {
    switch (type) {
      case "info":
        toast.info(message);
        break;
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "danger":
        toast.error(message);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (alerts?.length > 0) {
      alerts.forEach((alert) => {
        createAlertNotification(alert.alertType, alert.msg);
      });
    }
  }, [alerts]);

  return (
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

        <Footer />
      </div>
    </HelmetProvider>
  );
};

Publicayout.propTypes = {
  auth: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
  removeAllErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});

export default connect(mapStateToProps, { removeAllErrors })(Publicayout);
