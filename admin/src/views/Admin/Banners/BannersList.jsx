import React from "react";
import { PropTypes } from "prop-types";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import { connect } from "react-redux";
import moment from "moment";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiPlusMedical, BiTrash } from "react-icons/bi";

import PiDataTable from "@views/DataTable/PiDataTable";
import AppBreadcrumb from "@views/Admin/Layout/AppBreadCrumb";

import {
  getBannersList,
  deleteBanner,
  resetComponentStore,
} from "@actions/bannerActions";

import { capitalizeFirst, isAdmin } from "@utils/helper";
import ConfirmPopup from "../Layout/ConfirmBox";
import BannerModal from "./BannerModal";

const BannersList = ({
  loggedInBanner,
  bannersList: { data, count },
  getBannersList,
  deleteBanner,
  loadingBannerList,
  resetComponentStore,
  sortingParams,
}) => {
  const [onlyOnce, setOnce] = React.useState(true);
  const [modalData, setModalData] = React.useState(null);
  const [confirmModal, setConfirmModal] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  const { page, limit } = sortingParams;

  const initialSortingParams = {
    limit: 20,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [bannerParams, setBannerParams] = React.useState(initialSortingParams);

  const actions = (
    <div className="page-actions">
      <Button color="primary" size="sm" onClick={() => setModal(true)}>
        <BiPlusMedical /> Add New Banner
      </Button>
    </div>
  );

  const columns = [
    {
      name: "Title",
      width: "25%",
      cell: (row) => row.title,
    },
    {
      name: "Image",
      sortable: true,
      sortField: "name",
      width: "50%",
      cell: (row) => (
        <Row>
          <Col md="12" className="mb-1">
            <Image src={row.image} alt={row.name} width="350" />
          </Col>
        </Row>
      ),
    },
    {
      name: "Actions",
      width: "25%",
      button: true,
      cell: (row, index) => (
        <div className="App table-list-buttons">
          <Link to={`/admin/banners/${row._id}/profile`} title="View Banner">
            <Button variant="primary" size="sm">
              <FaEye />
            </Button>
          </Link>
          <Button
            className="ml-1"
            size="sm"
            title="Delete Banner"
            type="button"
            variant="danger"
            onClick={() => {
              setModalData({
                id: row._id,
                entity: `Banner: ${row.name}`,
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
    if (loggedInBanner && !isAdmin(loggedInBanner)) {
      navigate("/admin/dashboard");
    }

    getBannersList(bannerParams);
  }, [getBannersList, bannerParams, loggedInBanner, navigate]);

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

    setBannerParams(params);
  };

  const onFilterChange = (filter, val, newParams) => {
    setBannerParams((params) => ({ ...params, ...newParams }));
  };

  return (
    <React.Fragment>
      <AppBreadcrumb pageTitle="Banners" crumbs={[{ name: "Banners" }]} />

      <BannerModal
        modal={modal}
        onNo={() => {
          setModal(false);
        }}
      />

      <ConfirmPopup
        entity={modalData?.entity}
        modal={confirmModal}
        name={modalData?.name || "this banner"}
        onYes={() => {
          setConfirmModal(false);
          deleteBanner(modalData?.id).then(() => {
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

          <PiDataTable
            columns={columns}
            data={data}
            count={count}
            params={bannerParams}
            setParams={setBannerParams}
            pagination
            responsive
            striped={true}
            progressPending={loadingBannerList}
            highlightOnHover
            persistTableHead={true}
            paginationServer
          />
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

BannersList.propTypes = {
  getBannersList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  bannersList: state.banner.bannersList,
  loadingBannerList: state.banner.loadingBannerList,
  sortingParams: state.banner.sortingParams,
  loggedInBanner: state.auth.banner,
});

export default connect(mapStateToProps, {
  getBannersList,
  deleteBanner,
  resetComponentStore,
})(BannersList);
