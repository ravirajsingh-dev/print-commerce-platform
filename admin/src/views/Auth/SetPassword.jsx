import React, { useState, useMemo } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  setPassword as resetPassword,
  setPasswordError,
  loadPage,
} from "@actions/auth";
import { useNavigate } from "react-router-dom";

import { setAlert } from "@actions/alert";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo-dark-new.png";
import Spinner from "../Spinner";
import Alert from "../../notifications/Alert";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Errors from "@notifications/Errors";
import { Helmet } from "react-helmet";

const SetPassword = ({
  setAlert,
  setPasswordError,
  resetPassword,
  loadPage,
  history,
  authId,
}) => {
  const navigate = useNavigate();

  const [onlyOnce, setOnce] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState("password");
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "password" ? "text" : "password");
  };

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [confirmInputType, setConfirmInputType] = React.useState("password");

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setConfirmInputType(confirmInputType === "password" ? "text" : "password");
  };

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const { password, confirm_password } = formData;

  useMemo(() => {
    if (onlyOnce) {
      loadPage();
      setOnce(false);
    }
  }, [history, loadPage]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      setPasswordError("Passwords do not match", "confirm_password");
      setAlert(
        "Errors! Please correct the following errors and submit again.",
        "danger"
      );
    } else {
      setLoading(true);
      resetPassword(password, authId, navigate).then((res) => {
        setLoading(false);
      });
    }
  };

  return loading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      <Helmet>
        {/* <title>Set Password | {process.env.REACT_APP_APP_NAME}</title> */}
      </Helmet>
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
                  <Card.Title className="mt-0 mb-3">Set Password</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Please change your password.
                  </Card.Text>
                  <Alert />
                  <Form onSubmit={(e) => onSubmit(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>
                        Password <span>*</span>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          onChange={(e) => onChange(e)}
                          required
                        />
                        <InputGroup.Text onClick={toggleShowPassword}>
                          {inputType === "password" ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )}
                        </InputGroup.Text>
                      </InputGroup>

                      <Errors key="password" current_key="password" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>
                        Confirm Password <span>*</span>
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirm_password"
                          placeholder="Confirm Password"
                          onChange={(e) => onChange(e)}
                          required
                        />
                        <InputGroup.Text onClick={toggleShowConfirmPassword}>
                          {confirmInputType === "password" ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )}
                        </InputGroup.Text>

                        <Errors
                          key="confirm_password"
                          current_key="confirm_password"
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="d-grid mt-4 mb-0 text-center">
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

SetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  setPasswordError: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  authId: state.auth.user._id,
});

export default connect(mapStateToProps, {
  setAlert,
  setPasswordError,
  resetPassword,
  loadPage,
})(SetPassword);
