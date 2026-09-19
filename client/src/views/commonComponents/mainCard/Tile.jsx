import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import CopyToClipboard from "react-copy-to-clipboard";
import { MdOutlineCopyAll } from "react-icons/md";

const Tile = ({ label, value, copyable, isImage = false }) => {
  return (
    <Row>
      <Col md="12" className="tile-label">
        {label}
      </Col>

      <Col md="12" className="tile-value">
        {isImage ? (
          value ? (
            <Image src={value} width="100" height="100" />
          ) : null
        ) : (
          value
        )}

        {copyable ? (
          <CopyToClipboard
            options={{ debug: true, message: "Copied" }}
            text={value}
          >
            <MdOutlineCopyAll className="tile-copy-icon" size={20} />
          </CopyToClipboard>
        ) : null}
      </Col>
    </Row>
  );
};

export default Tile;
