import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";

import { FaRegCopyright } from "react-icons/fa";

const DefaultFooter = () => {
  return (
    <footer className="footer-section">
      <div className="container-fluid">
        <Row>
          <Col className="col-lg-10">
            <span>
              {moment().year()} <FaRegCopyright /> Shree Adevertising. All
              rights reserved.
            </span>
          </Col>
          <Col className="col-lg-2 footer-nav">
            {/* <Link to="/about">About</Link>
            <Link to="/support">Support</Link>
            <Link to="/contact-us">Contact Us</Link> */}
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default DefaultFooter;
