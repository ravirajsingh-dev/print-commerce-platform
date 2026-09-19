import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "../../Layout/AppBreadCrumb";
import ServiceCategoryFilters from "./ServiceCatFilters";

import {
  getServiceCatsList,
  deleteServiceCat,
  resetComponentStore,
} from "@actions/serviceCategoryActions";

import ConfirmPopup from "../../Layout/ConfirmBox";

const ServiceCategoriesList = ({
  serviceCatsList: { data, count },
  getServiceCatsList,
  deleteServiceCat,
  loadingServiceCatList,
  resetComponentStore,
  sortingParams,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
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
    ServiceCategoryBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [ServiceCategoryParams, setServiceCategoryParams] =
    React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/service-categories/create" title="create">
        <Button color="primary" size="sm">
          <BiPlusMedical /> Create New Service Category
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
      name: "ServiceCategory ID",
      selector: (row) => row.ServiceCategory_sku,
      width: "20%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
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
          <Link
            to={`/admin/product-services/${row._id}/edit`}
            title="View Product Service"
          >
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Delete ServiceCategory"
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

    getServiceCatsList(ServiceCategoryParams);
  }, [getServiceCatsList, ServiceCategoryParams, resetComponentStore]);

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

    setServiceCategoryParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setServiceCategoryParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <ConfirmPopup
        entity="Proudct"
        modal={confirmModal}
        name={modalData?.name}
        onYes={() => {
          deleteServiceCat(modalData?.id);
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

      <AppBreadcrumb
        pageTitle="Product Services"
        crumbs={[
          { name: "Products", path: "/admin/products" },
          { name: "Product Services" },
        ]}
      />

      <Card>
        <Card.Body>
          {actions}
          <div className="table-filter-section">
            <Row>
              <Col md="2">
                <ServiceCategoryFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={ServiceCategoryParams}
                  onFilterChange={onFilterChange}
                />
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={ServiceCategoryParams}
            setParams={setServiceCategoryParams}
            pagination
            responsive
            striped={true}
            selectableRows
            progressPending={loadingServiceCatList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

ServiceCategoriesList.propTypes = {
  getServiceCatsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  serviceCatsList: state.serviceCat.serviceCatsList,
  loadingServiceCatList: state.serviceCat.loadingServiceCatList,
  sortingParams: state.serviceCat.sortingParams,
});

export default connect(mapStateToProps, {
  getServiceCatsList,
  deleteServiceCat,
  resetComponentStore,
})(ServiceCategoriesList);
