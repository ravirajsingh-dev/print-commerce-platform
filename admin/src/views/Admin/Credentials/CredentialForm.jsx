import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Container, Card } from "react-bootstrap";
import Select from "react-select";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";
import { credentialTypes } from "@constants/index";

import {
  save,
  setErrors,
  removeCredentialErrors,
  loadPage,
} from "@actions/credentialActions";

const CredentialForm = ({
  save,
  errorList,
  setErrors,
  removeCredentialErrors,
  credentialID,
  loadPage,
  currentCredential,
}) => {
  const navigate = useNavigate();

  const initialFormData = {
    type: "",
    upi: "",
    account_number: "",
    name: "",
    ifsc: "",
    bank_name: "",
    primary: false,
  };

  React.useEffect(() => {
    if (!credentialID) {
      loadPage();
    }
  }, []);

  const loadCredentialFormData = (currentCredential) => {
    const { type, upi, account_number, name, ifsc, bank_name, primary } =
      currentCredential;

    const data = {
      type,
      upi,
      account_number,
      name,
      ifsc,
      bank_name,
      primary,
    };
    setFormData((formData) => ({ ...formData, ...data }));
  };

  React.useEffect(() => {
    if (!credentialID || !currentCredential) return;

    loadCredentialFormData(currentCredential);
  }, [currentCredential]);

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDisabled, setDisabled] = React.useState(credentialID ? true : false);

  const { type, upi, account_number, name, ifsc, bank_name, primary } =
    formData;

  const onChange = (e) => {
    if (!e.target) {
      return;
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    removeCredentialErrors();

    let validationRules = [{ param: "type", msg: "Type is required." }];

    if (type === "bank") {
      validationRules = [
        ...validationRules,
        { param: "account_number", msg: "Account number is required." },
        {
          param: "name",
          msg: "Account holder name is required.",
        },
        { param: "ifsc", msg: "Bank IFSC code is required." },
        { param: "bank_name", msg: "Bank name is required." },
      ];
    } else {
      validationRules.push({ param: "upi", msg: "UPI ID is required." });
    }

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    // setShowConfirmModal(true);
    setSubmitting(true);
    save({ ...formData }, credentialID, navigate).finally(() => {
      setSubmitting(false);
      setShowConfirmModal(false);
    });
  };

  const handleConfirm = (txn_password) => {
    setSubmitting(true);
    save({ ...formData, txn_password }, credentialID, navigate).finally(() => {
      setSubmitting(false);
      setShowConfirmModal(false);
    });
  };

  const handleSelect = (key) => (selectedOption) => {
    if (selectedOption?.value === "bank") {
      setFormData({
        ...formData,
        [key]: selectedOption.value,
        upi: "",
      });
    } else if (selectedOption?.value === "upi") {
      setFormData({
        ...formData,
        [key]: selectedOption.value,
        account_number: "",
        name: "",
        ifsc: "",
        bank_name: "",
      });
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Form
            onSubmit={onSubmit}
            autoComplete="off"
            className="registration-form"
          >
            <Row className="row-gap-3">
              <Col xs={12} className="card-heading ">
                <h4>{credentialID ? "Edit" : "Add"} UPI or Bank Details</h4>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label htmlFor="selectedMethod">
                    Type <span>*</span>
                  </Form.Label>
                  <Select
                    id="type"
                    name="type"
                    value={credentialTypes.find((each) => each.value === type)}
                    options={credentialTypes}
                    onChange={handleSelect("type")}
                    isDisabled={credentialID}
                  />
                  <Errors current_key="type" />
                </Form.Group>
              </Col>

              {type === "upi" ? (
                <>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="name">
                        UPI Holder Name<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.name ? "invalid" : ""}
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="name" />
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="upi">
                        UPI ID<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.upi ? "invalid" : ""}
                        type="text"
                        id="upi"
                        name="upi"
                        value={upi}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="upi" />
                    </Form.Group>
                  </Col>
                </>
              ) : null}

              {type === "bank" ? (
                <>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="account_number">
                        Account Number<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.account_number ? "invalid" : ""}
                        type="text"
                        id="account_number"
                        name="account_number"
                        value={account_number}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="account_number" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="name">
                        Account Holder Name<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.name ? "invalid" : ""}
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="name" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="ifsc">
                        IFSC Code<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.ifsc ? "invalid" : ""}
                        type="text"
                        id="ifsc"
                        name="ifsc"
                        value={ifsc}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="ifsc" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="bank_name">
                        Bank Name<span>*</span>
                      </Form.Label>
                      <Form.Control
                        className={errorList.bank_name ? "invalid" : ""}
                        type="text"
                        id="bank_name"
                        name="bank_name"
                        value={bank_name}
                        onChange={onChange}
                        disabled={credentialID}
                      />
                      <Errors current_key="bank_name" />
                    </Form.Group>
                  </Col>
                </>
              ) : null}

              {type === "" ? null : (
                <Col xs={12} md={6} className="form-customCheck">
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      id="primary"
                      name="primary"
                      label="Is Primary"
                      checked={primary}
                      onChange={onCheckboxChange}
                    />
                    <Errors current_key="primary" />
                  </Form.Group>
                </Col>
              )}

              <Col xs={12} className="text-end">
                <Button
                  className="m-2"
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      ></span>
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
                  onClick={() => navigate(-1)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* <VerificationConfirmModal
        show={showConfirmModal}
        handleClose={() => setShowConfirmModal(false)}
        handleConfirm={handleConfirm}
        title="Confirm Transaction"
        body="Please enter your transaction password to confirm."
        submitBtnText="Confirm"
      /> */}
    </>
  );
};

CredentialForm.propTypes = {
  save: PropTypes.func.isRequired,
  errorList: PropTypes.object.isRequired,
  setErrors: PropTypes.func.isRequired,
  removeCredentialErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  currentCredential: state.credentials.currentCredential,
});

export default connect(mapStateToProps, {
  save,
  setErrors,
  removeCredentialErrors,
  loadPage,
})(CredentialForm);
