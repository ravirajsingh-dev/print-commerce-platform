import React from "react";
import { Modal, Button, Image, Form, InputGroup } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";
import { changeUserPassword, setErrors, removeUserErrors } from "@actions/user";

const ChangePasswordModal = ({
  setModal,
  modal,
  errorList,
  setErrors,
  removeUserErrors,
  changeUserPassword,
  loadingChangePassword,
  modalData,
}) => {
  const initialData = {
    current_password: "",
    confirm_password: "",
  };

  const [formData, setFormData] = React.useState(initialData);
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState("password");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "password" ? "text" : "password");
  };

  const reset = () => {
    setModal(false);
    setFormData(initialData);
    // onClosed();
  };

  const { password, current_password, confirm_password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const savePassword = (e) => {
    e.preventDefault();
    removeUserErrors();

    let validationRules = [
      {
        param: "password",
        msg: "New password is required",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    if (password !== confirm_password) {
      setErrors([
        {
          param: "confirm_password",
          msg: "Password does not match.",
        },
      ]);
      return;
    }

    changeUserPassword(modalData?._id, formData).then((res) => {
      if (res && res.status) {
        reset();
      }
    });
  };

  React.useEffect(() => {
    removeUserErrors();
  }, [modal]);

  return (
    <Modal show={modal} onHide={reset}>
      <Modal.Header closeButton className="modal-header">
        <h4>Change Password for {modalData?.name}</h4>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => savePassword(e)}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>
              New Password <span>*</span>
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
                {inputType === "password" ? <FaRegEyeSlash /> : <FaRegEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="confirm_password">
              Confirm New Password <span>*</span>
            </Form.Label>
            <Form.Control
              className={errorList.confirm_password ? "invalid" : ""}
              type="password"
              id="confirm_password"
              name="confirm_password"
              minLength="8"
              value={confirm_password}
              onChange={(e) => onChange(e)}
            />
            <Errors current_key="confirm_password" key="confirm_password" />
          </Form.Group>

          <div className="float-end">
            <Button
              className="m-2"
              type="submit"
              variant="primary"
              disabled={loadingChangePassword}
            >
              {loadingChangePassword ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  {` Loading... `}
                </>
              ) : (
                <>Save</>
              )}
            </Button>
            <Button
              className="ml-2"
              type="reset"
              variant="danger"
              onClick={reset}
              disabled={loadingChangePassword}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  removeUserErrors: PropTypes.func.isRequired,
  changeUserPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingChangePassword: state.user.loadingChangePassword,
});

export default connect(mapStateToProps, {
  removeUserErrors,
  setErrors,
  changeUserPassword,
})(ChangePasswordModal);
