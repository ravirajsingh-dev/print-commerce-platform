import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { RiAddLargeLine } from "react-icons/ri";

import Tile from "@src/views/commonComponents/mainCard/Tile";
import { fetchWalletTransactions } from "@src/actions/walletActions";
import AppPagination from "@src/views/DataTable/AppPagination";
import BouncingLoader from "@src/views/spinners/BouncingLoader";

const WalletTxns = ({
  loggedInUser,
  fetchWalletTransactions,
  transactions: { data, count },
  sortingParams,
  loadingTransactions,
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
    fetchWalletTransactions(loggedInUser._id, params);
  }, [fetchWalletTransactions, loggedInUser, params]);

  return (
    <>
      <Row className="p-5">
        <Col xs="12">
          <div className="customTileCardDesign">
            <div className="heading-div">
              <div className="title">Transactions</div>
              <div className="btn-icon mb-3">
                <Link
                  to="/user/add-money"
                  className="rr-btn fadeInLeft animated"
                >
                  <RiAddLargeLine size={20} /> Add Funds
                </Link>
              </div>
            </div>
            {loadingTransactions ? (
              <BouncingLoader minHeight="200px" />
            ) : data.length > 0 ? (
              data.map((txn, i) => (
                <Row className="tile-body" key={txn._id}>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile label="SR." value={i + 1} />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile label="Amount" value={`₹${txn.amount}`} />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Description"
                      value={txn.description}
                      copyable
                    />
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
                  No transactions found.
                </Col>
              </Row>
            )}

            {!loadingTransactions && data.length > 0 && (
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
    </>
  );
};

WalletTxns.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth?.user || {},
  transactions: state.wallet?.transactions,
  sortingParams: state.wallet.sortingParams,
  loadingTransactions: state.wallet.loadingTransactions,
});

export default connect(mapStateToProps, { fetchWalletTransactions })(
  WalletTxns
);
