import React, { useState } from "react";
import { connect } from "react-redux";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

import { createComplaint } from "@src/actions/complaintActions";

const ComplaintForm = ({ createComplaint }) => {
  const [orderNo, setOrderNo] = useState("");
  const [language, setLanguage] = useState("English");
  const [complaintType, setComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = React.useState(false);

  const englishComplaints = [
    { value: "", label: "--Select Your Complaint--" },
    { value: "damage-product", label: "Damaged Product" },
    { value: "late-delivery", label: "Late Delivery" },
    { value: "wrong-item-delivered", label: "Wrong Item Delivered" },
    { value: "incomplete-order", label: "Incomplete Order" },
    { value: "other", label: "Other" },
  ];

  const hindiComplaints = [
    { value: "", label: "--अपनी शिकायत चुनें--" },
    { value: "damage-product", label: "उत्पाद क्षतिग्रस्त" },
    { value: "late-delivery", label: "देरी से डिलीवरी" },
    { value: "wrong-item-delivered", label: "गलत वस्तु प्राप्त हुई" },
    { value: "incomplete-order", label: "आदेश अधूरा है" },
    { value: "other", label: "अन्य" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    const prepData = {
      orderNumber: orderNo,
      language,
      complaintType,
      complaintDescription,
      file: file,
    };

    setLoading(true);
    createComplaint(prepData).then((res) => {
      setLoading(false);
      if (res?.status) {
        setOrderNo("");
        setLanguage("");
        setComplaintType("English");
        setComplaintDescription("");
        setFile(null);
      }
    });
  };

  const getComplaintOptions = () => {
    return language === "English" ? englishComplaints : hindiComplaints;
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">REGISTER COMPLAINT</h2>
      <Form onSubmit={handleSubmit}>
        {/* Order Number */}
        <Form.Group as={Row} className="mb-3" controlId="orderNo">
          <Form.Label column sm={2}>
            Order No
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Enter Order Number"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* Language Select */}
        <Form.Group
          as={Row}
          className="mb-3 "
          controlId="language"
          style={{ minHeight: "40px" }}
        >
          <Form.Label column sm={2}>
            Preferred Language
          </Form.Label>
          <Col sm={10} column>
            <Form.Select
              style={{ minHeight: "40px", fontSize: "16px" }}
              className="form-control"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setComplaintType(""); // Reset complaint when language changes
              }}
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Complaint Select */}
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="complaintType"
          style={{ minHeight: "40px" }}
        >
          <Form.Label column sm={2}>
            Complaint Type
          </Form.Label>
          <Col sm={10}>
            <Form.Select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              style={{ minHeight: "40px", fontSize: "16px" }}
            >
              {getComplaintOptions().map((option, idx) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Complaint Textarea */}
        <Form.Group className="mb-3" controlId="complaintDescription">
          <Col sm={{ span: 10, offset: 2 }}>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Write your complaint here..."
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        {/* File Upload */}
        <Form.Group as={Row} className="mb-3" controlId="fileUpload">
          <Form.Label column sm={2}>
            Upload Photo/Video
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="text-danger mt-2">
              <strong>IMP -</strong>
              <br />
              For faster resolution, attach video of at least 50% part of order.
              <br />
              शिकायत के जल्द समाधान हेतु ऑर्डर के 50% भाग का वीडियो अटैच करें।
            </div>
          </Col>
        </Form.Group>

        {/* Submit Button */}
        <Row>
          <Col className="text-center mb-5">
            <Button
              className="rr-btn"
              type="submit"
              size="lg"
              disabled={
                !orderNo || !complaintType || !complaintDescription || loading
              }
            >
              {loading ? "Saving" : "Register Complaint"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { createComplaint })(ComplaintForm);
