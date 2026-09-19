import React, { useEffect, useState } from "react";
import {
  Col,
  Form,
  InputGroup,
  Row,
  Button,
  Card,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

// custom Imports
import {
  changePassword,
  removeAllErrors,
  setErrors,
} from "@src/actions/authActions";

import Errors from "@src/Notifications/Errors";
import { validateForm } from "@src/utils/validation";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

const ChangePassword = ({
  errorList,
  setErrors,
  changePassword,
  removeAllErrors,
  auth: { loadingOnChangePassword },
}) => {
  const initialFormData = {
    current_password: "",
    password: "",
    confirm_password: "",
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [validated, setValidated] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { current_password, password, confirm_password } = formData;

  useEffect(() => {
    removeAllErrors();
  }, []);

  const onChange = (e) => {
    if (!e.target) {
      return;
    }
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (name === "password" || name === "confirm_password") {
      setPasswordMatch(newFormData.password === newFormData.confirm_password);
    }
  };

  const toggleShowLoginPassword = () =>
    setShowLoginPassword(!showLoginPassword);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = (e) => {
    e.preventDefault();
    removeAllErrors();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    let validationRules = [
      {
        param: "current_password",
        msg: "Please provide a valid login password.",
      },
      {
        param: "password",
        msg: "Please provide a valid password.",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      return;
    }

    const submitData = {};

    for (let i in formData) {
      if (
        formData[i] === "" ||
        formData[i] === null ||
        formData[i] === undefined
      )
        continue;
      submitData[i] = formData[i];
    }

    // do validation here
    changePassword(submitData, navigate);
  };
  return (
    <>
      <AppBreadCrumb
        title={"Change Password"}
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: `${"Change Password"}` },
        ]}
      />

      <Container>
        <Col xs="12" sm="7" className="custom-input-card">
          <Card>
            <Form
              noValidate
              validated={validated}
              onSubmit={onSubmit}
              className="p-2  registration-form "
            >
              <Form.Group as={Col} md="12" className="form-group-custom mb-3">
                <Form.Label
                  htmlFor="current_password"
                  className="common-sub-heading"
                >
                  Login password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type={showLoginPassword ? "text" : "password"}
                    id="current_password"
                    value={current_password}
                    name="current_password"
                    className={`text-muted ${
                      errorList.current_password ? "invalid" : ""
                    }`}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    placeholder="Enter login password"
                  />
                  <InputGroup.Text
                    className="show-password-icon text-muted"
                    onClick={toggleShowLoginPassword}
                  >
                    {showLoginPassword ? (
                      <AiOutlineEye size={20} />
                    ) : (
                      <AiOutlineEyeInvisible size={20} />
                    )}
                  </InputGroup.Text>
                  <Errors
                    current_key="current_password"
                    key="current_password"
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md="12" className="form-group-custom mb-3">
                <Form.Label htmlFor="password" className="common-sub-heading">
                  New password
                </Form.Label>
                <InputGroup>
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
                    placeholder="New password"
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

              <Form.Group as={Col} md="12" className="form-group-custom mb-5">
                <Form.Label
                  htmlFor="confirm_password"
                  className="common-sub-heading"
                >
                  Confirm password
                </Form.Label>
                <InputGroup className="input-group-password">
                  <Form.Control
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={confirm_password}
                    name="confirm_password"
                    className={`text-muted ${
                      errorList.confirm_password || !passwordMatch
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

              <Button
                type="submit"
                className="success-custom-btn fadeInLeft animated float-end"
              >
                {loadingOnChangePassword ? <>Loading...</> : "Save Changes"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Container>
    </>
  );
};

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  removeAllErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  setErrors,
  changePassword,
  removeAllErrors,
})(ChangePassword);
