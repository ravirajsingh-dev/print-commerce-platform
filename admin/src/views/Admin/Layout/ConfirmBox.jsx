import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { capitalizeFirst } from "@utils/helper";

const ConfirmPopup = ({
  entity,
  modal,
  name,
  onYes,
  onNo,
  inputText = "delete",
  btnText = "Delete",
}) => {
  return (
    <div>
      <Modal
        show={modal}
        onClose={onNo}
        className="transition-all ease-in-out duration-500 delay-500"
      >
        <Modal.Header className="p-3">Confirmation!</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {inputText} this{" "}
            <strong>{capitalizeFirst(entity)}</strong>?
          </p>
          <p>
            <strong>{capitalizeFirst(name)}</strong>
          </p>
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
              onClick={() => {
                onYes();
              }}
            >
              {btnText}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConfirmPopup;
