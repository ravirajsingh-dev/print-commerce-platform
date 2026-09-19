import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Card, Col, Form, Row, InputGroup } from "react-bootstrap";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import logo from "@assets/images/logo-dark-new.png";
import Errors from "@notifications/Errors";
import Alert from "@notifications/Alert";
import Spinner from "@views/Spinner";

import { setAlert } from "@actions/alert";
import {
  resetPassword,
  setPasswordError,
  getResetTokenStatus,
  tokenInvalid,
  loginRedirect,
} from "@actions/auth";

const ResetPassword = ({
  setAlert,
  setPasswordError,
  resetPassword,
  getResetTokenStatus,
  tokenInvalid,
  errorList,
  loading,
  loginRedirect,
}) => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = React.useState({
    password: "",
    confirm_password: "",
  });
  const [successful, setSuccessful] = React.useState(false);

  React.useEffect(() => {
    getResetTokenStatus(token).then((data) => {
      if (!data || !data.status) {
        tokenInvalid(navigate);
      }
    });
  }, [getResetTokenStatus, token, navigate, tokenInvalid]);

  const { password, confirm_password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm_password) {
      setPasswordError("Passwords do not match", "confirm_password");
      setAlert(
        "Errors! Please correct the following errors and submit again.",
        "danger"
      );
    } else {
      resetPassword(password, token).then((res) => {
        if (res && res.status === true) {
          setSuccessful(true);
        }
      });
    }
  };

  const [hidden, setHidden] = React.useState(true);
  const [icon, setIcon] = React.useState(<FaRegEyeSlash />);
  const onClickPasswordIcon = (e) => {
    setHidden(!hidden);
    setIcon(icon === <FaRegEye /> ? <FaRegEyeSlash /> : <FaRegEye />);
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
                {successful ? (
                  <Card.Text className="text-muted mb-4">
                    <span>
                      Password has been reset successfully. Click here to{" "}
                    </span>
                    <Link to="/" title="login">
                      Login
                    </Link>
                  </Card.Text>
                ) : (
                  <Form onSubmit={(e) => onSubmit(e)}>
                    <h2 className="mt-0 mb-3">Reset Password</h2>
                    <Alert />
                    <Form.Group className="mb-3">
                      <InputGroup>
                        <Form.Control
                          type={hidden ? "password" : "text"}
                          placeholder="Password"
                          autoComplete="password"
                          name="password"
                          minLength="8"
                          value={password}
                          onChange={(e) => onChange(e)}
                          required
                          invalid={errorList.password ? true : false}
                        />

                        <InputGroup.Text onClick={onClickPasswordIcon}>
                          {icon}
                        </InputGroup.Text>
                      </InputGroup>

                      <Errors current_key="password" key="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="confirm_password"
                        name="confirm_password"
                        minLength="8"
                        value={confirm_password}
                        onChange={(e) => onChange(e)}
                        invalid={errorList.confirm_password ? true : false}
                      />

                      <Errors
                        current_key="confirm_password"
                        key="confirm_password"
                      />
                    </Form.Group>
                    <Row>
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          <Col xs="6">
                            <Button
                              color="primary"
                              className="px-6"
                              type="submit"
                            >
                              Reset Password
                            </Button>
                          </Col>
                          <Col className="text-right">
                            <Link to="/">
                              <Button
                                variant="link"
                                className="px-0"
                                onClick={(e) => loginRedirect(navigate)}
                              >
                                Have an account? Login
                              </Button>
                            </Link>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  setPasswordError: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  getResetTokenStatus: PropTypes.func.isRequired,
  tokenInvalid: PropTypes.func.isRequired,
  loginRedirect: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  errorList: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  errorList: state.errors,
  loading: state.auth.loadingPasswordReset,
});

export default connect(mapStateToProps, {
  setAlert,
  setPasswordError,
  resetPassword,
  getResetTokenStatus,
  tokenInvalid,
  loginRedirect,
})(ResetPassword);
