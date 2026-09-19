import React from "react";
import { connect } from "react-redux";

import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import CRMOverReview from "./CRMOverReview";
import DashboardReports from "./DashboardReports";

import {
  getDashboardDetails,
  getPastWeekOrdersData,
} from "@actions/dashboardActions";

const AdminDashboard = ({ getDashboardDetails, getPastWeekOrdersData }) => {
  React.useEffect(() => {
    getDashboardDetails();
    // getPastWeekOrdersData();
  }, []);

  React.useEffect(() => {
    const intervel = setInterval(() => {
      getDashboardDetails(false);
    }, 30000);
    return () => {
      clearInterval(intervel);
    };
  }, []);

  return (
    <React.Fragment>
      <AppBreadcrumb pageTitle="Dashboard" />

      <CRMOverReview />
      <DashboardReports />
      {/* <TopUsers /> */}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  getDashboardDetails,
  getPastWeekOrdersData,
})(AdminDashboard);
