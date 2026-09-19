import React from "react";
import { Row, Col } from "react-bootstrap";

import TopPerforming from "./ToPerforming";
import RecentLeads from "./RecentLeads";
import ToDo from "./ToDo";
import NoUserImage from "../../../../assets/images/no-user.png";

const TopUsers = () => {
  const isSum = (num) => {
    return num % 2 === 1 ? true : false;
  };

  const usersList = [
    {
      name: "Jeremy Young",
      work: "Senior Sales Executive",
      leads: 187,
      deals: 154,
      tasks: 49,
      profile: NoUserImage,
      email: "jeremy@example.com",
      leadResult: "cold",
    },
    {
      name: "Thomas Kruger",
      work: "Senior Sales Executive",
      leads: 235,
      deals: 127,
      tasks: 83,
      profile: NoUserImage,
      email: "thomas@example.com",
      leadResult: "lost",
    },
    {
      name: "Pete Burdine",
      work: "Senior Sales Executive",
      leads: 365,
      deals: 148,
      tasks: 62,
      profile: NoUserImage,
      email: "pete@example.com",
      leadResult: "won",
    },
    {
      name: "Mary Nelson",
      work: "Senior Sales Executive",
      leads: 753,
      deals: 159,
      tasks: 93,
      profile: NoUserImage,
      email: "mary@example.com",
      leadResult: "cold",
    },
    {
      name: "Kevin Grove",
      work: "Senior Sales Executive",
      leads: 458,
      deals: 126,
      tasks: 73,
      profile: NoUserImage,
      email: "kevin@example.com",
      leadResult: "won",
    },
  ];
  return (
    <div className="mt-4">
      <Row>
        {/* <Col>
          <TopPerforming usersList={usersList} isSum={isSum} />
        </Col> */}

        <Col>
          <RecentLeads usersList={usersList} />
        </Col>
        <Col>
          <ToDo />
        </Col>
      </Row>
    </div>
  );
};

export default TopUsers;
