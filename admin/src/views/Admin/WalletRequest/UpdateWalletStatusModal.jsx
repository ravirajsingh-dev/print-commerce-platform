import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";

import * as Constants from "@constants/index";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";
import { capitalizeFirst } from "@utils/helper";

const UpdateWalletStatusModal = ({
  modal,
  onNo,
  modalData,
  removeWalletRequestErrors,
  setErrors,
  updateWalletRequestStatusByID,
  setModal,
  entity,
}) => {
  const [formData, setFormData] = React.useState({ reasonForCancel: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [statusList, setStatusList] = React.useState(false);

  const { reasonForCancel } = formData;

  const handleSelect = (selectOption) => {
    setFormData({
      ...formData,
      status: selectOption.value,
    });
  };

  React.useEffect(() => {
    if (!modalData?.status) return;

    // Find index of the selected status
    const index = Constants.GlobalWalletRequestStatus.findIndex(
      (option) => option.value === modalData?.status
    );

    // Filter out all statuses that appear before the selected one
    const filteredOptions =
      index !== -1
        ? Constants.GlobalWalletRequestStatus.slice(index + 1)
        : Constants.GlobalWalletRequestStatus;

    setStatusList(filteredOptions);
  }, [modalData?.status]);

  const onSubmit = (e) => {
    e.preventDefault();

    removeWalletRequestErrors();

    let validationRules = [];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    setSubmitting(true);

    let submitData = {
      reasonForCancel: formData.reasonForCancel,
      status: entity === "approve" ? "success" : "cancelled",
    };
    updateWalletRequestStatusByID(modalData?.id, submitData).then((res) => {
      setSubmitting(false);
      if (res?.status) {
        setModal(false);
      }
    });
  };

  const onChange = (e) => {
    if (!e.target) return;

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  React.useEffect(() => {
    setFormData({
      reasonForCancel: "",
    });
  }, [modal]);

  return (
    <Modal
      show={modal}
      onClose={onNo}
      className="transition-all ease-in-out duration-500 delay-500"
    >
      <Modal.Header className="p-2">Confirmation!</Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to {capitalizeFirst(entity)} this{" "}
          <p>
            <strong>{capitalizeFirst(modalData?.name)}</strong>?
          </p>
        </p>
        <div>
          <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
            {entity === "cancel" ? (
              <Form.Group className="mb-2 mr-sm-3">
                <Form.Label htmlFor="reasonForCancel">
                  Reason For Cancel
                </Form.Label>
                <Form.Control
                  as="textarea"
                  id="reasonForCancel"
                  name="reasonForCancel"
                  maxLength="60"
                  required
                  value={reasonForCancel}
                  onChange={(e) => onChange(e)}
                />

                <Errors current_key="reasonForCancel" key="reasonForCancel" />
              </Form.Group>
            ) : null}
          </Form>
        </div>
        <div className="d-flex float-end">
          <Button
            color="danger"
            onClick={onNo}
            className="me-2 mr-2"
            variant="danger"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              onSubmit(e);
            }}
            disable={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateWalletStatusModal;
