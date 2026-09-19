import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col, Button } from "react-bootstrap";
import {
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

import { RxDotsVertical } from "react-icons/rx";

import {
  generateOrderReport,
  generateStockReport,
  updateUserByID,
} from "@actions/dashboardActions";
import { downloadFileToLocal } from "@utils/helper";
import BouncingLoader from "@views/spinners/BouncingLoader";
import Tile from "./Tile";
import ConfirmPopup from "../Layout/ConfirmBox";

const DashboardReports = ({
  loadingDashboard,
  generateOrderReport,
  generateStockReport,
  dashboardDetails,
  updateUserByID,
}) => {
  const { newUsers = [], todayOrderDetails = [] } = dashboardDetails;

  const [statusModal, setStatusModal] = React.useState(false);
  const [modalData, setModalData] = React.useState(null);

  const [btnLoading, setBtnLoading] = React.useState({
    todayOrderReport: false,
    monthOrderReport: false,
    todayStockReport: false,
    monthStockReport: false,
  });

  const {
    todayOrderReport,
    monthOrderReport,
    todayStockReport,
    monthStockReport,
  } = btnLoading;

  const handleOrderReportDownload = (type, date) => {
    setBtnLoading({ ...btnLoading, [type]: true });
    generateOrderReport(date).then(() => {
      setBtnLoading({ ...btnLoading, [type]: false });
    });

    generateOrderReport(date).then(async (blob) => {
      setBtnLoading({ ...btnLoading, [type]: false });
      if (!blob) return;

      const fileURL = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv;charset=utf-8;" })
      );

      const fileName = `order-report-${moment().format("MMM Do")}.csv`;

      downloadFileToLocal(fileURL, fileName);
    });
  };

  const handleMonthReportDownload = (type, date) => {
    setBtnLoading({ ...btnLoading, [type]: true });
    generateStockReport(date).then((blob) => {
      setBtnLoading({ ...btnLoading, [type]: false });

      if (!blob) return;

      const fileURL = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv;charset=utf-8;" })
      );

      const fileName = `stock-report-${moment().format("MMM Do")}.csv`;

      downloadFileToLocal(fileURL, fileName);
    });
  };

  const onClickUserHandle = (user, status) => {
    setModalData({
      id: user._id,
      name: user.name,
      status,
      entity: "User",
    });
    setStatusModal(true);
  };

  const onClickYes = () => {
    updateUserByID(modalData.id, modalData.status).then(() => {
      setStatusModal(false);
    });
  };

  return (
    <div className="mt-4">
      <ConfirmPopup
        entity={modalData?.entity}
        modal={statusModal}
        name={modalData?.name}
        onYes={() => {
          onClickYes();
        }}
        onNo={() => {
          setStatusModal(false);
          setModalData({
            name: "",
            id: "",
            status: "",
            entity: "",
          });
        }}
        inputText={modalData?.status}
        btnText="Yes"
      />
      <Row>
        <Col sm="4">
          <Row>
            <Col sm="12">
              <div className="crm-card text-center">
                <h3>
                  <strong>Reports Section</strong>
                </h3>
              </div>
            </Col>
            <Col sm="6" className="mt-3 text-center">
              <div className="crm-card">
                <h4>Today's Orders</h4>

                <Button
                  onClick={(e) => {
                    handleOrderReportDownload("todayOrderReport", "today");
                  }}
                  disabled={todayOrderReport}
                >
                  {todayOrderReport ? "Downloading..." : "Download"}
                </Button>
              </div>
            </Col>
            <Col sm="6" className="mt-3 text-center">
              <div className="crm-card">
                <h4>Month Orders</h4>

                <Button
                  onClick={(e) => {
                    handleOrderReportDownload("monthOrderReport", "month");
                  }}
                >
                  {monthOrderReport ? "Downloading..." : "Download"}
                </Button>
              </div>
            </Col>
            <Col sm="6" className="mt-3 text-center">
              <div className="crm-card">
                <h4>Today's Stock Report</h4>

                <Button
                  onClick={(e) => {
                    handleMonthReportDownload("todayStockReport", "today");
                  }}
                >
                  {todayStockReport ? "Downloading..." : "Download"}
                </Button>
              </div>
            </Col>
            <Col sm="6" className="mt-3 text-center">
              <div className="crm-card">
                <h4>Month Stock Report</h4>

                <Button
                  onClick={(e) => {
                    handleMonthReportDownload("monthStockReport", "month");
                  }}
                >
                  {monthStockReport ? "Downloading..." : "Download"}
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs="8">
          <Row>
            <Col xs="12">
              <div
                className="crm-card"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                <Col xs="12">
                  <h4>New Users</h4>
                </Col>
                {loadingDashboard ? (
                  <div className="text-center w-full mx-auto">
                    <BouncingLoader minHeight="200px" display="unset" />
                  </div>
                ) : newUsers.length > 0 ? (
                  newUsers.map((user, i) => (
                    <Row className="tile-body mt-2 shadow" key={user._id}>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Name" value={user.name} />
                      </Col>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Email" value={user.email} />
                      </Col>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Phone" value={user.phone} />
                      </Col>

                      <Col
                        xs="12"
                        sm="6"
                        md="4"
                        lg="3"
                        className="text-center d-flex align-items-center"
                      >
                        <Button
                          title="Approve User"
                          type="button"
                          variant="primary"
                          onClick={(e) => {
                            onClickUserHandle(user, "approve");
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          className="ms-2"
                          onClick={(e) => {
                            onClickUserHandle(user, "delete");
                          }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row className="no-result">
                    <Col xs="12" className="text-center">
                      No new users found.
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
            <Col xs="12" className="mt-3">
              <div
                className="crm-card"
                style={{ height: "250px", overflowY: "scroll" }}
              >
                <Col xs="12">
                  <h4>Today Orders</h4>
                </Col>
                {loadingDashboard ? (
                  <div className="text-center w-full mx-auto">
                    <BouncingLoader minHeight="200px" display="unset" />
                  </div>
                ) : todayOrderDetails.length > 0 ? (
                  todayOrderDetails.map((order, i) => (
                    <Row className="tile-body mt-2 shadow" key={order._id}>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Order ID" value={order.order_id} />
                      </Col>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Order By" value={order.user?.name} />
                      </Col>
                      <Col xs="12" sm="6" md="4" lg="3">
                        <Tile label="Status" value={order.status} />
                      </Col>
                      <Col xs="12" sm="6" md="4" lg="3" className="text-center">
                        <Tile
                          label="Amount"
                          value={order?.full_amount || "-"}
                        />
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row className="no-result">
                    <Col xs="12" className="text-center">
                      No new users found.
                    </Col>
                  </Row>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dashboardDetails: state.dashboard.dashboardDetails,
  loadingDashboard: state.dashboard.loadingDashboard,
});

export default connect(mapStateToProps, {
  generateOrderReport,
  generateStockReport,
  updateUserByID,
})(DashboardReports);
