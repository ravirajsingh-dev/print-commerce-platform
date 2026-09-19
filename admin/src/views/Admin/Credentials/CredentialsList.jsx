import React from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// icons
import { VscEye } from "react-icons/vsc";
import { RiDeleteBin5Line } from "react-icons/ri";

// custom imports
import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadCrumb from "@views/Admin/Layout/AppBreadCrumb";
import {
  getCredentialsList,
  deleteCredential,
  resetComponentStore,
} from "@actions/credentialActions";

const CredentialsList = ({
  loggedInUser,
  credentialsList: { data, count },
  getCredentialsList,
  deleteCredential,
  loadingCredentialList,
  resetComponentStore,
  sortingParams,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedCredential, setSelectedCredential] = React.useState(null);
  const [showTxnPasswordModal, setShowTxnPasswordModal] = React.useState(false);
  const [isTxnPasswordSet, setIsTxnPasswordSet] = React.useState(
    !!loggedInUser?.txn_password
  );
  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 10,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [credentialParams, setCredentialParams] =
    React.useState(initialSortingParams);

  const columns = [
    {
      name: "Type",
      selector: (row) => row.type.toUpperCase(),
      sortable: false,
      sortField: "type",
      width: "15%",
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => <div>{row.name}</div>,
      sortable: false,
      sortField: "name",
      width: "25%",
      wrap: true,
    },
    {
      name: "AC/UPI",
      selector: (row) => <div>{row.upi ? row.upi : row.account_number}</div>,
      sortable: false,
      sortField: "name",
      width: "30%",
      wrap: true,
    },
    {
      name: "Actions",
      width: "calc(30%)",
      cell: (row) => (
        <div className="d-flex">
          <Link
            to={`/admin/credentials/${row._id}/edit`}
            title="Edit Credential"
            className="text-primary mx-3"
          >
            <Button size="sm">
              <VscEye size={20} />
            </Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              // setSelectedCredential(row);
              // setShowModal(true);
              handleConfirmDeletion(row._id);
            }}
          >
            <RiDeleteBin5Line />
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

    if (!loggedInUser) return;

    getCredentialsList(credentialParams, loggedInUser._id);
  }, [getCredentialsList, credentialParams, resetComponentStore, loggedInUser]);

  const searchFields = [
    { name: "providerName", type: "String" },
    { name: "balanceRange", type: "String" },
    { name: "bonus", type: "String" },
  ];

  // const handleTableChange = (type, searchText) => {
  //   handleTableChangeHelper(
  //     type,
  //     searchText,
  //     sortingParams,
  //     setCredentialParams,
  //     searchFields
  //   );
  // };

  const onFilterChange = (newParams) => {
    setCredentialParams((params) => ({ ...params, ...newParams }));
  };

  const handleConfirmDeletion = (id) => {
    deleteCredential(id);
  };

  const handleCreateCredentialClick = (e) => {
    e.preventDefault();
    navigate("/admin/credentials/create");
    // if (isTxnPasswordSet) {
    // } else {
    //   setShowTxnPasswordModal(true);
    // }
  };

  return (
    <>
      <AppBreadCrumb
        pageTitle="Credential List"
        crumbs={[{ name: "Credentials" }]}
      />

      <Card>
        <Card.Body>
          <div className="table-filter-section mb-3">
            <Row className="d-flex justify-content-between">
              <Col md="4">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateCredentialClick}
                >
                  Create Credential
                </Button>
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={credentialParams}
            setParams={setCredentialParams}
            pagination
            responsive
            striped={true}
            progressPending={loadingCredentialList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </>
  );
};

CredentialsList.propTypes = {
  getCredentialsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  credentialsList: state.credentials.credentialsList,
  loadingCredentialList: state.credentials.loadingCredentialList,
  sortingParams: state.credentials.sortingParams,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  getCredentialsList,
  deleteCredential,
  resetComponentStore,
})(CredentialsList);
