import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { connect } from "react-redux";
import searchFile from "@assets/images/ErrorPage/file-searching.svg";

import { isAdmin } from "@utils/helper";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import { Link } from "react-router-dom";

import { BiShare } from "react-icons/bi";

const NotFoundInner = ({ loggedInUser }) => {
  return (
    <React.Fragment>
      {isAdmin(loggedInUser) ? (
        <AppBreadcrumb pageTitle="404 Error" crumbs={[{ name: "404" }]} />
      ) : (
        <div className="mt-5"></div>
      )}
      <Row className="d-flex justify-content-center">
        <Col xs="12" sm="6" md="4" className="text-center">
          <Image src={searchFile} height={100} />

          <h1 className="error-text-404 mt-4">404</h1>

          <h4 className="text-uppercase mt-4 text-danger">Page not found</h4>

          <p className="mt-4 text-muted">
            It's looking like you may have taken a wrong turn. Don't worry... it
            happens to the best of us. Here's a little tip that might help you
            get back on track.
          </p>

          {isAdmin(loggedInUser) ? (
            <Link
              to="/admin/dashboard"
              className="btn btn-info p-2 mt-3 rounded-0"
            >
              <BiShare /> Return Home
            </Link>
          ) : loggedInUser ? (
            <Link
              to={`/admin/providers/${loggedInUser.provider_id}/provider-dashboard`}
              className="btn btn-info p-2 mt-3 rounded-0"
            >
              <BiShare /> Return Home
            </Link>
          ) : null}
        </Col>
      </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {})(NotFoundInner);
