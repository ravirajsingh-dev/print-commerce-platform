import React from "react";
import { ListGroup, Form, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import logo from "../../../assets/images/logo.png";
import logoDark from "../../../assets/images/logo-dark.png";
import flagUS from "../../../assets/images/flags/us.jpg";
import flagGermany from "../../../assets/images/flags/germany.jpg";
import flagRussia from "../../../assets/images/flags/russia.jpg";
import NoUserImage from "../../../assets/images/no-user.png";
import Slack from "../../../assets/images/apps/slack.png";
import bitbucket from "../../../assets/images/apps/bitbucket.png";
import dribbble from "../../../assets/images/apps/dribbble.png";
import GSuite from "../../../assets/images/apps/g-suite.png";
import dropBox from "../../../assets/images/apps/dropbox.png";
import GitHub from "../../../assets/images/apps/github.png";

import { BsFillBellFill, BsGear } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

import { TbGridDots } from "react-icons/tb";
import { logout } from "../../../actions/auth";
import Spinner from "@views/Spinner";
import { isAdmin, userNameToShow } from "@utils/helper";

const DashboardHeader = ({ logout, user, loadingProfile }) => {
  const onClickLogout = () => {
    logout();
  };

  const { avatar } = user ? user : {};
  return (
    <div className="navbar-custom topnav-navbar topnav-navbar-dark  p-0">
      <div className="container-fluid">
        <Link href="" className="topnav-logo">
          <span className="topnav-logo-lg">
            <img className="shree-logo" src={logo} alt="" height="50" />
          </span>
          <span className="topnav-logo-sm">
            <img src={logoDark} alt="" height="22" />
          </span>
        </Link>

        <ListGroup
          as="ul"
          className="list-unstyled topbar-menu float-end m-0 mb-0 navbar-left-section"
        >
          {/* <ListGroup.Item
            as="li"
            className="dropdown notification-list d-xl-none nav-item-li"
          >
            <Link
              className="nav-link dropdown-toggle arrow-none"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i className="dripicons-search noti-icon"></i>
            </Link>
            <div className="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Search ..."
                  aria-label="Recipient's username"
                />
              </Form>
            </div>
          </ListGroup.Item> */}

          <ListGroup.Item
            as="li"
            className="dropdown notification-list topbar-dropdown nav-item-li"
          >
            {/* <Link
              className="nav-link dropdown-toggle lang-en"
              data-bs-toggle="dropdown"
              id="topbar-languagedrop"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <Image src={flagUS} alt="US-flag" className="me-1" height="12" />
              <span className="align-middle">English</span>
            </Link> */}
            <div
              className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu d-none"
              aria-labelledby="topbar-languagedrop "
            >
              {/* <Link as="a" className="dropdown-item country-dropdown">
                <Image
                  src={flagGermany}
                  alt="County-flag"
                  className="me-1"
                  height="12"
                />
                <span className="align-middle">German</span>
              </Link>
              <Link as="a" className="dropdown-item country-dropdown">
                <Image
                  src={flagRussia}
                  alt="County-flag"
                  className="me-1"
                  height="12"
                />
                <span className="align-middle">Russia</span>
              </Link> */}
            </div>
          </ListGroup.Item>

          {/* <ListGroup.Item
            as="li"
            className="dropdown notification-list nav-item-li "
          >
            <Link
              className="nav-link dropdown-toggle arrow-none"
              data-bs-toggle="dropdown"
              href="#"
              id="topbar-notifydrop"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <BsFillBellFill className="noti-icon navbar-icon" />
            </Link>
            <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg"
                aria-labelledby="topbar-notifydrop"
              >
                <div className="dropdown-item noti-title">
                  <h5 className="m-0">
                    <span className="float-end">
                      <Link href="javascript: void(0);" className="text-dark">
                        <small>Clear All</small>
                      </Link>
                    </span>
                    Notification
                  </h5>
                </div>

                <div data-simplebar="init" className="notification-body">
                  <div className="simplebar-wrapper">
                    <div className="simplebar-height-auto-observer-wrapper">
                      <div className="simplebar-height-auto-observer"></div>
                    </div>
                    <div className="simplebar-mask">
                      <div
                        className="simplebar-offset"
                        style={{ right: "0px", bottom: "0px" }}
                      >
                        <div
                          className="simplebar-content-wrapper"
                          style={{ height: "auto", overflow: "hidden" }}
                        >
                          <div
                            className="simplebar-content"
                            style={{ padding: "0px" }}
                          >
                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon bg-primary">
                                <i className="mdi mdi-comment-account-outline"></i>
                              </div>
                              <p className="notify-details">
                                Caleb Flakelar commented on Admin
                                <small className="text-muted">1 min ago</small>
                              </p>
                            </Link>

                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon bg-info">
                                <i className="mdi mdi-account-plus"></i>
                              </div>
                              <p className="notify-details">
                                New user registered.
                                <small className="text-muted">
                                  5 hours ago
                                </small>
                              </p>
                            </Link>

                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon">
                                <img
                                  src="@assets/images/users/avatar-2.jpg"
                                  className="img-fluid rounded-circle"
                                  alt=""
                                />{" "}
                              </div>
                              <p className="notify-details">Cristina Pride</p>
                              <p className="text-muted mb-0 user-msg">
                                <small>
                                  Hi, How are you? What about our next meeting
                                </small>
                              </p>
                            </Link>

                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon bg-primary">
                                <i className="mdi mdi-comment-account-outline"></i>
                              </div>
                              <p className="notify-details">
                                Caleb Flakelar commented on Admin
                                <small className="text-muted">4 days ago</small>
                              </p>
                            </Link>

                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon">
                                <img
                                  src="@assets/images/users/avatar-4.jpg"
                                  className="img-fluid rounded-circle"
                                  alt=""
                                />{" "}
                              </div>
                              <p className="notify-details">Karen Robinson</p>
                              <p className="text-muted mb-0 user-msg">
                                <small>
                                  Wow ! this admin looks good and awesome design
                                </small>
                              </p>
                            </Link>

                            <Link
                              href="javascript:void(0);"
                              className="dropdown-item notify-item"
                            >
                              <div className="notify-icon bg-info">
                                <i className="mdi mdi-heart"></i>
                              </div>
                              <p className="notify-details">
                                Carlos Crouch liked
                                <b>Admin</b>
                                <small className="text-muted">
                                  13 days ago
                                </small>
                              </p>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="simplebar-placeholder"
                      style={{ width: "0px", height: "0px" }}
                    ></div>
                  </div>
                </div>

                <Link
                  href="javascript:void(0);"
                  className="dropdown-item text-center text-primary notify-item notify-all"
                >
                  View All
                </Link>
              </div>
          </ListGroup.Item> */}

          {/* <ListGroup.Item
            as="li"
            className="dropdown notification-list nav-item-li"
          >
            <Link
              className="nav-link dropdown-toggle arrow-none"
              data-bs-toggle="dropdown"
              href="#"
            >
              <TbGridDots className="noti-icon navbar-icon" />
            </Link>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg  menu-apps-section">
              <div className="p-2">
                <div className="row g-0">
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={Slack} alt="slack" />
                      <span className="d-block">Slack</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={GitHub} alt="Github" />
                      <span className="d-block">GitHub</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={dribbble} alt="dribbble" />
                      <span className="d-block">Dribbble</span>
                    </Link>
                  </div>
                </div>

                <div className="row g-0">
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={bitbucket} alt="bitbucket" />
                      <span className="d-block">Bitbucket</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={dropBox} alt="dropbox" />
                      <span className="d-block">Dropbox</span>
                    </Link>
                  </div>
                  <div className="col">
                    <Link className="dropdown-icon-item" href="#">
                      <Image src={GSuite} alt="G Suite" width="40" />
                      <span className="d-block">G Suite</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </ListGroup.Item> */}

          {/* <ListGroup.Item as="li" className="notification-list nav-item-li">
            <Link
              className="nav-link end-bar-toggle"
              href="javascript: void(0);"
            >
              <BsGear className="noti-icon navbar-icon" />
            </Link>
          </ListGroup.Item> */}

          <ListGroup.Item as="li" className="dropdown nav-item-li">
            <div
              className="nav-user arrow-none me-0 d-flex p-3"
              data-bs-toggle="dropdown"
              id="topbar-userdrop"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {loadingProfile ? (
                <Spinner width="70px" />
              ) : (
                <>
                  <div className="d-flex">
                    <span className="account-user-avatar">
                      {avatar ? (
                        <Image src={avatar} className="rounded-circle" />
                      ) : (
                        <Image src={NoUserImage} className="rounded-circle" />
                      )}
                    </span>

                    <div className="account-user-name">
                      {user && user.name
                        ? userNameToShow(user.name)
                        : "Anonymous user"}

                      <br></br>
                      {user && user.title ? (
                        <span className="account-position">{user.title}</span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown user-profile-dropdown"
              aria-labelledby="topbar-userdrop"
            >
              <div className=" dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome !</h6>
              </div>

              {isAdmin(user) ? (
                <Link to="/admin/profile" className="dropdown-item notify-item">
                  <i className="mdi mdi-account-circle me-1"></i>
                  <span>My Account</span>
                </Link>
              ) : null}

              {/* <Link
                href="javascript:void(0);"
                className="dropdown-item notify-item"
              >
                <i className="mdi mdi-account-edit me-1"></i>
                <span>Settings</span>
              </Link>

              <Link
                href="javascript:void(0);"
                className="dropdown-item notify-item"
              >
                <i className="mdi mdi-lifebuoy me-1"></i>
                <span>Support</span>
              </Link>

              <Link
                href="javascript:void(0);"
                className="dropdown-item notify-item"
              >
                <i className="mdi mdi-lock-outline me-1"></i>
                <span>Lock Screen</span>
              </Link> */}

              <Button
                variant=""
                className="dropdown-item notify-item logout-btn"
                onClick={(e) => onClickLogout()}
              >
                <FiLogOut /> Logout
              </Button>
            </div>
          </ListGroup.Item>
        </ListGroup>

        {/* <Link
          className="navbar-toggle"
          data-bs-toggle="collapse"
          data-bs-target="#topnav-menu-content"
        >
          <div className="lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Link> */}
        {/* <div className="app-search dropdown">
          <form>
            <div className="input-group">
              <input
                type="text"
                className="form-control m-0"
                placeholder="Search..."
                id="top-search"
              />
              <span className="mdi mdi-magnify search-icon"></span>
              <button className="input-group-text btn-primary" type="submit">
                Search
              </button>
            </div>
          </form>

          <div
            className="dropdown-menu dropdown-menu-animated dropdown-lg"
            id="search-dropdown"
          >
            <div className="dropdown-header noti-title">
              <h5 className="text-overflow mb-2">
                Found <span className="text-danger">17</span> results
              </h5>
            </div>

            <Link
              href="javascript:void(0);"
              className="dropdown-item notify-item"
            >
              <i className="uil-notes font-16 me-1"></i>
              <span>Analytics Report</span>
            </Link>

            <Link
              href="javascript:void(0);"
              className="dropdown-item notify-item"
            >
              <i className="uil-life-ring font-16 me-1"></i>
              <span>How can I help you?</span>
            </Link>

            <Link
              href="javascript:void(0);"
              className="dropdown-item notify-item"
            >
              <i className="uil-cog font-16 me-1"></i>
              <span>User profile settings</span>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

DashboardHeader.proTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errorList: state.errors,
  user: state.auth.user,
  loadingProfile: state.auth.loadingProfile,
});

export default connect(mapStateToProps, {
  logout,
})(DashboardHeader);
