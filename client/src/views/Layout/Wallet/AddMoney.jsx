import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { RiAddLargeLine } from "react-icons/ri";
import Tile from "@src/views/commonComponents/mainCard/Tile";
import AppBreadCrumb from "@src/views/DataTable/AppBreadCrumb";
import RechargeWalletModal from "./RechargeWalletModal";
import LoadingSkeleton from "@src/views/spinners/SkeletonLoader";
import { getAdminPrimeCredentials } from "@src/actions/commonActions";
import { capitalizeAll, lowercaseAll } from "@src/utils/helper";

const AddMoney = ({
  adminPrimeCredentialsLoading,
  adminPrimeCredentialsList,
  getAdminPrimeCredentials,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod] = useState("");
  const [selectedDetails, setSelectedDetails] = useState(null);

  useEffect(() => {
    getAdminPrimeCredentials();
  }, []);

  const bankDetails = adminPrimeCredentialsList.find(
    (cred) => cred.type === "bank" && cred.primary
  );
  const upiDetails = adminPrimeCredentialsList.find(
    (cred) => cred.type === "upi" && cred.primary
  );

  const handleShowModal = (methodType, details) => {
    setMethod(methodType);
    setSelectedDetails(details);
    setShowModal(true);
  };

  return (
    <>
      <AppBreadCrumb
        title="Recharge Wallet"
        breadcrumbs={[
          { label: "Shree Advertising", url: "/" },
          { label: "Recharge Wallet" },
        ]}
      />

      <Row className="p-5">
        <Col xs="12" sm="7">
          <div className="customTileCardDesign">
            <div className="heading-div">
              <div className="title">Admin Account Details</div>
              <div className="btn-icon mb-3">
                <Button
                  className="rr-btn fadeInLeft animated"
                  onClick={() => handleShowModal("bank", bankDetails)}
                >
                  <RiAddLargeLine size={20} /> Add Funds with Bank
                </Button>
              </div>
            </div>

            <Row className="tile-body">
              {bankDetails ? (
                <>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Bank Name"
                      value={capitalizeAll(bankDetails.bank_name)}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Holder Name"
                      value={capitalizeAll(bankDetails.name)}
                    />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="Number"
                      value={capitalizeAll(bankDetails.account_number)}
                      copyable
                    />
                  </Col>
                  <Col xs="12" sm="6" md="4" lg="3">
                    <Tile
                      label="IFSC Code"
                      value={capitalizeAll(bankDetails.ifsc)}
                      copyable
                    />
                  </Col>
                </>
              ) : (
                <LoadingSkeleton count={4} height="10px" />
              )}
            </Row>
          </div>
        </Col>

        <Col xs="12" sm="5">
          <div className="customTileCardDesign">
            <div className="heading-div">
              <div className="title">UPI Details</div>
              <div className="btn-icon mb-3">
                <Button
                  className="rr-btn fadeInLeft animated"
                  onClick={() => handleShowModal("upi", upiDetails)}
                >
                  <RiAddLargeLine size={20} /> Add Funds with UPI
                </Button>
              </div>
            </div>

            <Row className="tile-body">
              {upiDetails ? (
                <>
                  <Col sm="6">
                    <Tile
                      label="UPI Holder Name"
                      value={capitalizeAll(upiDetails.name)}
                    />
                  </Col>
                  <Col sm="6">
                    <Tile
                      label="UPI ID"
                      value={lowercaseAll(upiDetails.upi)}
                      copyable
                    />
                  </Col>
                </>
              ) : (
                <LoadingSkeleton count={2} height="10px" />
              )}
            </Row>
          </div>
        </Col>
      </Row>

      <RechargeWalletModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        method={method}
        details={selectedDetails}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  adminPrimeCredentialsList: state.common.adminPrimeCredentialsList,
  adminPrimeCredentialsLoading: state.common.adminPrimeCredentialsLoading,
});

export default connect(mapStateToProps, { getAdminPrimeCredentials })(AddMoney);
