import React from "react";
import { RxDotsVertical } from "react-icons/rx";

import { PropTypes } from "prop-types";
import { Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiLogInCircle } from "react-icons/bi";

import BouncingLoader from "@views/spinners/BouncingLoader";

import { getDashboardClientsList } from "@actions/dashboardActions";

const ToPerforming = ({
  clientsList,
  getDashboardClientsList,
  loadingClientList,
  isSum,
}) => {
  React.useEffect(() => {
    getDashboardClientsList();
  }, [getDashboardClientsList]);

  const { data = [] } = clientsList;
  return (
    <div className="crm-card dashboard-clients-list">
      <h5 className="d-inline-block">CLIENTS LIST</h5>
      <RxDotsVertical className="float-end" size={"25px"} />

      <div className="w-100">
        {loadingClientList ? (
          <div className="list-loader-div">
            <BouncingLoader />
          </div>
        ) : data && data.length ? (
          data.map((client, i) => (
            <Row
              key={i}
              className={
                isSum(i) ? "top-performer-list" : "top-performer-list-grey"
              }
            >
              <Col md="10">
                {client.name}
                <br></br>
                <span className="c-blue">{client.code}</span>
              </Col>

              <Col md="2">
                <Link
                  to={`/admin/clients/${client._id}/workspace`}
                  title="Access workspace"
                >
                  <Button variant="primary" size="sm" className="m-1 p-1">
                    <BiLogInCircle size="18px" />
                  </Button>
                </Link>
              </Col>
            </Row>
          ))
        ) : (
          <span className="d-flex justify-content-center">
            No clients found
          </span>
        )}
      </div>
    </div>
  );
};

ToPerforming.propTypes = {
  getDashboardClientsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  clientsList: state.dashboard.clientsList,
  loadingClientList: state.dashboard.loadingClientList,
});

export default connect(mapStateToProps, {
  getDashboardClientsList,
})(ToPerforming);
