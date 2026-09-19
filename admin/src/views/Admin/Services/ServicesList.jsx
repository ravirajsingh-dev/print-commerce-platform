import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";

import {
  getServicesList,
  deleteService,
  resetComponentStore,
} from "@actions/serviceActions";
import ConfirmPopup from "../Layout/ConfirmBox";

const ServicesList = ({
  servicesList: { data, count },
  getServicesList,
  deleteService,
  loadingServiceList,
  resetComponentStore,
  sortingParams,
  levelsList,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [changePasswordModal, setChangePasswordModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [modalData, setModalData] = React.useState({
    name: "",
    id: "",
    inputText: "",
  });

  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 20,
    page: 1,
    serviceBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [serviceParams, setServiceParams] =
    React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/services/create" title="create">
        <Button variant="primary" size="sm">
          <BiPlusMedical /> Create New Service
        </Button>
      </Link>
    </div>
  );

  const onClickDelete = (id, name) => {
    setModalData({
      id,
      name,
    });
    setConfirmModal(true);
  };

  const columns = [
    {
      name: "Name",
      sortable: true,
      sortField: "name",
      width: "20%",
      cell: (row) => row.title,
    },
    {
      name: "Service ID",
      selector: (row) => row.service_sku,
      width: "20%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
      width: "30%",
    },
    {
      name: "Status",
      selector: (row) => (row?.status === 1 ? "Active" : "Inactive"),
      sortable: true,
      sortField: "status",
      width: "10%",
    },
    {
      name: "Actions",
      width: "calc(20% - 48px)",
      button: true,
      cell: (row) => (
        <div className="App table-list-buttons">
          <Link to={`/admin/services/${row._id}/edit`} title="View Service">
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Delete Service"
            type="button"
            variant="danger"
            onClick={(e) => {
              onClickDelete(row._id, row.title);
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
    }

    getServicesList(serviceParams);
  }, [getServicesList, serviceParams, resetComponentStore]);

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
              H2C_ID: {
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

    setServiceParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setServiceParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <ConfirmPopup
        entity="Proudct"
        modal={confirmModal}
        name={modalData?.name}
        onYes={() => {
          deleteService(modalData?.id);
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

      <AppBreadcrumb pageTitle="Services" crumbs={[{ name: "Services" }]} />

      <Card>
        <Card.Body>
          {actions}

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={serviceParams}
            setParams={setServiceParams}
            pagination
            responsive
            striped={true}
            selectableRows
            progressPending={loadingServiceList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

ServicesList.propTypes = {
  getServicesList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  servicesList: state.service.servicesList,
  loadingServiceList: state.service.loadingServiceList,
  sortingParams: state.service.sortingParams,
  levelsList: state.common.levelsList,
});

export default connect(mapStateToProps, {
  getServicesList,
  deleteService,
  resetComponentStore,
})(ServicesList);
