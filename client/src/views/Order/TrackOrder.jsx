import React from "react";
import { connect } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import moment from "moment";
import Select from "react-select";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";

import { getOrdersListAll, trackOrderByID } from "@src/actions/orderActions";
import { GlobalOrderStatus2 } from "@src/constants/index";
import BouncingLoader2 from "../spinners/BouncingLoader2";

const TrackOrder = ({
  getOrdersListAll,
  ordersList,
  trackOrderByID,
  loadingOrderTracking,
  orderStatusList,
}) => {
  const location = useLocation();
  const order_id = location.state?.order;

  const [selectedOrder, setSelectedOrder] = React.useState(null);

  React.useEffect(() => {
    getOrdersListAll();
  }, []);

  React.useEffect(() => {
    if (!order_id) return;

    trackOrderByID(order_id);
  }, [order_id]);

  React.useEffect(() => {
    if (!order_id || !ordersList?.length) return;

    const selected = ordersList.find((r) => r._id === order_id);

    setSelectedOrder({
      value: selected._id,
      label: `${selected.name} (${selected.order_id})`,
      order_id: selected.order_id,
    });
  }, [order_id, ordersList]);

  const handleSelect = (type) => (selectedOption) => {
    setSelectedOrder(selectedOption);

    trackOrderByID(selectedOption?.value);
  };

  const isActive = (status) =>
    orderStatusList.some((order) => order.status === status.value);

  return (
    <>
      <AppBreadCrumb
        title="Track Order"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Track Order" },
        ]}
      />

      <div className="track-container">
        <article className="order-card">
          <header className="order-card-header my-3">
            My Orders / Tracking
          </header>
          <div className="order-card-body">
            <Row className="">
              <Col md="4">
                <Form.Group className="my-2 mr-sm-3">
                  <Form.Label htmlFor="filter">
                    Select Order <span>*</span>
                  </Form.Label>
                  <Select
                    id="order"
                    name="order"
                    options={ordersList?.map((r) => ({
                      value: r._id,
                      label: `${r.name} (${r.order_id})`,
                      order_id: r.order_id,
                    }))}
                    value={selectedOrder}
                    placeholder="Select"
                    onChange={handleSelect("order")}
                  />
                </Form.Group>
              </Col>
              <Col md="4" className="my-auto ms-auto text-end me-2">
                <h6>Order ID: {selectedOrder?.order_id}</h6>
              </Col>
            </Row>
            {loadingOrderTracking ? (
              <BouncingLoader2 />
            ) : selectedOrder ? (
              <>
                <article className="order-card">
                  <div className="order-card-body row">
                    <div className="col">
                      <strong>Estimated Delivery time:</strong> <br />
                      29 nov 2019
                    </div>
                    <div className="col">
                      <strong>Shipping BY:</strong> <br /> BLUEDART, |
                      <i className="fa fa-phone"></i> +1598675986
                    </div>
                    <div className="col">
                      <strong>Status:</strong> <br /> Picked by the courier
                    </div>
                    <div className="col">
                      <strong>Tracking #:</strong> <br /> BD045903594059
                    </div>
                  </div>
                </article>
                <div className="track">
                  {GlobalOrderStatus2.map((status) => {
                    // Find the matching status in orderStatusList
                    const orderStatus = orderStatusList.find(
                      (order) => order.status === status.value
                    );

                    return (
                      <div
                        className={`step ${orderStatus ? "active" : ""}`}
                        key={status.value}
                      >
                        <span className="icon">
                          <i className="fa fa-check"></i>
                        </span>
                        <span className="text">{status.label}</span>

                        {orderStatus && (
                          <div>
                            {orderStatus.updatedBy && (
                              <span>
                                Updated By{" "}
                                <strong>{orderStatus.updatedBy.name}</strong>
                              </span>
                            )}

                            {orderStatus.createdAt && (
                              <span className="d-block">
                                At{" "}
                                <strong>
                                  {moment(orderStatus.createdAt).format("ll")}
                                </strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/user/orders"
                  className="rr-btn btn-warning mt-5"
                  data-abc="true"
                >
                  <i className="fa fa-chevron-left"></i> Back to orders
                </Link>
              </>
            ) : null}
          </div>
        </article>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ordersList: state.order.ordersListAll,
  loadingOrderTracking: state.order.loadingOrderTracking,
  orderStatusList: state.order.orderStatusList,
});

export default connect(mapStateToProps, {
  getOrdersListAll,
  trackOrderByID,
})(TrackOrder);
