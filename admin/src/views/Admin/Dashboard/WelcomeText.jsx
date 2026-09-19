import React from "react";
import { Row, Col } from "react-bootstrap";

const WelcomeText = () => {
  return (
    <div>
      <Row className="d-flex">
        <Col>
          <h2 className="text-center mt-5 pt-5">
            Welcome to Shree Adevertising Admin!
          </h2>
        </Col>
      </Row>
    </div>
  );
};

export default WelcomeText;
