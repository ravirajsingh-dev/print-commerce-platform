import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Image,
  InputGroup,
  Card,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Alert from "@src/Notifications/Alert";

// Icons
import logo from "@assets/images/logo.png";

// Custom Imports
import Errors from "@src/Notifications/Errors";
import { validateForm } from "@utils/validation";
import {
  updatePassword,
  verifyOtp,
  resetPassword,
  setErrors,
  loadPage,
  resetComponentStore,
} from "@actions/authActions";

const ForgotPassword = ({
  updatePassword,
  verifyOtp,
  errorList,
  setErrors,
  loadPage,
  resetPassword,
  loadingPasswordReset,
  otpSent,
  loadingOnOTPVerified,
  otpVerified,
  resetComponentStore,
}) => {
  const navigate = useNavigate();

  const initialFormData = {
    email: "",
    otp: "",
    resendOTP: false,
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(null);
  const [remainingSec, setRemainingSec] = useState(null);

  const { email, otp, password, confirmPassword } = formData;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);

    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(newFormData.password === newFormData.confirmPassword);
    }
  };

  const onResendOtp = () => {
    if (resendCountdown <= 0) {
      setFormData({ ...formData, resendOTP: true });
      resetPassword(formData).then((res) => {
        const status = res.status ? true : false;

        if (status) {
          setResendCountdown(60);
        }
      });
    }
  };

  const onVerifyOTP = () => {
    let validationRules = [
      { param: "otp", msg: " One-Time Password is required." },
    ];
    const errors = validateForm(formData, validationRules);
    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};
    for (let i in formData) {
      if (
        formData[i] !== "" &&
        formData[i] !== null &&
        formData[i] !== undefined
      ) {
        submitData[i] = formData[i];
      }
    }
    verifyOtp(submitData);
  };

  const onUpdatePassword = () => {
    if (!passwordMatch) return;

    let validationRules = [
      {
        param: "password",
        msg: "A valid password is required.",
      },
    ];
    const errors = validateForm(formData, validationRules);
    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};
    for (let i in formData) {
      if (
        formData[i] !== "" &&
        formData[i] !== null &&
        formData[i] !== undefined
      ) {
        submitData[i] = formData[i];
      }
    }

    updatePassword(submitData).then((res) => {
      const status = res.status ? true : false;
      setPasswordUpdated(status);
      setFormData(initialFormData);

      if (status) {
        const redirectTime = 5;
        setRemainingSec(redirectTime);

        const interval = setInterval(() => {
          setRemainingSec((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setTimeout(() => navigate("/"), redirectTime * 1000);
      }
    });
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (e) => {
    e.preventDefault();
    loadPage();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    let validationRules = [
      { param: "email", msg: "Please provide a valid Email." },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    const submitData = {};
    for (let i in formData) {
      if (
        formData[i] !== "" &&
        formData[i] !== null &&
        formData[i] !== undefined
      ) {
        submitData[i] = formData[i];
      }
    }

    console.log("submitData", submitData);

    resetPassword(submitData).then((res) => {
      const status = res.status ? true : false;

      if (status) {
        setResendCountdown(60);
      }
    });
  };

  useEffect(() => {
    loadPage();
    resetComponentStore();
  }, []);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (remainingSec === 0 && passwordUpdated) {
      navigate("/");
    }
  }, [remainingSec, passwordUpdated, navigate]);

  if (otpVerified) {
    return (
      <React.Fragment>
        <div className="auth-fluid">
          <div className="auth-fluid-form-box">
            <div className="auth-brand text-center text-lg-start">
              <Link to="/">
                <span>
                  <img src={logo} alt="" height="40" />
                </span>
              </Link>
            </div>

            <Card className="border-none">
              <Card.Body>
                <Card.Title className="mt-0 mb-3">
                  Setup Your Password
                </Card.Title>
                <div>
                  {passwordUpdated ? (
                    <div className="mx-3">
                      <Alert />
                      <p className="text-center">
                        Redirect to login page in {remainingSec} seconds
                      </p>
                      <div className="auth-action-footer">
                        Redirect to <Link to="/login">Login</Link>
                      </div>
                    </div>
                  ) : (
                    <Form noValidate className="form-box">
                      <Alert />
                      <Form.Group>
                        <Form.Label
                          htmlFor="password"
                          className="register-lable"
                        >
                          Password *
                        </Form.Label>
                        <InputGroup className="input-group-password">
                          <Form.Control
                            required
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            name="password"
                            className={`text-muted ${
                              errorList.password ? "invalid" : ""
                            }`}
                            onChange={(e) => {
                              onChange(e);
                            }}
                            placeholder="Password"
                          />
                          <InputGroup.Text
                            className="show-password-icon text-muted"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <AiOutlineEye size={20} />
                            ) : (
                              <AiOutlineEyeInvisible size={20} />
                            )}
                          </InputGroup.Text>
                          <Errors current_key="password" key="password" />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group>
                        <Form.Label
                          htmlFor="confirmPassword"
                          className="register-lable"
                        >
                          Confirm Password *
                        </Form.Label>
                        <InputGroup className="input-group-password">
                          <Form.Control
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            name="confirmPassword"
                            className={`text-muted ${
                              errorList.confirmPassword || !passwordMatch
                                ? "invalid"
                                : ""
                            }`}
                            onChange={(e) => onChange(e)}
                            placeholder="Confirm password"
                            isInvalid={!passwordMatch}
                          />
                          <InputGroup.Text
                            className="show-password-icon text-muted"
                            onClick={toggleShowConfirmPassword}
                          >
                            {showConfirmPassword ? (
                              <AiOutlineEye size={20} />
                            ) : (
                              <AiOutlineEyeInvisible size={20} />
                            )}
                          </InputGroup.Text>
                          <Form.Control.Feedback type="invalid">
                            {passwordMatch
                              ? "Please provide a valid password."
                              : "Passwords do not match."}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <div className="submit-btn mt-4">
                        <Button
                          type="button"
                          className="rr-btn"
                          disabled={loadingPasswordReset}
                          onClick={onUpdatePassword}
                        >
                          {loadingPasswordReset ? "Submitting..." : "Submit"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </div>
              </Card.Body>
            </Card>
            <Row className="text-center mt-3 mb-3">
              <Col>
                <span>Back to</span>
                <Link to="/login" className="text-muted ms-1 text-decoration">
                  <strong>Log In</strong>
                </Link>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }

  if (otpSent) {
    return (
      <React.Fragment>
        <div className="auth-fluid">
          <div className="auth-fluid-form-box">
            <div className="auth-brand text-center text-lg-start">
              <Link to="/">
                <span>
                  <img src={logo} alt="" height="40" />
                </span>
              </Link>
            </div>
            <Card className="border-none">
              <Card.Body>
                <Card.Title className="mt-0 mb-3">Verify</Card.Title>

                <Form noValidate className="form-box">
                  <Row className="mb-3">
                    <Alert />
                    <Form.Group as={Col} md="12">
                      <Form.Label htmlFor="otp" className="register-lable">
                        One-Time Password
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        id="otp"
                        name="otp"
                        value={otp}
                        maxLength="6"
                        onChange={onChange}
                        placeholder="Enter your OTP"
                        className={`text-muted ${
                          errorList.otp ? "invalid" : ""
                        }`}
                      />
                      <Button
                        variant="link"
                        size="lg"
                        disabled={resendCountdown > 0}
                        onClick={onResendOtp}
                        className="resend-btn"
                      >
                        {resendCountdown > 0
                          ? `Resend OTP in ${resendCountdown}s`
                          : "Resend OTP"}
                      </Button>
                      <Errors current_key="otp" key="otp" />
                    </Form.Group>
                  </Row>

                  <div className="submit-btn">
                    <Button
                      type="button"
                      className="rr-btn"
                      disabled={loadingOnOTPVerified}
                      onClick={onVerifyOTP}
                    >
                      {loadingOnOTPVerified ? "Verifying OTP..." : "Verify OTP"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <span>Back to</span>
            <Link to="/login" className="text-muted ms-1 text-decoration">
              <strong>Log In</strong>
            </Link>
          </div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="auth-fluid">
        <div className="auth-fluid-form-box">
          <div className="auth-brand text-center text-lg-start">
            <Link to="/">
              <span>
                <img src={logo} alt="" height="40" />
              </span>
            </Link>
          </div>

          <Card className="border-none">
            <Card.Body>
              <Card.Title className="mt-0 mb-3">Forgot Password</Card.Title>

              <Card.Text className="text-muted mb-4">
                Enter your email address and we'll send you an email with
                instructions to reset your password.
              </Card.Text>

              <Form onSubmit={(e) => onSubmit(e)} className="form-box">
                <Row className="mb-3">
                  <Col xs={12}>
                    <Alert />
                    <Form.Group as={Col} md="12" className="form-group-custom">
                      <Form.Label htmlFor="email">Email*</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={email.toLowerCase()}
                        onChange={(e) => onChange(e)}
                        placeholder="Enter your register email address."
                        className={`p-3 text-muted ${
                          errorList.email ? "invalid" : ""
                        }`}
                      />
                      <Errors current_key="email" key="email" />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="center">
                  <Button
                    type="submit"
                    className="rr-btn"
                    disabled={loadingPasswordReset}
                  >
                    {loadingPasswordReset ? "Request OTP..." : "Request OTP"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <Row className="text-center mt-3 mb-3">
            <Col>
              <span>Back to</span>
              <Link to="/login" className="text-muted ms-1 text-decoration">
                <strong>Log In</strong>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  otpSent: state.auth.otpSent,
  otpVerified: state.auth.otpVerified,
  loadingPasswordReset: state.auth.loadingPasswordReset,
  loadingOnOTPVerified: state.auth.loadingOnOTPVerified,
});

export default connect(mapStateToProps, {
  updatePassword,
  verifyOtp,
  resetPassword,
  setErrors,
  loadPage,
  resetComponentStore,
})(ForgotPassword);
