import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { LineChart, ResponsiveContainer, Line, BarChart, Bar } from "recharts";

import { BsArrowUp, BsArrowDown } from "react-icons/bs";

import LoadingSkeleton from "@views/spinners/SkeletonLoader";

const CRMOverReview = ({ dashboardDetails, loadingDashboard }) => {
  return (
    <div>
      <Row className="d-flex first-line-data">
        <Col>
          <div className="crm-card">
            <h4>Total Users</h4>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.totalUsers}</strong>
            )}

            {/* <span className="d-block mt-3 c-green">
                  <BsArrowUp color={"green"} /> 3.17%
                </span> */}

            {/* <Col>
                <ResponsiveContainer>
                  <BarChart width={150} height={40} data={data}>
                    <Bar dataKey="c1" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Col> */}
          </div>
        </Col>
        <Col>
          <div className="crm-card">
            <h4>Today Orders</h4>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.todayOrders}</strong>
            )}
            {/* <span className="d-block mt-3 c-red">
                  <BsArrowDown /> 5.89%
                </span> */}
          </div>
        </Col>
        <Col>
          <div className="crm-card">
            <h4>Pending Orders</h4>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.pendingOrders}</strong>
            )}
            {/* <span className="d-block mt-3 c-green">
                  <BsArrowUp color={"green"} /> 4.58%
                </span> */}
          </div>
        </Col>
        <Col>
          <div className="crm-card">
            <h4>Pending Requests</h4>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.pendingWalletRequests}</strong>
            )}
            {/* <span className="d-block mt-3 c-green">
                  <BsArrowUp color={"green"} /> 11.7%
                </span> */}
          </div>
        </Col>
        <Col>
          <div className="crm-card">
            <h4>Total Credited(₹)</h4>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.totalCreditedAmount}</strong>
            )}

            {/* <span className="d-block mt-3 c-green">
                  <BsArrowUp color={"green"} /> 3.17%
                </span> */}
          </div>
        </Col>
        <Col>
          <div className="crm-card">
            <h5>Today's Dispatch Count</h5>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.todaysDispatch}</strong>
            )}
            {/* <span className="d-block mt-3 c-green">
                  <BsArrowUp color={"green"} /> 3.17%
                </span> */}
          </div>
        </Col>

        <Col>
          <div className="crm-card">
            <h5>Today's Square Feet </h5>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.todaySquareFeet}</strong>
            )}
          </div>
        </Col>

        <Col>
          <div className="crm-card">
            <h5>Today's Received Payment</h5>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.todayReceivedPayment}</strong>
            )}
          </div>
        </Col>

        <Col>
          <div className="crm-card">
            <h5>Today's Pending Payment</h5>
            {loadingDashboard ? (
              <LoadingSkeleton count={1} />
            ) : (
              <strong>{dashboardDetails?.todayPendingPayment}</strong>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardDetails: state.dashboard.dashboardDetails,
  loadingDashboard: state.dashboard.loadingDashboard,
});

export default connect(mapStateToProps, {})(CRMOverReview);
