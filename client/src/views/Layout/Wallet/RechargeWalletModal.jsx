import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col, Button, Modal, Form, Image } from "react-bootstrap";
import Tile from "@src/views/commonComponents/mainCard/Tile";
import QRCodePlaceholder from "@assets/images/3d-question-mark.png";
import {
  capitalizeAll,
  handleNumberInput,
  lowercaseAll,
} from "@src/utils/helper";
import { generateQRCode } from "@src/actions/commonActions";
import { setErrors } from "@src/actions/walletActions";
import { validateForm } from "@src/utils/validation";
import Errors from "@src/Notifications/Errors";
import {
  removeWalletErrors,
  createWalletRechargeRequest,
} from "@src/actions/walletActions";
import Spinner from "@src/views/spinners/Spinner";
import BouncingLoader from "@src/views/spinners/BouncingLoader";

const RechargeWalletModal = ({
  show,
  handleClose,
  method,
  details,
  loadingGenerateQRCode,
  amountQRCode,
  generateQRCode,
  removeWalletErrors,
  createWalletRechargeRequest,
  loggedInUser,
  errorList,
  setErrors,
}) => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [txnNumber, setTxnNumber] = useState("");
  const [remainingTime, setRemainingTime] = useState(750);
  const [debounceTimer, setDebounceTimer] = useState(null);

  React.useEffect(() => {
    removeWalletErrors();
  }, [show]);

  useEffect(() => {
    if (method === "upi" && amount) {
      clearTimeout(debounceTimer);
      let countdown = 750;
      setRemainingTime(countdown);

      const interval = setInterval(() => {
        countdown -= 750;
        setRemainingTime(countdown);
      }, 750);

      const timer = setTimeout(() => {
        generateQRCode(details._id, amount);
        clearInterval(interval);
      }, 750);

      setDebounceTimer(timer);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [amount, method, generateQRCode]);

  const handleModalClose = () => {
    setAmount("");
    setTxnNumber("");
    setRemainingTime(1000);
    clearTimeout(debounceTimer);
    handleClose();
  };

  const onSubmit = (e) => {
    e.preventDefault();

    removeWalletErrors();

    let validationRules = [
      {
        param: "amount",
        msg: "Amount is required.",
      },
      {
        param: "txn_number",
        msg: "TXN Number is required.",
      },
    ];

    const formData = {
      type: method,
      amount,
      txn_number: txnNumber.toUpperCase(),
      payment_details: method === "bank" ? details.account_number : details.upi,
      status: "in_review",
      remarks: `Your ${method.toUpperCase()} payment request (Txn: ${txnNumber.toUpperCase()}) is under review. Please allow some time for verification.`,
    };

    console.log("formData", formData);

    const errors = validateForm(formData, validationRules);

    if (errors.length) {
      setErrors(errors);
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

    console.log(submitData);

    // return;
    createWalletRechargeRequest(loggedInUser._id, submitData, navigate);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="p-5">
        <Modal.Title>Recharge Wallet</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-5 custom-modal-card">
        <Form onSubmit={onSubmit}>
          {method === "bank" && details ? (
            <Row className="customWalletModal">
              <Col xs="12">
                <Tile
                  label="Bank Name"
                  value={capitalizeAll(details.bank_name)}
                />
                <Tile label="Holder Name" value={capitalizeAll(details.name)} />
                <Tile
                  label="Number"
                  value={capitalizeAll(details.account_number)}
                  copyable
                />
                <Tile
                  label="IFSC Code"
                  value={capitalizeAll(details.ifsc)}
                  copyable
                />
              </Col>
            </Row>
          ) : method === "upi" && details ? (
            <Row className="customWalletModal">
              <Col xs="12">
                <div className="qr-code-img">
                  {loadingGenerateQRCode ? (
                    <BouncingLoader minHeight="250px" />
                  ) : (
                    <Image
                      src={amountQRCode || QRCodePlaceholder}
                      alt="QRCode"
                    />
                  )}
                </div>
                <span className="desc">
                  {amount === ""
                    ? "Enter a valid amount to generate the QR Code."
                    : loadingGenerateQRCode
                    ? `Generating QR Code... (${Math.ceil(
                        remainingTime / 1000
                      )}s left)`
                    : amountQRCode
                    ? "QR Code generated successfully. Scan to pay."
                    : "Enter a valid amount to get the QR Code."}
                </span>

                <Tile
                  label="UPI Holder Name"
                  value={capitalizeAll(details.name)}
                />
                <Tile
                  label="UPI ID"
                  value={lowercaseAll(details.upi)}
                  copyable
                />
              </Col>
            </Row>
          ) : (
            <p>No details available.</p>
          )}

          <Form.Group className="form-group-custom mt-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter amount"
              className={errorList.amount ? "invalid" : ""}
              value={amount}
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={handleNumberInput}
            />

            <Errors current_key="amount" />
          </Form.Group>

          <Form.Group className="form-group-custom mt-3">
            <Form.Label>Transaction Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter transaction number"
              className={errorList.txn_number ? "invalid" : ""}
              value={txnNumber}
              name="txn_number"
              onChange={(e) => setTxnNumber(e.target.value)}
            />

            <Errors current_key="txn_number" />
          </Form.Group>

          <div className="float-end mt-3">
            <Button
              className="cancel-custom-btn fadeInLeft animated"
              onClick={handleModalClose}
            >
              Close
            </Button>
            <Button
              className="success-custom-btn fadeInLeft animated ms-2"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  loggedInUser: state.auth.user,
  amountQRCode: state.common.amountQRCode,
  loadingGenerateQRCode: state.common.loadingGenerateQRCode,
});

export default connect(mapStateToProps, {
  generateQRCode,
  removeWalletErrors,
  createWalletRechargeRequest,
  setErrors,
})(RechargeWalletModal);
