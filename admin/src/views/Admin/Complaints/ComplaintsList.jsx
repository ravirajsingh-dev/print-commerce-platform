import React from "react";
import { Button, Row, Col, Card, Image } from "react-bootstrap";
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
  getComplaintsList,
  deleteComplaint,
  resetComponentStore,
} from "@actions/complaintActions";

const ComplaintsList = ({
  loggedInUser,
  complaintsList: { data, count },
  getComplaintsList,
  deleteComplaint,
  loadingComplaintList,
  resetComponentStore,
  sortingParams,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
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

  const [complaintParams, setComplaintParams] =
    React.useState(initialSortingParams);

  const columns = [
    {
      name: "User",
      selector: (row) => row?.userDetails?.name || "N/A",
      sortable: false,
      sortField: "type",
      width: "10%",
      wrap: true,
    },
    {
      name: "Order Number",
      selector: (row) => <div>{row.orderNumber}</div>,
      sortable: false,
      sortField: "name",
      width: "10%",
      wrap: true,
    },
    {
      name: "Description",
      selector: (row) => <div>{row?.complaintDescription}</div>,
      sortable: false,
      sortField: "name",
      width: "30%",
      wrap: true,
    },
    {
      name: "Image",
      selector: (row) => (
        <div>
          {row?.file ? (
            <Image src={row?.file} width="200" height="200" />
          ) : (
            "Not Uploaded"
          )}
        </div>
      ),
      sortable: false,
      sortField: "name",
      width: "30%",
      wrap: true,
    },
    {
      name: "Actions",
      width: "calc(20%)",
      button: true,
      cell: (row) => (
        <div className="App table-list-buttons">
          <Link to={`/admin/complaints/${row._id}/edit`} title="Edit Complaint">
            <Button variant="primary" size="sm" className="me-2">
              <VscEye size={20} />
            </Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              // setSelectedComplaint(row);
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

    getComplaintsList(complaintParams, loggedInUser._id);
  }, [getComplaintsList, complaintParams, resetComponentStore, loggedInUser]);

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
  //     setComplaintParams,
  //     searchFields
  //   );
  // };

  const onFilterChange = (newParams) => {
    setComplaintParams((params) => ({ ...params, ...newParams }));
  };

  const handleConfirmDeletion = (id) => {
    deleteComplaint(id);
  };

  const handleCreateComplaintClick = (e) => {
    e.preventDefault();
    navigate("/admin/complaints/create");
    // if (isTxnPasswordSet) {
    // } else {
    //   setShowTxnPasswordModal(true);
    // }
  };

  return (
    <>
      <AppBreadCrumb
        pageTitle="Complaint List"
        crumbs={[{ name: "Complaints" }]}
      />

      <Card>
        <Card.Body>
          {/* <div className="table-filter-section mb-3">
            <Row className="d-flex justify-content-between">
              <Col md="4">
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleCreateComplaintClick}
                >
                  Create Complaint
                </Button>
              </Col>
            </Row>
          </div> */}

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={complaintParams}
            setParams={setComplaintParams}
            pagination
            responsive
            striped={true}
            progressPending={loadingComplaintList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </>
  );
};

ComplaintsList.propTypes = {
  getComplaintsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  complaintsList: state.complaint.complaintsList,
  loadingComplaintList: state.complaint.loadingComplaintList,
  sortingParams: state.complaint.sortingParams,
  loggedInUser: state.auth.user,
});

export default connect(mapStateToProps, {
  getComplaintsList,
  deleteComplaint,
  resetComponentStore,
})(ComplaintsList);
