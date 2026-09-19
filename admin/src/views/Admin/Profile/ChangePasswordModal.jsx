import React from "react";
import { Modal, Button, Image, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";
import {
  changePassword,
  setErrors,
  removeProfileErrors,
} from "@actions/profileActions";

const ChangePasswordModal = ({
  setModal,
  modal,
  errorList,
  setErrors,
  removeProfileErrors,
  changePassword,
  loadingChangePassword,
}) => {
  const initialData = {
    email: "",
    password: "",
    current_password: "",
    confirm_password: "",
  };

  const [formData, setFormData] = React.useState(initialData);

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
    removeProfileErrors();

    let validationRules = [
      {
        param: "current_password",
        msg: "Current password is required",
      },
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

    changePassword(formData).then((res) => {
      if (res && res.status) {
        reset();
      }
    });
  };

  React.useEffect(() => {
    removeProfileErrors();
  }, [modal]);

  return (
    <Modal show={modal} onHide={reset}>
      <Modal.Header closeButton className="modal-header">
        <h4>Change Password</h4>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={(e) => savePassword(e)}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="current_password">
              Current Password <span>*</span>
            </Form.Label>
            <Form.Control
              className={errorList.current_password ? "invalid" : ""}
              type="password"
              id="current_password"
              name="current_password"
              minLength="8"
              value={current_password}
              onChange={(e) => onChange(e)}
            />
            <Errors current_key="current_password" key="current_password" />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label htmlFor="password">
              New Password <span>*</span>
            </Form.Label>
            <Form.Control
              className={errorList.password ? "invalid" : ""}
              type="password"
              id="password"
              name="password"
              minLength="8"
              value={password}
              onChange={(e) => onChange(e)}
            />
            <Errors current_key="password" key="password" />
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
  removeProfileErrors: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loadingChangePassword: state.profile.loadingChangePassword,
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps, {
  removeProfileErrors,
  setErrors,
  changePassword,
})(ChangePasswordModal);
