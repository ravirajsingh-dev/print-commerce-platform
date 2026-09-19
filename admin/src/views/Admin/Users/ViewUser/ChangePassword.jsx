import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Card, InputGroup } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";
import { setErrors, removeUserErrors, changeUserPassword } from "@actions/user";

const ChangePassword = ({
  errorList,
  currentUser,
  setErrors,
  removeUserErrors,
  loadingChangePassword,
  changeUserPassword,
}) => {
  const { user_id } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    password: "",
    confirm_password: "",
  };

  const [formData, setFormData] = React.useState(initialFormData);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(false);

  const { password, confirm_password } = formData;

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const toggleEditMode = () => setIsEditable((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    removeUserErrors();

    const validationRules = [
      { param: "password", msg: "New password is required." },
      { param: "confirm_password", msg: "Confirm password is required." },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    if (password !== confirm_password) {
      setErrors([
        { param: "confirm_password", msg: "Passwords do not match." },
      ]);
      return;
    }

    changeUserPassword(user_id, { password }).then((res) => {
      if (res && res.status) {
        setFormData({ password: "", confirm_password: "" });
        setIsEditable(false);
      }
    });
  };

  const resetForm = () => {
    setFormData({ password: "", confirm_password: "" });
    setIsEditable(false);
  };

  return (
    <Card className="card-body">
      <Form onSubmit={validateAndSubmit} autoComplete="off">
        <div className="card-heading mb-3 d-flex justify-content-between align-items-center">
          <h4>Change Password for {currentUser?.name}</h4>
          <Button variant="link" size="sm" onClick={toggleEditMode}>
            <MdEdit title={isEditable ? "View Mode" : "Edit Mode"} size={20} />
          </Button>
        </div>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>
            New Password <span>*</span>
          </Form.Label>
          <InputGroup>
            <Form.Control
              className={errorList.password ? "invalid" : ""}
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter new password"
              minLength="8"
              required
              disabled={!isEditable}
            />
            <InputGroup.Text
              onClick={isEditable ? toggleShowPassword : () => {}}
              style={{ cursor: isEditable ? "pointer" : "not-allowed" }}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </InputGroup.Text>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirm_password">
          <Form.Label>
            Confirm New Password <span>*</span>
          </Form.Label>

          <InputGroup>
            <Form.Control
              className={errorList.confirm_password ? "invalid" : ""}
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={confirm_password}
              onChange={handleChange}
              placeholder="Confirm new password"
              minLength="8"
              required
              disabled={!isEditable}
            />
            <InputGroup.Text
              onClick={isEditable ? toggleShowConfirmPassword : () => {}}
              style={{ cursor: isEditable ? "pointer" : "not-allowed" }}
            >
              {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </InputGroup.Text>
          </InputGroup>

          <Errors current_key="confirm_password" key="confirm_password" />
        </Form.Group>

        <div className="d-flex justify-content-end">
          {isEditable && (
            <>
              <Button
                type="submit"
                variant="primary"
                className="me-2"
                disabled={loadingChangePassword}
              >
                {loadingChangePassword ? (
                  <>
                    <span className="spinner-border spinner-border-sm"></span>
                    Loading...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button variant="danger" onClick={resetForm}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </Form>
    </Card>
  );
};

ChangePassword.propTypes = {
  currentUser: PropTypes.object.isRequired,
  errorList: PropTypes.object.isRequired,
  loadingChangePassword: PropTypes.bool.isRequired,
  changeUserPassword: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  removeUserErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  errorList: state.errors,
  loadingChangePassword: state.user.loadingChangePassword,
});

export default connect(mapStateToProps, {
  setErrors,
  removeUserErrors,
  changeUserPassword,
})(ChangePassword);
