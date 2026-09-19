import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import UserFilters from "./UserFilters";
import ChangePasswordModal from "./ChangePasswordModal";

import { getUsersList, deleteUser, resetComponentStore } from "@actions/user";

import { capitalizeFirst, getUserStatusLabel, isAdmin } from "@utils/helper";
import ConfirmPopup from "../Layout/ConfirmBox";

const UsersList = ({
  loggedInUser,
  usersList: { data, count },
  getUsersList,
  deleteUser,
  loadingUserList,
  resetComponentStore,
  sortingParams,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [modalData, setModalData] = React.useState(null);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [changePasswordModal, setChangePasswordModal] = React.useState(false);

  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 20,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [userParams, setUserParams] = React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/users/create" title="create">
        <Button color="primary" size="sm">
          <BiPlusMedical /> Create New User
        </Button>
      </Link>
    </div>
  );

  const columns = [
    {
      name: "SA ID",
      sortable: true,
      sortField: "SA_ID",
      width: "15%",
      cell: (row) => row.SA_ID,
    },
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      width: "20%",
      cell: (row) => (
        <Row>
          <Col md="12" className="mb-1">
            {capitalizeFirst(row.business_name)}
          </Col>
          <Col md="12" className="mb-1">
            {capitalizeFirst(row.name)}
          </Col>
          <Col md="12" className="mb-1">
            {row.phone}
          </Col>
          <Col md="12" className="mb-2">
            {row.city ? `${row.city},${row.state}` : ""}
          </Col>
        </Row>
      ),
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email",
      width: "20%",
      wrap: true,
    },

    {
      name: "Status",
      selector: (row) => getUserStatusLabel(row.status),
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
          <Link to={`/admin/users/${row._id}/profile`} title="View User">
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Delete User"
            type="button"
            variant="danger"
            onClick={() => {
              setModalData({
                id: row._id,
                entity: `User: ${row.name}`,
                name: row.name,
                index,
              });
              setConfirmModal(true);
            }}
          >
            <BiTrash />
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

    getUsersList(userParams);
  }, [getUsersList, userParams, loggedInUser, navigate]);

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
              SA_ID: {
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
              phone: {
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

    setUserParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setUserParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <AppBreadcrumb pageTitle="Users" crumbs={[{ name: "Users" }]} />

      <ChangePasswordModal
        setModal={setChangePasswordModal}
        modal={changePasswordModal}
        modalData={modalData}
      />

      <ConfirmPopup
        entity={modalData?.entity}
        modal={confirmModal}
        name={modalData?.name || "this user"}
        onYes={() => {
          setConfirmModal(false);
          deleteUser(modalData?.id).then(() => {
            setModalData(null);
          });
        }}
        onNo={() => {
          setConfirmModal(false);
          setModalData(null);
        }}
      />

      <Card>
        <Card.Body>
          {actions}

          <div className="table-filter-section">
            <Row>
              <Col md="2">
                <UserFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={userParams}
                  onFilterChange={onFilterChange}
                />
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={userParams}
            setParams={setUserParams}
            pagination
            responsive
            striped={true}
            progressPending={loadingUserList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

UsersList.propTypes = {
  getUsersList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  usersList: state.user.usersList,
  loadingUserList: state.user.loadingUserList,
  sortingParams: state.user.sortingParams,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  getUsersList,
  deleteUser,
  resetComponentStore,
})(UsersList);
