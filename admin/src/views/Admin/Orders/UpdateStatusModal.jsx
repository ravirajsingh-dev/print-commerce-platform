import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";

import * as Constants from "@constants/index";

import Errors from "@notifications/Errors";
import { validateForm } from "@utils/validation";

const UpdateStatusModal = ({
  modal,
  onNo,
  modalData,
  removeOrderErrors,
  setErrors,
  updateOrderStatusByID,
  setModal,
}) => {
  const [formData, setFormData] = React.useState({ status: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [statusList, setStatusList] = React.useState(false);

  React.useEffect(() => {
    setStatusList([]);
    setFormData({
      status: "",
    });
  }, [modal]);

  const { status } = formData;

  const handleSelect = (selectOption) => {
    setFormData({
      ...formData,
      status: selectOption.value,
    });
  };

  React.useEffect(() => {
    // if (!modalData?.status) return;

    // // Find index of the selected status
    // const index = Constants.GlobalOrderStatus.findIndex(
    //   (option) => option.value === modalData?.status
    // );

    // // Filter out all statuses that appear before the selected one
    // const filteredOptions =
    //   index !== -1
    //     ? Constants.GlobalOrderStatus.slice(index + 1)
    //     : Constants.GlobalOrderStatus;

    // setStatusList(filteredOptions);

    if (!modalData?.status) return;

    console.log("modalData?.status", modalData?.status);

    // Find index of the selected status
    const index = Constants.GlobalOrderStatus.findIndex(
      (option) => option.value === modalData?.status
    );

    console.log("index", index);

    // Get only the previous status (one above)
    const filteredOptions = [Constants.GlobalOrderStatus[index + 1]];

    console.log(
      "Constants.GlobalOrderStatus[index - 1]",
      Constants.GlobalOrderStatus[index - 1]
    );

    setStatusList(filteredOptions);
  }, [modalData?.status]);

  const onSubmit = (e) => {
    e.preventDefault();

    removeOrderErrors();

    let validationRules = [
      {
        param: "status",
        msg: "Please select a status.",
      },
    ];

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
      return;
    }

    setSubmitting(true);
    updateOrderStatusByID(modalData?.id, formData).then((res) => {
      setSubmitting(false);
      if (res?.status) {
        setModal(false);
      }
    });
  };
  return (
    <Modal
      show={modal}
      onClose={onNo}
      className="transition-all ease-in-out duration-500 delay-500"
    >
      <Modal.Header className="p-2">
        Update Order Status Of <b className="ps-2">{modalData?.name}</b>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
            <Form.Group className="mb-2 mr-sm-3">
              <Form.Label htmlFor="filter">
                Status <span>*</span>
              </Form.Label>
              <Select
                id="status"
                name="status"
                options={statusList}
                value={Constants.GlobalOrderStatus.find(
                  (each) => each.value === status
                )}
                placeholder="Select"
                onChange={handleSelect}
              />

              <Errors current_key="status" key="status" />
            </Form.Group>
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

export default UpdateStatusModal;
