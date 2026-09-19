import React from "react";
import { PropTypes } from "prop-types";
import { Dropdown, Row, Col, Pagination } from "react-bootstrap";
import { connect } from "react-redux";

import * as Constants from "../../constants/index";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { getClientsList, resetComponentStore } from "../../actions/client";

const ClientPagination = ({
  clientsList: { data, count },
  sortingParams,
  getClientsList,
}) => {
  const initialSortingParams = {
    limit: 20,
    page: 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const { page, limit } = sortingParams;

  const [clientParams, setClientParams] = React.useState(initialSortingParams);

  const handleTableChange = (
    type,
    { page, sizePerPage, searchText, sortField, sortOrder }
  ) => {
    let params = {
      page: type === "search" ? 1 : page ? page : 1,
      limit: sizePerPage,
      orderBy: sortField,
      ascending: sortOrder,
      filters: sortingParams.filters,
      query: sortingParams.query,
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
              orderID: {
                value: searchText,
                type: "String",
              },
              tests: {
                value: searchText,
                type: "Array",
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

    setClientParams(params);
  };

  React.useEffect(() => {
    getClientsList(clientParams);
  }, [getClientsList, clientParams]);

  const onSizePerPageChange = (pageSize) => {
    setClientParams({
      ...clientParams,
      page: 1,
      limit: pageSize,
    });
  };

  const setPage = (page) => {
    setClientParams({
      ...clientParams,
      page,
    });
  };

  return (
    <div className="pi-pagination">
      <Row>
        <Col className="d-flex align-items-center">
          <Dropdown>
            <span>Records per page: </span>
            <Dropdown.Toggle variant="primary" size="sm" id="dropdown-basic">
              {limit}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {Constants.PAGE_SIZE_OPTIONS.map((option, i) => (
                <React.Fragment key={i}>
                  <Dropdown.Item
                    key={option.text}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSizePerPageChange(option.page);
                    }}
                  >
                    {option.text}
                  </Dropdown.Item>
                </React.Fragment>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <PaginationControl
            page={page}
            between={4}
            total={count}
            limit={limit}
            changePage={(page) => {
              setPage(page);
            }}
            ellipsis={2}
            next={true}
            last={true}
          />
        </Col>
      </Row>
    </div>
  );
};

ClientPagination.propTypes = {
  getClientsList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  clientsList: state.client.clientsList,
  loadingClientList: state.client.loadingClientList,
  sortingParams: state.client.sortingParams,
});

export default connect(mapStateToProps, {
  getClientsList,
  resetComponentStore,
})(ClientPagination);
