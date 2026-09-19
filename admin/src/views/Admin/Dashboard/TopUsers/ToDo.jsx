import React from "react";
import { Form, Image } from "react-bootstrap";

import { BsArrowRight } from "react-icons/bs";
import { RxDotsVertical } from "react-icons/rx";
import { TbSpeakerphone } from "react-icons/tb";

import MobileImage from "../../../../assets/images/email-campaign.svg";

const ToDo = () => {
  return (
    <div>
      <div className="mobile-section">
        <div>
          <TbSpeakerphone size={"30px"} />
          <h4>
            Enhance your Campaign for better outreach{" "}
            <span>
              <BsArrowRight />
            </span>
          </h4>
        </div>
        <Image src={MobileImage} width="150" />
      </div>

      <div className="crm-card mt-4">
        <h5 className="d-inline-block">TODO</h5>
        <RxDotsVertical className="float-end" size={"25px"} />

        <Form>
          <div className="task-to-do">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" checked required />
            </Form.Group>
            <span className="strike">Build an angular app</span>
          </div>
          <div className="task-to-do">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" required />
            </Form.Group>
            <span>Create New Version 3.0</span>
          </div>
          <div className="task-to-do">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" checked required />
            </Form.Group>
            <span className="strike">Hehe! This Looks cool!</span>
          </div>
          <div className="task-to-do">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" required />
            </Form.Group>
            <span>Testing</span>
          </div>
          <div className="task-to-do">
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" required />
            </Form.Group>
            <span>Creating Component Page</span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ToDo;
