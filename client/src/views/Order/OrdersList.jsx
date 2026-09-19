import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { PropTypes } from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

import { FaEye } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { VscGraphLeft } from "react-icons/vsc";
import { TbFilterSearch } from "react-icons/tb";

import BouncingLoader from "../spinners/BouncingLoader";
import Tile from "../commonComponents/mainCard/Tile";
import AppPagination from "../DataTable/AppPagination";
import AppBreadcrumb from "@src/views/DataTable/AppBreadCrumb";
import CancelOrderPopup from "./CancelOrderPopup";
import ViewOrder from "./ViewOrder";

import {
  getOrdersList,
  resetComponentStore,
  updateOrderStatusByID,
  getInvoiceByID,
} from "@src/actions/orderActions";
import OrderFilters from "./OrderFilters";
import { GlobalOrderStatus } from "@src/constants/index";

const OrdersList = ({
  loggedInUser,
  ordersList: { data, count },
  getOrdersList,
  loadingOrderList,
  resetComponentStore,
  sortingParams,
  updateOrderStatusByID,
  getInvoiceByID,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [modalData, setModalData] = React.useState(null);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [invoiceLoading, setInvoiceLoading] = React.useState({});
  const [editModal, setEditModal] = React.useState(false);

  const { page, limit } = sortingParams;

  React.useEffect(() => {
    const invoiceObj = {};
    if (data && data.length) {
      data.forEach((res, i) => {
        invoiceObj[`invoice-${i}`] = false;
      });
    }

    setInvoiceLoading(invoiceObj);
  }, [data]);

  const initialSortingParams = {
    limit: limit,
    page: page,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [params, setParams] = React.useState(initialSortingParams);
  const [showFilters, setShowFilters] = React.useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const onClickCancel = (id, name) => {
    setModalData({
      id,
      name,
    });
    setConfirmModal(true);
  };

  const onClickEdit = (id, name) => {
    setModalData({
      id,
      name,
    });
    setEditModal(true);
  };

  const onClickDownloadInvoice = (row, index) => {
    invoiceLoading[index] = true;
    setInvoiceLoading({ ...invoiceLoading });

    getInvoiceByID(row._id, row.order_id).then((blob) => {
      invoiceLoading[index] = false;
      setInvoiceLoading({ ...invoiceLoading });
    });
  };

  const checkIsDisable = (status) => {
    if (status === "pending" || status === "processing") {
      return false;
    }

    return true;
  };

  const navigate = useNavigate();
  React.useMemo(() => {
    if (onlyOnce) {
      resetComponentStore();
      setOnce(false);
    }

    if (!loggedInUser) return;

    getOrdersList(params);
  }, [getOrdersList, params, resetComponentStore, loggedInUser]);

  const handleTableChange = (type, searchText) => {
    console.log("ON Table change");
    let params = {
      limit: limit,
      page: type === "search" ? 1 : page ? page : 1,
    };

    let filters = [];
    if (type === "search") {
      if (searchText.length > 0) {
        filters = sortingParams.filters.includes(type)
          ? sortingParams.filters
          : [...sortingParams.filters, type];
        params = {
          ...params,
          query: {
            ...sortingParams.query,
            [type]: {
              order_id: {
                value: searchText,
                type: "String",
              },
              name: {
                value: searchText,
                type: "String",
              },
              email: {
                value: searchText,
                type: "String",
              },
            },
          },
          filters,
        };
      } else {
        filters = sortingParams.filters.filter((item) => item !== type);
        const temp = {};
        params = {
          ...sortingParams,
          filters,
        };
        for (var i in params.query) {
          if (i === type) continue;
          temp[i] = params.query[i];
        }
        params.query = temp;
      }
    }

    setParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <AppBreadcrumb
        title="Your Orders"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "orders" },
        ]}
      />

      <ViewOrder
        modal={editModal}
        modalData={modalData}
        onNo={() => {
          setEditModal(false);
          setModalData({
            name: "",
            id: "",
            status: "",
          });
        }}
        setModal={setEditModal}
      />

      <CancelOrderPopup
        modal={confirmModal}
        modalData={modalData}
        onNo={() => {
          setConfirmModal(false);
          setModalData({
            name: "",
            id: "",
            status: "",
          });
        }}
        updateOrderStatusByID={updateOrderStatusByID}
        setModal={setConfirmModal}
      />

      <Row>
        <Col xs="12">
          <div className="customTileCardDesign m-5">
            <div className="heading-div">
              <div className="title">Orders</div>
              <div className="btn-icon mb-3">
                <Button
                  className="rr-btn fadeInLeft animated"
                  onClick={toggleFilters}
                >
                  <TbFilterSearch size={20} /> Filters
                </Button>
              </div>
            </div>

            <div className="filter-dropdown-container">
              {showFilters && (
                <div className="filter-dropdown">
                  <OrderFilters
                    filterParams={params}
                    filterName="Status"
                    filter="status"
                    filterType="string"
                    type="searchable-select"
                    selectOptions={GlobalOrderStatus}
                    placeholder="Search Orders"
                    onSearch={handleTableChange}
                    onFilterChange={onFilterChange}
                    toggleFilters={toggleFilters}
                  />
                </div>
              )}
            </div>

            {loadingOrderList ? (
              <BouncingLoader minHeight="200px" />
            ) : data.length > 0 ? (
              data.map((odr, i) => (
                <Row className="tile-body" key={odr._id}>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile label="SR." value={i + 1} />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile label="Order ID" value={`${odr.order_id}`} copyable />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Total Amount"
                      value={`${odr.full_amount ? `₹${odr.full_amount}` : "-"}`}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile label="Status" value={odr.status} />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Date"
                      value={moment(odr.createdAt).format(
                        "MMM DD, YYYY, hh:mm a"
                      )}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Actions"
                      value={
                        <div className="App table-list-buttons">
                          <Button
                            variant="info"
                            size="lg"
                            onClick={(e) => {
                              onClickEdit(odr._id, odr.name);
                            }}
                          >
                            <FaEye />
                          </Button>

                          {!checkIsDisable(odr.status) ? (
                            <Button
                              className="ms-2"
                              size="lg"
                              title={
                                checkIsDisable(odr.status)
                                  ? "Orde can not cancelled after confirmed"
                                  : "Cancel Order"
                              }
                              type="button"
                              variant="warning"
                              onClick={(e) => {
                                onClickCancel(odr._id, odr.name);
                              }}
                              disabled={checkIsDisable(odr.status)}
                            >
                              <ImCross />
                            </Button>
                          ) : null}

                          <Link
                            to={`/user/orders/tracking`}
                            title={
                              odr.status === "cancelled"
                                ? "Can not track disable order"
                                : "Track Order"
                            }
                            state={{ order: odr._id, orderID: odr.order_id }}
                          >
                            <Button
                              className="ms-2"
                              size="lg"
                              title={
                                odr.status === "cancelled"
                                  ? "Can not track disable order"
                                  : "Track Order"
                              }
                              type="button"
                              variant="success"
                              onClick={(e) => {
                                onClickCancel(odr._id, odr.name);
                              }}
                              disabled={odr.status === "cancelled"}
                            >
                              <VscGraphLeft size="16px" />
                            </Button>
                          </Link>

                          <Button
                            className="ms-2"
                            size="lg"
                            title="Download Invoice"
                            type="button"
                            onClick={(e) => {
                              onClickDownloadInvoice(odr, i);
                            }}
                            disabled={
                              invoiceLoading[i] || odr.status === "cancelled"
                            }
                          >
                            {invoiceLoading[i] ? (
                              <i className="fa fa-download"></i>
                            ) : (
                              <FaFileAlt />
                            )}
                          </Button>
                        </div>
                      }
                    />
                  </Col>
                </Row>
              ))
            ) : (
              <Row className="no-result">
                <Col xs="12" className="text-center">
                  No Orders found.
                </Col>
              </Row>
            )}

            {!loadingOrderList && data.length > 0 && (
              <Row>
                <Col xs="12">
                  <AppPagination
                    count={count}
                    params={params}
                    setParams={setParams}
                  />
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

OrdersList.propTypes = {
  getOrdersList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  ordersList: state.order.ordersList,
  loadingOrderList: state.order.loadingOrderList,
  sortingParams: state.order.sortingParams,
  loggedInUser: state.auth.user,
  levelsList: state.common.levelsList,
});

export default connect(mapStateToProps, {
  getOrdersList,
  resetComponentStore,
  updateOrderStatusByID,
  getInvoiceByID,
})(OrdersList);
