import React from "react";
import { connect } from "react-redux";
import { BiSolidError } from "react-icons/bi";

import { Link, useParams } from "react-router-dom";
import {
  AiFillDashboard,
  AiOutlineAppstore,
  AiOutlineLayout,
} from "react-icons/ai";
import { FcMoneyTransfer } from "react-icons/fc";
import { IoMdCopy } from "react-icons/io";
import { BsClipboard } from "react-icons/bs";
import { GiKnightBanner } from "react-icons/gi";
import { FaProductHunt } from "react-icons/fa6";
import { MdMiscellaneousServices } from "react-icons/md";
import { TbUsers } from "react-icons/tb";
import { FaPrint } from "react-icons/fa";
import { AiTwotoneBank } from "react-icons/ai";

const DefaultTopNav = ({ user }) => {
  const params = useParams();

  const [currentPage, setCurrentPage] = React.useState("");
  React.useEffect(() => {
    const paramsArray = params["*"].split("/");
    if (!paramsArray.length) return;

    const currentPage = paramsArray[0];
    setCurrentPage(currentPage);
  }, [params]);

  return (
    <div className="topnav shadow-sm top-sidebar">
      <div className="container-fluid">
        {/* <NavLink href="index.html" className="logo text-center logo-light">
        <span className="logo-lg">
          <img src="./assets/images/logo.png" alt="" height="16" />
        </span>
      </NavLink> */}

        <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
          <div
            className="collapse navbar-collapse active"
            id="topnav-menu-content"
          >
            <ul className="navbar-nav">
              <li
                className={`nav-item dropdown ${
                  currentPage === "dashboard" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/dashboard"
                  id="topnav-dashboards"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <AiFillDashboard className="sidebar-icon ml-1" />
                  Dashboard
                  <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "users" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/users"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <TbUsers className="sidebar-icon" />
                  Users <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "orders" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/orders"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaPrint className="sidebar-icon" />
                  Orders <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "products" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/products"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaProductHunt className="sidebar-icon" />
                  Products <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "services" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/services"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MdMiscellaneousServices className="sidebar-icon" />
                  Services <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "credentials" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/credentials"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <AiTwotoneBank className="sidebar-icon" />
                  Credentials <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "wallet-request" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/wallet-request"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <AiTwotoneBank className="sidebar-icon" />
                  Wallet Requests <div className="arrow-down"></div>
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "banner" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/banner"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <GiKnightBanner className="sidebar-icon" />
                  Banner
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "complaints" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/complaints"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <BiSolidError className="sidebar-icon" />
                  Complaints
                </Link>
              </li>

              <li
                className={`nav-item dropdown ${
                  currentPage === "deduct-money" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link dropdown-toggle arrow-none"
                  to="/admin/deduct-money"
                  id="topnav-apps"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FcMoneyTransfer className="sidebar-icon" />
                  Deduct Money
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(DefaultTopNav);
