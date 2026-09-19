import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import "react-toastify/dist/ReactToastify.css";

import { isAdmin } from "@utils/helper";

import AdminRoutes from "@views/Routing/AdminRoutes";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";
import DefaultTopNav from "./DefaultTopNav";
import NotFoundInner from "@views/404Inner";
import BouncingLoader from "@views/spinners/BouncingLoader";

const AdminLayout = ({
  auth: { actionPending, user, loading, isAuthenticated },
  alerts,
}) => {
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

  React.useEffect(() => {
    alerts !== null &&
      alerts.length > 0 &&
      alerts.map((alert) => {
        createAlertNotification(`${alert.alertType}`, alert.msg);
      });
  }, [alerts, actionPending]);

  return loading ? (
    <BouncingLoader />
  ) : isAuthenticated ? (
    <div className="admin-dashboard">
      <Helmet>
        {/* <title>Admin Portal | {process.env.REACT_APP_APP_NAME}</title> */}
      </Helmet>

      <div className="top-layout">
        <DefaultHeader />
        <ToastContainer />
        <DefaultTopNav />
        <Container fluid>
          <Routes>
            {AdminRoutes.map((route, i) => {
              return user || isAdmin(user) ? (
                <Route path={route.path} element={route.element} key={i} />
              ) : (
                <Route path="/*" element={<NotFoundInner />} key={i} />
              );
            })}
          </Routes>
        </Container>
      </div>
      <div className="footer-layout">
        <DefaultFooter />
      </div>
    </div>
  ) : (
    <>Hello</>
  );
};

AdminLayout.propTypes = {
  auth: PropTypes.object.isRequired,
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alerts: state.alert,
});
export default connect(mapStateToProps, {
  // loadPendingAction,
  // updateSidebar,
  // logout,
})(AdminLayout);
