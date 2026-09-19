import React from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo-dark-new.png";
import { FaRegEyeSlash } from "react-icons/fa";
import { connect } from "react-redux";
import { signup } from "../actions/auth";
import Errors from "@notifications/Errors";

const Signup = ({ signup, errorList }) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    terms: "",
  };

  const [validated, setValidated] = React.useState(false);
  const [formData, setFormData] = React.useState(initialState);

  const onChange = (e) => {
    if (!e) return;

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeCheck = (e) => {
    if (!e.target) return;

    setFormData({
      ...formData,
      terms: e.target.checked ? true : false,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    // do validation here
    signup(formData);
  };

  return (
    <div className="auth-fluid">
      <div className="auth-fluid-form-box">
        <Row className="align-items-center d-flex h-100 auth-fluid-form">
          <div className="auth-brand text-center text-lg-start">
            <Link to="/">
              <span>
                <img src={logo} alt="" height="40" />
              </span>
            </Link>
          </div>
          <Col lg="12">
            <Card>
              <Card.Body>
                <Card.Title className="mt-0 mb-3">Free Sing Up</Card.Title>
                <Card.Text className="text-muted mb-4">
                  Don't have an account? Create your account, it takes less than
                  a minute
                </Card.Text>

                <Form
                  noValidate
                  validated={validated}
                  className="p-3"
                  onSubmit={(e) => onSubmit(e)}
                >
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your Name"
                      name="name"
                      onChange={(e) => onChange(e)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      onChange={(e) => onChange(e)}
                      required
                    />
                    <Errors current_key="email" key="email" />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(e) => onChange(e)}
                        required
                      />
                      <InputGroup.Text>
                        <FaRegEyeSlash />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="I accept Terms and Conditions"
                      onChange={(e) => onChangeCheck(e)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      You must agree before submitting.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="d-grid mt-4 mb-0 text-center">
                    <Button variant="primary" type="submit">
                      Sign Up
                    </Button>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
            <Row className="text-center mt-3 mb-3">
              <Col>
                <span>Already have account?</span>
                <Link to="/login" className="text-muted ms-1 text-decoration">
                  <strong>Log In </strong>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
});

export default connect(mapStateToProps, {
  signup,
})(Signup);
