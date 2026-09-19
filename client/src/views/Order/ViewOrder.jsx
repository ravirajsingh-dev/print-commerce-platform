import React from "react";
import { connect } from "react-redux";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  Badge,
  Table,
} from "react-bootstrap";
import moment from "moment";
import Errors from "@src/Notifications/Errors";
import { capitalizeFirst, getOrderPaymentStatus } from "@src/utils/helper";
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
  loggedInUser,
}) => {
  React.useEffect(() => {
    if (!modalData || !modal) return;
    getOrderById(modalData?.id);
  }, [modalData, modal, getOrderById]);

  React.useEffect(() => {
    console.log("currentOrder", currentOrder);
  }, [currentOrder]);

  const orderItems = [
    {
      mediaName: "Star Flex[SqFt]",
      liability: "",
      size: "180x22",
      role: 1,
      qty: 1,
      rate: 10.6,
      rRole: 3,
      rConsume: 45,
      totalPrice: 477,
      status: "Under Processing",
    },
    {
      mediaName: "Star Flex[SqFt]",
      liability: "",
      size: "132x72",
      role: 1,
      qty: 1,
      rate: 10.6,
      rRole: 6,
      rConsume: 66,
      totalPrice: 699,
      status: "Under Processing",
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      show={modal}
      onHide={onNo}
      size="xl"
      className="transition-all ease-in-out duration-500 delay-500"
    >
      <Modal.Header className="p-4 h5" closeButton>
        View Order
        {/* <div className="d-flex justify-content-end mb-3 ms-3">
          <Button variant="outline-primary" onClick={handlePrint}>
            🖨️ Print
          </Button>
        </div> */}
      </Modal.Header>
      {loadingOrder ? (
        <BouncingLoader minHeight="300px" />
      ) : (
        <Modal.Body>
          <Row>
            <Col sm="12" md="6">
              <Card className="mb-3 border-warning">
                <Card.Header className="bg-warning text-white">
                  <strong>🛒 Order Details</strong>
                </Card.Header>
                <Card.Body>
                  <p>
                    <strong>Order Reg. Date:</strong>{" "}
                    {moment(currentOrder?.createdAt).format("ll")}
                  </p>
                  <p>
                    <strong>Order Name:</strong> {currentOrder?.name}
                  </p>
                  <p>
                    <strong>Pre-Calc Amount:</strong> {currentOrder?.amount}
                  </p>
                  <p>
                    <strong>Shipping Charges:</strong> 0
                  </p>
                  <p>
                    <strong>Order Amount:</strong> {currentOrder?.full_amount}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {currentOrder?.order_id}
                  </p>

                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <Badge bg="warning">
                      {getOrderPaymentStatus(currentOrder?.status)}
                    </Badge>
                  </p>
                  <p>
                    <strong>Order Status:</strong>{" "}
                    <Badge bg="warning">
                      {capitalizeFirst(currentOrder.status)}
                    </Badge>
                  </p>
                  {/* <p>
                    <strong>Ad. Pay SMS:</strong> <Badge bg="info">Sent</Badge>
                  </p> */}
                  {/* <p>
                    <strong>Pending Amount:</strong>
                    <Badge bg="secondary">0</Badge>
                  </p> */}
                  {/* <p>
                    <strong>Paid Amount:</strong> <Badge bg="warning">0</Badge>
                  </p> */}
                  {/* <p>
                    <strong>Current Wallet Balance:</strong>{" "}
                    <Badge bg="info">0</Badge>
                  </p> */}
                  {/* <p>
                    <strong>Total Pending Amount:</strong>{" "}
                    <Badge bg="danger">373</Badge>
                  </p> */}
                  {/* <p>
                    <strong>Payment Due Date:</strong>{" "}
                  </p> */}
                  <p>
                    <strong>Comment:</strong>{" "}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="12" md="6">
              <Row>
                <Col sm="12">
                  <Card className="mb-3 border-primary">
                    <Card.Header className="bg-primary text-white">
                      <strong>👤 Customer Information</strong>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          {/* <p>
                            <strong>Marketing Officer:</strong> Kundan
                            Bhakhariwal
                          </p> */}
                          <p>
                            <strong>Customer Name:</strong> {loggedInUser?.name}
                          </p>
                          {/* <p>
                            <strong>Operator Name:</strong> Vijay vaishanav
                          </p> */}
                          <p>
                            <strong>Email:</strong> {loggedInUser?.email}
                          </p>
                          <p>
                            <strong>Mobile:</strong> {loggedInUser?.phone}
                          </p>
                          <p>
                            <strong>City:</strong> {loggedInUser?.city}
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm="12">
                  <Card className="mb-3 border-danger">
                    <Card.Header className="bg-danger text-white">
                      <strong>📦 Shipping Address</strong>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Deliver By:</strong> Blue Dart
                      </p>
                      <p>
                        To,
                        <br />
                        {loggedInUser?.address}
                        <br />
                        {loggedInUser?.city}
                        <br />
                        {loggedInUser?.state}{" "}
                        {loggedInUser?.pin_code ??
                          `(${loggedInUser?.pin_code})`}
                        <br />
                        {loggedInUser?.phone}
                        <br />
                        {loggedInUser?.email}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Card className="border-success">
            <Card.Header className="bg-success text-white">
              <strong>📋 Order Item Detail</strong>
            </Card.Header>
            <Card.Body>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Media Name</th>
                    <th>Liability</th>
                    <th>Size</th>
                    <th>Role</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder?.order_items?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.service?.title}</td>
                      <td></td>
                      <td>{item?.width || 1 * item?.height || 0}</td>
                      <td>{item.role_used}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {item?.service?.price_per_square
                          ? item?.service?.price_per_square
                          : item?.service?.price}
                      </td>
                      <td>{item.amount}</td>
                      <td>
                        <Badge bg="warning">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

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
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  getOrderById,
})(ViewOrder);
