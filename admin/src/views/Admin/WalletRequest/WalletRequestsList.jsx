import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";
import { CiCircleList } from "react-icons/ci";
import { GrStatusGood } from "react-icons/gr";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";

import {
  getWalletRequestsList,
  removeWalletRequestErrors,
  updateWalletRequestStatusByID,
  resetComponentStore,
  setErrors,
} from "@actions/walletActions";

import { capitalizeFirst, getUserStatusLabel, isAdmin } from "@utils/helper";
import ConfirmPopup from "../Layout/ConfirmBox";
import UpdateWalletStatusModal from "./UpdateWalletStatusModal";
import WalletRequestFilters from "./WalletRequestFilters";

const WalletRequestsList = ({
  loggedInUser,
  walletRequestsList: { data, count },
  getWalletRequestsList,
  updateWalletRequestStatusByID,
  loadingWalletRequestList,
  resetComponentStore,
  sortingParams,
  removeWalletRequestErrors,
  setErrors,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [modalData, setModalData] = React.useState(null);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [statusModal, setStatusmModal] = React.useState(false);

  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 20,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [params, setParams] = React.useState(initialSortingParams);

  const onClickUpdateStatus = (id, name, status, entity) => {
    setModalData({
      id,
      name,
      status,
      entity,
    });
    setStatusmModal(true);
  };

  const columns = [
    {
      name: "User",
      sortable: true,
      sortField: "SA_ID",
      width: "15%",
      cell: (row) => `${row.userDetails?.name} (${row.userDetails?.SA_ID})`,
    },

    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      sortField: "email",
      width: "10%",
      wrap: true,
    },

    {
      name: "Received In",
      selector: (row) => `${row.type} (${row?.payment_details})`,
      sortable: true,
      sortField: "email",
      width: "15%",
      wrap: true,
    },

    {
      name: "TXN Number",
      selector: (row) => `${row.txn_number}`,
      sortable: true,
      sortField: "email",
      width: "15%",
      wrap: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      sortField: "status",
      width: "10%",
    },
    {
      name: "Joined At",
      selector: (row) => moment(row.createdAt).format("MMM DD, YYYY"),
      sortable: true,
      sortField: "createdAt",
      width: "15%",
    },
    {
      name: "Actions",
      width: "20%",
      button: true,
      cell: (row, index) => (
        <div className="App table-list-buttons">
          <Button
            className="ml-1"
            size="sm"
            title="Update Status"
            type="button"
            variant="primary"
            onClick={(e) => {
              onClickUpdateStatus(
                row._id,
                row.txn_number,
                row.status,
                "approve"
              );
            }}
          >
            Approve
          </Button>

          <Button
            className="ml-1"
            size="sm"
            title="Update Status"
            type="button"
            variant="danger"
            onClick={(e) => {
              onClickUpdateStatus(
                row._id,
                row.txn_number,
                row.status,
                "cancel"
              );
            }}
          >
            Cancel
          </Button>
        </div>
      ),
    },
  ];

  const navigate = useNavigate();
  React.useEffect(() => {
    if (onlyOnce) {
      resetComponentStore();
      setOnce(false);
    }
  }, [onlyOnce, resetComponentStore]);

  React.useEffect(() => {
    if (loggedInUser && !isAdmin(loggedInUser)) {
      navigate("/admin/dashboard");
    }

    getWalletRequestsList(params);
  }, [getWalletRequestsList, params, loggedInUser, navigate]);

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
              amount: {
                value: searchText,
                type: "Number",
              },
              type: {
                value: searchText,
                type: "String",
              },
              txn_number: {
                value: searchText,
                type: "String",
              },
              status: {
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
        pageTitle="Wallet Request"
        crumbs={[{ name: "Wallet Request" }]}
      />

      <UpdateWalletStatusModal
        modal={statusModal}
        entity={modalData?.entity}
        modalData={modalData}
        onNo={() => {
          setStatusmModal(false);
          setModalData({
            name: "",
            id: "",
            status: "",
            entity: "",
          });
        }}
        removeWalletRequestErrors={removeWalletRequestErrors}
        setErrors={setErrors}
        updateWalletRequestStatusByID={updateWalletRequestStatusByID}
        setModal={setStatusmModal}
      />

      <Card>
        <Card.Body>
          <div className="table-filter-section">
            <Row>
              <Col md="4">
                <WalletRequestFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={params}
                  onFilterChange={onFilterChange}
                />
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={params}
            setParams={setParams}
            pagination
            responsive
            striped={true}
            progressPending={loadingWalletRequestList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

WalletRequestsList.propTypes = {
  getWalletRequestsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  walletRequestsList: state.wallet.walletRequestsList,
  loadingWalletRequestList: state.wallet.loadingWalletRequestList,
  sortingParams: state.wallet.sortingParams,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  getWalletRequestsList,
  updateWalletRequestStatusByID,
  resetComponentStore,
  removeWalletRequestErrors,
  setErrors,
})(WalletRequestsList);
