import React from "react";
import { connect } from "react-redux";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

import Errors from "@src/Notifications/Errors";
import { capitalizeFirst } from "@src/utils/helper";
import { getOrderById } from "@src/actions/orderActions";
import Tile from "../commonComponents/mainCard/Tile";
import BouncingLoader from "../spinners/BouncingLoader";

const ViewOrder = ({
  modal,
  onNo,
  modalData,
  setModal,
  getOrderById,
  currentOrder,
  loadingOrder,
}) => {
  React.useEffect(() => {
    if (!modalData || !modal) return;
    getOrderById(modalData?.id);
  }, [modalData, modal, getOrderById]);

  React.useEffect(() => {
    console.log("currentOrder", currentOrder);
  }, [currentOrder]);

  return (
    <Modal
      show={modal}
      onClose={onNo}
      size="xl"
      className="transition-all ease-in-out duration-500 delay-500"
    >
      <Modal.Header className="p-4 h5" closeButton>
        View Order
      </Modal.Header>
      {loadingOrder ? (
        <BouncingLoader minHeight="300px" />
      ) : (
        <Modal.Body>
          <Row className="tile-body p-4">
            <Col xs="12" sm="6" md="4" lg="3">
              <Tile label="Name" value={currentOrder?.name} />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <Tile label="Order ID" value={`${currentOrder?.order_id}`} />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <Tile
                label="Amount"
                value={`${currentOrder?.full_amount || "Not Descrive Yet"}`}
              />
            </Col>
            <Col xs="12" sm="6" md="4" lg="3">
              <Tile
                label="Status"
                value={capitalizeFirst(currentOrder.status)}
              />
            </Col>
          </Row>
          <div className="ps-4">Order Items</div>

          {currentOrder?.order_items?.map((item, index) => (
            <Row key={index} className="tile-body p-4 pt-0">
              <Col xs="12" sm="6" md="3" lg="3">
                <Tile label="Name" value={item?.service?.title} />
              </Col>
              <Col xs="12" sm="6" md="4" lg="2">
                <Tile label="Quantity" value={item?.quantity} />
              </Col>
              <Col xs="12" sm="6" md="4" lg="2">
                <Tile label="Price" value={item?.amount} />
              </Col>
              <Col xs="12" sm="6" md="4" lg="2">
                <Tile label="Quality" value={item?.quality || "-"} />
              </Col>
              {item?.width ? (
                <Col xs="12" sm="6" md="4" lg="1">
                  <Tile label="WIdth" value={item?.width} />
                </Col>
              ) : null}
              {item?.height ? (
                <Col xs="12" sm="6" md="4" lg="1">
                  <Tile label="Height" value={item?.height} />
                </Col>
              ) : null}

              <hr className="my-3 px-4" />
            </Row>
          ))}
          <div className="d-flex float-end mt-2">
            <Button
              color="danger"
              onClick={onNo}
              className="me-2 mr-2 rr-btn"
              variant="danger"
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  currentOrder: state.order.currentOrder,
  loadingOrder: state.order.loadingOrder,
});

export default connect(mapStateToProps, {
  getOrderById,
})(ViewOrder);
