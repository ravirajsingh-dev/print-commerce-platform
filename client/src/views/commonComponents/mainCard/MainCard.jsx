import { Container, Row, Col } from "react-bootstrap";
import React from "react";

const MainCard = ({ children }) => {
  return (
    <div className="main-card">
      <Row>
        <Col>{children}</Col>
      </Row>
    </div>
  );
};

export default MainCard;
