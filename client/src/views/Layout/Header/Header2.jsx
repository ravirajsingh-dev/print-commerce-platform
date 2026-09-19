import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Image, Row, Col } from "react-bootstrap";
import LogoImg from "@assets/images/logo.png";
import { IoWalletOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";
import { logout } from "@src/actions/authActions";
import { fetchCurrentBalance } from "@src/actions/walletActions";

const Header2 = ({
  loggedInUser,
  loading,
  logout,
  fetchCurrentBalance,
  currentTxnDetails,
}) => {
  // Fetch balance only when loggedInUser._id is available
  useEffect(() => {
    if (loggedInUser?._id) {
      fetchCurrentBalance(loggedInUser._id);
    }
  }, [loggedInUser?._id]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("header-sticky");
      const sidebar = document.getElementById("sidebar-area");
      if (header) {
        if (window.scrollY > 250) header.classList.add("rs-sticky");
        else {
          header.classList.remove("rs-sticky");
          sidebar?.classList.remove("info-open");
        }
      }
    };

    const sidebar = document.getElementById("sidebar-area");
    const sidebarToggle = document.querySelector(".sidebar__toggle");
    const closeElements = document.querySelectorAll(
      ".offcanvas__close, .offcanvas__overlay"
    );

    const openSidebar = () => sidebar?.classList.add("info-open");
    const closeSidebar = () => sidebar?.classList.remove("info-open");

    sidebarToggle?.addEventListener("click", openSidebar);
    closeElements.forEach((el) => el.addEventListener("click", closeSidebar));
    window.addEventListener("scroll", handleScroll);

    return () => {
      sidebarToggle?.removeEventListener("click", openSidebar);
      closeElements.forEach((el) =>
        el.removeEventListener("click", closeSidebar)
      );
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header style={{ height: "110px" }}>
      <Row className="m-0 p-0">
        <Col sm="3" className="header-logo text-center py-2">
          <Image src={LogoImg} alt="logo" className="header-image" />
        </Col>

        <Col sm="4" className="d-flex text-center justify-content-end py-3">
          <div>
            <small className="d-block">
              <strong>Printing Services Division</strong>
            </small>
            <small className="d-block">
              Go to{" "}
              <Link to="/our-services" className="text-orange">
                All Services
              </Link>
            </small>
            <small>
              <b className="text-orange">Total Members</b> : 8268 &
              Increasing...
            </small>
          </div>
        </Col>

        <Col sm="5" className="align-items-center">
          <UserDetails
            loggedInUser={loggedInUser}
            loading={loading}
            logout={logout}
            currentTxnDetails={currentTxnDetails}
          />
        </Col>
      </Row>
    </header>
  );
};

const UserDetails = ({ loggedInUser, loading, logout, currentTxnDetails }) => {
  const [displayState, setDisplayState] = useState(
    loggedInUser ? "user" : "loading"
  );

  useEffect(() => {
    if (loading) setDisplayState("loading");
    else if (loggedInUser) setDisplayState("user");
    else setDisplayState("login");
  }, [loggedInUser, loading]);

  const renderUser = () => {
    switch (displayState) {
      case "loading":
        return <strong>Loading...</strong>;

      case "user":
        return (
          <div className="d-flex w-100">
            {/* LEFT SIDE */}
            <div className="w-50 d-flex justify-content-end">
              <div className="text-center">
                <span className="d-block text-orange">
                  Hi {loggedInUser?.business_name}
                </span>

                <span className="ms-2 d-block">
                  Member ID -{" "}
                  <span className="text-orange">{loggedInUser?.SA_ID}</span>
                </span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-50 text-end">
              {/* WALLET */}
              <span className="me-3 d-block">
                <IoWalletOutline size="24px" className="text-danger bold" /> :
                <b className="te">
                  ₹
                  {currentTxnDetails?.currentBalance ??
                    (loading ? "..." : "0.00")}
                </b>
              </span>

              {/* LOGOUT */}
              <span>
                Signout:
                <FaPowerOff
                  cursor="pointer"
                  className="ms-2 my-auto text-danger fs-5 cursor-pointer"
                  size="18px"
                  onClick={() => {
                    if (window.confirm("Are you really want to logout?")) {
                      logout();
                    }
                  }}
                />
              </span>
            </div>
          </div>
        );

      default:
        return (
          <Link to="/login" className="rr-btn">
            Login
          </Link>
        );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-100 ps-5">
      {renderUser()}
    </div>
  );
};

Header2.propTypes = {
  loggedInUser: PropTypes.object,
  loading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.user,
  currentTxnDetails: state.wallet.currentTxnDetails || { currentBalance: 0 },
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { logout, fetchCurrentBalance })(
  Header2
);
