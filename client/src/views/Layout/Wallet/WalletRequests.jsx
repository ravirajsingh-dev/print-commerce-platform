import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Tile from "@src/views/commonComponents/mainCard/Tile";
import { fetchWalletRequests } from "@src/actions/walletActions";
import BouncingLoader from "@src/views/spinners/BouncingLoader";
import AppPagination from "@src/views/DataTable/AppPagination";

const WalletRequests = ({
  loggedInUser,
  fetchWalletRequests,
  walletRequestsList: { data, count },
  loadingWalletRequestList,
  sortingParams,
}) => {
  const initialSortingParams = {
    limit: sortingParams.limit || 20,
    page: sortingParams.page || 1,
    orderBy: "createdAt",
    ascending: "desc",
    query: "",
    filters: [],
  };

  const [params, setParams] = React.useState(initialSortingParams);

  React.useEffect(() => {
    if (!loggedInUser) return;
    fetchWalletRequests(loggedInUser._id, params);
  }, [fetchWalletRequests, loggedInUser, params]);

  return (
    <Row className="p-5">
      <Col xs="12">
        <div className="customTileCardDesign">
          <div className="heading-div">
            <div className="title">Fund Requests</div>
            {/* <div className="btn-icon mb-3">
              <Link to="/user/add-money" className="rr-btn fadeInLeft animated">
                <RiAddLargeLine size={20} /> Add Funds
              </Link>
            </div> */}
          </div>

          {loadingWalletRequestList ? (
            <BouncingLoader minHeight="200px" />
          ) : data.length > 0 ? (
            data.map((txn, i) => (
              <Row className="tile-body" key={txn._id}>
                <Col xs="12" sm="6" md="4" lg="3">
                  <Tile label="SR." value={i + 1} />
                </Col>
                {/* <Col xs="12" sm="6" md="4" lg="3">
                  <Tile label="Amount" value={`₹${txn.amount}`} />
                </Col> */}
                <Col xs="12" sm="6" md="4" lg="3">
                  <Tile label="Remarks" value={txn.remarks} />
                </Col>
                <Col xs="12" sm="6" md="4" lg="3">
                  <Tile label="Status" value={txn.status} />
                </Col>
                <Col xs="12" sm="6" md="4" lg="3">
                  <Tile
                    label="Date"
                    value={moment(txn.createdAt).format(
                      "MMM DD, YYYY, hh:mm a"
                    )}
                  />
                </Col>
              </Row>
            ))
          ) : (
            <Row className="no-result">
              <Col xs="12" className="text-center">
                No walletRequestsList found.
              </Col>
            </Row>
          )}

          {!loadingWalletRequestList && data.length > 0 && (
            <Row>
              <Col xs="12">
                <AppPagination
                  count={count}
                  params={params}
                  setParams={setParams}
                />
              </Col>
            </Row>
          )}
        </div>
      </Col>
    </Row>
  );
};

WalletRequests.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth?.user || {},
  walletRequestsList: state.wallet?.walletRequestsList,
  sortingParams: state.wallet.sortingParams,
  loadingWalletRequestList: state.wallet?.loadingWalletRequestList,
});

export default connect(mapStateToProps, { fetchWalletRequests })(
  WalletRequests
);
