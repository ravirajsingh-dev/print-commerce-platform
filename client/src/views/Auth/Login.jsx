import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
  Image,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "@assets/images/logo.png";
import Alert from "../../Notifications/Alert";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Errors from "@src/Notifications/Errors";
import { loadPage, login } from "@src/actions/authActions";

const LoginPage = ({ login, loadPage, loading }) => {
  const navigate = useNavigate();

  // Load stored credentials if rememberMe was checked
  const storedCredentials = JSON.parse(
    localStorage.getItem("rememberedUser")
  ) || {
    email: "",
    password: "",
    rememberMe: false,
  };

  const [formData, setFormData] = useState(storedCredentials);
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState("password");

  useEffect(() => {
    loadPage();
  }, []);

  const onChange = (e) => {
    if (!e) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onChangeCheck = (e) => {
    if (!e.target) return;

    const updatedFormData = { ...formData, rememberMe: e.target.checked };
    setFormData(updatedFormData);

    if (e.target.checked) {
      localStorage.setItem("rememberedUser", JSON.stringify(updatedFormData));
    } else {
      localStorage.removeItem("rememberedUser");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "password" ? "text" : "password");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    login(formData, navigate).then(() => {
      if (formData.rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(formData));
      } else {
        localStorage.removeItem("rememberedUser");
      }
    });
  };

  return (
    <React.Fragment>
      <div className="auth-fluid">
        <div className="auth-fluid-form-box">
          <Row className="align-items-center d-flex h-100 auth-fluid-form">
            <div className="">
              <Link to="/">
                <Image
                  src={logo}
                  alt=""
                  width="auto"
                  height="auto"
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </div>
            <Col lg="12">
              <Card className="border-none">
                <Card.Body>
                  <Card.Title className="card-title">Log In</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    Enter your email address and password to access admin panel.
                  </Card.Text>
                  <Alert />
                  <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        minLength="8"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
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
                          value={formData.password}
                          onChange={onChange}
                          required
                        />
                        <InputGroup.Text onClick={toggleShowPassword}>
                          {inputType === "password" ? (
                            <FaRegEyeSlash size={"18px"} />
                          ) : (
                            <FaRegEye size={"18px"} />
                          )}
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                      <Form.Check
                        type="checkbox"
                        label={
                          <div>
                            I accept the{" "}
                            <Link
                              to="/terms-conditions"
                              style={{ color: "#ff3d00" }}
                            >
                              Terms and Conditions
                            </Link>
                          </div>
                        }
                        checked={formData.rememberMe}
                        onChange={onChangeCheck}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="d-grid mt-4 mb-0 text-center">
                      <Button
                        variant="primary"
                        type="submit"
                        className="rr-btn btn-transparent fadeInLeft animated"
                      >
                        {loading ? "Logging..." : "Log In"}
                      </Button>
                    </Form.Group>
                  </Form>

                  <div className="mt-3">
                    <p className="fw-bold">
                      Don't have an account?{"  "}
                      <Link to="/contact-us" style={{ color: "#ff3d00" }}>
                        Contact Us
                      </Link>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

LoginPage.propTypes = {
  errorList: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func,
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
