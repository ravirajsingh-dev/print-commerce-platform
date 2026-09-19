import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo-dark-new.png";
import Alert from "../../notifications/Alert";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Errors from "@notifications/Errors";

import { login, loadPage } from "../../actions/auth";

const LoginPage = ({ login, loadPage, loading }) => {
  const initialState = {
    email: "",
    password: "",
    rememberMe: "",
  };

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState(initialState);
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState("password");

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "password" ? "text" : "password");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    login(formData, navigate).then(() => {});
  };

  React.useEffect(() => {
    loadPage();
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        {/* <title>Login | {process.env.REACT_APP_APP_NAME}</title> */}
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
              <Card
                // style={{ backgroundColor: "#d0fdf87a" }}
                className="auth-login-card"
              >
                <Card.Body>
                  <Card.Title className="mt-0 mb-3">Log In</Card.Title>
                  <Card.Text className="mb-4">
                    Enter your email address and password to access admin panel.
                  </Card.Text>
                  <Alert />
                  <Form onSubmit={(e) => onSubmit(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        minLength="8"
                        name="email"
                        onChange={(e) => onChange(e)}
                        required
                      />

                      <Errors key="email" current_key="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Link
                        to="/forgot-password"
                        className="text-muted ms-1 text-decoration float-end"
                      >
                        Forgot your password?
                      </Link>
                      <Form.Label>Password</Form.Label>
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
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    onChange={(e) => onChangeCheck(e)}
                    required
                  />
                </Form.Group> */}
                    <Form.Group className="d-grid mt-4 mb-0 text-center">
                      <Button
                        variant="primary"
                        type="submit"
                        // disabled={loading}
                      >
                        {loading ? "Logging..." : "Log In"}
                      </Button>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="auth-fluid-right text-center">
          <div className="auth-user-testimonial"></div>
        </div>
      </div>
    </React.Fragment>
  );
};

LoginPage.proTypes = {
  errorList: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loading: state.auth.loading,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  login,
  loadPage,
})(LoginPage);
