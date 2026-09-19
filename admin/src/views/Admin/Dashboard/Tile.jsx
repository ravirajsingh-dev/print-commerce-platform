import React from "react";
import { Row, Col } from "react-bootstrap";
import { MdOutlineCopyAll } from "react-icons/md";

const Tile = ({ label, value, copyable }) => {
  return (
    <Row>
      <Col md="12" className="tile-label">
        {label}
      </Col>

      <Col md="12" className="tile-value">
        {value}
      </Col>
    </Row>
  );
};

export default Tile;
