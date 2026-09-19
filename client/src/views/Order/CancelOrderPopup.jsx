import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

import Errors from "@src/Notifications/Errors";
import { capitalizeFirst } from "@src/utils/helper";

const CancelOrderPopup = ({
  modal,
  onNo,
  modalData,
  updateOrderStatusByID,
  setModal,
}) => {
  const [formData, setFormData] = React.useState({
    status: "cancelled",
    reasonForCancel: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  const { reasonForCancel } = formData;

  const onChange = (e) => {
    if (!e.target) return;

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

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
      <Modal.Header className="p-4 h5">Confirmation!</Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to Cancel this Order?</p>
        <p>
          <strong>{capitalizeFirst(modalData?.name)}</strong>
        </p>
        <div>
          <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
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
          </Form>
        </div>
        <div className="d-flex float-end mt-2">
          <Button
            color="danger"
            onClick={onNo}
            className="me-2 mr-2 rr-btn2"
            variant="danger"
          >
            No
          </Button>
          <Button
            className="rr-btn"
            onClick={(e) => {
              onSubmit(e);
            }}
            disable={submitting}
          >
            {submitting ? "Cancelling..." : "Cancel Order"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CancelOrderPopup;
