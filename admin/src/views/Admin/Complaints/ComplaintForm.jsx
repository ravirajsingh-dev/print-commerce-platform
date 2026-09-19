import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card, Image } from "react-bootstrap";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";

import {
  updateComplaintStatus,
  setErrors,
  removeComplaintErrors,
  loadPage,
} from "@actions/complaintActions";
import ConfirmPopup from "../Layout/ConfirmBox";

const ComplaintForm = ({
  updateComplaintStatus,
  errorList,
  setErrors,
  removeComplaintErrors,
  complaintID,
  loadPage,
  currentComplaint,
}) => {
  const navigate = useNavigate();

  const initialFormData = {
    complaintDescription: "",
    complaintType: "",
    name: "",
    orderNumber: "",
    file: "",
    userName: "",
    SA_ID: "",
    status: "",
    primary: false,
  };

  React.useEffect(() => {
    if (!complaintID) {
      loadPage();
    }
  }, []);

  const loadComplaintFormData = (currentComplaint) => {
    const {
      complaintDescription,
      complaintType,
      name,
      orderNumber,
      userName,
      SA_ID,
      status,
      file,
      primary,
    } = currentComplaint;

    const data = {
      complaintDescription,
      complaintType,
      name,
      orderNumber,
      userName,
      SA_ID,
      status,
      file,
      primary,
    };
    setFormData((formData) => ({ ...formData, ...data }));
  };

  React.useEffect(() => {
    if (!complaintID || !currentComplaint) return;

    loadComplaintFormData(currentComplaint);
  }, [currentComplaint]);

  React.useEffect(() => {
    console.log("currentComplaint", currentComplaint);
  }, [currentComplaint]);

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalData, setModalData] = React.useState({
    entity: "Complaint Status",
  });
  const [isDisabled, setDisabled] = React.useState(complaintID ? true : false);

  const {
    complaintDescription,
    complaintType,
    name,
    orderNumber,
    userName,
    SA_ID,
    file,
    primary,
    status,
  } = formData;

  const onClickComplete = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  return (
    <>
      <ConfirmPopup
        entity={modalData?.entity}
        modal={showConfirmModal}
        inputText="Update"
        btnText="Update"
        name={orderNumber}
        onYes={() => {
          setShowConfirmModal(false);
          setSubmitting(true);
          updateComplaintStatus(complaintID, navigate).then(() => {
            setSubmitting(false);
            setModalData(null);
          });
        }}
        onNo={() => {
          setShowConfirmModal(false);
          setModalData(null);
        }}
      />
      <Card>
        <Card.Body>
          <Form autoComplete="off" className="registration-form">
            <Row className="row-gap-3">
              <Col className="text-end">
                {/* Order Number */}
                <Form.Group as={Row} className="mb-3" controlId="orderNo">
                  <Form.Label column sm={2}>
                    User Name
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Order Number"
                      value={userName}
                      disabled
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col className="text-end">
                {/* Complaint Type */}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>
                    SA ID
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control type="text" value={SA_ID} disabled />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-gap-3">
              <Col className="text-end">
                {/* Order Number */}
                <Form.Group as={Row} className="mb-3" controlId="orderNo">
                  <Form.Label column sm={2}>
                    Order No
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      placeholder="Enter Order Number"
                      value={orderNumber}
                      disabled
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col className="text-end">
                {/* Complaint Type */}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>
                    Complaint Type
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control type="text" value={complaintType} disabled />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-gap-3">
              <Col className="text-end">
                {/* complaintDescription */}
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="complaintDescription"
                >
                  <Form.Label column sm={2}>
                    Description
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={complaintDescription}
                      disabled
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col className="text-end">
                {/* Complaint Type */}
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>
                    Image
                  </Form.Label>
                  <Col sm={9}>
                    {file ? <Image src={file} width="350" /> : "Not Uploaded"}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-gap-3">
              <Col sm={6} className="text-end">
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={2}>
                    Status
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control type="text" value={status} disabled />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row className="row-gap-3">
              <Col xs={12} className="text-end">
                <Button
                  className="m-2"
                  type="button"
                  onClick={onClickComplete}
                  variant="primary"
                  disabled={
                    submitting || currentComplaint?.status === "Completed"
                  }
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
                      {` Loading... `}
                    </>
                  ) : currentComplaint?.status === "Completed" ? (
                    <>Completed</>
                  ) : (
                    <>Complete</>
                  )}
                </Button>
                <Button
                  className="ml-2"
                  type="reset"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Back to List
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

ComplaintForm.propTypes = {
  updateComplaintStatus: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
  removeComplaintErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  currentComplaint: state.complaint.currentComplaint,
});

export default connect(mapStateToProps, {
  updateComplaintStatus,
  setErrors,
  removeComplaintErrors,
  loadPage,
})(ComplaintForm);
