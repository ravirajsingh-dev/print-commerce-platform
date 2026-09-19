import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { MdOutlineDesignServices } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiCircleList } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";
import ProductFilters from "./ProductFilters";

import {
  getProductsList,
  deleteProduct,
  resetComponentStore,
} from "@actions/productActions";
import ConfirmPopup from "../Layout/ConfirmBox";

const ProductsList = ({
  productsList: { data, count },
  getProductsList,
  deleteProduct,
  loadingProductList,
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
    productBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [productParams, setProductParams] =
    React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Link to="/admin/products/create" title="create">
        <Button variant="secondary" size="sm">
          <BiPlusMedical /> Create New Product
        </Button>
      </Link>

      <Link
        to="/admin/product-services"
        title="Product Services"
        className="ms-2"
      >
        <Button color="primary" size="sm">
          <MdOutlineDesignServices /> Product Services
        </Button>
      </Link>

      {/* <Link
        to="/admin/service-categories"
        title="Service Categories"
        className="ms-2"
      >
        <Button color="primary" size="sm">
          <BiSolidCategory /> Service Categories
        </Button>
      </Link> */}
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
      name: "Product ID",
      selector: (row) => row.product_sku,
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
          <Link to={`/admin/products/${row._id}/edit`} title="View Product">
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Delete Product"
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

    getProductsList(productParams);
  }, [getProductsList, productParams, resetComponentStore]);

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
              product_sku: {
                value: searchText,
                type: "String",
              },
              title: {
                value: searchText,
                type: "String",
              },
              description: {
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

    setProductParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setProductParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <ConfirmPopup
        entity="Proudct"
        modal={confirmModal}
        name={modalData?.name}
        onYes={() => {
          deleteProduct(modalData?.id);
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

      <AppBreadcrumb pageTitle="Products" crumbs={[{ name: "Products" }]} />

      <Card>
        <Card.Body>
          {actions}
          <div className="table-filter-section">
            <Row>
              <Col md="2">
                <ProductFilters
                  onSearch={handleTableChange}
                  filterType="String"
                  filterName="Search"
                  filterParams={productParams}
                  onFilterChange={onFilterChange}
                />
              </Col>
            </Row>
          </div>

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={productParams}
            setParams={setProductParams}
            pagination
            responsive
            striped={true}
            selectableRows
            progressPending={loadingProductList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

ProductsList.propTypes = {
  getProductsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  productsList: state.product.productsList,
  loadingProductList: state.product.loadingProductList,
  sortingParams: state.product.sortingParams,
  levelsList: state.common.levelsList,
});

export default connect(mapStateToProps, {
  getProductsList,
  deleteProduct,
  resetComponentStore,
})(ProductsList);
