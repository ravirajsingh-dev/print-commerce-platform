import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiCircleList } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import OrderFilters from "./OrderFilters";

import {
  getOrdersList,
  deleteOrder,
  resetComponentStore,
  updateOrderStatusByID,
  removeOrderErrors,
  setErrors,
} from "@actions/orderActions";

import { getProductsListAll } from "@actions/productActions";
import { getProductServicesListAll } from "@actions/productServiceActions";
import { getServiceCatsListAll } from "@actions/serviceCategoryActions";

import {
  getOrderStatusByValue,
  isAdmin,
  isDisabledOrderStatusUpdate,
} from "@utils/helper";
import ConfirmPopup from "../Layout/ConfirmBox";
import UpdateStatusModal from "./UpdateStatusModal";

const OrdersList = ({
  loggedInUser,
  ordersList: { data, count },
  getOrdersList,
  deleteOrder,
  loadingOrderList,
  resetComponentStore,
  sortingParams,
  levelsList,
  getProductsListAll,
  getProductServicesListAll,
  getServiceCatsListAll,
  updateOrderStatusByID,
  removeOrderErrors,
  setErrors,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [modalData, setModalData] = React.useState(null);
  const [statusModal, setStatusmModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);

  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 20,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [orderParams, setOrderParams] = React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/orders/create" title="create">
        <Button color="primary" size="sm">
          <BiPlusMedical /> Create New Order
        </Button>
      </Link>
    </div>
  );

  const onClickUpdateStatus = (id, name, status) => {
    setModalData({
      id,
      name,
      status,
    });
    setStatusmModal(true);
  };

  const onClickDelete = (id, name) => {
    setModalData({
      id,
      name,
    });
    setConfirmModal(true);
  };

  const columns = [
    {
      name: "Order ID",
      sortField: "order_id",
      width: "10%",
      cell: (row) => row.order_id,
    },
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      width: "10%",
      cell: (row) => row.name,
    },
    {
      name: "User",
      selector: (row) => row.userInfo?.name,
      width: "10%",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      width: "10%",
    },
    {
      name: "Full Amount",
      selector: (row) => row.full_amount,
      sortable: true,
      sortField: "status",
      width: "10%",
    },
    {
      name: "Status",
      selector: (row) => <div>{getOrderStatusByValue(row.status)}</div>,
      sortable: true,
      sortField: "status",
      width: "15%",
    },
    {
      name: "Created At",
      selector: (row) => moment(row.createdAt).format("MMM DD, YYYY, hh:mm a"),
      sortable: true,
      sortField: "createdAt",
      width: "15%",
    },
    {
      name: "Actions",
      width: "calc(20% - 48px)",
      button: true,
      cell: (row) => (
        <div className="App table-list-buttons">
          <Link to={`/admin/orders/${row._id}/edit`} title="View Order">
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Update Status"
            type="button"
            variant="success"
            onClick={(e) => {
              onClickUpdateStatus(row._id, row.name, row.status);
            }}
          >
            <GrStatusGood />
          </Button>
          <Button
            className="ml-1"
            size="sm"
            title="Delete Order"
            type="button"
            variant="danger"
            onClick={(e) => {
              onClickDelete(row._id, row.name);
            }}
          >
            <MdDelete />
          </Button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
  React.useMemo(() => {
    if (onlyOnce) {
      resetComponentStore();
      setOnce(false);
      getProductsListAll();
      getProductServicesListAll();
      getServiceCatsListAll();
    }

    if (!loggedInUser) return;

    // To Prevent API call when order is not a admin
    if (!isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
      return;
    }

    getOrdersList(orderParams);
  }, [getOrdersList, orderParams, resetComponentStore, loggedInUser]);

  React.useEffect(() => {
    const intervel = setInterval(() => {
      getOrdersList(orderParams, false);
    }, 30000);
    return () => {
      clearInterval(intervel);
    };
  }, []);

  const handleTableChange = (type, searchText) => {
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

    setOrderParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setOrderParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <AppBreadcrumb pageTitle="Orders" crumbs={[{ name: "Orders" }]} />

      <ConfirmPopup
        entity="Order"
        modal={confirmModal}
        name={modalData?.name}
        onYes={() => {
          deleteOrder(modalData?.id);
          setConfirmModal(false);
        }}
        onNo={() => {
          setConfirmModal(false);
          setModalData({
            name: "",
            id: "",
          });
        }}
        inputText={modalData?.inputText}
      />

      <UpdateStatusModal
        modal={statusModal}
        modalData={modalData}
        onNo={() => {
          setStatusmModal(false);
          setModalData({
            name: "",
            id: "",
            status: "",
          });
        }}
        removeOrderErrors={removeOrderErrors}
        setErrors={setErrors}
        updateOrderStatusByID={updateOrderStatusByID}
        setModal={setStatusmModal}
      />

      <Card>
        <Card.Body>
          {actions}
          <div className="table-filter-section">
            <Row>
              <Col md="2">
                <OrderFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={orderParams}
                  onFilterChange={onFilterChange}
                />
              </Col>

              {/* <Col md="2">
                <OrderFilters
                  type="searchable-select"
                  filter="leg-status"
                  filterType="Leg"
                  filterName="Leg Status"
                  filterParams={orderParams}
                  onFilterChange={onFilterChange}
                  selectOptions={[
                    {
                      value: "all",
                      title: "All",
                    },
                    {
                      value: "completed",
                      title: "Completed",
                    },
                    {
                      value: "not-completed",
                      title: "Not Completed",
                    },
                  ]}
                />
              </Col> */}

              {/* <Col md="2">
                <OrderFilters
                  type="text"
                  filter="search-team"
                  filterType="String"
                  filterName="Search My Team"
                  placeholder="Search Order Team With H2C ID"
                  filterParams={orderParams}
                  onFilterChange={onFilterChange}
                />
              </Col> */}
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={orderParams}
            setParams={setOrderParams}
            pagination
            responsive
            striped={true}
            selectableRows
            progressPending={loadingOrderList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
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
  deleteOrder,
  resetComponentStore,
  getProductsListAll,
  getProductServicesListAll,
  getServiceCatsListAll,
  updateOrderStatusByID,
  removeOrderErrors,
  setErrors,
})(OrdersList);
