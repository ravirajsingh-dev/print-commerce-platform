import React from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FaWallet, FaArrowDown, FaArrowUp } from "react-icons/fa";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import LoadingSkeleton from "@src/views/spinners/SkeletonLoader";
import { fetchCurrentBalance } from "@src/actions/walletActions";

const Wallet = ({
  loggedInUser,
  currentTxnDetails,
  loadingCurrentBalance,
  fetchCurrentBalance,
}) => {
  React.useEffect(() => {
    if (!loggedInUser) return;
    fetchCurrentBalance(loggedInUser._id);
  }, [fetchCurrentBalance, loggedInUser]);

  return (
    <>
      <AppBreadCrumb
        title="Wallet Overview"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Wallet" },
        ]}
      />

      <Row className="p-5">
        <Col md={6} lg={6} xl={4} xxl={4}>
          <div className="customTileCardDesign">
            <div className="title">Wallet Balance</div>
            {loadingCurrentBalance ? (
              <LoadingSkeleton count={2} width="250px" height="10px" />
            ) : (
              <>
                <div className="total-count">
                  ₹{currentTxnDetails?.currentBalance}
                </div>
                <div className="desc">Available balance in your wallet.</div>
              </>
            )}
            <div className="icon">
              <FaWallet />
            </div>
          </div>
        </Col>

        <Col md={6} lg={6} xl={4} xxl={4}>
          <div className="customTileCardDesign">
            <div className="title">Total Credit</div>
            {loadingCurrentBalance ? (
              <LoadingSkeleton count={2} width="250px" height="10px" />
            ) : (
              <>
                <div className="total-count">
                  ₹{currentTxnDetails?.creditedAmount}
                </div>
                <div className="desc">Total funds added to your wallet.</div>
              </>
            )}
            <div className="icon">
              <FaArrowDown />
            </div>
          </div>
        </Col>

        {/* <Col md={6} lg={6} xl={4} xxl={4}>
          <div className="customTileCardDesign">
            <div className="title">Total Debit</div>
            {loadingCurrentBalance ? (
              <LoadingSkeleton count={2} width="250px" height="10px" />
            ) : (
              <>
                <div className="total-count">
                  ₹{currentTxnDetails?.debitedAmount}
                </div>
                <div className="desc">Total funds spent from your wallet.</div>
              </>
            )}
            <div className="icon">
              <FaArrowUp />
            </div>
          </div>
        </Col> */}
      </Row>
    </>
  );
};

Wallet.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
  currentTxnDetails: state.wallet.currentTxnDetails,
  loadingCurrentBalance: state.wallet.loadingCurrentBalance,
});

export default connect(mapStateToProps, { fetchCurrentBalance })(Wallet);
