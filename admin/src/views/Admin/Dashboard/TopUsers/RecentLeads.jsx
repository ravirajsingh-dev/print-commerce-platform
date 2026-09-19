import React from "react";
import { Row, Col, Image } from "react-bootstrap";

import { RxDotsVertical } from "react-icons/rx";

const RecentLeads = ({ usersList }) => {
  return (
    <div className="crm-card">
      <h5 className="d-inline-block">RECENT LEADS</h5>
      <RxDotsVertical className="float-end" size={"25px"} />

      {usersList.map((user, i) => (
        <Row key={i} className="top-performer-list">
          <Col lg={2} className="user-profile text-center">
            <Image src={user.profile} />
          </Col>
          <Col lg={7}>
            {user.name}
            <br></br>
            {user.email}
          </Col>
          <Col lg={3}>
            {user.leadResult === "won" ? (
              <span className="lead-won">Won lead</span>
            ) : user.leadResult === "lost" ? (
              <span className="lead-lost">Lost lead</span>
            ) : (
              <span className="lead-cold">Cold lead</span>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default RecentLeads;
