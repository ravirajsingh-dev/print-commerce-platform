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
import { MdDelete } from "react-icons/md";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "../../Layout/AppBreadCrumb";
import ProductServiceFilters from "./ProductServiceFilters";

import {
  getProductServicesList,
  deleteProductService,
  resetComponentStore,
} from "@actions/productServiceActions";

import ConfirmPopup from "../../Layout/ConfirmBox";

const ProductServicesList = ({
  productServicesList: { data, count },
  getProductServicesList,
  deleteProductService,
  loadingProductServiceList,
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
    productServiceBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [productServiceParams, setProductServiceParams] =
    React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/product-services/create" title="create">
        <Button color="primary" size="sm">
          <BiPlusMedical /> Create New Product Service
        </Button>
      </Link>
    </div>
  );

  const conditionalRowStyles = [
    {
      when: (row) => row.stock > 200,
      style: {
        backgroundColor: "rgba(63, 195, 128, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    {
      when: (row) => row.stock <= 200 && row.stock > 50,
      style: {
        backgroundColor: "rgba(248, 148, 6, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    {
      when: (row) => !row.stock || row.stock < 50,
      style: {
        backgroundColor: "rgba(242, 38, 19, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "not-allowed",
        },
      },
    },
  ];

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
      width: "15%",
      cell: (row) => row.title,
    },
    {
      name: "Product Service ID",
      selector: (row) => row.productService_sku,
      width: "15%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true,
      width: "25%",
    },
    {
      name: "Stock (Inch)",
      selector: (row) => row.stock,
      width: "15%",
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
            title="Delete ProductService"
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

    getProductServicesList(productServiceParams);
  }, [getProductServicesList, productServiceParams, resetComponentStore]);

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

    setProductServiceParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setProductServiceParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <ConfirmPopup
        entity="Proudct"
        modal={confirmModal}
        name={modalData?.name}
        onYes={() => {
          deleteProductService(modalData?.id);
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
                <ProductServiceFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={productServiceParams}
                  onFilterChange={onFilterChange}
                />
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={productServiceParams}
            setParams={setProductServiceParams}
            pagination
            responsive
            striped={true}
            selectableRows
            progressPending={loadingProductServiceList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
            conditionalRowStyles={conditionalRowStyles}
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

ProductServicesList.propTypes = {
  getProductServicesList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  productServicesList: state.productService.productServicesList,
  loadingProductServiceList: state.productService.loadingProductServiceList,
  sortingParams: state.productService.sortingParams,
});

export default connect(mapStateToProps, {
  getProductServicesList,
  deleteProductService,
  resetComponentStore,
})(ProductServicesList);
